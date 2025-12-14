import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    CalendarDaysIcon,
    TicketIcon,
    CreditCardIcon,
    UserCircleIcon,
    ArrowRightIcon,
    BanknotesIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

export default function UserDashboard({ user, recentBookings, stats }) {
    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user.name}!
                    </h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <TicketIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.upcomingTrips}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <CalendarDaysIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">${stats.totalSpent}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <CreditCardIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Member Since</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {new Date(user.created_at).getFullYear()}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <UserCircleIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Bookings & Payments */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Bookings */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                                    <Link
                                        href={route('user.bookings')}
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        View all
                                    </Link>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentBookings.length > 0 ? (
                                    recentBookings.map((booking) => (
                                        <div key={booking.id} className="px-6 py-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        {booking.package.title}
                                                    </h3>
                                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                                                        {new Date(booking.booking_date).toLocaleString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })}
                                                        <span className="mx-2">•</span>
                                                        {booking.number_of_people} people
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        ${booking.total_price}
                                                    </span>
                                                    <Link
                                                        href={route('bookings.show', booking.id)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <ArrowRightIcon className="h-5 w-5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center">
                                        <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-4 text-sm font-semibold text-gray-900">No bookings yet</h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Start your journey by exploring our amazing packages.
                                        </p>
                                        <div className="mt-6">
                                            <Link
                                                href={route('packages.index')}
                                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                            >
                                                Browse Packages
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Payments */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                                    <Link
                                        href={route('user.bookings')}
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        View all
                                    </Link>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentBookings.length > 0 ? (
                                    recentBookings
                                        .filter(booking => booking.total_price > 0) // Only show bookings with payments
                                        .map((booking) => (
                                            <div key={booking.id} className="px-6 py-4 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                                            <BanknotesIcon className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-900">
                                                                Payment for <span className="text-red-800">{booking.package.title}</span>
                                                            </h3>

                                                            {/* <div className="mt-1 flex items-center text-sm text-gray-500">
                                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                                Paid on {booking.booking_date}
                                                                <span className="mx-2">•</span>
                                                                <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs">
                                                                    Paid
                                                                </span>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            ${booking.total_price}
                                                        </span>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="px-6 py-8 text-center">
                                        <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-4 text-sm font-semibold text-gray-900">No Payments yet</h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Your payment history will appear here after you make bookings.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quick Actions, Profile, etc. */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        {/* <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    href={route('packages.index')}
                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                                >
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-sm font-medium text-gray-900">Find New Packages</span>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                                </Link>

                                <Link
                                    href={route('user.bookings')}
                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                                >
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <TicketIcon className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span className="ml-3 text-sm font-medium text-gray-900">View All Bookings</span>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                                </Link>

                                <Link
                                    href={route('profile.edit')}
                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                                >
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <UserCircleIcon className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <span className="ml-3 text-sm font-medium text-gray-900">Update Profile</span>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                                </Link>
                            </div>
                        </div> */}

                        {/* Profile Summary */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full" />
                                        ) : (
                                            <span className="text-lg font-semibold text-gray-700">
                                                {user.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {user.phone || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Member Since</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={route('profile.edit')}
                                    className="block w-full text-center bg-gray-50 text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-100"
                                >
                                    Edit Profile
                                </Link>
                            </div>
                        </div>

                        {/* Recommended Packages */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">Ready for Adventure?</h3>
                            <p className="text-sm opacity-90 mb-4">
                                Check out our specially curated packages for you.
                            </p>
                            <Link
                                href={route('packages.index')}
                                className="inline-flex items-center justify-center w-full bg-white text-indigo-600 py-2 px-4 rounded-md font-medium hover:bg-gray-100"
                            >
                                Explore Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}