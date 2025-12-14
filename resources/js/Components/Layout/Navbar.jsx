import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Bars3Icon,
    XMarkIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

export default function Navbar({ auth, siteSettings }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: route('home') },
        { name: 'Packages', href: route('packages.index') },
        { name: 'About', href: route('about') },  
        { name: 'Contact Us', href: route('contact') }, 
    ];

    return (
        <nav className="bg-white shadow-lg relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex flex-shrink-0 items-center">
                            <Link href={route('home')} className="text-2xl font-bold text-indigo-600">
                                {siteSettings?.site_name || 'Travel Agency'}
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>    

                    {/* RIGHT SIDE */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">

                        {/* If Logged In */}
                        {auth.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                                >
                                    <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    <span>{auth.user.name}</span>
                                </button>

                                {/* User Dropdown */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg z-50 py-2">

                                        {/* Admin Panel (Only for admin) */}
                                        {auth.user.is_admin && (
                                            <Link
                                                href={route('admin.dashboard')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Admin Panel
                                            </Link>
                                        )}

                                        {/* Dashboard (Show only if NOT admin) */}
                                        {!auth.user.is_admin && (
                                            <Link
                                                href={route('dashboard')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Dashboard
                                            </Link>
                                        )}

                                        {/* Profile */}
                                        <Link
                                            href={route('profile.edit')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Edit Profile
                                        </Link>

                                        {/* Logout */}
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                )}

                            </div>
                        ) : (
                            /* Guest User */
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="block h-6 w-6" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="space-y-1 pb-3 pt-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile User Menu */}
                    <div className="border-t border-gray-200 pb-3 pt-4">
                        {auth.user ? (
                            <div className="space-y-3 px-4">
                                <div className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{auth.user.name}</div>
                                        <div className="text-sm font-medium text-gray-500">{auth.user.email}</div>
                                    </div>
                                </div>

                                {auth.user.is_admin && (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        Admin Panel
                                    </Link>
                                )}

                                <Link
                                    href={route('profile.edit')}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3 px-4">
                                <Link
                                    href={route('login')}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block rounded-md bg-indigo-600 px-3 py-2 text-base font-medium text-white hover:bg-indigo-700"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}