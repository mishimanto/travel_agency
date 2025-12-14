<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    /**
     * Display a listing of the packages.
     */
    // PackageController.php - index method
public function index(Request $request)
{
    $query = Package::with('destination')
        ->where('is_active', true);

    // Search
    if ($request->has('search') && $request->search) {
        $query->where(function($q) use ($request) {
            $q->where('title', 'like', '%' . $request->search . '%')
              ->orWhere('description', 'like', '%' . $request->search . '%');
        });
    }

    // Destinations filter
    if ($request->has('destinations') && is_array($request->destinations)) {
        $query->whereIn('destination_id', $request->destinations);
    }

    // Price range filter
    if ($request->has('min_price')) {
        $query->where('price', '>=', $request->min_price);
    }
    if ($request->has('max_price')) {
        $query->where('price', '<=', $request->max_price);
    }

    // Duration filter
    if ($request->has('duration')) {
        switch ($request->duration) {
            case '1-3':
                $query->whereBetween('duration_days', [1, 3]);
                break;
            case '4-7':
                $query->whereBetween('duration_days', [4, 7]);
                break;
            case '8-14':
                $query->whereBetween('duration_days', [8, 14]);
                break;
            case '15+':
                $query->where('duration_days', '>=', 15);
                break;
        }
    }

    // Special offers filter
    if ($request->boolean('special_offers')) {
        $query->whereNotNull('offer_price')
              ->whereRaw('offer_price < price');
    }

    // Sorting
    switch ($request->get('sort_by', 'featured')) {
        case 'price_asc':
            $query->orderBy('price');
            break;
        case 'price_desc':
            $query->orderByDesc('price');
            break;
        case 'discount_desc':
            $query->whereNotNull('offer_price')
                  ->orderByRaw('((price - offer_price) / price) * 100 DESC');
            break;
        case 'duration_asc':
            $query->orderBy('duration_days');
            break;
        case 'duration_desc':
            $query->orderByDesc('duration_days');
            break;
        case 'newest':
            $query->orderByDesc('created_at');
            break;
        case 'featured':
        default:
            $query->orderByDesc('is_featured')
                  ->orderByDesc('created_at');
            break;
    }

    $packages = $query->paginate(12);

    $destinations = Destination::where('is_active', true)->get();

    return Inertia::render('Packages/Index', [
        'packages' => $packages,
        'filters' => [
            'destinations' => $destinations,
        ],
        'search' => $request->search,
    ]);
}

    /**
     * Show a single package.
     */
    public function show(Package $package)
    {
        $package->load('destination');

        // Fix JSON fields:
        $package->available_dates = $this->fixJsonData($package->available_dates);
        $package->inclusions      = $this->fixJsonData($package->inclusions);
        $package->itinerary       = $this->fixJsonData($package->itinerary);

        return Inertia::render('Packages/Show', [
            'package' => $package,
        ]);
    }

    /**
     * Fix JSON fields
     */
    private function fixJsonData($data)
    {
        if (is_array($data)) return $data;
        if (is_null($data)) return [];

        if (is_string($data)) {
            $decoded = json_decode($data, true);
            return $decoded ?: [];
        }

        return [];
    }
}
