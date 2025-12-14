<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Package;
use App\Models\User;
use App\Models\Destination;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalBookings' => Booking::count(),
            'totalRevenue' => Booking::sum('total_price') ?? 0,
            'activeUsers' => User::where('is_admin', 0)->count(),
            'avgBookingValue' => Booking::avg('total_price') ?? 0,
        ];

        // Eager load user and package relationships with null checks
        $recentBookings = Booking::with(['user', 'package.destination'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'user' => $booking->user ? [
                        'name' => $booking->user->name,
                        'email' => $booking->user->email,
                    ] : null,
                    'package' => $booking->package ? [
                        'title' => $booking->package->title,
                        'destination' => $booking->package->destination,
                    ] : null,
                    'booking_date' => $booking->booking_date,
                    'status' => $booking->status,
                    'total_price' => $booking->total_price,
                ];
            });

        $topPackages = Package::with(['destination'])
            ->withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'title' => $package->title,
                    'price' => $package->price,
                    'bookings_count' => $package->bookings_count,
                    'destination' => $package->destination,
                ];
            });

        // ================= CHART DATA =================
        
        // 1. Monthly Revenue Data (Last 6 months)
        $monthlyRevenue = $this->getMonthlyRevenueData();
        
        // 2. Booking Status Distribution
        $bookingStatus = $this->getBookingStatusData();
        
        // 3. Top Destinations by Bookings (FIXED QUERY)
        $topDestinations = $this->getTopDestinationsData();
        
        // 4. Monthly Bookings Trend
        $monthlyBookings = $this->getMonthlyBookingsData();
        
        // 5. Package Performance
        $packagePerformance = $this->getPackagePerformanceData();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'topPackages' => $topPackages,
            'chartData' => [
                'monthlyRevenue' => $monthlyRevenue,
                'bookingStatus' => $bookingStatus,
                'topDestinations' => $topDestinations,
                'monthlyBookings' => $monthlyBookings,
                'packagePerformance' => $packagePerformance,
            ],
        ]);
    }

    private function getMonthlyRevenueData()
    {
        $revenueData = Booking::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_price) as revenue')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->take(6)
            ->get()
            ->reverse();

        $labels = [];
        $data = [];

        foreach ($revenueData as $item) {
            $monthName = Carbon::createFromDate($item->year, $item->month, 1)->format('M');
            $labels[] = $monthName;
            $data[] = (float) $item->revenue;
        }

        // If no data, show last 6 months with zero values
        if (empty($labels)) {
            for ($i = 5; $i >= 0; $i--) {
                $month = Carbon::now()->subMonths($i);
                $labels[] = $month->format('M');
                $data[] = 0;
            }
        }

        return [
            'labels' => $labels,
            'data' => $data
        ];
    }

    private function getBookingStatusData()
    {
        return [
            'pending' => Booking::where('status', 'pending')->count(),
            'confirmed' => Booking::where('status', 'confirmed')->count(),
            'completed' => Booking::where('status', 'completed')->count(),
            'cancelled' => Booking::where('status', 'cancelled')->count(),
        ];
    }

    private function getTopDestinationsData()
    {
        // FIXED QUERY: Using aggregate functions for all selected columns
        $destinations = Destination::select([
                'destinations.id',
                'destinations.name',
                DB::raw('COUNT(bookings.id) as bookings_count')
            ])
            ->leftJoin('packages', 'destinations.id', '=', 'packages.destination_id')
            ->leftJoin('bookings', 'packages.id', '=', 'bookings.package_id')
            ->groupBy('destinations.id', 'destinations.name') // Include all non-aggregated columns in GROUP BY
            ->orderBy('bookings_count', 'desc')
            ->take(5)
            ->get();

        // Alternative method using Eloquent relationships (Simpler and more reliable)
        if ($destinations->isEmpty()) {
            $destinations = Destination::withCount(['packages.bookings as bookings_count'])
                ->orderByDesc('bookings_count')
                ->take(5)
                ->get();
        }

        return $destinations->map(function ($destination) {
            return [
                'name' => $destination->name,
                'bookings' => $destination->bookings_count ?? 0
            ];
        })->toArray();
    }

    private function getMonthlyBookingsData()
    {
        $bookingData = Booking::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as bookings_count')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->take(6)
            ->get()
            ->reverse();

        $labels = [];
        $data = [];

        foreach ($bookingData as $item) {
            $monthName = Carbon::createFromDate($item->year, $item->month, 1)->format('M');
            $labels[] = $monthName;
            $data[] = (int) $item->bookings_count;
        }

        // If no data, show last 6 months with zero values
        if (empty($labels)) {
            for ($i = 5; $i >= 0; $i--) {
                $month = Carbon::now()->subMonths($i);
                $labels[] = $month->format('M');
                $data[] = 0;
            }
        }

        return [
            'labels' => $labels,
            'data' => $data
        ];
    }

    private function getPackagePerformanceData()
    {
        $packages = Package::withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->take(5)
            ->get();

        return $packages->map(function ($package) {
            return [
                'title' => $package->title,
                'price' => (float) $package->price,
                'bookings' => $package->bookings_count,
                'revenue' => (float) $package->price * $package->bookings_count
            ];
        })->toArray();
    }

    // Alternative method for top destinations (using subquery - more efficient)
    private function getTopDestinationsDataAlternative()
    {
        return Destination::select('destinations.*')
            ->addSelect([
                'bookings_count' => Booking::selectRaw('COUNT(bookings.id)')
                    ->join('packages', 'bookings.package_id', '=', 'packages.id')
                    ->whereColumn('packages.destination_id', 'destinations.id')
            ])
            ->orderByDesc('bookings_count')
            ->take(5)
            ->get()
            ->map(function ($destination) {
                return [
                    'name' => $destination->name,
                    'bookings' => $destination->bookings_count ?? 0
                ];
            })->toArray();
    }
}