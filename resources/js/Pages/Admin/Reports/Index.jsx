import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ReportsIndex({ 
    stats, 
    recentBookings, 
    topPackages, 
    monthlyTrend,
    filters 
}) {
    const [dateRange, setDateRange] = useState({
        start_date: filters.start_date,
        end_date: filters.end_date,
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDateFilter = () => {
        router.get(route('reports.index'), dateRange, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        setDateRange({
            start_date: thirtyDaysAgo.toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
        });

        router.get(route('reports.index'), {
            start_date: thirtyDaysAgo.toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Reports">
            <Head title="Reports" />
            <div className="py-4">
                <div className="mx-auto">     
                    {/* Date Filter */}
                    <div className="p-6 mt-6 bg-white rounded-lg shadow">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="start_date"
                                    value={dateRange.start_date}
                                    onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="end_date"
                                    value={dateRange.end_date}
                                    onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleDateFilter}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                                >
                                    Apply Filter
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Total Bookings */}
                        <div className="p-6 bg-white rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.total_bookings}</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Revenue */}
                        <div className="p-6 bg-white rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Confirmed Bookings */}
                        <div className="p-6 bg-white rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Confirmed</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.confirmed_bookings}</p>
                                </div>
                            </div>
                        </div>

                        {/* Paid Payments */}
                        <div className="p-6 bg-white rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Paid Payments</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.paid_payments}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Packages */}
                    <div className="p-6 mt-6 bg-white rounded-lg shadow">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Top Packages by Bookings</h3>
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Package
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Destination
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Bookings
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Revenue
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {topPackages.length > 0 ? (
                                        topPackages.map((pkg) => (
                                            <tr key={pkg.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{pkg.destination}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{pkg.bookings_count}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {formatCurrency(pkg.total_revenue)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                No packages found in this period
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Bookings Table */}
                    <div className="p-6 mt-6 bg-white rounded-lg shadow">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Bookings</h3>
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Booking ID
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Package
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Booking Date
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            People
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Payment
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentBookings.length > 0 ? (
                                        recentBookings.map((booking) => (
                                            <tr key={booking.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">#{booking.id}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{booking.user_name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{booking.package_title}</div>
                                                    <div className="text-xs text-gray-500">{booking.destination}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{booking.booking_date}</div>
                                                    <div className="text-xs text-gray-500">Created: {booking.created_at}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{booking.number_of_people}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {formatCurrency(booking.total_price)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getStatusColor(booking.payment_status)}`}>
                                                        {booking.payment_status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                                No bookings found in this period
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <div className="p-6 mt-6 bg-white rounded-lg shadow">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Monthly Booking Trend</h3>
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Month
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Bookings
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Revenue
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                            Average per Booking
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {monthlyTrend.length > 0 ? (
                                        monthlyTrend.map((month) => (
                                            <tr key={month.month}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{month.month}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{month.bookings_count}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {formatCurrency(month.total_revenue)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatCurrency(month.total_revenue / (month.bookings_count || 1))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                No data available for this period
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Detailed Stats */}
                    <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
                        {/* Booking Status */}
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Booking Status</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Pending', value: stats.pending_bookings, color: 'bg-yellow-500' },
                                    { label: 'Confirmed', value: stats.confirmed_bookings, color: 'bg-green-500' },
                                    { label: 'Completed', value: stats.completed_bookings, color: 'bg-blue-500' },
                                    { label: 'Cancelled', value: stats.cancelled_bookings, color: 'bg-red-500' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Payment Status</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Paid', value: stats.paid_payments, color: 'bg-green-500' },
                                    { label: 'Pending', value: stats.pending_payments, color: 'bg-yellow-500' },
                                    { label: 'Failed', value: stats.failed_payments, color: 'bg-red-500' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}