<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactMessage;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::latest()->paginate(10); 
        
        return Inertia::render('Admin/ContactMessages/Index', [
            'messages' => $messages, 
        ]);
    }


    public function show(contactMessage $contactMessage)
    {
        return Inertia::render('Admin/ContactMessages/Show', [
            'message' => $contactMessage,
        ]);
    }
}
