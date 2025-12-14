<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::where('user_id', Auth::id())
            ->with(['package.destination'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Booking/Index', [
            'bookings' => $bookings,
        ]);
    }

    public function create(Package $package)
    {
        // Calculate if offer is available
        $hasOffer = $package->offer_price && $package->offer_price < $package->price;
        $discountPercentage = 0;
        $savingsPerPerson = 0;
        
        if ($hasOffer) {
            $discountPercentage = round((($package->price - $package->offer_price) / $package->price) * 100);
            $savingsPerPerson = $package->price - $package->offer_price;
        }

        return Inertia::render('Booking/Create', [
            'package' => $package->load('destination'),
            'hasOffer' => $hasOffer,
            'discountPercentage' => $discountPercentage,
            'savingsPerPerson' => $savingsPerPerson,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'booking_date' => 'required|date',
            'number_of_people' => 'required|integer|min:1|max:10',
            'special_requests' => 'nullable|string|max:500',
        ]);

        $package = Package::findOrFail($request->package_id);
        
        // Calculate price per person (use offer if available and valid)
        $pricePerPerson = $this->calculatePricePerPerson($package);
        
        $totalPrice = $pricePerPerson * $request->number_of_people;

        $booking = Booking::create([
            'user_id' => Auth::id(),
            'package_id' => $request->package_id,
            'booking_date' => $request->booking_date,
            'number_of_people' => $request->number_of_people,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'payment_status' => 'pending',
            'special_requests' => $request->special_requests,
        ]);

        return redirect()->route('bookings.show', $booking->id)
            ->with('success', 'Booking created successfully!');
    }

    /**
     * Calculate price per person considering offer price
     */
    private function calculatePricePerPerson(Package $package)
    {
        // Check if offer price exists and is valid
        if ($package->offer_price && 
            is_numeric($package->offer_price) && 
            is_numeric($package->price) &&
            $package->offer_price < $package->price &&
            $package->offer_price > 0) {
            return $package->offer_price;
        }
        
        // Return regular price
        return $package->price;
    }

    public function show(Booking $booking)
    {
        // Ensure user can only view their own bookings
        if ($booking->user_id !== Auth::id() && !Auth::user()->is_admin) {
            abort(403);
        }

        $booking->load(['package.destination', 'user']);

        return Inertia::render('Booking/Show', [
            'booking' => $booking,
        ]);
    }
}