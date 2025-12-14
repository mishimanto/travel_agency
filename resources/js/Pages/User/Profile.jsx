import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import {
    UserCircleIcon,
    CameraIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Profile({ user }) {
    const [imagePreview, setImagePreview] = useState(user.avatar_url || null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: null,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // FormData ব্যবহার করুন কারণ file upload করবেন
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone || '');
        formData.append('address', data.address || '');
        
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }
        
        if (data.current_password) {
            formData.append('current_password', data.current_password);
        }
        
        if (data.password) {
            formData.append('password', data.password);
            formData.append('password_confirmation', data.password_confirmation);
        }
        
        // Laravel এর জন্য CSRF token যোগ করুন
        formData.append('_method', 'PATCH');
        
        router.post(route('profile.update'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                // Reset form after successful update
                setData({
                    ...data,
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            },
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // File validation
            if (file.size > 2 * 1024 * 1024) { // 2MB
                alert('File size should be less than 2MB');
                return;
            }
            
            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }
            
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        if (confirm('Are you sure you want to remove your profile picture?')) {
            router.delete(route('profile.avatar.remove'), {
                preserveScroll: true,
                onSuccess: () => {
                    setImagePreview(null);
                    setData('avatar', null);
                },
            });
        }
    };

    const handleDeleteAccount = () => {
        if (!user.is_admin) {
            setShowDeleteConfirm(true);
        }
    };

    const confirmDeleteAccount = () => {
        setDeleteError('');
        
        if (!deletePassword) {
            setDeleteError('Please enter your password to confirm deletion.');
            return;
        }

        router.delete(route('profile.destroy'), {
            data: { password: deletePassword },
            preserveScroll: false,
            onError: (errors) => {
                if (errors.password) {
                    setDeleteError(errors.password);
                } else {
                    setDeleteError('An error occurred while deleting your account.');
                }
            },
            onSuccess: () => {
                // Redirect to home page after successful deletion
                window.location.href = '/';
            },
        });
    };

    return (
        <AppLayout title="Profile">
            <Head title="Profile" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Information Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
                                
                                <div className="space-y-6">
                                    {/* Avatar Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Profile Picture
                                        </label>
                                        <div className="flex items-center space-x-6">
                                            <div className="relative">
                                                {imagePreview ? (
                                                    <div className="relative">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Profile"
                                                            className="h-24 w-24 rounded-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveAvatar}
                                                            className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                                                        >
                                                            <XMarkIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <UserCircleIcon className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                )}
                                                <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                                                    <CameraIcon className="h-4 w-4" />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                        id="avatar-upload"
                                                    />
                                                </label>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Upload a new profile picture. JPG, PNG or GIF, max 2MB.
                                                </p>
                                                {data.avatar && (
                                                    <p className="text-sm text-green-600 mt-1">
                                                        New image selected: {data.avatar.name}
                                                    </p>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('avatar-upload').click()}
                                                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Choose a different photo
                                                </button>
                                            </div>
                                        </div>
                                        {errors.avatar && (
                                            <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                        {errors.phone && (
                                            <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="123 Main St, City, State, ZIP"
                                        />
                                        {errors.address && (
                                            <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Password Update Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Update Password</h2>
                                
                                <div className="space-y-6">
                                    <p className="text-sm text-gray-600">
                                        Ensure your account is using a long, random password to stay secure.
                                    </p>

                                    {/* Current Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Leave blank to keep current password"
                                        />
                                        {errors.current_password && (
                                            <p className="mt-2 text-sm text-red-600">{errors.current_password}</p>
                                        )}
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Leave blank to keep current password"
                                        />
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Leave blank to keep current password"
                                        />
                                        {errors.password_confirmation && (
                                            <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Account Summary */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Member Since</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Account Type</p>
                                    <p className="font-medium text-gray-900">
                                        {user.is_admin ? (
                                            <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                                                Administrator
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                Standard User
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email Verified</p>
                                    <p className="font-medium text-gray-900">
                                        {user.email_verified_at ? (
                                            <span className="text-green-600">Verified</span>
                                        ) : (
                                            <span className="text-yellow-600">Not Verified</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                <Link
                                    href={route('user.bookings')}
                                    className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-900">My Bookings</span>
                                    <p className="text-sm text-gray-500 mt-1">View and manage your travel bookings</p>
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-900">Dashboard</span>
                                    <p className="text-sm text-gray-500 mt-1">Back to your dashboard</p>
                                </Link>
                            </div>
                        </div>

                        {/* Delete Account Section - শুধুমাত্র non-admin users এর জন্য */}
                        {!user.is_admin && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                                <div className="flex items-start">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-900">Delete Account</h3>
                                        <p className="text-sm text-red-700 mt-1">
                                            Once you delete your account, all of your data will be permanently removed.
                                            This action cannot be undone.
                                        </p>
                                        
                                        {!showDeleteConfirm ? (
                                            <button
                                                type="button"
                                                onClick={handleDeleteAccount}
                                                className="mt-4 bg-white text-red-600 border border-red-300 py-2 px-4 rounded-md hover:bg-red-50 font-medium transition-colors"
                                            >
                                                Delete My Account
                                            </button>
                                        ) : (
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-red-900 mb-1">
                                                        Enter your password to confirm deletion
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={deletePassword}
                                                        onChange={(e) => setDeletePassword(e.target.value)}
                                                        className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                                        placeholder="Your current password"
                                                    />
                                                    {deleteError && (
                                                        <p className="mt-1 text-sm text-red-600">{deleteError}</p>
                                                    )}
                                                </div>
                                                <div className="flex space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={confirmDeleteAccount}
                                                        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 font-medium transition-colors"
                                                    >
                                                        Confirm Delete
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowDeleteConfirm(false);
                                                            setDeletePassword('');
                                                            setDeleteError('');
                                                        }}
                                                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 font-medium transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Admin Notice যদি admin হয় */}
                {user.is_admin && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-xl p-6">
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3" />
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-900">Administrator Account</h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    As an administrator, you cannot delete your account through this interface.
                                    Please contact the system administrator for account management.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Delete Account Confirmation</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete your account? This action will:
                        </p>
                        <ul className="text-sm text-gray-600 mb-6 space-y-2">
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Permanently delete all your personal data
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Cancel all your active bookings
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Remove your access to the system
                            </li>
                        </ul>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">
                                    Enter your password to confirm
                                </label>
                                <input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    placeholder="Your current password"
                                />
                                {deleteError && (
                                    <p className="mt-1 text-sm text-red-600">{deleteError}</p>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={confirmDeleteAccount}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 font-medium"
                                >
                                    Yes, Delete My Account
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeletePassword('');
                                        setDeleteError('');
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}