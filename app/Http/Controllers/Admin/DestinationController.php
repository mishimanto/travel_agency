<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DestinationController extends Controller
{
    public function index()
    {
        $destinations = Destination::withCount('packages')
            ->latest()
            ->paginate(12);

        return Inertia::render('Admin/Destinations/Index', [
            'destinations' => $destinations,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'is_active'   => 'boolean',
            'new_images'  => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $imagePaths = [];

        // Upload new images
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $img) {
                $imagePaths[] = $img->store('destinations', 'public');
            }
        }

        // Add existing images (if any from editing)
        if ($request->has('images')) {
            foreach ($request->images as $existingImage) {
                $imagePaths[] = $existingImage;
            }
        }

        Destination::create([
            'name'        => $request->name,
            'description' => $request->description,
            'is_active'   => $request->boolean('is_active'),
            'images'      => $imagePaths,
        ]);

        return redirect()->route('admin.destinations.index')
            ->with('success', 'Destination created successfully.');
    }

    public function update(Request $request, Destination $destination)
    {
        $request->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'required|string',
            'is_active'       => 'boolean',
            'images'          => 'nullable|array', // Existing images
            'new_images'      => 'nullable|array', // New uploads
            'new_images.*'    => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'deleted_images'  => 'nullable|array', // Images to delete
        ]);

        // Start with existing images
        $currentImages = $request->has('images') ? $request->images : [];

        // Delete selected images
        if ($request->filled('deleted_images')) {
            foreach ($request->deleted_images as $path) {
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        // Upload new images
        $newImages = [];
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $img) {
                $newImages[] = $img->store('destinations', 'public');
            }
        }

        // Merge remaining existing + new images
        $updatedImages = array_values(array_merge($currentImages, $newImages));

        // Update destination
        $destination->update([
            'name'        => $request->name,
            'description' => $request->description,
            'is_active'   => $request->boolean('is_active'),
            'images'      => $updatedImages,
        ]);

        return redirect()->route('admin.destinations.index')
            ->with('success', 'Destination updated successfully.');
    }

    public function destroy(Destination $destination)
    {
        // Prevent deletion if packages exist
        if ($destination->packages()->exists()) {
            return back()->with('error', 'Cannot delete destination with existing packages.');
        }

        // Delete images from storage
        if (!empty($destination->images)) {
            foreach ($destination->images as $path) {
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $destination->delete();

        return redirect()->route('admin.destinations.index')
            ->with('success', 'Destination deleted successfully.');
    }
}