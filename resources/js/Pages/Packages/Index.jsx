import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    FunnelIcon, 
    Squares2X2Icon, 
    ListBulletIcon,
    ChevronDownIcon,
    XMarkIcon,
    MapPinIcon,
    ClockIcon,
    StarIcon,
    CurrencyDollarIcon,
    PhotoIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    XCircleIcon,
    TagIcon
} from '@heroicons/react/24/outline';

export default function PackagesIndex({ packages, filters = {}, search: initialSearch = '' }) {
    const { url } = usePage();

    const safePackages = packages || {};
    const safeData = safePackages.data || [];
    const safeLinks = safePackages.links || [];
    const safeDestinations = filters.destinations || [];

    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    const [search, setSearch] = useState(initialSearch);
    const [selectedDestinations, setSelectedDestinations] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [durationFilter, setDurationFilter] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [showSpecialOffersOnly, setShowSpecialOffersOnly] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);

        if (query.get('destinations')) {
            try {
                setSelectedDestinations(JSON.parse(query.get('destinations')));
            } catch {}
        }

        if (query.get('min_price')) setPriceRange([parseInt(query.get('min_price')), priceRange[1]]);
        if (query.get('max_price')) setPriceRange([priceRange[0], parseInt(query.get('max_price'))]);
        if (query.get('duration')) setDurationFilter(query.get('duration'));
        if (query.get('sort_by')) setSortBy(query.get('sort_by'));
        if (query.get('special_offers')) setShowSpecialOffersOnly(query.get('special_offers') === 'true');
    }, []);

    const formatPrice = (price) => {
        const num = parseFloat(price || 0);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(num);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `/storage/${imagePath}`;
    };

    const calculateDiscountPercentage = (price, offerPrice) => {
        if (!offerPrice || offerPrice >= price || price <= 0) return 0;
        return Math.round(((price - offerPrice) / price) * 100);
    };

    const applyFilters = () => {
        router.get(route('packages.index'), {
            search,
            destinations: selectedDestinations,
            min_price: priceRange[0],
            max_price: priceRange[1],
            duration: durationFilter,
            sort_by: sortBy,
            special_offers: showSpecialOffersOnly
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        applyFilters();
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedDestinations([]);
        setPriceRange([0, 5000]);
        setDurationFilter('');
        setSortBy('featured');
        setShowSpecialOffersOnly(false);

        router.get(route('packages.index'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const PackageCard = ({ pkg }) => {
        const imageUrl = getImageUrl(pkg.image);
        const hasOffer = pkg.offer_price && parseFloat(pkg.offer_price) < parseFloat(pkg.price || 0);
        const discountPercentage = hasOffer ? calculateDiscountPercentage(parseFloat(pkg.price), parseFloat(pkg.offer_price)) : 0;

        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt={pkg.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80`;" alt="" />
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {pkg.is_featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-yellow-500 text-white shadow-md">
                                <StarIcon className="h-3 w-3 mr-1" /> Featured
                            </span>
                        )}
                        {hasOffer && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-500 text-white shadow-md">
                                <TagIcon className="h-3 w-3 mr-1" /> {discountPercentage}% OFF
                            </span>
                        )}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3">
                        {hasOffer ? (
                            <div className="bg-white p-2 rounded-lg shadow-lg text-center min-w-[100px]">
                                <div className="text-sm text-gray-500 line-through">
                                    {formatPrice(pkg.price)}
                                </div>
                                <div className="text-lg font-bold text-red-600">
                                    {formatPrice(pkg.offer_price)}
                                </div>
                            </div>
                        ) : (
                            <span className="px-4 py-2 bg-white text-gray-800 rounded-lg font-bold shadow-lg text-lg">
                                {formatPrice(pkg.price)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-200">
                        {pkg.title}
                    </h3>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{pkg.destination?.name ?? 'Unknown Destination'}</span>
                    </div>

                    <p className="mt-3 text-gray-600 text-sm line-clamp-2 min-h-[40px]">
                        {pkg.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span className="font-medium">{pkg.duration_days || 0} days</span>
                        </div>
                        {hasOffer && (
                            <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-full font-medium">
                                Special Offer
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <Link
                            href={route('packages.show', pkg.id)}
                            className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-md hover:from-indigo-700 hover:to-purple-700 text-center font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            View Details
                            {/* {hasOffer ? 'Book Now' : 'View Details'} */}
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AppLayout title="Travel Packages">
            <Head>
                <meta name="description" content="Browse travel packages with special offers and discounts" />
            </Head>

            {/* Search and Filter Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 py-8">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Explore Amazing Travel Packages
                        </h1>
                        {/* <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover your perfect getaway with our curated collection of travel packages.
                            {showSpecialOffersOnly && (
                                <span className="font-bold text-red-600 ml-1">Showing special offers only!</span>
                            )}
                        </p> */}
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search packages by title, destination, or keywords..."
                                className="w-full pl-12 pr-40 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                            />

                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />

                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                            >
                                Search
                            </button>
                        </form>

                        {/* <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                <FunnelIcon className="h-5 w-5 mr-2" />
                                Filters
                            </button>

                            <div className="flex items-center gap-4 ml-auto">
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-600 mr-2">Special Offers Only:</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showSpecialOffersOnly}
                                            onChange={(e) => setShowSpecialOffersOnly(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                    </label>
                                </div>

                                <div className="hidden md:flex items-center border-l border-gray-300 pl-4">
                                    <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                                    <select
                                        className="border-0 bg-transparent text-gray-700 focus:ring-0"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price_asc">Price: Low → High</option>
                                        <option value="price_desc">Price: High → Low</option>
                                        <option value="discount_desc">Best Discount</option>
                                        <option value="duration_asc">Duration: Short → Long</option>
                                        <option value="duration_desc">Duration: Long → Short</option>
                                        <option value="newest">Newest</option>
                                    </select>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col lg:flex-row gap-8">
                
                {/* Filter Sidebar */}
                <div className={`${showFilters ? 'block' : 'hidden lg:block'} lg:w-1/4`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg sticky top-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-xl text-gray-900">Filters</h2>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Special Offers Filter */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800">Special Offers</h3>
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                    {safeData.filter(p => p.offer_price && parseFloat(p.offer_price) < parseFloat(p.price || 0)).length} available
                                </span>
                            </div>
                            <label className="flex items-center mt-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                                <input
                                    type="checkbox"
                                    checked={showSpecialOffersOnly}
                                    onChange={(e) => setShowSpecialOffersOnly(e.target.checked)}
                                    className="h-5 w-5 text-red-600 focus:ring-red-500 rounded"
                                />
                                <span className="ml-3 font-medium text-gray-700">Show offers</span>
                            </label>
                        </div>

                        {/* Destinations */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Destinations</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {safeDestinations.map((dest) => (
                                    <label key={dest.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                                        <input
                                            type="checkbox"
                                            checked={selectedDestinations.includes(dest.id)}
                                            onChange={(e) => {
                                                if (e.target.checked)
                                                    setSelectedDestinations([...selectedDestinations, dest.id]);
                                                else
                                                    setSelectedDestinations(selectedDestinations.filter((x) => x !== dest.id));
                                            }}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                                        />
                                        <span className="ml-3 text-gray-700">{dest.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                            </h3>
                            <div className="space-y-4">
                                <div className="relative pt-1">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="100"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="100"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                                    />
                                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                                        <span>$0</span>
                                        <span>$5,000</span>
                                        <span>$10,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Duration</h3>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                value={durationFilter}
                                onChange={(e) => setDurationFilter(e.target.value)}
                            >
                                <option value="">All Durations</option>
                                <option value="1-3">1–3 days</option>
                                <option value="4-7">4–7 days</option>
                                <option value="8-14">8–14 days</option>
                                <option value="15+">15+ days</option>
                            </select>
                        </div>

                        <button
                            onClick={applyFilters}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                        >
                            Apply Filters
                        </button>

                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setShowFilters(false)}
                            className="lg:hidden w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                        >
                            Close Filters
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-3/4">
                    {/* Results Info */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {safeData.length} Travel Packages
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    
                                    {selectedDestinations.length > 0 && `${selectedDestinations.length} destinations selected • `}
                                    {search && `Results for "${search}"`}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        <Squares2X2Icon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        <ListBulletIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(selectedDestinations.length > 0 || search || priceRange[0] > 0 || priceRange[1] < 5000 || durationFilter || showSpecialOffersOnly) && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {search && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm">
                                        Search: {search}
                                        <button onClick={() => setSearch('')} className="ml-2">
                                            <XMarkIcon className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                                {showSpecialOffersOnly && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-100 text-red-800 text-sm">
                                        Special Offers Only
                                        <button onClick={() => setShowSpecialOffersOnly(false)} className="ml-2">
                                            <XMarkIcon className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                                {selectedDestinations.map(destId => {
                                    const dest = safeDestinations.find(d => d.id === destId);
                                    return dest && (
                                        <span key={destId} className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-sm">
                                            {dest.name}
                                            <button 
                                                onClick={() => setSelectedDestinations(selectedDestinations.filter(id => id !== destId))}
                                                className="ml-2"
                                            >
                                                <XMarkIcon className="h-3 w-3" />
                                            </button>
                                        </span>
                                    );
                                })}
                                {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm">
                                        Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                                        <button onClick={() => setPriceRange([0, 5000])} className="ml-2">
                                            <XMarkIcon className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                                {durationFilter && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 text-sm">
                                        Duration: {durationFilter}
                                        <button onClick={() => setDurationFilter('')} className="ml-2">
                                            <XMarkIcon className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Packages Grid */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {safeData.map((pkg) => (
                                <PackageCard key={pkg.id} pkg={pkg} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {safeData.map((pkg) => (
                                <div key={pkg.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/3">
                                            <div className="relative h-48 md:h-full">
                                                <img 
                                                    src={getImageUrl(pkg.image) || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                                    alt={pkg.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:w-2/3 p-6">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                                                {pkg.offer_price && parseFloat(pkg.offer_price) < parseFloat(pkg.price) && (
                                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                        {calculateDiscountPercentage(parseFloat(pkg.price), parseFloat(pkg.offer_price))}% OFF
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center mt-2 text-gray-600">
                                                <MapPinIcon className="h-4 w-4 mr-1" />
                                                {pkg.destination?.name || 'Unknown Destination'} • 
                                                <ClockIcon className="h-4 w-4 ml-3 mr-1" />
                                                {pkg.duration_days} days
                                            </div>
                                            <p className="mt-3 text-gray-600 line-clamp-2">{pkg.description}</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="text-lg font-bold">
                                                    {pkg.offer_price && parseFloat(pkg.offer_price) < parseFloat(pkg.price) ? (
                                                        <>
                                                            <span className="text-red-600">{formatPrice(pkg.offer_price)}</span>
                                                            <span className="text-gray-400 line-through ml-2">{formatPrice(pkg.price)}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-900">{formatPrice(pkg.price)}</span>
                                                    )}
                                                </div>
                                                <Link
                                                    href={route('packages.show', pkg.id)}
                                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {safeData.length === 0 && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages found</h3>
                            <p className="text-gray-600 mb-6">
                                Try adjusting your search or filter criteria
                            </p>
                            <button
                                onClick={clearFilters}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {safeLinks.length > 3 && (
                        <div className="mt-8">
                            <nav className="flex justify-center">
                                <ul className="flex items-center space-x-1">
                                    {safeLinks.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}