import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    CalendarDaysIcon,
    StarIcon,
    GlobeAltIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    FaceSmileIcon,
    UserGroupIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PaperAirplaneIcon,
    CreditCardIcon,
    AcademicCapIcon,
    ArrowLongRightIcon,
    ShieldExclamationIcon,
    CheckBadgeIcon,
    CheckCircleIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Hero Carousel Component
const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
            title: "Discover Paradise",
            subtitle: "Experience luxury in Bali's most beautiful resorts",
            color: "from-blue-500/20 to-cyan-500/20"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
            title: "Mountain Adventures",
            subtitle: "Conquer the Swiss Alps with expert guides",
            color: "from-purple-500/20 to-pink-500/20"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
            title: "Cultural Immersion",
            subtitle: "Discover ancient traditions in Japan",
            color: "from-emerald-500/20 to-teal-500/20"
        }
    ];

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsTransitioning(false), 1000);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        setTimeout(() => setIsTransitioning(false), 1000);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[700px] overflow-hidden">
            {/* Background Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${slide.image}')`,
                            transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 20s ease-out'
                        }}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-overlay`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>
                    
                    {/* Animated Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative h-full flex items-center z-20">
                        <div className="container mx-auto px-4">
                            <div className="max-w-2xl text-white transform transition-all duration-1000"
                                 style={{
                                     opacity: index === currentSlide ? 1 : 0,
                                     transform: index === currentSlide ? 'translateY(0)' : 'translateY(40px)'
                                 }}>
                                <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-6 py-3 mb-6 border border-white/20">
                                    <SparklesIcon className="h-5 w-5 text-yellow-300 mr-2 animate-pulse" />
                                    <span className="text-sm font-medium bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                                        World's Leading Travel Agency 2025
                                    </span>
                                </div>
                                
                                <h1 className="text-6xl font-bold mb-6 leading-tight">
                                    <span className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent animate-gradient">
                                        {slide.title}
                                    </span>
                                </h1>
                                
                                <p className="text-2xl text-gray-200 mb-10 font-light">
                                    {slide.subtitle}
                                </p>
                                
                                <div className="flex gap-6">
                                    {/* <Link
                                        href={route('packages.index')}
                                        className="group inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-10 py-4 rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 font-semibold text-lg shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)]"
                                    >
                                        <span className="mr-3">Explore Packages</span>
                                        <ArrowLongRightIcon className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                    </Link> */}
                                    
                                    <Link
                                        href={route('packages.index')}
                                        className="group inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg border-2 border-white/30 hover:border-white/50"
                                    >
                                        <CalendarDaysIcon className="h-6 w-6 mr-3" />
                                        Plan Your Trip
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Navigation Buttons */}
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-30 flex justify-between px-12">
                <button
                    onClick={prevSlide}
                    disabled={isTransitioning}
                    className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all duration-300 disabled:opacity-30 border border-white/30 hover:border-white/50 hover:scale-110 active:scale-95 shadow-lg"
                >
                    <ChevronLeftIcon className="h-8 w-8 text-white" />
                </button>
                
                <button
                    onClick={nextSlide}
                    disabled={isTransitioning}
                    className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all duration-300 disabled:opacity-30 border border-white/30 hover:border-white/50 hover:scale-110 active:scale-95 shadow-lg"
                >
                    <ChevronRightIcon className="h-8 w-8 text-white" />
                </button>
            </div>
            
            {/* Indicators */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex gap-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (!isTransitioning) {
                                setIsTransitioning(true);
                                setCurrentSlide(index);
                                setTimeout(() => setIsTransitioning(false), 1000);
                            }
                        }}
                        className={`h-3 rounded-full transition-all duration-500 ${
                            index === currentSlide 
                            ? 'w-12 bg-gradient-to-r from-blue-400 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.7)]' 
                            : 'w-3 bg-white/50 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>
            
            {/* Stats Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Destinations", value: "200+", color: "text-blue-300" },
                            { label: "Happy Travelers", value: "15K+", color: "text-cyan-300" },
                            { label: "Satisfaction Rate", value: "98%", color: "text-emerald-300" },
                            { label: "24/7 Support", value: "Always", color: "text-purple-300" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center text-white group">
                                <div className={`text-4xl font-bold mb-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-300 font-medium tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PackageGrid = ({ packages = [] }) => {
    const displayPackages = packages.slice(0, 4);
    
    if (displayPackages.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 mb-4">
                    <PaperAirplaneIcon className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No featured packages available</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayPackages.map((pkg, index) => (
                    <div key={pkg.id || index} className="group relative">
                        {/* Glow Effect Behind Card */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-2xl"></div>
                        
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 relative z-10">
                            <div className="relative h-64 overflow-hidden">
                                {pkg.image ? (
                                    <img 
                                        src={`/storage/${pkg.image}`}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                        <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80`;" alt="" />
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                
                                {pkg.is_featured && (
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                                        FEATURED
                                    </div>
                                )}
                                
                                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                                    <div className="flex items-center">
                                        <ClockIcon className="h-4 w-4 text-blue-600 mr-2" />
                                        <span className="text-blue-700 font-bold">{pkg.duration_days} days</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    {pkg.title}
                                </h3>
                                
                                <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                                    {pkg.description}
                                </p>
                                
                                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                                    <div>
                                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                            ${parseFloat(pkg.price).toLocaleString()}
                                        </div>
                                        <div className="text-gray-500 text-sm">per person</div>
                                    </div>
                                    <Link
                                        href={route('packages.show', pkg.id)}
                                        className="group/btn inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 text-sm font-semibold shadow-sm hover:shadow-md"
                                    >
                                        View Details
                                        {/* <ArrowLongRightIcon className="h-4 w-4 ml-2 group-hover/btn:translate-x-2 transition-transform" /> */}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Explore All Packages Button */}
            {packages.length > 4 && (
                <div className="text-center mt-12">
                    <Link
                        href={route('packages.index')}
                        className="group inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-12 py-4 rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 font-semibold text-lg shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:scale-105"
                    >
                        <span className="mr-3">Explore All Packages</span>
                        <ArrowLongRightIcon className="h-6 w-6 group-hover:translate-x-3 transition-transform" />
                    </Link>
                </div>
            )}
        </>
    );
};

// Improved Testimonial Carousel Component
const TestimonialCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            location: "New York, USA",
            text: "The Bali trip was absolutely magical! Every detail was perfectly planned, and the luxury resort exceeded our expectations. The food, accommodation, and activities were all 5-star quality.",
            rating: 5,
            package: "Bali Beach Paradise",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            travelDate: "March 2024"
        },
        {
            id: 2,
            name: "Michael Chen",
            location: "Toronto, Canada",
            text: "Our Swiss Alps adventure was breathtaking. The guides were knowledgeable, accommodations were cozy, and the views were unforgettable. Will definitely book another trip!",
            rating: 5,
            package: "Swiss Alps Adventure",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            travelDate: "February 2024"
        },
        {
            id: 3,
            name: "Elena Rodriguez",
            location: "Madrid, Spain",
            text: "The cultural immersion in Japan was incredible. From traditional tea ceremonies to modern Tokyo, every moment was curated to perfection. Highly recommended!",
            rating: 5,
            package: "Japanese Cultural Tour",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            travelDate: "January 2024"
        },
        {
            id: 4,
            name: "David Wilson",
            location: "London, UK",
            text: "The safari experience in Kenya was beyond amazing. We saw the Big Five and the guides were incredibly knowledgeable about wildlife and conservation.",
            rating: 5,
            package: "Kenyan Safari Expedition",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            travelDate: "December 2023"
        }
    ];

    const nextTestimonial = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 1000);
    };

    const prevTestimonial = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
        setTimeout(() => setIsAnimating(false), 1000);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextTestimonial();
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            {/* Decorative Background Elements */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
                <div className="overflow-hidden">
                    <div 
                        className="flex transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                                <div className={`bg-white rounded-3xl p-10 shadow-xl border border-gray-100 transition-all duration-500 ${
                                    index === currentIndex ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
                                }`}>
                                    {/* Quote Icon with Glow */}
                                    <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-xl">
                                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
                                    </div>
                                    
                                    {/* Profile Section */}
                                    <div className="flex flex-col md:flex-row items-start md:items-center mb-8 gap-8">
                                        <div className="relative">
                                            {/* Profile Image with Glow Border */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-md opacity-60 animate-pulse"></div>
                                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
                                                    <img 
                                                        src={testimonial.image}
                                                        alt={testimonial.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Rating Badge */}
                                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                                                ★ 5.0
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                                                <div>
                                                    <h4 className="text-2xl font-bold text-gray-900">{testimonial.name}</h4>
                                                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                                                </div>
                                                
                                                <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 text-sm font-medium px-4 py-2 rounded-full border border-blue-100">
                                                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                                    {testimonial.travelDate}
                                                </div>
                                            </div>
                                            
                                            <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-full text-sm font-semibold mt-3">
                                                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                                                {testimonial.package}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Rating Stars */}
                                    <div className="flex mb-8">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <StarIconSolid key={i} className="h-7 w-7 text-amber-400 mr-1" />
                                        ))}
                                    </div>
                                    
                                    {/* Testimonial Text */}
                                    <div className="relative mb-8">
                                        <div className="absolute -top-4 -left-4 text-8xl text-blue-100/50 font-serif">"</div>
                                        <p className="text-gray-700 text-xl leading-relaxed mb-6 pl-8 font-medium italic">
                                            {testimonial.text}
                                        </p>
                                        <div className="absolute -bottom-4 -right-4 text-8xl text-blue-100/50 font-serif rotate-180">"</div>
                                    </div>
                                    
                                    {/* Footer with Verified Badge */}
                                    <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                                        <div className="inline-flex items-center text-emerald-600 font-semibold text-sm bg-emerald-50 px-4 py-2 rounded-full">
                                            <CheckBadgeIcon className="h-5 w-5 mr-2" />
                                            Verified Traveler • 2+ Trips
                                        </div>
                                        
                                        <div className="text-sm text-gray-500">
                                            Trip completed successfully
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Navigation Dots */}
                <div className="flex justify-center mt-10 gap-3">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (!isAnimating) {
                                    setIsAnimating(true);
                                    setCurrentIndex(index);
                                    setTimeout(() => setIsAnimating(false), 1000);
                                }
                            }}
                            className={`h-2 rounded-full transition-all duration-500 ${
                                index === currentIndex 
                                ? 'w-10 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                                : 'w-3 bg-gray-300 hover:bg-gray-400 transform hover:scale-125'
                            }`}
                        />
                    ))}
                </div>
                
                {/* Navigation Buttons */}
                {/* <button
                    onClick={prevTestimonial}
                    disabled={isAnimating}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 border border-gray-200 disabled:opacity-30"
                >
                    <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                </button>
                
                <button
                    onClick={nextTestimonial}
                    disabled={isAnimating}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 border border-gray-200 disabled:opacity-30"
                >
                    <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                </button> */}
            </div>
        </div>
    );
};

export default function Home({ featuredPackages = [], destinations = [] }) {
    const activeDestinations = destinations.filter(dest => dest.is_active);
    const featuredPackagesList = featuredPackages.filter(pkg => pkg.is_featured && pkg.is_active);

    return (
        <AppLayout title="Home">
            <Head>
                <meta name="description" content="Discover amazing travel experiences with our expertly curated packages. Luxury travel packages worldwide." />
            </Head>

            {/* Hero Section with Carousel */}
            <HeroCarousel />

            {/* Featured Packages */}
            <div className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-8 py-3 mb-6 border border-blue-300/30">
                            <StarIcon className="h-6 w-6 text-blue-500 mr-3" />
                            <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                Featured Packages
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Travel Experiences</h2>
                        {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover our most sought-after travel packages, carefully curated for unforgettable memories
                        </p> */}
                    </div>
                    
                    <PackageGrid packages={featuredPackagesList} />
                </div>
            </div>

            {/* Popular Destinations with Images */}
            {activeDestinations.length > 0 && (
                <div className="py-20 bg-gradient-to-b from-white via-purple-50/20 to-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-8 py-3 mb-6 border border-purple-300/30">
                                <GlobeAltIcon className="h-6 w-6 text-purple-500 mr-3" />
                                <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                    Top Destinations
                                </span>
                            </div>
                            {/* <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Amazing Locations</h2> */}
                            {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Discover breathtaking destinations that will inspire your next adventure
                            </p> */}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {activeDestinations.slice(0, 4).map((destination, index) => (
                                <div key={destination.id} className="group">
                                    <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4">
                                        {/* Destination Image */}
                                        <div className="aspect-[4/5] bg-gradient-to-br from-blue-400/20 to-purple-400/20 relative overflow-hidden">
                                            {/* Actual Destination Image */}
                                            {destination.image ? (
                                                <img 
                                                    src={`/storage/${destination.image}`}
                                                    alt={destination.name}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                                    <img src="https://images.unsplash.com/photo-1738603567155-303e75573bf7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D;" alt="" />
                                                </div>
                                            )}
                                            
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                                            
                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
                                                <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors">
                                                    {destination.name}
                                                </h3>
                                                <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                                                    {destination.description}
                                                </p>
                                                <Link
                                                    href={route('packages.index', { destination: destination.id })}
                                                    className="inline-flex items-center text-white font-semibold hover:text-cyan-300 text-sm group/link"
                                                >
                                                    Explore Packages
                                                    <ArrowLongRightIcon className="h-4 w-4 ml-2 group-hover/link:translate-x-3 transition-transform duration-300" />
                                                </Link>
                                            </div>
                                            
                                            {/* Hover Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </div>
                                        
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-cyan-300/30 transition-all duration-500"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Why Choose Us */}
            <div className="py-20 bg-gradient-to-b from-white via-emerald-50/20 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-8 py-3 mb-6 border border-emerald-300/30">
                            <ShieldExclamationIcon className="h-6 w-6 text-emerald-500 mr-3" />
                            <span className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                                Why Choose Us
                            </span>
                        </div>
                        {/* <h2 className="text-4xl font-bold text-gray-900 mb-4">Excellence in Every Journey</h2> */}
                        {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We're committed to delivering exceptional travel experiences with unmatched service
                        </p> */}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: CreditCardIcon,
                                title: "Best Price Guarantee",
                                description: "We guarantee the best prices for all our travel packages",
                                color: 'from-blue-500 to-cyan-400',
                                glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                            },
                            {
                                icon: ShieldExclamationIcon,
                                title: "Safe & Secure",
                                description: "Your security is our priority with encrypted payments",
                                color: 'from-emerald-500 to-teal-400',
                                glow: 'shadow-[0_0_30px_rgba(52,211,153,0.3)]'
                            },
                            {
                                icon: ClockIcon,
                                title: "24/7 Support",
                                description: "Round-the-clock multilingual support",
                                color: 'from-purple-500 to-pink-400',
                                glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                            },
                            {
                                icon: AcademicCapIcon,
                                title: "Expert Guides",
                                description: "Local guides with extensive knowledge",
                                color: 'from-amber-500 to-orange-400',
                                glow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="group">
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:border-white/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 ${feature.glow} group-hover:scale-110 transition-all duration-500`}>
                                        <feature.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:bg-clip-text transition-all duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                    
                                    {/* Hover Line */}
                                    <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Improved Testimonials Section */}
            <div className="py-10 bg-gradient-to-b from-white via-rose-50/20 to-white relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-rose-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 px-8 py-3 mb-6 border border-rose-300/30">
                            <FaceSmileIcon className="h-6 w-6 text-rose-500 mr-3" />
                            <span className="text-lg font-semibold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
                                Traveler Reviews
                            </span>
                        </div>
                        {/* <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Travelers Say</h2> */}
                        {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Don't just take our word for it - hear from thousands of satisfied travelers
                        </p> */}
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        <TestimonialCarousel />
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-gray-200/50">
                        {[
                            { 
                                value: "200+", 
                                label: "Destinations", 
                                color: "text-blue-500", 
                                bg: "from-blue-500/20 to-cyan-500/20",
                                icon: GlobeAltIcon
                            },
                            { 
                                value: "4.9/5", 
                                label: "Average Rating", 
                                color: "text-emerald-500", 
                                bg: "from-emerald-500/20 to-teal-500/20",
                                icon: StarIcon
                            },
                            { 
                                value: "98%", 
                                label: "Satisfaction Rate", 
                                color: "text-amber-500", 
                                bg: "from-amber-500/20 to-orange-500/20",
                                icon: CheckCircleIcon
                            },
                            { 
                                value: "24/7", 
                                label: "Support", 
                                color: "text-purple-500", 
                                bg: "from-purple-500/20 to-pink-500/20",
                                icon: ClockIcon
                            }
                        ].map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.bg} mb-4 mx-auto group-hover:scale-110 transition-all duration-500 shadow-lg hover:shadow-xl border border-white/30`}>
                                    <stat.icon className={`h-10 w-10 ${stat.color}`} />
                                </div>
                                <div className={`text-3xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                    {stat.value}
                                </div>
                                <div className="text-gray-700 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-cyan-900">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>
                
                <div className="relative container mx-auto px-4 py-24 text-center">
                    <h2 className="text-5xl font-bold mb-6 text-white">
                        Ready for Your <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">Dream Vacation?</span>
                    </h2>
                    
                    <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Join thousands of happy travelers who have experienced unforgettable journeys with our award-winning travel agency.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            href={route('packages.index')}
                            className="group inline-flex items-center justify-center bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-[length:200%_100%] text-white px-12 py-5 rounded-xl hover:bg-right transition-all duration-500 font-bold text-lg shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_rgba(59,130,246,0.7)] hover:scale-105"
                        >
                            <PaperAirplaneIcon className="h-6 w-6 mr-3 animate-bounce" />
                            Start Planning Today
                        </Link>
                        
                        <Link
                            href={route('register')}
                            className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-12 py-5 rounded-xl hover:bg-white/20 transition-all duration-300 font-bold text-lg border-2 border-white/30 hover:border-white/50 hover:scale-105"
                        >
                            <UserGroupIcon className="h-6 w-6 mr-3" />
                            Create Account
                        </Link>
                    </div>
                    
                    <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 inline-block">
                        <p className="text-blue-200 text-lg">
                            Need help? Call our experts at <span className="font-bold text-cyan-300">1-800-TRAVEL</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes gradient-xy {
                    0%, 100% {
                        background-position: 0% 0%;
                    }
                    50% {
                        background-position: 100% 100%;
                    }
                }
                
                .animate-gradient-xy {
                    background-size: 200% 200%;
                    animation: gradient-xy 8s ease infinite;
                }
                
                @keyframes gradient {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 4s ease infinite;
                }
                
                /* Smooth scroll behavior */
                html {
                    scroll-behavior: smooth;
                }
                
                /* Better focus styles */
                *:focus {
                    outline: 2px solid rgba(59, 130, 246, 0.5);
                    outline-offset: 2px;
                }
                
                /* Smooth transitions */
                * {
                    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    transition-duration: 300ms;
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 10px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #06b6d4);
                    border-radius: 5px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #2563eb, #0891b2);
                }
            `}</style>
        </AppLayout>
    );
}