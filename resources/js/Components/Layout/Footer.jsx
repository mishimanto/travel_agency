import React from 'react';
import { Link } from '@inertiajs/react';

// Make sure this is a default export
export default function Footer({ siteSettings }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href={route('home')} className="text-2xl font-bold">
                            {siteSettings?.site_name || 'Travel Agency'}
                        </Link>
                        <p className="mt-4 text-gray-300 max-w-md">
                            {siteSettings?.about_us || 'Your trusted partner for unforgettable travel experiences.'}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href={route('home')} className="text-gray-300 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href={route('packages.index')} className="text-gray-300 hover:text-white">
                                    Packages
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li>
                                <span>{siteSettings?.contact_email || 'contact@travel.com'}</span>
                            </li>
                            <li>
                                <span>{siteSettings?.contact_phone || '+1 (555) 123-4567'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400">
                            © {currentYear} {siteSettings?.site_name || 'Travel Agency'}. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}