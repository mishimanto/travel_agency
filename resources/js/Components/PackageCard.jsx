// resources/js/Components/PackageCard.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    MapPinIcon, 
    CalendarDaysIcon, 
    StarIcon,
    ClockIcon 
} from '@heroicons/react/24/outline';

export default function PackageCard({ package: pkg }) {
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
        // Default image
        return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80`;
    };

    // Helper function to safely get available dates as array
    const getAvailableDates = () => {
        if (!pkg.available_dates) return [];
        
        if (Array.isArray(pkg.available_dates)) {
            return pkg.available_dates;
        }
        
        if (typeof pkg.available_dates === 'string') {
            try {
                // Remove extra quotes and decode
                const cleanString = pkg.available_dates.trim().replace(/^\"|\"$/g, '');
                const parsed = JSON.parse(cleanString);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                // Try direct JSON parse
                try {
                    const parsed = JSON.parse(pkg.available_dates);
                    return Array.isArray(parsed) ? parsed : [];
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
        
        if (typeof pkg.available_dates === 'object') {
            return Object.values(pkg.available_dates);
        }
        
        return [];
    };

    // Get safe available dates array
    const availableDates = getAvailableDates();

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Package Image */}
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={getImageUrl()} 
                    alt={pkg.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
                    }}
                />
                
                {/* Featured Badge */}
                {pkg.is_featured && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                    </div>
                )}
                
                {/* Price Tag */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-3 py-2 rounded-lg">
                    <div className="text-lg">${pkg.price}</div>
                    <div className="text-xs text-gray-600">per person</div>
                </div>
            </div>

            {/* Package Content */}
            <div className="p-6">
                {/* Destination */}
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{pkg.destination?.name || 'Destination'}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                    {pkg.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {pkg.description}
                </p>

                {/* Details */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{pkg.duration_days} days</span>
                    </div>
                    <div className="flex items-center">
                        <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                        <span>4.8 (124 reviews)</span>
                    </div>
                </div>

                {/* Available Dates */}
                <div className="mb-6">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        <span className="font-medium">Next Available:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {availableDates.length > 0 ? (
                            <>
                                {availableDates.slice(0, 2).map((date, index) => {
                                    try {
                                        const dateObj = new Date(date);
                                        if (isNaN(dateObj.getTime())) return null;
                                        
                                        return (
                                            <span 
                                                key={index} 
                                                className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full"
                                            >
                                                {dateObj.toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        );
                                    } catch {
                                        return null;
                                    }
                                })}
                                {availableDates.length > 2 && (
                                    <span className="text-gray-500 text-xs">
                                        +{availableDates.length - 2} more
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-gray-400 text-xs">Dates not available</span>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-between items-center">
                    <Link
                        href={route('packages.show', pkg.id)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium flex-1 text-center"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}