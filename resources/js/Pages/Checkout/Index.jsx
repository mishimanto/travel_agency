import { useState } from 'react';
import axios from 'axios';

export default function Checkout() {

    const handlePay = async () => {
        const res = await axios.post('/create-stripe-session');

        const stripe = Stripe(import.meta.env.VITE_STRIPE_KEY);

        await stripe.redirectToCheckout({
            sessionId: res.data.id
        });
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Stripe Test Payment</h1>

            <button
                onClick={handlePay}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
                Pay $20
            </button>
        </div>
    );
}
