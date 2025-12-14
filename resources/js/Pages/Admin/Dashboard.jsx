import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    ChartBarIcon,
    UserGroupIcon,
    TicketIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CalendarIcon,
    MapPinIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement, 
    ArcElement, 
    Title, 
    Tooltip, 
    Legend,
    RadialLinearScale,
    Filler
} from 'chart.js';
import { Line, Doughnut, Bar, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Filler,
    Title,
    Tooltip,
    Legend
);

export default function AdminDashboard({ 
    stats, 
    recentBookings, 
    topPackages,
    chartData 
}) {
    // Ensure stats have default values
    const safeStats = {
        totalBookings: stats?.totalBookings || 0,
        totalRevenue: stats?.totalRevenue || 0,
        activeUsers: stats?.activeUsers || 0,
        avgBookingValue: stats?.avgBookingValue || 0,
    };

    // Ensure arrays exist
    const safeRecentBookings = recentBookings || [];
    const safeTopPackages = topPackages || [];

    // Ensure chart data exists
    const safeChartData = chartData || {
        monthlyRevenue: { labels: [], data: [] },
        bookingStatus: {},
        topDestinations: [],
        monthlyBookings: { labels: [], data: [] },
        packagePerformance: []
    };

    // Calculate total booking status counts
    const totalBookingStatus = {
        pending: safeChartData.bookingStatus?.pending || 0,
        confirmed: safeChartData.bookingStatus?.confirmed || 0,
        completed: safeChartData.bookingStatus?.completed || 0,
        cancelled: safeChartData.bookingStatus?.cancelled || 0,
    };

    const totalBookingsCount = Object.values(totalBookingStatus).reduce((a, b) => a + b, 0);

    const statCards = [
        {
            name: 'Total Bookings',
            value: safeStats.totalBookings,
            change: '+12%',
            changeType: 'increase',
            icon: TicketIcon,
            color: 'bg-blue-500',
            description: 'Total bookings received'
        },
        {
            name: 'Total Revenue',
            value: `$${parseFloat(safeStats.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: '+8.2%',
            changeType: 'increase',
            icon: CurrencyDollarIcon,
            color: 'bg-green-500',
            description: 'Total revenue generated'
        },
        {
            name: 'Active Users',
            value: safeStats.activeUsers,
            change: '+3.2%',
            changeType: 'increase',
            icon: UserGroupIcon,
            color: 'bg-purple-500',
            description: 'Registered customers'
        },
        {
            name: 'Avg. Booking Value',
            value: `$${parseFloat(safeStats.avgBookingValue).toFixed(2)}`,
            change: '-2.1%',
            changeType: 'decrease',
            icon: ChartBarIcon,
            color: 'bg-yellow-500',
            description: 'Average booking amount'
        },
    ];

    // 1. Monthly Revenue Chart Data (Line Chart)
    const monthlyRevenueChartData = {
        labels: safeChartData.monthlyRevenue?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue ($)',
                data: safeChartData.monthlyRevenue?.data || [0, 0, 0, 0, 0, 0],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const monthlyRevenueOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Monthly Revenue Trend',
                font: {
                    size: 14,
                    weight: '600'
                },
                padding: {
                    bottom: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Revenue: $${context.raw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    };

    // 2. Booking Status Chart Data (Doughnut Chart)
    const bookingStatusChartData = {
        labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        datasets: [
            {
                label: 'Bookings',
                data: [
                    totalBookingStatus.pending,
                    totalBookingStatus.confirmed,
                    totalBookingStatus.completed,
                    totalBookingStatus.cancelled
                ],
                backgroundColor: [
                    'rgba(250, 204, 21, 0.8)',   // Yellow for pending
                    'rgba(34, 197, 94, 0.8)',    // Green for confirmed
                    'rgba(59, 130, 246, 0.8)',   // Blue for completed
                    'rgba(239, 68, 68, 0.8)',    // Red for cancelled
                ],
                borderColor: [
                    'rgb(250, 204, 21)',
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2,
                hoverOffset: 15
            },
        ],
    };

    const bookingStatusOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 11
                    }
                }
            },
            title: {
                display: true,
                text: 'Booking Status Distribution',
                font: {
                    size: 14,
                    weight: '600'
                },
                padding: {
                    bottom: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const percentage = totalBookingsCount > 0 
                            ? ((context.raw / totalBookingsCount) * 100).toFixed(1)
                            : '0.0';
                        return `${context.label}: ${context.raw} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '65%',
    };

    // 3. Top Destinations Chart Data (Bar Chart)
    const topDestinationsChartData = {
        labels: safeChartData.topDestinations?.map(d => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name) 
                || ['Bali', 'Kyoto', 'Paris', 'New York', 'Sydney'],
        datasets: [
            {
                label: 'Bookings',
                data: safeChartData.topDestinations?.map(d => d.bookings) || [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(14, 165, 233, 0.8)',
                    'rgba(20, 184, 166, 0.8)',
                ],
                borderColor: [
                    'rgb(139, 92, 246)',
                    'rgb(236, 72, 153)',
                    'rgb(245, 158, 11)',
                    'rgb(14, 165, 233)',
                    'rgb(20, 184, 166)',
                ],
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const topDestinationsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Top Destinations',
                font: {
                    size: 14,
                    weight: '600'
                },
                padding: {
                    bottom: 20
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    stepSize: 1,
                    precision: 0
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    // 4. Monthly Bookings Chart Data (Line Chart)
    const monthlyBookingsChartData = {
        labels: safeChartData.monthlyBookings?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Bookings',
                data: safeChartData.monthlyBookings?.data || [0, 0, 0, 0, 0, 0],
                borderColor: 'rgb(236, 72, 153)',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(236, 72, 153)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    const monthlyBookingsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Monthly Bookings Trend',
                font: {
                    size: 14,
                    weight: '600'
                },
                padding: {
                    bottom: 20
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    stepSize: 1,
                    precision: 0
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    };

    // Calculate booking status percentages
    const getStatusPercentage = (status) => {
        if (totalBookingsCount === 0) return 0;
        return ((totalBookingStatus[status] / totalBookingsCount) * 100).toFixed(1);
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Stats Cards */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat) => (
                            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                        <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts Section - Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Monthly Revenue Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="h-80">
                            <Line 
                                data={monthlyRevenueChartData} 
                                options={monthlyRevenueOptions} 
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Total (6 months): </span>
                                <span className="font-bold text-gray-900">
                                    ${safeChartData.monthlyRevenue?.data?.reduce((a, b) => a + b, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                <span className="text-gray-600">Revenue Trend</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Status Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="h-80">
                            <Doughnut 
                                data={bookingStatusChartData} 
                                options={bookingStatusOptions} 
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {['pending', 'confirmed', 'completed', 'cancelled'].map((status, index) => {
                                const StatusIcon = 
                                    status === 'pending' ? ClockIcon :
                                    status === 'confirmed' ? CheckCircleIcon :
                                    status === 'completed' ? CalendarIcon :
                                    XCircleIcon;
                                
                                const statusColor = 
                                    status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                                    status === 'confirmed' ? 'text-green-600 bg-green-100' :
                                    status === 'completed' ? 'text-blue-600 bg-blue-100' :
                                    'text-red-600 bg-red-100';
                                
                                return (
                                    <div key={status} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <StatusIcon className={`h-4 w-4 mr-2 ${statusColor.split(' ')[0]}`} />
                                            <span className="text-sm font-medium capitalize">{status}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold">
                                                {totalBookingStatus[status] || 0}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-1">
                                                ({getStatusPercentage(status)}%)
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Charts Section - Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Destinations Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="h-80">
                            <Bar 
                                data={topDestinationsChartData} 
                                options={topDestinationsOptions} 
                            />
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-gray-600">
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    <span>Most Popular Destinations</span>
                                </div>
                                <span className="font-medium">
                                    Total Bookings: {safeChartData.topDestinations?.reduce((sum, d) => sum + d.bookings, 0) || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Bookings Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="h-80">
                            <Line 
                                data={monthlyBookingsChartData} 
                                options={monthlyBookingsOptions} 
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Total Bookings (6 months): </span>
                                <span className="font-bold text-gray-900">
                                    {safeChartData.monthlyBookings?.data?.reduce((a, b) => a + b, 0) || 0}
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                                <span className="text-gray-600">Booking Trend</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Package Performance Summary */}
                {safeChartData.packagePerformance && safeChartData.packagePerformance.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Packages</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {safeChartData.packagePerformance.map((pkg, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {pkg.title}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-900">
                                                    ${parseFloat(pkg.price).toFixed(2)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {pkg.bookings} bookings
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-semibold text-green-600">
                                                    ${parseFloat(pkg.revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-green-500 h-2 rounded-full" 
                                                            style={{ 
                                                                width: `${Math.min((pkg.bookings / Math.max(...safeChartData.packagePerformance.map(p => p.bookings))) * 100, 100)}%` 
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        {Math.round((pkg.bookings / Math.max(...safeChartData.packagePerformance.map(p => p.bookings))) * 100)}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Recent Bookings & Top Packages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Bookings */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                            <a href={route('admin.bookings.index')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                View all →
                            </a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {safeRecentBookings.length > 0 ? (
                                        safeRecentBookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-indigo-800">
                                                                {booking.user?.name?.charAt(0) || 'U'}
                                                            </span>
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {booking.user?.name || 'Unknown User'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {booking.user?.email || 'No email'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {booking.package?.title || 'Package not found'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                    {booking.booking_date
                                                        ? new Date(booking.booking_date).toLocaleString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })
                                                        : 'No date'}
                                                    </p>

                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        ${parseFloat(booking.total_price || 0).toFixed(2)}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {booking.status || 'unknown'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                                No recent bookings found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Packages */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Top Packages</h3>
                            <a href={route('admin.packages.index')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                View all →
                            </a>
                        </div>
                        <div className="space-y-4">
                            {safeTopPackages.length > 0 ? (
                                safeTopPackages.map((pkg, index) => (
                                    <div key={pkg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <div className="flex items-center">
                                            <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${
                                                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                                index === 2 ? 'bg-orange-100 text-orange-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                <span className="font-bold">#{index + 1}</span>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {pkg.title || 'Untitled Package'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {pkg.destination?.name || 'No destination'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">
                                                ${pkg.price ? parseFloat(pkg.price).toFixed(2) : '0.00'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                <span className="font-semibold">{pkg.bookings_count || 0}</span> bookings
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No top packages found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}