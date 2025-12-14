<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Booking;
use Inertia\Inertia;
use Inertia\Response;
use Exception;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class StripePaymentController extends Controller
{
    /**
     * Show Stripe payment page
     */
    public function stripe(Request $request): Response
    {
        $bookingId = $request->query('booking_id');
        $booking = null;

        if ($bookingId) {
            $booking = Booking::with('package')
                ->where('id', $bookingId)
                ->where('user_id', auth()->id())
                ->first();

            if (!$booking) {
                abort(404, 'Booking not found');
            }

            if ($booking->payment_status === 'paid') {
                return redirect()->route('bookings.show', $bookingId)
                    ->with('error', 'This booking is already paid.');
            }
        }

        $user = auth()->user();

        // 🔥 FIX 1: Ensure Stripe Customer
        if (!$user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }

        return Inertia::render('Stripe/Payment', [
            'booking' => $booking,
            'amount' => $booking ? $booking->total_price : 0,
            'stripeKey' => env('STRIPE_KEY'),
            'intent' => $user->createSetupIntent()->client_secret,
        ]);
    }

    /**
     * Process payment using Cashier
     */

    public function processPayment(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $user = $request->user();
        $booking = Booking::where('id', $request->booking_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // Create PaymentIntent manually (NO automatic_payment_methods)
            $paymentIntent = PaymentIntent::create([
                'amount' => $booking->total_price * 100,
                'currency' => 'usd',
                'customer' => $user->stripe_id,
                'payment_method' => $request->payment_method,

                // Manual confirmation (React will confirm client-side)
                'confirmation_method' => 'manual',
                'confirm' => true,

                'payment_method_types' => ['card'], // FIX ⚡ No redirects

                'metadata' => [
                    'booking_id' => $booking->id,
                ],
            ]);

            // If succeeded
            if ($paymentIntent->status === 'succeeded') {

                $booking->update([
                    'payment_status' => 'paid',
                    'status' => 'confirmed',
                    'payment_method' => 'stripe',
                    'stripe_payment_intent' => $paymentIntent->id,
                    'payment_date' => now(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful!',
                    'redirect' => route('bookings.show', $booking->id),
                ]);
            }

            // Handle 3D secure
            if ($paymentIntent->status === 'requires_action') {
                return response()->json([
                    'success' => false,
                    'requires_action' => true,
                    'payment_intent_client_secret' => $paymentIntent->client_secret,
                ]);
            }

            // Other error
            return response()->json([
                'success' => false,
                'message' => 'Payment could not complete.',
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Payment failed: " . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create Payment Intent (frontend)
     */
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id'
        ]);

        $booking = Booking::where('id', $request->booking_id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $user = $request->user();

        // 🔥 FIX 3: Ensure Stripe customer exists
        if (!$user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }

        try {
            $paymentIntent = $user->createSetupIntent([
                'payment_method_types' => ['card'],
                'metadata' => [
                    'booking_id' => $booking->id,
                ]
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'amount' => $booking->total_price,
                'booking' => $booking
            ]);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function success(): Response
    {
        return Inertia::render('Stripe/Success');
    }

    public function cancel(): Response
    {
        return Inertia::render('Stripe/Cancel');
    }
}
