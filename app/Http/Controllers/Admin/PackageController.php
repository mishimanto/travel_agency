<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::with('destination')
            ->latest()
            ->paginate(10);

        $destinations = Destination::where('is_active', true)->get();

        return Inertia::render('Admin/Packages/Index', [
            'packages' => $packages,
            'destinations' => $destinations, 
        ]);
    }

    public function create()
    {
        $destinations = Destination::where('is_active', true)->get();
        
        return Inertia::render('Admin/Packages/Create', [
            'destinations' => $destinations,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'offer_price' => 'nullable|numeric|min:0|lt:price',
            'duration_days' => 'required|integer|min:1',
            'destination_id' => 'required|exists:destinations,id',
            'available_dates' => 'nullable|array',
            'available_dates.*' => 'date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'inclusions' => 'nullable|array',
            'inclusions.*' => 'string|max:255',
            'itinerary' => 'nullable|array',
            'itinerary.*.day' => 'required|integer',
            'itinerary.*.title' => 'required|string|max:255',
            'itinerary.*.description' => 'required|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean'
        ]);

        $data = $request->except(['image', 'available_dates', 'inclusions', 'itinerary']);
        
        // Handle boolean values
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active'] = $request->boolean('is_active');

        // Handle JSON fields
        if ($request->has('available_dates')) {
            $data['available_dates'] = json_encode($request->available_dates);
        }

        if ($request->has('inclusions')) {
            $data['inclusions'] = json_encode($request->inclusions);
        }

        if ($request->has('itinerary')) {
            $data['itinerary'] = json_encode($request->itinerary);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('packages', 'public');
            $data['image'] = $imagePath;
        }

        Package::create($data);

        return redirect()->route('admin.packages.index')
            ->with('success', 'Package created successfully.');
    }

    public function edit(Package $package)
    {
        $destinations = Destination::where('is_active', true)->get();
        
        // Parse JSON fields for editing
        $package->available_dates = $package->available_dates 
            ? json_decode($package->available_dates, true) 
            : [];
            
        $package->inclusions = $package->inclusions 
            ? json_decode($package->inclusions, true) 
            : [];
            
        $package->itinerary = $package->itinerary 
            ? json_decode($package->itinerary, true) 
            : [];

        return Inertia::render('Admin/Packages/Edit', [
            'package' => $package,
            'destinations' => $destinations,
        ]);
    }

    public function update(Request $request, Package $package)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'offer_price' => 'nullable|numeric|min:0|lt:price',
            'duration_days' => 'required|integer|min:1',
            'destination_id' => 'required|exists:destinations,id',
            'available_dates' => 'nullable|array',
            'available_dates.*' => 'date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'inclusions' => 'nullable|array',
            'inclusions.*' => 'string|max:255',
            'itinerary' => 'nullable|array',
            'itinerary.*.day' => 'required|integer',
            'itinerary.*.title' => 'required|string|max:255',
            'itinerary.*.description' => 'required|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'remove_image' => 'boolean'
        ]);

        $data = $request->except(['image', 'available_dates', 'inclusions', 'itinerary', 'remove_image']);
        
        // Handle boolean values
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active'] = $request->boolean('is_active');

        // Handle JSON fields
        if ($request->has('available_dates')) {
            $data['available_dates'] = json_encode($request->available_dates);
        } else {
            $data['available_dates'] = null;
        }

        if ($request->has('inclusions')) {
            $data['inclusions'] = json_encode($request->inclusions);
        } else {
            $data['inclusions'] = null;
        }

        if ($request->has('itinerary')) {
            $data['itinerary'] = json_encode($request->itinerary);
        } else {
            $data['itinerary'] = null;
        }

        // Handle image removal
        if ($request->boolean('remove_image') && $package->image) {
            Storage::disk('public')->delete($package->image);
            $data['image'] = null;
        }

        // Handle new image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($package->image) {
                Storage::disk('public')->delete($package->image);
            }
            
            $imagePath = $request->file('image')->store('packages', 'public');
            $data['image'] = $imagePath;
        }

        $package->update($data);

        return redirect()->route('admin.packages.index')
            ->with('success', 'Package updated successfully.');
    }

    public function destroy(Package $package)
    {
        // Delete image if exists
        if ($package->image) {
            Storage::disk('public')->delete($package->image);
        }

        $package->delete();

        return redirect()->route('admin.packages.index')
            ->with('success', 'Package deleted successfully.');
    }
}