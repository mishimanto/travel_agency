import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function About({ auth, settings, title }) {
    return (
        <>
            <AppLayout title="About Us">
                <Head title="About Us" />
            
                <div className="bg-white">
                    <div className="mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                About Us
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
                                Welcome to <span className='text-gray-900'>{settings?.site_name || 'Travel Agency'}</span>, your trusted partner for unforgettable travel experiences.
                            </p>
                        </div>

                        <div className="mt-20">
                            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                                    <p className="mt-4 text-lg text-gray-600">
                                        Founded in 2010, we've been helping travelers discover the world's most amazing destinations.
                                        Our mission is to make travel accessible, enjoyable, and memorable for everyone.
                                    </p>
                                    <p className="mt-4 text-lg text-gray-600">
                                        With over 10,000 satisfied customers and partnerships with the best hotels and airlines,
                                        we ensure every journey is seamless and extraordinary.
                                    </p>
                                </div>
                                
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
                                    <ul className="mt-4 space-y-4">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <span className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600">✓</span>
                                                </span>
                                            </div>
                                            <p className="ml-3 text-lg text-gray-600">
                                                <strong>Customer First:</strong> Your satisfaction is our top priority
                                            </p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <span className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600">✓</span>
                                                </span>
                                            </div>
                                            <p className="ml-3 text-lg text-gray-600">
                                                <strong>Authentic Experiences:</strong> We curate genuine local experiences
                                            </p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <span className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600">✓</span>
                                                </span>
                                            </div>
                                            <p className="ml-3 text-lg text-gray-600">
                                                <strong>Best Value:</strong> Quality services at competitive prices
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Team Section */}
                            {/* <div className="mt-24">
                                <h2 className="text-3xl font-bold text-center text-gray-900">Meet Our Team</h2>
                                <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                                    {[
                                        { name: 'John Doe', role: 'Founder & CEO', bio: '20+ years in travel industry' },
                                        { name: 'Jane Smith', role: 'Travel Specialist', bio: 'Expert in Asian destinations' },
                                        { name: 'Mike Johnson', role: 'Customer Support', bio: 'Available 24/7 for assistance' },
                                        { name: 'Sarah Williams', role: 'Tour Guide', bio: 'Multilingual guide with 15 years experience' },
                                    ].map((member, index) => (
                                        <div key={index} className="text-center">
                                            <div className="h-32 w-32 rounded-full bg-gray-300 mx-auto mb-4"></div>
                                            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                            <p className="text-indigo-600">{member.role}</p>
                                            <p className="mt-2 text-gray-600">{member.bio}</p>
                                        </div>
                                    ))}
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

            </AppLayout>
        </>
    );
}