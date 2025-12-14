<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Package;
use App\Models\Destination;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Display the reports page
     */
    public function index(Request $request)
    {
        // Default date range: last 30 days
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->subDays(30);
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now();
        
        // Get booking statistics
        $totalBookings = Booking::whereBetween('created_at', [$startDate, $endDate])->count();
        $totalRevenue = Booking::whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_status', 'paid')
            ->sum('total_price');
        
        // Get bookings by status
        $bookingsByStatus = Booking::select('status', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status => $item->count];
            });
        
        // Get bookings by payment status
        $bookingsByPayment = Booking::select('payment_status', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('payment_status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->payment_status => $item->count];
            });
        
        // Get recent bookings for the table
        $recentBookings = Booking::with(['user', 'package.destination'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'user_name' => $booking->user->name,
                    'package_title' => $booking->package->title,
                    'destination' => $booking->package->destination->name,
                    'booking_date' => $booking->booking_date,
                    'number_of_people' => $booking->number_of_people,
                    'total_price' => $booking->total_price,
                    'status' => $booking->status,
                    'payment_status' => $booking->payment_status,
                    'created_at' => $booking->created_at->format('Y-m-d H:i'),
                ];
            });
        
        // Get top packages by bookings
        $topPackages = Package::withCount(['bookings' => function($query) use ($startDate, $endDate) {
                $query->whereBetween('bookings.created_at', [$startDate, $endDate]);
            }])
            ->withSum(['bookings' => function($query) use ($startDate, $endDate) {
                $query->whereBetween('bookings.created_at', [$startDate, $endDate]);
            }], 'total_price')
            ->orderBy('bookings_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'title' => $package->title,
                    'destination' => $package->destination->name,
                    'bookings_count' => $package->bookings_count,
                    'total_revenue' => $package->bookings_sum_total_price,
                ];
            });
        
        // Get monthly booking trend
        $monthlyTrend = Booking::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as bookings_count'),
                DB::raw('SUM(total_price) as total_revenue')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'bookings_count' => $item->bookings_count,
                    'total_revenue' => $item->total_revenue,
                ];
            });

        return Inertia::render('Admin/Reports/Index', [
            'stats' => [
                'total_bookings' => $totalBookings,
                'total_revenue' => $totalRevenue,
                'pending_bookings' => $bookingsByStatus['pending'] ?? 0,
                'confirmed_bookings' => $bookingsByStatus['confirmed'] ?? 0,
                'completed_bookings' => $bookingsByStatus['completed'] ?? 0,
                'cancelled_bookings' => $bookingsByStatus['cancelled'] ?? 0,
                'paid_payments' => $bookingsByPayment['paid'] ?? 0,
                'pending_payments' => $bookingsByPayment['pending'] ?? 0,
                'failed_payments' => $bookingsByPayment['failed'] ?? 0,
            ],
            'recentBookings' => $recentBookings,
            'topPackages' => $topPackages,
            'monthlyTrend' => $monthlyTrend,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
        ]);
    }
}