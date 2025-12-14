import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeftIcon,
    UserIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    TicketIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    CreditCardIcon,
    MapPinIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';

export default function BookingShow({ booking }) {
    const [loading, setLoading] = useState(false);
    
    // Ensure booking data exists
    const safeBooking = booking || {};
    const packageData = safeBooking.package || {};
    const userData = safeBooking.user || {};

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price || 0);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Status badge styling
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: InformationCircleIcon },
            confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon },
            completed: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
            cancelled: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
        };
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <Icon className="h-4 w-4 mr-1" />
                {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
            </span>
        );
    };

    // Payment status badge styling
    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: InformationCircleIcon },
            paid: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
            failed: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
        };
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <Icon className="h-4 w-4 mr-1" />
                {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
            </span>
        );
    };

    // Handle status update
    const handleStatusUpdate = (newStatus) => {
        if (confirm(`Are you sure you want to change status to "${newStatus}"?`)) {
            setLoading(true);
            router.put(route('admin.bookings.updateStatus', safeBooking.id), {
                status: newStatus
            }, {
                preserveScroll: true,
                onSuccess: () => setLoading(false),
                onError: () => setLoading(false),
            });
        }
    };

    // Handle payment status update
    const handlePaymentStatusUpdate = (newStatus) => {
        if (confirm(`Are you sure you want to change payment status to "${newStatus}"?`)) {
            setLoading(true);
            router.put(route('admin.bookings.updateStatus', safeBooking.id), {
                payment_status: newStatus
            }, {
                preserveScroll: true,
                onSuccess: () => setLoading(false),
                onError: () => setLoading(false),
            });
        }
    };

    // Handle delete
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this booking?')) {
            router.delete(route('admin.bookings.destroy', safeBooking.id), {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(route('admin.bookings.index'));
                }
            });
        }
    };

    return (
        <AdminLayout title="Booking Details">
            <Head title="Booking Details" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={route('admin.bookings.index')}
                            className="mr-4 text-gray-400 hover:text-gray-600"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                            <p className="text-gray-600">Booking ID: #{safeBooking.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={handleDelete}
                            className="px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm font-medium hover:bg-red-50"
                        >
                            Delete Booking
                        </button>
                    </div>
                </div>

                {/* Booking Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {formatPrice(safeBooking.total_price)}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Booking Status</p>
                                <div className="mt-2">
                                    {getStatusBadge(safeBooking.status)}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
                                <TicketIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Payment Status</p>
                                <div className="mt-2">
                                    {getPaymentStatusBadge(safeBooking.payment_status)}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                                <CreditCardIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Travelers</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">
                                    {safeBooking.number_of_people || 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Booking & Customer Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Information */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <TicketIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                    Booking Information
                                </h3>
                                <div className="flex space-x-2">
                                    {/* Status Update Buttons */}
                                    <select 
                                        value={safeBooking.status || 'pending'}
                                        onChange={(e) => handleStatusUpdate(e.target.value)}
                                        disabled={loading}
                                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    
                                    {/* Payment Status Update Buttons */}
                                    <select 
                                        value={safeBooking.payment_status || 'pending'}
                                        onChange={(e) => handlePaymentStatusUpdate(e.target.value)}
                                        disabled={loading}
                                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="pending">Payment Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600">Booking Date</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {formatDate(safeBooking.booking_date)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Created At</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {formatDate(safeBooking.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Number of People</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {safeBooking.number_of_people || 0} travelers
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Price</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {formatPrice(safeBooking.total_price)}
                                    </p>
                                </div>
                            </div>

                            {/* Special Requests */}
                            {safeBooking.special_requests && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Special Requests</h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-700">{safeBooking.special_requests}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Package Information */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPinIcon className="h-5 w-5 mr-2 text-green-600" />
                                Package Details
                            </h3>
                            {packageData ? (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Package Name</p>
                                        <p className="text-lg font-semibold text-gray-900">{packageData.title}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Duration</p>
                                            <p className="text-sm font-medium text-gray-900 flex items-center">
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                {packageData.duration_days || 0} days
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Price per person</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatPrice(packageData.price)}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Description</p>
                                        <p className="text-sm text-gray-700 mt-1">{packageData.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No package information available</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Customer & Actions */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Customer Information
                            </h3>
                            {userData ? (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="text-sm font-medium text-gray-900">{userData.email}</p>
                                    </div>
                                    {userData.phone && (
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="text-sm font-medium text-gray-900">{userData.phone}</p>
                                        </div>
                                    )}
                                    {userData.address && (
                                        <div>
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="text-sm font-medium text-gray-900">{userData.address}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500">No customer information available</p>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => handleStatusUpdate('confirmed')}
                                    disabled={loading || safeBooking.status === 'confirmed'}
                                    className={`w-full flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${safeBooking.status === 'confirmed' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    Confirm Booking
                                </button>
                                
                                <button 
                                    onClick={() => handlePaymentStatusUpdate('paid')}
                                    disabled={loading || safeBooking.payment_status === 'paid'}
                                    className={`w-full flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${safeBooking.payment_status === 'paid' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                >
                                    <CreditCardIcon className="h-4 w-4 mr-2" />
                                    Mark as Paid
                                </button>
                                
                                <button 
                                    onClick={() => handleStatusUpdate('cancelled')}
                                    disabled={loading || safeBooking.status === 'cancelled'}
                                    className={`w-full flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${safeBooking.status === 'cancelled' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
                                >
                                    <XCircleIcon className="h-4 w-4 mr-2" />
                                    Cancel Booking
                                </button>
                            </div>
                        </div>

                        {/* Booking Summary */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Package Price</span>
                                    <span className="text-sm font-medium">
                                        {formatPrice(packageData.price)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Number of Travelers</span>
                                    <span className="text-sm font-medium">
                                        {safeBooking.number_of_people || 0}
                                    </span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {formatPrice(safeBooking.total_price)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Timeline</h3>
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        <div className="space-y-8">
                            <div className="relative flex items-start">
                                <div className="absolute left-3 top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                                <div className="ml-10">
                                    <p className="text-sm font-medium text-gray-900">Booking Created</p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(safeBooking.created_at)} • By {userData?.name || 'Customer'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="relative flex items-start">
                                <div className={`absolute left-3 top-1 w-3 h-3 rounded-full border-2 border-white ${safeBooking.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <div className="ml-10">
                                    <p className="text-sm font-medium text-gray-900">Payment {safeBooking.payment_status === 'paid' ? 'Completed' : 'Pending'}</p>
                                    <p className="text-sm text-gray-500">
                                        {safeBooking.payment_status === 'paid' ? 'Payment received successfully' : 'Awaiting payment'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="relative flex items-start">
                                <div className={`absolute left-3 top-1 w-3 h-3 rounded-full border-2 border-white ${
                                    safeBooking.status === 'completed' ? 'bg-green-500' :
                                    safeBooking.status === 'confirmed' ? 'bg-blue-500' :
                                    safeBooking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}></div>
                                <div className="ml-10">
                                    <p className="text-sm font-medium text-gray-900">Booking {safeBooking.status?.charAt(0).toUpperCase() + safeBooking.status?.slice(1)}</p>
                                    <p className="text-sm text-gray-500">
                                        Current status: {safeBooking.status || 'pending'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}