import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function DestinationsEdit({ destination }) {
    // images এখন object array: [{ path: '...', url: '...' }]
    const initialImages = destination.images || [];

    const { data, setData, processing, errors, put } = useForm({
        name: destination.name || "",
        description: destination.description || "",
        is_active: destination.is_active ?? true,

        // শুধু path গুলো backend এ পাঠাবো
        existing_images: initialImages.map(img => img.path), // শুধু path
        new_images: [],        // নতুন ফাইল object
        deleted_images: [],    // delete হবে এমন path গুলো
    });

    const [imagePreviews, setImagePreviews] = useState(initialImages);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);

    // Detect changes
    useEffect(() => {
        const changed =
            data.name !== destination.name ||
            data.description !== destination.description ||
            data.is_active !== destination.is_active ||
            JSON.stringify(data.existing_images) !== JSON.stringify(initialImages.map(img => img.path)) ||
            data.new_images.length > 0 ||
            data.deleted_images.length > 0;

        setHasChanges(changed);
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("is_active", data.is_active ? "1" : "0");

        // existing images (paths)
        data.existing_images.forEach((path, index) => {
            formData.append(`images[${index}]`, path);
        });

        // new uploads
        data.new_images.forEach((file, index) => {
            formData.append(`new_images[${index}]`, file);
        });

        // deleted images (paths)
        data.deleted_images.forEach((path, index) => {
            formData.append(`deleted_images[${index}]`, path);
        });

        put(route("admin.destinations.update", destination.id), formData, {
            forceFormData: true,
        });
    };

    const handleNewImageChange = (e) => {
        const files = [...e.target.files];
        setData("new_images", [...data.new_images, ...files]);

        const previews = files.map((f) => URL.createObjectURL(f));
        setNewImagePreviews([...newImagePreviews, ...previews]);

        e.target.value = null;
    };

    const removeExistingImage = (index) => {
        const imageToDelete = imagePreviews[index]; // { path, url }

        // Delete করা image এর path টা deleted_images এ যোগ করুন
        setData("deleted_images", [...data.deleted_images, imageToDelete.path]);

        // existing_images থেকে path remove করুন
        const updatedPaths = [...data.existing_images];
        updatedPaths.splice(index, 1);
        setData("existing_images", updatedPaths);

        // UI থেকে remove করুন
        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);
        setImagePreviews(updatedPreviews);
    };

    const removeNewImage = (index) => {
        URL.revokeObjectURL(newImagePreviews[index]);

        const updatedFiles = [...data.new_images];
        const updatedPreview = [...newImagePreviews];

        updatedFiles.splice(index, 1);
        updatedPreview.splice(index, 1);

        setData("new_images", updatedFiles);
        setNewImagePreviews(updatedPreview);
    };

    return (
        <AdminLayout title="Edit Destination">
            <Head title={`Edit ${destination.name}`} />

            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <div className="mb-8">
                    <Link href={route("admin.destinations.index")} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Destinations
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Destination Name *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className="w-full rounded-md border-gray-300"
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Description *</label>
                            <textarea
                                rows="4"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className="w-full rounded-md border-gray-300"
                            />
                            {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
                        </div>

                        {/* Existing Images */}
                        {imagePreviews.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {imagePreviews.map((img, index) => (
                                        <div key={index} className="relative">
                                            <img src={img.url} className="h-32 w-full object-cover rounded-lg" />
                                            <button type="button" onClick={() => removeExistingImage(index)}
                                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full">
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images Preview */}
                        {newImagePreviews.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">New Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {newImagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img src={preview} className="h-32 w-full object-cover rounded-lg" />
                                            <button type="button" onClick={() => removeNewImage(index)}
                                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full">
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload new images */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <PhotoIcon className="h-10 w-10 mx-auto text-gray-400" />
                            <label className="cursor-pointer inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
                                Upload Images
                                <input type="file" className="hidden" multiple accept="image/*" onChange={handleNewImageChange} />
                            </label>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between pt-4">
                            <span className="text-sm">Active</span>
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData("is_active", e.target.checked)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Link href={route("admin.destinations.index")} className="px-4 py-2 border rounded-md">
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={!hasChanges || processing}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md"
                            >
                                {processing ? "Updating..." : "Update Destination"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}