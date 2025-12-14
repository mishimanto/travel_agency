// resources/js/Pages/Stripe/Payment.jsx
import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { loadStripe } from "@stripe/stripe-js";
import {
    CardElement,
    Elements,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import AppLayout from "@/Layouts/AppLayout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

function CheckoutForm({ booking, amount, intentSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const { props } = usePage();
    const { auth } = props;
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [cardComplete, setCardComplete] = useState(false);
    const [name, setName] = useState(auth?.user?.name || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!stripe || !elements) {
            setError("Stripe is not loaded yet.");
            return;
        }

        if (!cardComplete) {
            setError("Please complete the card details.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const cardElement = elements.getElement(CardElement);
            
            // Confirm card setup
            const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(
                intentSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: name,
                            email: auth?.user?.email,
                        },
                    },
                }
            );

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            // Send payment method to server
            const response = await fetch(route('stripe.process'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    payment_method: setupIntent.payment_method,
                    booking_id: booking?.id,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.requires_action) {
                    // Handle 3D Secure
                    const { error: confirmError } = await stripe.confirmCardPayment(
                        result.payment_intent_client_secret
                    );
                    
                    if (confirmError) {
                        throw new Error(confirmError.message);
                    }
                    
                    // Retry payment after 3D Secure
                    await handleSubmit(e);
                    return;
                }
                throw new Error(result.message || 'Payment failed');
            }

            setSuccess('Payment successful! Redirecting...');
            
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = route('bookings.show', booking.id);
            }, 2000);

        } catch (err) {
            setError(err.message || "Payment failed");
            console.error('Payment error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h2>
                
                {booking && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">Booking Reference:</span>
                            <span className="font-semibold">#{booking.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                            <span className="text-xl font-bold text-green-600">${amount}</span>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                        {success}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name on Card
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter name as shown on card"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Details
                            </label>
                            <div className="p-3 border border-gray-300 rounded-md bg-white">
                                <CardElement 
                                    onChange={(e) => setCardComplete(e.complete)}
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#424770',
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading || !stripe || !cardComplete}
                            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : `Pay $${amount}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Payment({ booking, amount, stripeKey, intent }) {
    const { props } = usePage();
    const { auth } = props;
    
    return (
        <AppLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Payment</h2>}
        >
            <Head title="Complete Payment" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm 
                            booking={booking} 
                            amount={amount} 
                            intentSecret={intent}
                        />
                    </Elements>
                </div>
            </div>
        </AppLayout>
    );
}