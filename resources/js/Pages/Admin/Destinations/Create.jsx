import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    PhotoIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function DestinationsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        images: [],
        is_active: true,
    });

    const [imagePreviews, setImagePreviews] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.destinations.store'));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
        
        // Create previews
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newImages = [...data.images];
        const newPreviews = [...imagePreviews];
        
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    return (
        <AdminLayout title="Add Destination">
            <Head title="Add New Destination" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href={route('admin.destinations.index')}
                        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Destinations
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Destination</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Destination Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Images Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Destination Images</h2>
                            
                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="mb-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                    <label className="cursor-pointer inline-flex items-center">
                                        <span className="mt-2 block text-sm font-semibold text-indigo-600">
                                            Upload destination images
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    PNG, JPG, GIF, WEBP up to 2MB each
                                </p>
                                {data.images.length > 0 && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        {data.images.length} image(s) selected
                                    </p>
                                )}
                                {errors.images && (
                                    <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-gray-900">
                                    Active Status
                                </label>
                                <p className="text-sm text-gray-500">
                                    Make this destination visible on the website
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <Link
                                href={route('admin.destinations.index')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating...' : 'Create Destination'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}