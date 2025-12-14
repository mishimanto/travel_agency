import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Layout/Navbar';
import Footer from '@/Components/Layout/Footer';
import { Toaster } from 'react-hot-toast';

export default function AppLayout({ title, children }) {
    const { props } = usePage();
    const { auth, siteSettings } = props;

    return (
        <>
            <Head title={title ? `${title}` : siteSettings?.site_name} />
            <Toaster position="top-right" />
            
            <div className="min-h-screen bg-gray-50">
                <Navbar auth={auth} siteSettings={siteSettings} />
                
                <main>
                    {children}
                </main>
                
                <Footer siteSettings={siteSettings} />
            </div>
        </>
    );
}