<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Models\Booking;
use App\Models\Package;
use Illuminate\Support\Facades\Log;

class StripeController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        Log::info('=== Stripe Session Creation Started ===');
        Log::info('Request Data:', $request->all());
        
        try {
            // Check Stripe key
            $stripeSecret = config('services.stripe.secret');
            
            if (empty($stripeSecret)) {
                Log::error('Stripe secret key is empty!');
                return response()->json([
                    'success' => false,
                    'message' => 'Stripe configuration missing',
                    'debug' => 'Check .env file for STRIPE_SECRET'
                ], 500);
            }

            // Validate request
            $validated = $request->validate([
                'booking_id' => 'required|exists:bookings,id',
                'package_id' => 'required|exists:packages,id',
                'amount' => 'required|numeric|min:0.50',
                'currency' => 'nullable|string|size:3',
            ]);
            
            Log::info('Validation passed', $validated);

            // Get booking and verify ownership
            $booking = Booking::findOrFail($request->booking_id);
            
            // Ensure user owns this booking (security check)
            if ($booking->user_id !== auth()->id()) {
                Log::error('Unauthorized booking access attempt', [
                    'booking_user_id' => $booking->user_id,
                    'current_user_id' => auth()->id()
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to booking'
                ], 403);
            }

            // Get package details
            $package = Package::findOrFail($request->package_id);
            Log::info('Package found:', ['id' => $package->id, 'name' => $package->title]);

            // Convert amount to cents (Stripe expects integer)
            $amountInCents = (int) ($request->amount * 100);
            Log::info('Amount conversion:', [
                'original' => $request->amount,
                'in_cents' => $amountInCents,
                'currency' => $request->currency ?? 'usd'
            ]);
            
            // Set Stripe API key
            Stripe::setApiKey($stripeSecret);
            
            // Create checkout session
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => strtolower($request->currency ?? 'usd'),
                        'product_data' => [
                            'name' => $package->title . ' - Booking #' . $booking->id,
                            'description' => 'Booking for ' . $package->title,
                            'metadata' => [
                                'booking_id' => $booking->id,
                                'package_id' => $package->id,
                            ],
                        ],
                        'unit_amount' => $amountInCents,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => url('/payment/success') . '?session_id={CHECKOUT_SESSION_ID}&booking_id=' . $booking->id,
                'cancel_url' => url('/payment/cancel') . '?booking_id=' . $booking->id,
                'customer_email' => auth()->user()->email,
                'metadata' => [
                    'booking_id' => $booking->id,
                    'package_id' => $package->id,
                    'user_id' => auth()->id(),
                ],
                'payment_intent_data' => [
                    'metadata' => [
                        'booking_id' => $booking->id,
                        'package_id' => $package->id,
                    ],
                ],
            ]);

            Log::info('Stripe session created successfully:', [
                'session_id' => $session->id,
                'url' => $session->url
            ]);

            // Update booking with session ID
            $booking->update([
                'payment_session_id' => $session->id,
            ]);

            return response()->json([
                'success' => true,
                'sessionId' => $session->id,
                'url' => $session->url,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', $e->errors());
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('Error creating Stripe session:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment session',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
    
    public function success(Request $request)
    {
        try {
            $sessionId = $request->get('session_id');
            $bookingId = $request->get('booking_id');

            Log::info('Payment success callback:', [
                'session_id' => $sessionId,
                'booking_id' => $bookingId
            ]);

            // Verify payment with Stripe
            Stripe::setApiKey(config('services.stripe.secret'));
            $session = Session::retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                // Update booking status
                $booking = Booking::findOrFail($bookingId);
                $booking->update([
                    'status' => 'confirmed',
                    'payment_status' => 'paid',
                    'payment_method' => 'stripe',
                    'transaction_id' => $sessionId,
                    'paid_at' => now(),
                ]);

                return redirect()->route('bookings.show', $bookingId)
                    ->with('success', 'Payment successful! Your booking is confirmed.');
            }

            return redirect()->route('payment.cancel')->with('error', 'Payment not completed');

        } catch (\Exception $e) {
            Log::error('Payment Success Error: ' . $e->getMessage());
            return redirect()->route('home')->with('error', 'Payment verification failed');
        }
    }

    public function cancel(Request $request)
    {
        $bookingId = $request->get('booking_id');
        
        Log::info('Payment cancelled:', ['booking_id' => $bookingId]);
        
        // Update booking status to cancelled
        if ($bookingId) {
            Booking::where('id', $bookingId)
                ->where('payment_status', '!=', 'paid')
                ->update([
                    'status' => 'cancelled',
                    'payment_status' => 'cancelled'
                ]);
        }

        return redirect()->route('bookings.show', $bookingId)
            ->with('error', 'Payment was cancelled. Please try again.');
    }
}