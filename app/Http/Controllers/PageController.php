<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use Inertia\Inertia;
use App\Models\Setting;
use App\Models\ContactMessage;


class PageController extends Controller
{
    // About Page
    public function about()
    {
        $settings = Setting::pluck('value', 'key'); 

        return Inertia::render('Pages/About', [
            'title' => 'About Us',
            'metaDescription' => 'Learn more about our travel agency and our mission.',
            'settings' => $settings,
        ]);
    }

    // Contact Page
    public function contact()
    {
        $settings = Setting::pluck('value', 'key');

        return Inertia::render('Pages/Contact', [
            'title' => 'Contact Us',
            'metaDescription' => 'Get in touch with our team for any inquiries.',
            'settings' => $settings,
        ]);
    }

    public function contactSubmit(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        // Save to database
        ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
        ]);

        return back()->with('success', 'Message sent successfully!');
    }
}