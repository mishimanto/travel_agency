<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $recentBookings = Booking::where('user_id', $user->id)
            ->with(['package.destination'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $stats = [
            'totalBookings' => Booking::where('user_id', $user->id)->count(),
            'upcomingTrips' => Booking::where('user_id', $user->id)
                ->where('status', 'confirmed')
                ->where('payment_status', 'confirmed')
                ->where('booking_date', '>=', now())
                ->count(),
            'totalSpent' => Booking::where('user_id', $user->id)->sum('total_price'),
        ];

        return Inertia::render('User/Dashboard', [
            'user' => $user,
            'recentBookings' => $recentBookings,
            'stats' => $stats,
        ]);
    }
}