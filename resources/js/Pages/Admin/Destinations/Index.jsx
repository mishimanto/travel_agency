import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    TicketIcon,
    PhotoIcon,
    XMarkIcon,
    CheckIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';

export default function DestinationsIndex({ destinations }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');
    const [selectedDestinations, setSelectedDestinations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingDestination, setEditingDestination] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true,
        images: [],
    });
    const [newImages, setNewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleNewDestinationClick = () => {
        setEditingDestination(null);
        setFormData({
            name: '',
            description: '',
            is_active: true,
            images: [],
        });
        setNewImages([]);
        setImagePreviews([]);
        setExistingImages([]);
        setDeletedImages([]);
        setErrors({});
        setShowModal(true);
    };

    const handleEditClick = (destination) => {
        setEditingDestination(destination);
        
        // Parse images from destination data
        let imagesArray = [];
        if (destination.images && Array.isArray(destination.images)) {
            imagesArray = destination.images;
        } else if (destination.images && typeof destination.images === 'string') {
            try {
                imagesArray = JSON.parse(destination.images);
            } catch (e) {
                console.error('Error parsing images:', e);
            }
        }

        // Prepare existing images with URLs
        const existingImagesData = imagesArray.map((imagePath, index) => ({
            id: index,
            path: imagePath,
            url: getImageUrl(imagePath),
        }));

        setFormData({
            name: destination.name || '',
            description: destination.description || '',
            is_active: destination.is_active !== undefined ? destination.is_active : true,
            images: imagesArray,
        });
        setExistingImages(existingImagesData);
        setImagePreviews([]);
        setNewImages([]);
        setDeletedImages([]);
        setErrors({});
        setShowModal(true);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('storage/')) return `/${imagePath}`;
        if (imagePath.startsWith('/storage')) return imagePath;
        
        return `/storage/${imagePath}`;
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    const data = new FormData();
    
    data.append('name', formData.name || '');
    data.append('description', formData.description || '');
    data.append('is_active', formData.is_active ? '1' : '0');
    
    existingImages.forEach((img, index) => {
        if (!deletedImages.includes(img.path)) {
            data.append(`images[${index}]`, img.path);
        }
    });
    
    newImages.forEach((file, index) => {
        data.append(`new_images[${index}]`, file);
    });
    
    deletedImages.forEach((path, index) => {
        data.append(`deleted_images[${index}]`, path);
    });
    
    console.log('FormData contents:');
    for (let [key, value] of data.entries()) {
        console.log(key, value);
    }
    
    if (editingDestination) {
        // For update: Add _method=PUT parameter
        data.append('_method', 'PUT');
        
        router.post(route('admin.destinations.update', editingDestination.id), data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                setShowModal(false);
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    is_active: true,
                    images: [],
                });
                setNewImages([]);
                setImagePreviews([]);
                setExistingImages([]);
                setDeletedImages([]);
            },
            onError: (errors) => {
                console.log('Update errors:', errors);
                setErrors(errors);
                setLoading(false);
            },
        });
    } else {
        // For create: Simple POST request
        router.post(route('admin.destinations.store'), data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                setShowModal(false);
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    is_active: true,
                    images: [],
                });
                setNewImages([]);
                setImagePreviews([]);
                setExistingImages([]);
                setDeletedImages([]);
            },
            onError: (errors) => {
                console.log('Create errors:', errors);
                setErrors(errors);
                setLoading(false);
            },
        });
    }
};

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this destination? This will also delete all associated packages.')) {
            router.delete(route('admin.destinations.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedDestinations.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedDestinations.length} destinations?`)) {
            selectedDestinations.forEach(id => {
                router.delete(route('admin.destinations.destroy', id), {
                    preserveScroll: true,
                });
            });
            setSelectedDestinations([]);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Create previews for new images
        const newPreviews = [];
        const validFiles = [];
        
        files.forEach(file => {
            if (file.size > 2 * 1024 * 1024) {
                alert(`${file.name} is too large (max 2MB)`);
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push({
                    url: reader.result,
                    name: file.name,
                });
                
                if (newPreviews.length === files.length) {
                    setImagePreviews(prev => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
            
            validFiles.push(file);
        });
        
        setNewImages(prev => [...prev, ...validFiles]);
    };

    const handleRemoveNewImage = (index) => {
        const updatedPreviews = [...imagePreviews];
        const updatedFiles = [...newImages];
        
        updatedPreviews.splice(index, 1);
        updatedFiles.splice(index, 1);
        
        setImagePreviews(updatedPreviews);
        setNewImages(updatedFiles);
    };

    const handleRemoveExistingImage = (image) => {
        // Add to deleted images list
        setDeletedImages(prev => [...prev, image.path]);
        
        // Remove from existing images display
        setExistingImages(prev => prev.filter(img => img.path !== image.path));
    };

    const handleRestoreImage = (imagePath) => {
        // Remove from deleted images
        setDeletedImages(prev => prev.filter(path => path !== imagePath));
        
        // Find and restore to existing images
        const originalImage = destinations.data
            .find(d => d.id === editingDestination.id)
            ?.images?.find(img => img === imagePath);
        
        if (originalImage) {
            setExistingImages(prev => [...prev, {
                id: prev.length,
                path: originalImage,
                url: getImageUrl(originalImage),
            }]);
        }
    };

    const filteredDestinations = destinations.data.filter(destination =>
        destination.name.toLowerCase().includes(search.toLowerCase()) ||
        destination.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Destinations">
            <Head title="Manage Destinations" />

            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{flash.success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XMarkIcon className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{flash.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900"></h2>
                        <p className="mt-1 text-gray-600"></p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleNewDestinationClick}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Destination
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search destinations..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedDestinations.length > 0 && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                    {selectedDestinations.length} selected
                                </span>
                                <button
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
                                >
                                    <TrashIcon className="h-4 w-4 mr-1" />
                                    Delete Selected
                                </button>
                                <button
                                    onClick={() => setSelectedDestinations([])}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Destinations Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDestinations(filteredDestinations.map(d => d.id));
                                                } else {
                                                    setSelectedDestinations([]);
                                                }
                                            }}
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Destination
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Packages
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDestinations.length > 0 ? (
                                    filteredDestinations.map((destination) => {
                                        const images = destination.images && Array.isArray(destination.images) 
                                            ? destination.images 
                                            : (typeof destination.images === 'string' ? JSON.parse(destination.images || '[]') : []);
                                        
                                        return (
                                            <tr key={destination.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDestinations.includes(destination.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedDestinations([...selectedDestinations, destination.id]);
                                                            } else {
                                                                setSelectedDestinations(selectedDestinations.filter(id => id !== destination.id));
                                                            }
                                                        }}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden">
                                                        {images.length > 0 ? (
                                                            <img
                                                                src={getImageUrl(images[0])}
                                                                alt={destination.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                                                <PhotoIcon className="h-6 w-6 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{destination.name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {images.length} images
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs">
                                                        <p className="text-sm text-gray-900 line-clamp-2">
                                                            {destination.description}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {destination.packages_count || 0}
                                                        </div>
                                                        <div className="text-xs text-gray-500">packages</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        destination.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {destination.is_active ? (
                                                            <>
                                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircleIcon className="h-3 w-3 mr-1" />
                                                                Inactive
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(destination.created_at).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(destination.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <Link
                                                            href={route('packages.index', { destination: destination.id })}
                                                            target="_blank"
                                                            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                                                            title="View Packages"
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleEditClick(destination)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                            title="Edit"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(destination.id)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                                <MapPinIcon className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="mt-4 text-xl font-semibold text-gray-900">No destinations found</h3>
                                            <p className="mt-2 text-gray-600">
                                                {search ? 'No destinations match your search.' : 'Start by adding your first destination.'}
                                            </p>
                                            {!search && (
                                                <div className="mt-6">
                                                    <button
                                                        onClick={handleNewDestinationClick}
                                                        className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500"
                                                    >
                                                        <PlusIcon className="h-5 w-5 mr-2" />
                                                        Add Destination
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {destinations.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <nav className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {destinations.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                link.active
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{destinations.from}</span> to{' '}
                                            <span className="font-medium">{destinations.to}</span> of{' '}
                                            <span className="font-medium">{destinations.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {destinations.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Destination Modal */}
            {showModal && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 max-h-[90vh] overflow-y-auto">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <h3 className="text-lg font-medium text-gray-900 mb-6">
                                {editingDestination ? 'Edit Destination' : 'Create New Destination'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Form Errors */}
                                {Object.keys(errors).length > 0 && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">
                                                    Please fix the following errors:
                                                </h3>
                                                <div className="mt-2 text-sm text-red-700">
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {Object.entries(errors).map(([field, messages]) => (
                                                            <li key={field}>{Array.isArray(messages) ? messages.join(', ') : messages}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Destination Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active || false}
                                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                        Active Destination
                                    </label>
                                </div>

                                {/* Images Upload Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Destination Images (Multiple)
                                    </label>
                                    
                                    {/* Existing Images */}
                                    {existingImages.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images</h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {existingImages.map((image) => (
                                                    <div key={image.id} className="relative group">
                                                        <img
                                                            src={image.url}
                                                            alt={`Destination ${image.id}`}
                                                            className="h-24 w-full object-cover rounded-lg"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveExistingImage(image)}
                                                                className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-all duration-200"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* New Images Preview */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">New Images</h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={preview.url}
                                                            alt={`New image ${index}`}
                                                            className="h-24 w-full object-cover rounded-lg"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveNewImage(index)}
                                                                className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-all duration-200"
                                                            >
                                                                <XMarkIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Deleted Images (if any) */}
                                    {deletedImages.length > 0 && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                {deletedImages.length} image(s) marked for deletion
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {deletedImages.map((path, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => handleRestoreImage(path)}
                                                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200"
                                                    >
                                                        Restore
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Image Upload Area */}
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors duration-200">
                                        <div className="space-y-2">
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex flex-col items-center">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                                    <span className="px-3 py-2 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200">
                                                        Choose images
                                                    </span>
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                        multiple
                                                    />
                                                </label>
                                                <p className="text-xs text-gray-500 mt-3">
                                                    or drag and drop here
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF, WEBP up to 2MB each
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : (editingDestination ? 'Update Destination' : 'Create Destination')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}