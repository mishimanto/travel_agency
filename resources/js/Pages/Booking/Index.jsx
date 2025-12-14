import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    CalendarDaysIcon,
    MapPinIcon,
    UsersIcon,
    CreditCardIcon,
    ChevronDownIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';

export default function BookingsIndex({ bookings }) {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date_desc');

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredBookings = bookings.data.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    return (
        <AppLayout title="My Bookings">
            <Head title="My Bookings" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p className="mt-2 text-gray-600">
                        View and manage all your travel bookings in one place
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-600">Filter by:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilter(status)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                                            filter === status
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="date_desc">Sort by: Most Recent</option>
                                <option value="date_asc">Sort by: Oldest First</option>
                                <option value="price_desc">Sort by: Highest Price</option>
                                <option value="price_asc">Sort by: Lowest Price</option>
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length > 0 ? (
                    <div className="space-y-6">
                        {filteredBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="md:flex">
                                    {/* Package Image */}
                                    <div className="md:w-1/4">
                                        <div className="h-48 md:h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="md:w-3/4 p-6">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900">
                                                            {booking.package.title}
                                                        </h3>
                                                        <div className="flex items-center mt-2 text-gray-600">
                                                            <MapPinIcon className="h-4 w-4 mr-1" />
                                                            <span>{booking.package.destination.name}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-indigo-600">
                                                            ${booking.total_price}
                                                        </div>
                                                        <div className="text-sm text-gray-500">Total</div>
                                                    </div>
                                                </div>

                                                {/* Booking Info */}
                                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="flex items-center">
                                                        <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Travel Date</p>
                                                            <p className="font-medium text-gray-900">
                                                                {new Date(booking.booking_date).toLocaleDateString('en-US', {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Travelers</p>
                                                            <p className="font-medium text-gray-900">
                                                                {booking.number_of_people} people
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Package Price</p>
                                                            <p className="font-medium text-gray-900">
                                                                ${booking.package.price} per person
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status & Actions */}
                                                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-center space-x-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                                                            Payment: {booking.payment_status}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        <Link
                                                            href={route('bookings.show', booking.id)}
                                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            View Details
                                                        </Link>
                                                        {booking.status === 'pending' && (
                                                            <button className="text-sm font-medium text-red-600 hover:text-red-800">
                                                                Cancel Booking
                                                            </button>
                                                        )}
                                                        {booking.status === 'confirmed' && (
                                                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                                                Download Invoice
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <CalendarDaysIcon className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">No bookings found</h3>
                        <p className="mt-2 text-gray-600">
                            {filter === 'all'
                                ? "You haven't made any bookings yet. Start your journey today!"
                                : `No ${filter} bookings found.`}
                        </p>
                        {filter === 'all' && (
                            <div className="mt-6">
                                <Link
                                    href={route('packages.index')}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Browse Packages
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {bookings.links.length > 3 && (
                    <div className="mt-8 bg-white rounded-xl shadow-sm p-4">
                        <nav className="flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {bookings.links.map((link, index) => (
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
                                        Showing <span className="font-medium">{bookings.from}</span> to{' '}
                                        <span className="font-medium">{bookings.to}</span> of{' '}
                                        <span className="font-medium">{bookings.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {bookings.links.map((link, index) => (
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

                {/* Booking Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Bookings', value: bookings.total, color: 'bg-blue-500' },
                        { label: 'Confirmed', value: bookings.data.filter(b => b.status === 'confirmed').length, color: 'bg-green-500' },
                        { label: 'Pending', value: bookings.data.filter(b => b.status === 'pending').length, color: 'bg-yellow-500' },
                        { label: 'Completed', value: bookings.data.filter(b => b.status === 'completed').length, color: 'bg-purple-500' },
                    ].map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}>
                                    <CalendarDaysIcon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}