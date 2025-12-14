import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    CalendarDaysIcon, 
    MapPinIcon, 
    UserIcon, 
    ClockIcon,
    CheckCircleIcon,
    StarIcon,
    ChevronRightIcon,
    XMarkIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

export default function PackageShow({ package: pkg }) {
    const [selectedDate, setSelectedDate] = useState(pkg.available_dates?.[0] || '');
    const [travelers, setTravelers] = useState(1);
    const [activeTab, setActiveTab] = useState('overview');

    const { data, setData, post, processing } = useForm({
        package_id: pkg.id,
        booking_date: selectedDate,
        number_of_people: travelers,
        special_requests: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('bookings.store'));
    };

    const totalPrice = pkg.price * travelers;

    // Helper function to get image URL
    const getImageUrl = () => {
        if (pkg.image) {
            // If image is a full URL
            if (pkg.image.startsWith('http')) {
                return pkg.image;
            }
            // If image is stored in storage
            if (pkg.image.startsWith('packages/') || pkg.image.startsWith('storage/')) {
                return `/storage/${pkg.image.replace('storage/', '')}`;
            }
            // Return as is
            return pkg.image;
        }
        
        // Default gradient background based on destination or package ID
        const gradients = [
            'bg-gradient-to-br from-blue-500 to-purple-600',
            'bg-gradient-to-br from-emerald-500 to-cyan-600',
            'bg-gradient-to-br from-amber-500 to-orange-600',
            'bg-gradient-to-br from-rose-500 to-pink-600',
            'bg-gradient-to-br from-indigo-500 to-blue-600',
            'bg-gradient-to-br from-teal-500 to-green-600',
            'bg-gradient-to-br from-orange-500 to-red-600',
            'bg-gradient-to-br from-purple-500 to-pink-600',
        ];
        
        const gradientIndex = pkg.id ? pkg.id % gradients.length : 0;
        return gradients[gradientIndex];
    };

    // Check if image exists
    const hasImage = pkg.image && !getImageUrl().includes('gradient');

    // Helper function to safely get inclusions as array
    const getInclusions = () => {
        if (!pkg.inclusions) return [];
        
        if (Array.isArray(pkg.inclusions)) {
            return pkg.inclusions;
        }
        
        if (typeof pkg.inclusions === 'string') {
            try {
                // Try to parse as JSON
                const parsed = JSON.parse(pkg.inclusions);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                // If not JSON, try splitting by commas
                return pkg.inclusions.split(',').map(item => item.trim()).filter(item => item);
            }
        }
        
        if (typeof pkg.inclusions === 'object') {
            return Object.values(pkg.inclusions);
        }
        
        return [];
    };

    // Helper function to safely get available dates
    const getAvailableDates = () => {
        if (!pkg.available_dates) return [];
        
        if (Array.isArray(pkg.available_dates)) {
            return pkg.available_dates.filter(date => date).sort();
        }
        
        if (typeof pkg.available_dates === 'string') {
            try {
                // Remove extra quotes and decode
                const cleanString = pkg.available_dates.trim().replace(/^\"|\"$/g, '');
                const parsed = JSON.parse(cleanString);
                return Array.isArray(parsed) ? parsed.filter(date => date).sort() : [];
            } catch {
                // Try direct JSON parse
                try {
                    const parsed = JSON.parse(pkg.available_dates);
                    return Array.isArray(parsed) ? parsed.filter(date => date).sort() : [];
                } catch {
                    // If comma separated
                    if (pkg.available_dates.includes(',')) {
                        return pkg.available_dates.split(',')
                            .map(date => date.trim().replace(/^"|"$/g, ''))
                            .filter(date => date)
                            .sort();
                    }
                    return [pkg.available_dates];
                }
            }
        }
        
        return [];
    };

    // Get safe arrays
    const inclusions = getInclusions();
    const availableDates = getAvailableDates();

    return (
        <AppLayout title={pkg.title}>
            <Head>
                <meta name="description" content={pkg.description} />
            </Head>

            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-4">
                            <li>
                                <Link href={route('home')} className="text-gray-400 hover:text-gray-500">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                            </li>
                            <li>
                                <Link href={route('packages.index')} className="text-gray-400 hover:text-gray-500">
                                    Packages
                                </Link>
                            </li>
                            <li>
                                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                            </li>
                            <li className="text-gray-900 font-medium truncate">{pkg.title}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Left Column - Package Details */}
                    <div className="lg:col-span-2">
                        {/* Package Image */}
                        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                            {hasImage ? (
                                <div className="relative h-96 overflow-hidden">
                                    <img 
                                        src={getImageUrl()} 
                                        alt={pkg.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.parentElement.innerHTML = `
                                                <div class="w-full h-full ${getImageUrl()} flex items-center justify-center">
                                                    <div class="text-center">
                                                        <span class="text-white text-2xl font-bold block mb-2">${pkg.title}</span>
                                                        <span class="text-white/80">${pkg.destination?.name || 'Amazing Destination'}</span>
                                                    </div>
                                                </div>
                                            `;
                                        }}
                                    />
                                    {/* Image Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    {/* Package Title on Image */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h2 className="text-3xl font-bold text-white mb-2">{pkg.title}</h2>
                                        <div className="flex items-center text-white/90">
                                            <MapPinIcon className="h-5 w-5 mr-2" />
                                            <span>{pkg.destination?.name || 'Destination not specified'}</span>
                                            <ClockIcon className="h-5 w-5 mr-2 ml-4" />
                                            <span>{pkg.duration_days} days</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                    <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80`;" alt="" />
                                </div>
                            )}
                        </div>

                        <div className="mb-8">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    {['overview', 'itinerary', 'inclusions', 'reviews'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === tab
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="py-8">
                                {activeTab === 'overview' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">About this package</h3>
                                        <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
                                        
                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-3">Highlights</h4>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                                        <span>Expert local guides</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                                        <span>Small group tours</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                                        <span>Flexible booking options</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                                                <ul className="space-y-2">
                                                    {inclusions.length > 0 ? (
                                                        inclusions.slice(0, 3).map((item, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-gray-500">No inclusions listed</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'itinerary' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h3>
                                        <div className="space-y-8">
                                            {Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 ? (
                                                pkg.itinerary.map((day, index) => (
                                                    <div key={index} className="flex">
                                                        <div className="flex flex-col items-center mr-4">
                                                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                <span className="text-indigo-600 font-bold">Day {day.day}</span>
                                                            </div>
                                                            {index < pkg.itinerary.length - 1 && (
                                                                <div className="w-0.5 h-full bg-gray-300 my-2"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 pb-8">
                                                            <h4 className="text-lg font-semibold text-gray-900">{day.title}</h4>
                                                            <p className="mt-2 text-gray-600">{day.description}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No itinerary available</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'inclusions' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-4">Included</h4>
                                                <ul className="space-y-3">
                                                    {inclusions.length > 0 ? (
                                                        inclusions.map((item, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-gray-500">No inclusions listed</li>
                                                    )}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-4">Not Included</h4>
                                                <ul className="space-y-3">
                                                    <li className="flex items-start">
                                                        <XMarkIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                                        <span>International flights</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <XMarkIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                                        <span>Travel insurance</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <XMarkIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                                        <span>Personal expenses</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <XMarkIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                                        <span>Visa fees</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Traveler Reviews</h3>
                                        <div className="space-y-6">
                                            {[1, 2, 3].map((review) => (
                                                <div key={review} className="bg-gray-50 p-6 rounded-lg">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">John Doe</h4>
                                                            <div className="flex items-center mt-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                                                                ))}
                                                                <span className="ml-2 text-sm text-gray-600">March 2024</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700">
                                                        Amazing experience! The tour was well-organized, and our guide was very knowledgeable. 
                                                        Would definitely recommend this package to anyone visiting.
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                            <div className="text-center mb-6">
                                {pkg.offer_price && parseFloat(pkg.offer_price) < parseFloat(pkg.price) ? (
                                    <div className="space-y-2">
                                        {/* Original Price with line-through */}
                                        <div className="text-gray-400 line-through text-xl">${pkg.price}</div>
                                        
                                        {/* Offer Price - highlighted */}
                                        <div className="text-4xl font-bold text-red-600">${pkg.offer_price}</div>
                                        
                                        {/* Discount badge */}
                                        <div className="inline-block bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                                            {Math.round(((parseFloat(pkg.price) - parseFloat(pkg.offer_price)) / parseFloat(pkg.price)) * 100)}% OFF
                                        </div>
                                        
                                        <div className="text-gray-600 mt-2">per person</div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="text-3xl font-bold text-indigo-600">${pkg.price}</div>
                                        <div className="text-gray-600">per person</div>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Date Selection - Updated to use safe availableDates */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        <CalendarDaysIcon className="inline h-5 w-5 mr-2" />
                                        Select Date
                                    </label>
                                    <select
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setData('booking_date', e.target.value);
                                        }}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select a date</option>
                                        {availableDates.map((date) => {
                                            try {
                                                const dateObj = new Date(date);
                                                if (isNaN(dateObj.getTime())) return null;
                                                
                                                return (
                                                    <option key={date} value={date}>
                                                        {dateObj.toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </option>
                                                );
                                            } catch {
                                                return null;
                                            }
                                        })}
                                    </select>
                                </div>

                                {/* Rest of your booking widget remains the same... */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        <UserIcon className="inline h-5 w-5 mr-2" />
                                        Travelers
                                    </label>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newTravelers = Math.max(1, travelers - 1);
                                                setTravelers(newTravelers);
                                                setData('number_of_people', newTravelers);
                                            }}
                                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            <span className="text-lg">-</span>
                                        </button>
                                        <span className="text-xl font-semibold">{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newTravelers = travelers + 1;
                                                setTravelers(newTravelers);
                                                setData('number_of_people', newTravelers);
                                            }}
                                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            <span className="text-lg">+</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Special Requests
                                    </label>
                                    <textarea
                                        value={data.special_requests}
                                        onChange={(e) => setData('special_requests', e.target.value)}
                                        rows="3"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Any special requirements or requests..."
                                    />
                                </div>

                                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Package Price</span>
                                        <div className="text-right">
                                            
                                            {pkg.offer_price && parseFloat(pkg.offer_price) < parseFloat(pkg.price) ? (
                                                <div className="space-y-1">
                                                    <div className="text-gray-400 line-through text-sm">${pkg.price}</div>
                                                    <div className="font-semibold text-red-600 text-lg">
                                                        ${pkg.offer_price}
                                                        {/* <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                            {Math.round(((parseFloat(pkg.price) - parseFloat(pkg.offer_price)) / parseFloat(pkg.price)) * 100)}% OFF
                                                        </span> */}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="font-semibold">${pkg.price}</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Service fee</span>
                                        <span className="font-semibold">$49.99</span>
                                    </div> */}

                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Person</span>
                                        <span className="font-semibold">{travelers}</span>
                                    </div>
                                    
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <div className="text-right">
                                                {/* Total price calculation */}
                                                {pkg.offer_price && parseFloat(pkg.offer_price) < parseFloat(pkg.price) ? (
                                                    <div className="space-y-1">
                                                        <div className="text-gray-400 line-through text-sm">
                                                            ${(parseFloat(pkg.price) * travelers).toFixed(2)}
                                                        </div>
                                                        <div className="text-2xl font-bold text-red-600">
                                                            ${(parseFloat(pkg.offer_price) * travelers).toFixed(2)}
                                                            <span className="ml-2 text-sm font-normal">
                                                                Save ${((parseFloat(pkg.price) - parseFloat(pkg.offer_price)) * travelers).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-2xl font-bold text-indigo-600">
                                                        ${(parseFloat(pkg.price) * travelers).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !selectedDate}
                                    className={`w-full py-3 px-4 rounded-md text-lg font-semibold ${
                                        processing || !selectedDate
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    }`}
                                >
                                    {processing ? 'Processing...' : 'Book Now'}
                                </button>

                                <div className="mt-6 text-center text-sm text-gray-500">
                                    <p className="mb-2">✓ Free cancellation up to 30 days before</p>
                                    <p>✓ Reserve now, pay later option available</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}