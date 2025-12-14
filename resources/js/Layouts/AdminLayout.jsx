import React, { useState, Fragment } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Bars3Icon, 
    XMarkIcon,
    HomeIcon,
    Squares2X2Icon,
    GlobeAltIcon,
    TicketIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    UserGroupIcon,
    ChevronDownIcon,
    UserIcon,
    ChatBubbleLeftEllipsisIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

export default function AdminLayout({ title, children }) {
    const { props } = usePage();
    const { auth } = props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentRoute = route().current();

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: Squares2X2Icon, routeName: 'admin.dashboard' },
        { name: 'Packages', href: route('admin.packages.index'), icon: TicketIcon, routeName: 'admin.packages.*' },
        { name: 'Destinations', href: route('admin.destinations.index'), icon: GlobeAltIcon, routeName: 'admin.destinations.*' },
        { name: 'Bookings', href: route('admin.bookings.index'), icon: UserGroupIcon, routeName: 'admin.bookings.*' },
        { name: 'Reports', href: route('admin.reports.index'), icon: ChartBarIcon, routeName: 'admin.reports' },
        { name: 'Messages', href: route('admin.contact-messages.index'), icon: ChatBubbleLeftEllipsisIcon, routeName: 'admin.contact-messages.*' },
        { name: 'Settings', href: route('admin.settings'), icon: Cog6ToothIcon, routeName: 'admin.settings' },
    ];

    const userNavigation = [
        { name: 'Your Profile', href: route('profile.edit') },
        { name: 'Settings', href: '#' },
        { name: 'Sign out', href: route('logout'), method: 'post' },
    ];

    // Function to check if a navigation item is active
    const isActive = (routePattern) => {
        if (routePattern.includes('*')) {
            const pattern = routePattern.replace('.*', '');
            return currentRoute?.startsWith(pattern);
        }
        return currentRoute === routePattern;
    };

    return (
        <>
            <Head title={`${title} - Admin Panel`} />
            
            <div className="min-h-screen bg-gray-100">
                {/* Mobile sidebar */}
                <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                    <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed inset-y-0 left-0 flex w-72">
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                            <div className="flex h-16 shrink-0 items-center">
                                <Link href={route('admin.dashboard')} className="text-xl font-bold text-gray-900">
                                    Admin Panel
                                </Link>
                                <button
                                    type="button"
                                    className="ml-auto rounded-md p-2 text-gray-700"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <nav className="flex flex-1 flex-col">
                                <ul className="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <ul className="-mx-2 space-y-1">
                                            {navigation.map((item) => {
                                                const active = isActive(item.routeName);
                                                return (
                                                    <li key={item.name}>
                                                        <Link
                                                            href={item.href}
                                                            className={`
                                                                group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                                                                transition-all duration-200 ease-in-out
                                                                ${active 
                                                                    ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 pl-3 ml-[-0.5rem]' 
                                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-400 hover:pl-3 hover:ml-[-0.5rem]'
                                                                }
                                                            `}
                                                        >
                                                            <item.icon className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                                                                active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                                                            }`} />
                                                            {item.name}
                                                            {active && (
                                                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center text-center">
                            <Link href={route('admin.dashboard')} className="text-xl font-bold text-gray-900 mx-auto">
                                Admin Panel
                            </Link>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul className="mx-2 space-y-1">
                                        {navigation.map((item) => {
                                            const active = isActive(item.routeName);
                                            return (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        className={`
                                                            group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                                                            transition-all duration-200 ease-in-out
                                                            relative
                                                            ${active 
                                                                ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-600 shadow-sm' 
                                                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:text-indigo-600 hover:shadow-sm'
                                                            }
                                                        `}
                                                    >
                                                        {/* Active indicator bar */}
                                                        {active && (
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-600 rounded-r-full"></div>
                                                        )}
                                                        
                                                        {/* Icon with transition */}
                                                        <div className={`p-1.5 rounded-md transition-all duration-200 ${
                                                            active 
                                                                ? 'bg-indigo-100 text-indigo-600' 
                                                                : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                                        }`}>
                                                            <item.icon className="h-4 w-4" />
                                                        </div>
                                                        
                                                        {/* Menu text */}
                                                        <span className="flex-1">{item.name}</span>
                                                        
                                                        {/* Active dot indicator */}
                                                        {active && (
                                                            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></div>
                                                        )}
                                                        
                                                        {/* Hover arrow effect */}
                                                        <span className={`opacity-0 transform -translate-x-1 transition-all duration-200 ${
                                                            active 
                                                                ? 'opacity-100 translate-x-0 text-indigo-600' 
                                                                : 'group-hover:opacity-100 group-hover:translate-x-0 text-gray-400'
                                                        }`}>
                                                        </span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main content */}
                <div className="lg:pl-72">
                    {/* Navbar */}
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-100 rounded-md transition-colors duration-150"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>

                        {/* Page title */}
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                        </div>

                        <div className="flex items-center justify-end gap-x-4">
                            {/* Back to Site */}
                            <Link
                                href={route('home')}
                                className="hidden sm:flex items-center gap-x-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-150 px-3 py-1.5 rounded-md hover:bg-gray-50"
                            >
                                <HomeIcon className="h-5 w-5" />
                                Back to Site
                            </Link>

                            {/* User dropdown */}
                            <Menu as="div" className="relative">
                                <Menu.Button className="flex items-center gap-x-2 text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-150">
                                    <div className="flex items-center gap-x-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-sm font-medium">{auth.user.name}</p>
                                        </div>
                                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                </Menu.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                                            <p className="text-sm font-medium">{auth.user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
                                        </div>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('profile.edit')}
                                                    className={`${
                                                        active ? 'bg-gray-50' : ''
                                                    } flex items-center gap-x-2 px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150`}
                                                >
                                                    <UserIcon className="h-4 w-4" />
                                                    Your Profile
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    method="post"
                                                    href={route('logout')}
                                                    as="button"
                                                    className={`${
                                                        active ? 'bg-gray-50' : ''
                                                    } flex w-full items-center gap-x-2 px-4 py-2.5 text-sm text-red-700 transition-colors duration-150`}
                                                >
                                                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                                    Sign out
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>

                    <main className="py-10">
                        <div className="px-4 sm:px-6 lg:px-8">
                            {/* Breadcrumb or page header can be added here */}
                            <div className="mb-6">
                                <nav className="flex" aria-label="Breadcrumb">
                                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                        <li className="inline-flex items-center">
                                            <Link href={route('admin.dashboard')} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
                                                <Squares2X2Icon className="w-4 h-4 mr-2" />
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <div className="flex items-center">
                                                <span className="text-gray-400 mx-2">/</span>
                                                <span className="ml-1 text-sm font-medium text-gray-900 md:ml-2">{title}</span>
                                            </div>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                            
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}