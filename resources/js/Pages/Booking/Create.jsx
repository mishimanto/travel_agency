import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    CreditCardIcon,
    LockClosedIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';

export default function BookingCreate({ package: pkg }) {
    const { data, setData, post, processing, errors } = useForm({
        package_id: pkg.id,
        booking_date: pkg.available_dates?.[0] || '',
        number_of_people: 1,
        special_requests: '',
        payment_method: 'card',
        card_number: '',
        card_expiry: '',
        card_cvc: '',
        card_name: '',
        total_price: pkg.price * 1,
    });

    const [step, setStep] = useState(1);
    const [paymentComplete, setPaymentComplete] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('bookings.store'), {
            onSuccess: () => {
                setPaymentComplete(true);
                setStep(3);
            },
        });
    };

    const totalPrice = pkg.price * data.number_of_people;
    const serviceFee = 49.99;
    const grandTotal = totalPrice + serviceFee;

    return (
        <AppLayout title="Complete Booking">
            <Head title="Complete Booking" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        {[1, 2, 3].map((stepNumber) => (
                            <React.Fragment key={stepNumber}>
                                <div className={`flex items-center ${stepNumber <= step ? 'text-indigo-600' : 'text-gray-400'}`}>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                        stepNumber < step ? 'bg-indigo-600 text-white' :
                                        stepNumber === step ? 'border-2 border-indigo-600 text-indigo-600' :
                                        'border-2 border-gray-300 text-gray-300'
                                    }`}>
                                        {stepNumber < step ? (
                                            <CheckCircleIcon className="h-5 w-5" />
                                        ) : (
                                            stepNumber
                                        )}
                                    </div>
                                    <span className="ml-2 text-sm font-medium">
                                        {stepNumber === 1 ? 'Details' : stepNumber === 2 ? 'Payment' : 'Confirmation'}
                                    </span>
                                </div>
                                {stepNumber < 3 && (
                                    <div className={`h-0.5 w-16 mx-4 ${stepNumber < step ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {paymentComplete ? (
                    /* Confirmation Step */
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Thank you for your booking. Your trip to {pkg.destination.name} is now confirmed.
                            </p>
                            
                            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                                <div className="space-y-3 text-left">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Package:</span>
                                        <span className="font-medium">{pkg.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Travelers:</span>
                                        <span className="font-medium">{data.number_of_people} people</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Travel Date:</span>
                                        <span className="font-medium">{data.booking_date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Amount:</span>
                                        <span className="font-bold text-indigo-600">${grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">
                                    A confirmation email has been sent to your email address with all the details.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route('user.bookings')}
                                        className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
                                    >
                                        View My Bookings
                                    </Link>
                                    <Link
                                        href={route('packages.index')}
                                        className="inline-flex items-center justify-center bg-white text-gray-700 px-6 py-3 rounded-md border border-gray-300 font-medium hover:bg-gray-50"
                                    >
                                        Browse More Packages
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Booking Form */
                    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Booking Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {step === 1 ? (
                                    /* Step 1: Traveler Details */
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Traveler Information</h3>
                                        
                                        <div className="space-y-6">
                                            {/* Booking Date */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                                    Travel Date *
                                                </label>
                                                <select
                                                    value={data.booking_date}
                                                    onChange={(e) => setData('booking_date', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                >
                                                    <option value="">Select a date</option>
                                                    {pkg.available_dates?.map((date) => (
                                                        <option key={date} value={date}>
                                                            {new Date(date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.booking_date && (
                                                    <p className="mt-2 text-sm text-red-600">{errors.booking_date}</p>
                                                )}
                                            </div>

                                            {/* Number of Travelers */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                                    Number of Travelers *
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('number_of_people', Math.max(1, data.number_of_people - 1))}
                                                        className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                    >
                                                        <span className="text-lg">-</span>
                                                    </button>
                                                    <span className="text-xl font-semibold">
                                                        {data.number_of_people} {data.number_of_people === 1 ? 'Person' : 'People'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('number_of_people', data.number_of_people + 1)}
                                                        className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                    >
                                                        <span className="text-lg">+</span>
                                                    </button>
                                                </div>
                                                {errors.number_of_people && (
                                                    <p className="mt-2 text-sm text-red-600">{errors.number_of_people}</p>
                                                )}
                                            </div>

                                            {/* Special Requests */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                                    Special Requests
                                                </label>
                                                <textarea
                                                    value={data.special_requests}
                                                    onChange={(e) => setData('special_requests', e.target.value)}
                                                    rows={4}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    placeholder="Any dietary requirements, accessibility needs, or other special requests..."
                                                />
                                                {errors.special_requests && (
                                                    <p className="mt-2 text-sm text-red-600">{errors.special_requests}</p>
                                                )}
                                            </div>

                                            {/* Next Step Button */}
                                            <div className="pt-6 border-t">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(2)}
                                                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 font-medium"
                                                >
                                                    Continue to Payment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Step 2: Payment Details */
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>
                                        
                                        <div className="space-y-6">
                                            {/* Payment Method */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-4">
                                                    Select Payment Method
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('payment_method', 'card')}
                                                        className={`p-4 rounded-lg border-2 ${
                                                            data.payment_method === 'card'
                                                                ? 'border-indigo-500 bg-indigo-50'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <CreditCardIcon className="h-6 w-6 mr-3" />
                                                            <span className="font-medium">Credit/Debit Card</span>
                                                        </div>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('payment_method', 'paypal')}
                                                        className={`p-4 rounded-lg border-2 ${
                                                            data.payment_method === 'paypal'
                                                                ? 'border-indigo-500 bg-indigo-50'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <svg className="h-6 w-6 mr-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.972.382-1.052.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-1.646-1.198-4.244-1.03-6.734-.992l-.472.02c-.525.025-.978.375-1.052.9l-1.187 7.527c-.074.524.276.97.703 1.057h3.147c4.186 0 7.213-1.633 8.18-6.311.014-.073.028-.146.04-.22.43-2.247.17-3.951-.938-5.44z" />
                                                            </svg>
                                                            <span className="font-medium">PayPal</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Card Details */}
                                            {data.payment_method === 'card' && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                                            Cardholder Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={data.card_name}
                                                            onChange={(e) => setData('card_name', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            placeholder="John Doe"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                                            Card Number *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={data.card_number}
                                                            onChange={(e) => setData('card_number', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            placeholder="1234 5678 9012 3456"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                                Expiry Date *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={data.card_expiry}
                                                                onChange={(e) => setData('card_expiry', e.target.value)}
                                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                placeholder="MM/YY"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                                CVC *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={data.card_cvc}
                                                                onChange={(e) => setData('card_cvc', e.target.value)}
                                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                placeholder="123"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Security Info */}
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="flex items-start">
                                                    <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                                                        <p className="text-sm text-blue-700 mt-1">
                                                            Your payment information is encrypted and secure. We never store your card details.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-between pt-6 border-t">
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="px-6 py-3 text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                                                >
                                                    ← Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50"
                                                >
                                                    {processing ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Order Summary */}
                            <div className="space-y-6">
                                {/* Package Summary */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Package</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0"></div>
                                            <div className="ml-4">
                                                <h4 className="font-medium text-gray-900">{pkg.title}</h4>
                                                <p className="text-sm text-gray-500">{pkg.destination.name}</p>
                                                <p className="text-sm text-gray-500">{pkg.duration_days} days</p>
                                            </div>
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3 pt-4 border-t">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Package Price</span>
                                                <span className="font-medium">${pkg.price} × {data.number_of_people}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Service Fee</span>
                                                <span className="font-medium">${serviceFee}</span>
                                            </div>
                                            <div className="flex justify-between pt-3 border-t">
                                                <span className="text-lg font-bold text-gray-900">Total</span>
                                                <span className="text-2xl font-bold text-indigo-600">${grandTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Important Information */}
                                <div className="bg-yellow-50 rounded-xl p-6">
                                    <div className="flex items-start">
                                        <InformationCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                                        <div>
                                            <h4 className="font-medium text-yellow-900">Important Information</h4>
                                            <ul className="mt-2 space-y-2 text-sm text-yellow-700">
                                                <li>• Free cancellation up to 30 days before travel</li>
                                                <li>• 24/7 customer support included</li>
                                                <li>• Travel insurance recommended</li>
                                                <li>• Visa requirements may apply</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Secure Payment */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-500">Secure SSL Encryption</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png" 
                                             alt="MasterCard" className="h-8" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                                             alt="Visa" className="h-8" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" 
                                             alt="PayPal" className="h-8" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}