// resources/js/Pages/Booking/Show.jsx
import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    CheckCircleIcon,
    CalendarDaysIcon,
    UserIcon,
    CurrencyDollarIcon,
    MapPinIcon,
    ClockIcon,
    TicketIcon,
    CreditCardIcon,
    DocumentTextIcon,
    PencilIcon,
    XCircleIcon,
    PhoneIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

// Stripe import করুন conditional ভাবে
let stripePromise = null;
if (typeof window !== 'undefined' && import.meta.env.VITE_STRIPE_KEY) {
    import('@stripe/stripe-js').then(({ loadStripe }) => {
        stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
    });
}

export default function BookingShow({ booking }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { flash } = usePage().props;
    
    // Check if booking is available
    if (!booking) {
        return (
            <AppLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600">Booking Not Found</h1>
                        <p className="mt-4">The booking you are looking for does not exist.</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const handlePayment = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
        window.location.href = route('stripe.payment') + `?booking_id=${booking.id}`;

    } catch (error) {
        console.error('Payment error:', error);
        setError('Failed to redirect to payment page');
        
        // Show error for 5 seconds
        setTimeout(() => setError(null), 5000);
        setLoading(false);
    }
};
    const handleDownloadInvoice = () => {
        alert('Invoice download feature coming soon!');
    };

    const handleModifyBooking = () => {
        alert('Booking modification feature coming soon!');
    };

    const handleCancelBooking = () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            alert('Booking cancellation feature coming soon!');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    // Get status badge color
    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get payment status color
    const getPaymentStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout title={`Booking #${booking.id || ''}`}>
            <Head>
                <title>{`Booking #${booking.id || ''} - Travel Agency`}</title>
                <meta name="description" content="View your booking details" />
            </Head>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            {flash.success}
                        </div>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
                        <div className="flex items-center">
                            <XCircleIcon className="h-5 w-5 mr-2" />
                            {flash.error}
                        </div>
                    </div>
                </div>
            )}

            {/* Error/Success Messages */}
            {error && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
                        <div className="flex items-center">
                            <XCircleIcon className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            {success}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-4">
                                <li>
                                    <Link 
                                        href={route('home')} 
                                        className="text-gray-400 hover:text-gray-500 transition"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mx-2">›</span>
                                        <Link 
                                            href={route('dashboard')} 
                                            className="text-gray-400 hover:text-gray-500 transition"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mx-2">›</span>
                                        <Link 
                                            href={route('user.bookings')} 
                                            className="text-gray-400 hover:text-gray-500 transition"
                                        >
                                            My Bookings
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mx-2">›</span>
                                        <span className="text-gray-900 font-medium">
                                            Booking #{booking.id || ''}
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* Success Message */}
                        {booking.status === 'confirmed' && booking.payment_status === 'paid' && (
                            <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6">
                                <div className="flex items-center">
                                    <CheckCircleIcon className="h-12 w-12 text-green-500 mr-4 flex-shrink-0" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
                                        <p className="text-gray-600 mt-2">
                                            Your booking has been confirmed. We've sent a confirmation email to your registered email address.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pending Payment Message */}
                        {booking.status === 'pending' && booking.payment_status === 'pending' && (
                            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                                <div className="flex items-center">
                                    <CreditCardIcon className="h-12 w-12 text-yellow-500 mr-4 flex-shrink-0" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Payment Required</h2>
                                        <p className="text-gray-600 mt-2">
                                            Your booking is pending payment. Please complete the payment to confirm your booking.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Left Column - Booking Details */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* Booking Details Card */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <TicketIcon className="h-6 w-6 text-gray-400 mr-2" />
                                        Booking Details
                                    </h3>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 w-8">
                                                    <div className="h-6 w-6 text-gray-400">
                                                        #
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Booking ID</div>
                                                    <div className="font-semibold text-gray-900">#{booking.id || ''}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start">
                                                <CalendarDaysIcon className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-500">Booking Date</div>
                                                    <div className="font-semibold text-gray-900">
                                                        {formatDate(booking.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start">
                                                <CalendarDaysIcon className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-500">Trip Date</div>
                                                    <div className="font-semibold text-gray-900">
                                                        {formatDate(booking.booking_date)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start">
                                                <UserIcon className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-500">Travelers</div>
                                                    <div className="font-semibold text-gray-900">
                                                        {booking.number_of_people || 0} {booking.number_of_people === 1 ? 'Person' : 'People'}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start">
                                                <CurrencyDollarIcon className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-500">Total Price</div>
                                                    {booking.package?.offer_price && parseFloat(booking.package.offer_price) < parseFloat(booking.package.price) ? (
                                                        <div className="space-y-1">
                                                            {/* Offer Total - Highlighted */}
                                                            <div className="text-2xl font-bold text-red-600">
                                                                ${parseFloat(booking.total_price || 0).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-2xl font-bold text-indigo-600">
                                                            ${parseFloat(booking.total_price || 0).toFixed(2)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start">
                                                <div className="h-6 w-6 mr-2 flex-shrink-0">
                                                    {/* Status Icon Placeholder */}
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Status</div>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                                        {(booking.status || 'Pending').charAt(0).toUpperCase() + (booking.status || 'Pending').slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start">
                                                <div className="h-6 w-6 mr-2 flex-shrink-0">
                                                    {/* Payment Status Icon Placeholder */}
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Payment Status</div>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                                                        {(booking.payment_status || 'Pending').charAt(0).toUpperCase() + (booking.payment_status || 'Pending').slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {booking.special_requests && (
                                            <div className="border-t pt-6 mt-6">
                                                <div className="text-sm text-gray-500 mb-2">Special Requests</div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-gray-700">{booking.special_requests}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Package Details Card */}
                                {booking.package && (
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                            <MapPinIcon className="h-6 w-6 text-gray-400 mr-2" />
                                            Package Details
                                        </h3>
                                        
                                        <div className="flex flex-col md:flex-row items-start mb-6">
                                            {booking.package.image && (
                                                <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden mr-4 mb-4 md:mb-0">
                                                    <img 
                                                        src={booking.package.image_url || `/storage/${booking.package.image}`} 
                                                        alt={booking.package.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-900">{booking.package.title}</h4>
                                                <p className="text-gray-600 mt-2">{booking.package.description}</p>
                                                
                                                <div className="flex flex-wrap gap-4 mt-4">
                                                    {booking.package.destination && (
                                                        <div className="flex items-center text-gray-600">
                                                            <MapPinIcon className="h-4 w-4 mr-1" />
                                                            <span>{booking.package.destination.name}</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-center text-gray-600">
                                                        <ClockIcon className="h-4 w-4 mr-1" />
                                                        <span>{booking.package.duration_days} days</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-gray-600">
                                                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                                                        {booking.package?.offer_price && parseFloat(booking.package.offer_price) < parseFloat(booking.package.price) ? (
                                                            <span>
                                                                <span className="text-gray-400 line-through mr-2">${parseFloat(booking.package.price || 0).toFixed(2)}</span>
                                                                <span className="text-red-600 font-medium">${parseFloat(booking.package.offer_price || 0).toFixed(2)}</span>
                                                                <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">Special Offer</span>
                                                            </span>
                                                        ) : (
                                                            <span>${parseFloat(booking.package?.price || 0).toFixed(2)} per person</span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4">
                                                    <Link 
                                                        href={route('packages.show', booking.package.id)}
                                                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                                                    >
                                                        View Package Details
                                                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Actions & Payment */}
                            <div className="lg:col-span-1 space-y-6">
                                
                                {/* Next Steps Card */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600 font-bold">1</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-medium text-gray-900">Check Your Email</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    We've sent a confirmation email with all the details.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600 font-bold">2</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-medium text-gray-900">Prepare Documents</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Make sure you have valid passports and necessary visas.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600 font-bold">3</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-medium text-gray-900">Contact Support</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Need help? Our support team is available 24/7.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="mt-8 space-y-3">
                                        <button 
                                            onClick={handlePayment}
                                            disabled={loading || booking.payment_status === 'paid'}
                                            className={`w-full py-3 px-4 rounded-lg transition font-medium flex items-center justify-center ${
                                                booking.payment_status === 'paid'
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : loading
                                                    ? 'bg-green-500 text-white opacity-50 cursor-not-allowed'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : booking.payment_status === 'paid' ? (
                                                <>
                                                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                                                    Payment Completed
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCardIcon className="h-5 w-5 mr-2" />
                                                    Make Payment
                                                </>
                                            )}
                                        </button>

                                        {booking.payment_status === 'paid' && (
                                            <a
                                                href={route('invoice.booking', booking.id)}
                                                target="_blank"
                                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center"
                                            >
                                                Download Invoice
                                            </a>
                                        )}
                                        
                                        {/* <button 
                                            onClick={handleDownloadInvoice}
                                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center"
                                        >
                                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                                            Download Invoice
                                        </button> */}
                                        
                                        {/* <button 
                                            onClick={handleModifyBooking}
                                            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center"
                                        >
                                            <PencilIcon className="h-5 w-5 mr-2" />
                                            Modify Booking
                                        </button> */}
                                        
                                        {/* <button 
                                            onClick={handleCancelBooking}
                                            className="w-full border border-red-300 text-red-600 py-3 px-4 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center"
                                        >
                                            <XCircleIcon className="h-5 w-5 mr-2" />
                                            Cancel Booking
                                        </button> */}
                                    </div>
                                </div>
                                
                                {/* Help Card */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                        Need Help?
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Our travel experts are here to help you with any questions.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <PhoneIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                                            <span className="text-sm">017XXXXXXXX</span>
                                        </div>
                                        <div className="flex items-center">
                                            <EnvelopeIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                                            <span className="text-sm">support@travelagency.com</span>
                                        </div>
                                        {/* <div className="pt-3">
                                            <a 
                                                href="mailto:support@travelagency.com"
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Email Support →
                                            </a>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}