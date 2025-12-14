<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function download($id)
    {
        $booking = Booking::with('user', 'package')->findOrFail($id);

        // Security check
        if ($booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access');
        }

        if ($booking->payment_status !== 'paid') {
            return back()->with('error', 'Payment not completed');
        }

        $pdf = Pdf::loadView('invoices.booking', [
            'booking' => $booking
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('invoice-booking-'.$booking->id.'.pdf');
    }
}
