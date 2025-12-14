import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    TicketIcon,
    StarIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    XMarkIcon,
    PhotoIcon,
    CalendarDaysIcon,
    MapPinIcon,
    ClockIcon,
    CurrencyDollarIcon,
    CheckIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function AdminPackagesIndex({ packages, destinations }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        offer_price: '',
        duration_days: '',
        destination_id: '',
        available_dates: [],
        image: null,
        inclusions: [],
        itinerary: [],
        is_featured: false,
        is_active: true,
    });
    const [newInclusion, setNewInclusion] = useState('');
    const [newItineraryDay, setNewItineraryDay] = useState({
        day: '',
        title: '',
        description: ''
    });
    const [newAvailableDate, setNewAvailableDate] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const safePackages = packages || {};
    const safeData = safePackages.data || [];
    const safeLinks = safePackages.links || [];

    // Initialize form when modal opens for new package
    const handleNewPackageClick = () => {
        setEditingPackage(null);
        setFormData({
            title: '',
            description: '',
            price: '',
            offer_price: '',
            duration_days: '',
            destination_id: destinations?.[0]?.id?.toString() || '',
            available_dates: [],
            image: null,
            inclusions: [],
            itinerary: [],
            is_featured: false,
            is_active: true,
        });
        setNewInclusion('');
        setNewItineraryDay({ day: '', title: '', description: '' });
        setNewAvailableDate('');
        setImagePreview(null);
        setErrors({});
        setShowModal(true);
    };

    // Initialize form when editing
    const handleEditClick = (pkg) => {
        setEditingPackage(pkg);
        
        // Parse JSON fields safely
        let availableDates = [];
        let inclusions = [];
        let itinerary = [];
        
        try {
            if (pkg.available_dates) {
                const parsed = typeof pkg.available_dates === 'string' 
                    ? JSON.parse(pkg.available_dates) 
                    : pkg.available_dates;
                if (Array.isArray(parsed)) availableDates = parsed;
            }
        } catch (e) {
            console.error('Error parsing available_dates:', e);
        }
        
        try {
            if (pkg.inclusions) {
                const parsed = typeof pkg.inclusions === 'string' 
                    ? JSON.parse(pkg.inclusions) 
                    : pkg.inclusions;
                if (Array.isArray(parsed)) inclusions = parsed;
            }
        } catch (e) {
            console.error('Error parsing inclusions:', e);
        }
        
        try {
            if (pkg.itinerary) {
                const parsed = typeof pkg.itinerary === 'string' 
                    ? JSON.parse(pkg.itinerary) 
                    : pkg.itinerary;
                if (Array.isArray(parsed)) itinerary = parsed;
            }
        } catch (e) {
            console.error('Error parsing itinerary:', e);
        }

        setFormData({
            title: pkg.title || '',
            description: pkg.description || '',
            price: pkg.price?.toString() || '',
            offer_price: pkg.offer_price?.toString() || '',
            duration_days: pkg.duration_days?.toString() || '',
            destination_id: pkg.destination_id?.toString() || '',
            available_dates: availableDates,
            image: null,
            inclusions: inclusions,
            itinerary: itinerary,
            is_featured: Boolean(pkg.is_featured),
            is_active: Boolean(pkg.is_active !== undefined ? pkg.is_active : true),
        });
        
        if (pkg.image) {
            setImagePreview(getImageUrl(pkg.image));
        }
        
        setNewInclusion('');
        setNewItineraryDay({ day: '', title: '', description: '' });
        setNewAvailableDate('');
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
        
        // Append all form fields with proper validation
        const fields = [
            'title', 'description', 'price', 'offer_price', 'duration_days', 'destination_id',
        ];
        
        fields.forEach(field => {
            if (formData[field] !== undefined && formData[field] !== null) {
                data.append(field, formData[field].toString());
            }
        });
        
        // Handle boolean fields - convert to 1 or 0
        data.append('is_featured', formData.is_featured ? '1' : '0');
        data.append('is_active', formData.is_active ? '1' : '0');
        
        // Handle arrays - append each item separately
        // Laravel will automatically convert these to arrays
        if (formData.available_dates && Array.isArray(formData.available_dates)) {
            formData.available_dates.forEach((date, index) => {
                data.append(`available_dates[${index}]`, date);
            });
        }
        
        if (formData.inclusions && Array.isArray(formData.inclusions)) {
            formData.inclusions.forEach((inclusion, index) => {
                data.append(`inclusions[${index}]`, inclusion);
            });
        }
        
        if (formData.itinerary && Array.isArray(formData.itinerary)) {
            formData.itinerary.forEach((day, index) => {
                data.append(`itinerary[${index}][day]`, day.day.toString());
                data.append(`itinerary[${index}][title]`, day.title);
                data.append(`itinerary[${index}][description]`, day.description);
            });
        }
        
        // Handle image file
        if (formData.image instanceof File) {
            data.append('image', formData.image);
        }
        
        // If editing, we need to handle existing images
        if (editingPackage && !formData.image && !imagePreview && editingPackage.image) {
            // User removed the image
            data.append('remove_image', '1');
        }
        
        if (editingPackage) {
            // Update existing package
            data.append('_method', 'PUT');
            router.post(route('admin.packages.update', editingPackage.id), data, {
                forceFormData: true,
                onSuccess: () => {
                    setLoading(false);
                    setShowModal(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setLoading(false);
                },
            });
        } else {
            // Create new package
            router.post(route('admin.packages.store'), data, {
                forceFormData: true,
                onSuccess: () => {
                    setLoading(false);
                    setShowModal(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setLoading(false);
                },
            });
        }
    };

    const handleDelete = (pkg) => {
        if (confirm(`Are you sure you want to delete "${pkg.title}"?`)) {
            router.delete(route('admin.packages.destroy', pkg.id), {
                preserveScroll: true,
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedPackages.length === 0) return;
        if (confirm(`Are you sure you want to delete ${selectedPackages.length} packages?`)) {
            router.post(route('admin.packages.bulk-delete'), {
                ids: selectedPackages
            }, {
                preserveScroll: true,
                onSuccess: () => setSelectedPackages([])
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, image: null });
        setImagePreview(null);
    };

    const addInclusion = () => {
        if (newInclusion.trim()) {
            setFormData({
                ...formData,
                inclusions: [...formData.inclusions, newInclusion.trim()]
            });
            setNewInclusion('');
        }
    };

    const removeInclusion = (index) => {
        const newInclusions = [...formData.inclusions];
        newInclusions.splice(index, 1);
        setFormData({ ...formData, inclusions: newInclusions });
    };

    const addItineraryDay = () => {
        if (newItineraryDay.day && newItineraryDay.title && newItineraryDay.description) {
            setFormData({
                ...formData,
                itinerary: [...formData.itinerary, { 
                    day: parseInt(newItineraryDay.day) || 1,
                    title: newItineraryDay.title,
                    description: newItineraryDay.description
                }]
            });
            setNewItineraryDay({ day: '', title: '', description: '' });
        }
    };

    const removeItineraryDay = (index) => {
        const newItinerary = [...formData.itinerary];
        newItinerary.splice(index, 1);
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const addAvailableDate = () => {
        if (newAvailableDate) {
            setFormData({
                ...formData,
                available_dates: [...formData.available_dates, newAvailableDate]
            });
            setNewAvailableDate('');
        }
    };

    const removeAvailableDate = (index) => {
        const newDates = [...formData.available_dates];
        newDates.splice(index, 1);
        setFormData({ ...formData, available_dates: newDates });
    };

    const filteredPackages = safeData.filter(pkg => {
        const matchesSearch = search === '' || 
            (pkg.title && pkg.title.toLowerCase().includes(search.toLowerCase())) ||
            (pkg.description && pkg.description.toLowerCase().includes(search.toLowerCase()));
        
        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'active' && pkg.is_active) ||
            (selectedStatus === 'inactive' && !pkg.is_active) ||
            (selectedStatus === 'featured' && pkg.is_featured);
        
        return matchesSearch && matchesStatus;
    });

    const formatPrice = (price) => {
        const num = parseFloat(price || 0);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(num);
    };

    const getAvailableDatesCount = (dates) => {
        if (!dates) return 0;
        try {
            const parsed = typeof dates === 'string' ? JSON.parse(dates) : dates;
            return Array.isArray(parsed) ? parsed.length : 0;
        } catch {
            return 0;
        }
    };

    const getFirstInclusion = (inclusions) => {
        if (!inclusions) return 'No inclusions';
        try {
            const parsed = typeof inclusions === 'string' ? JSON.parse(inclusions) : inclusions;
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed[0] + (parsed.length > 1 ? ` +${parsed.length - 1} more` : '');
            }
        } catch {
            return 'No inclusions';
        }
        return 'No inclusions';
    };

    return (
        <AdminLayout title="Packages">
            <Head title="Manage Packages" />

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
                        <p className="text-gray-600 mt-1"></p>
                    </div>
                    <button
                        onClick={handleNewPackageClick}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add New Package
                    </button>
                </div>
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Packages</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{safePackages.total || 0}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                <TicketIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Packages</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {safeData.filter(p => p.is_active).length}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                                <div className="h-6 w-6 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Featured Packages</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {safeData.filter(p => p.is_featured).length}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
                                <StarIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg. Price</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {formatPrice(safeData.length > 0 
                                        ? safeData.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / safeData.length 
                                        : 0)}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search packages by title or description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <FunnelIcon className="h-5 w-5 text-gray-400" />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="featured">Featured</option>
                            </select>
                        </div>

                        {selectedPackages.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    {selectedPackages.length} selected
                                </span>
                                <button
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
                                >
                                    <TrashIcon className="h-4 w-4 mr-1" />
                                    Delete Selected
                                </button>
                                <button
                                    onClick={() => setSelectedPackages([])}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Packages Table (Line View) */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedPackages(filteredPackages.map(p => p.id));
                                                } else {
                                                    setSelectedPackages([]);
                                                }
                                            }}
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Package
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Destination
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Duration
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPackages.length > 0 ? (
                                    filteredPackages.map((pkg) => {
                                        const imageUrl = getImageUrl(pkg.image);
                                        const availableDatesCount = getAvailableDatesCount(pkg.available_dates);
                                        const firstInclusion = getFirstInclusion(pkg.inclusions);
                                        
                                        return (
                                            <tr key={pkg.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPackages.includes(pkg.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedPackages([...selectedPackages, pkg.id]);
                                                            } else {
                                                                setSelectedPackages(selectedPackages.filter(id => id !== pkg.id));
                                                            }
                                                        }}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 relative group">
                                                            {imageUrl ? (
                                                                <>
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={pkg.title}
                                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=Travel';
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                                                                </>
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                                                                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="flex items-center">
                                                                <div className="text-sm font-semibold text-gray-900">{pkg.title || 'Untitled Package'}</div>
                                                                {pkg.is_featured && (
                                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                        <StarIcon className="h-3 w-3 mr-1" />
                                                                        Featured
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                                                                {pkg.description || 'No description available'}
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-1 flex items-center">
                                                                <TicketIcon className="h-3 w-3 mr-1" />
                                                                {firstInclusion}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                        {pkg.destination?.name || 'No destination'}
                                                    </div>
                                                </td>
                                            
                                                <td className="px-6 py-4">
                                                    {pkg.offer_price && parseFloat(pkg.offer_price) < parseFloat(pkg.price) ? (
                                                        <div>
                                                            <div className="text-sm font-bold text-red-600">
                                                                {formatPrice(pkg.offer_price)}
                                                            </div>
                                                            <div className="text-xs text-gray-500 line-through">
                                                                {formatPrice(pkg.price)}
                                                            </div>
                                                            <div className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded mt-1 inline-block">
                                                                {Math.round(((parseFloat(pkg.price) - parseFloat(pkg.offer_price)) / parseFloat(pkg.price)) * 100)}% OFF
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm font-bold text-gray-900">
                                                            {formatPrice(pkg.price)}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-500">
                                                        <CalendarDaysIcon className="h-3 w-3 inline mr-1" />
                                                        {availableDatesCount} dates
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                        {pkg.duration_days || 0} days
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        pkg.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {pkg.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <Link
                                                            href={route('packages.show', pkg.id)}
                                                            target="_blank"
                                                            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                                                            title="Preview"
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleEditClick(pkg)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(pkg)}
                                                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
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
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <TicketIcon className="h-12 w-12 text-gray-400 mb-3" />
                                                <h3 className="text-lg font-medium text-gray-900">No packages found</h3>
                                                <p className="text-gray-500 mt-1 max-w-md">
                                                    {search || selectedStatus !== 'all' 
                                                        ? 'Try adjusting your search or filter' 
                                                        : 'Get started by creating your first travel package'}
                                                </p>
                                                <button
                                                    onClick={handleNewPackageClick}
                                                    className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                                >
                                                    <PlusIcon className="h-4 w-4 mr-2" />
                                                    Add New Package
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {safeLinks.length > 3 && selectedStatus === 'all' && search === '' && (
                    <div className="bg-white rounded-xl shadow-sm px-6 py-4">
                        <nav className="flex items-center justify-between">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{safePackages.from || 0}</span> to{' '}
                                        <span className="font-medium">{safePackages.to || 0}</span> of{' '}
                                        <span className="font-medium">{safePackages.total || 0}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {safeLinks.map((link, index) => (
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

            {/* Package Modal with Improved Image Preview */}
            {showModal && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6 max-h-[90vh] overflow-y-auto">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <h3 className="text-lg font-medium text-gray-900 mb-6">
                                {editingPackage ? 'Edit Package' : 'Create New Package'}
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Package Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Destination *
                                        </label>
                                        <select
                                            value={formData.destination_id || ''}
                                            onChange={(e) => setFormData({...formData, destination_id: e.target.value})}
                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        >
                                            <option value="">Select Destination</option>
                                            {destinations?.map(destination => (
                                                <option key={destination.id} value={destination.id}>
                                                    {destination.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price ($) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.price || ''}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>

                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Offer Price ($) <span className="text-gray-500 font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.offer_price || ''}
                                            onChange={(e) => setFormData({...formData, offer_price: e.target.value})}
                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {formData.offer_price && parseFloat(formData.offer_price) < parseFloat(formData.price || 0) && (
                                            <p className="mt-1 text-xs text-green-600">
                                                Discount: {Math.round(((parseFloat(formData.price || 0) - parseFloat(formData.offer_price)) / parseFloat(formData.price || 1)) * 100)}% off
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration (Days) *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.duration_days || ''}
                                            onChange={(e) => setFormData({...formData, duration_days: e.target.value})}
                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="is_featured"
                                                checked={formData.is_featured || false}
                                                onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                                                Featured Package
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                checked={formData.is_active !== undefined ? formData.is_active : true}
                                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Improved Image Upload with Better Preview */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Package Image
                                    </label>
                                    <div className="space-y-4">
                                        {imagePreview && (
                                            <div className="relative">
                                                <div className="relative h-64 w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Package preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-3 right-3 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-colors duration-200"
                                                    >
                                                        <XMarkIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200 ${imagePreview ? 'border-gray-200' : 'border-gray-300 hover:border-indigo-400'}`}>
                                            <div className="space-y-1 text-center">
                                                {!imagePreview && (
                                                    <>
                                                        <div className="mx-auto h-12 w-12 text-gray-400">
                                                            <PhotoIcon className="h-full w-full" />
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                                                <span className="px-3 py-2 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200">Choose an image</span>
                                                                <input
                                                                    type="file"
                                                                    className="sr-only"
                                                                    onChange={handleImageChange}
                                                                    accept="image/*"
                                                                />
                                                            </label>
                                                            <p className="text-xs text-gray-500 mt-3">
                                                                or drag and drop here
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            PNG, JPG, GIF, WEBP up to 2MB
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Inclusions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Inclusions
                                    </label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={newInclusion}
                                            onChange={(e) => setNewInclusion(e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Add inclusion (e.g., Breakfast, WiFi, etc.)"
                                        />
                                        <button
                                            type="button"
                                            onClick={addInclusion}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.inclusions?.map((inclusion, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                                <span className="text-sm text-gray-700">{inclusion}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeInclusion(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Itinerary */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Itinerary
                                    </label>
                                    <div className="space-y-4 mb-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <input
                                                type="number"
                                                value={newItineraryDay.day}
                                                onChange={(e) => setNewItineraryDay({...newItineraryDay, day: e.target.value})}
                                                className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Day"
                                            />
                                            <input
                                                type="text"
                                                value={newItineraryDay.title}
                                                onChange={(e) => setNewItineraryDay({...newItineraryDay, title: e.target.value})}
                                                className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Title"
                                            />
                                            <input
                                                type="text"
                                                value={newItineraryDay.description}
                                                onChange={(e) => setNewItineraryDay({...newItineraryDay, description: e.target.value})}
                                                className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Description"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addItineraryDay}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Add Day
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.itinerary?.map((day, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors duration-200">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-medium text-gray-900">Day {day.day}: {day.title}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItineraryDay(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <XMarkIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600">{day.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Available Dates */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Available Dates
                                    </label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="date"
                                            value={newAvailableDate}
                                            onChange={(e) => setNewAvailableDate(e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={addAvailableDate}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Add Date
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {formData.available_dates?.map((date, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200">
                                                <span className="text-sm text-gray-700">{date}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAvailableDate(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
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
                                        {loading ? 'Processing...' : (editingPackage ? 'Update Package' : 'Create Package')}
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