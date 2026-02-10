'use client';

import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiService, Doctor } from '@/services/api';
import { MapPin, Star, Clock, Filter, Search, X } from 'lucide-react';

export default function AllDoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [reminder, setReminder] = useState({ active: false, time: '' });

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [minRating, setMinRating] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const specializations = [
        'General Physician',
        'Emergency Medicine',
        'Orthopedic Surgery',
        'Dermatology',
        'Plastic Surgery',
        'Wound Care Specialist',
        'Burn Specialist',
        'Pediatrics',
        'Cardiology'
    ];

    const locations = [
        'Chittoor',
        'Hyderabad',
        'Tirupati',
        'Vijayawada',
        'Visakhapatnam'
    ];

    const loadAllDoctors = async () => {
        try {
            // Get all doctors without filters
            const doctorList = await apiService.getDoctors(undefined, undefined, 50);
            setDoctors(doctorList);
            setFilteredDoctors(doctorList);
        } catch (error) {
            console.error('Failed to load doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterDoctors = useCallback(() => {
        let filtered = [...doctors];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(doc =>
                doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.hospital.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Specialization filter
        if (selectedSpecialization) {
            filtered = filtered.filter(doc =>
                doc.specialization === selectedSpecialization
            );
        }

        // Location filter (based on hospital name/area)
        if (selectedLocation) {
            filtered = filtered.filter(doc =>
                doc.hospital.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        // Rating filter
        if (minRating > 0) {
            filtered = filtered.filter(doc => doc.rating >= minRating);
        }

        setFilteredDoctors(filtered);
    }, [doctors, searchQuery, selectedSpecialization, selectedLocation, minRating]);

    useEffect(() => {
        const savedReminder = localStorage.getItem('medidoctor_reminder');
        if (savedReminder) {
            setReminder(JSON.parse(savedReminder));
        }
        loadAllDoctors();
    }, []);

    useEffect(() => {
        filterDoctors();
    }, [filterDoctors]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedSpecialization('');
        setSelectedLocation('');
        setMinRating(0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar reminderActive={reminder.active} reminderTime={reminder.time} />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <LoadingSpinner message="Loading doctors..." />

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar reminderActive={reminder.active} reminderTime={reminder.time} />

            {/* Header */}
            <div className="bg-white border-b-2 border-gray-200">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
                    <p className="text-gray-600">Browse and filter from our network of medical professionals</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Search and Filter Controls */}
                <div className="bg-white border-2 border-gray-200 p-6 mb-6 shadow-sm">
                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by doctor name, specialization, or hospital..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
                        />
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 border-2 border-blue-700 transition-colors mb-4"
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="space-y-4 p-4 bg-gray-50 border-2 border-gray-200">
                            <div className="grid md:grid-cols-3 gap-4">
                                {/* Specialization Filter */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Specialization
                                    </label>
                                    <select
                                        value={selectedSpecialization}
                                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
                                    >
                                        <option value="">All Specializations</option>
                                        {specializations.map(spec => (
                                            <option key={spec} value={spec}>{spec}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location Filter */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Location
                                    </label>
                                    <select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Rating Filter */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Minimum Rating
                                    </label>
                                    <select
                                        value={minRating}
                                        onChange={(e) => setMinRating(Number(e.target.value))}
                                        className="w-full px-4 py-2 border-2 border-gray-300 focus:border-blue-600 focus:outline-none"
                                    >
                                        <option value="0">All Ratings</option>
                                        <option value="4.5">4.5+ Stars</option>
                                        <option value="4.0">4.0+ Stars</option>
                                        <option value="3.5">3.5+ Stars</option>
                                        <option value="3.0">3.0+ Stars</option>
                                    </select>
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
                            >
                                <X className="w-4 h-4" />
                                Clear All Filters
                            </button>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing <strong>{filteredDoctors.length}</strong> of <strong>{doctors.length}</strong> doctors
                    </div>
                </div>

                {/* Doctor Cards */}
                <div className="space-y-4">
                    {filteredDoctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="bg-white border-2 border-gray-200 hover:border-blue-600 transition-all shadow-sm"
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {doctor.name}
                                        </h3>
                                        <p className="text-blue-600 font-semibold mb-3">
                                            {doctor.specialization}
                                        </p>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                <span>{doctor.hospital} • {doctor.distance_km} km away</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                <span className="font-semibold text-gray-900">{doctor.rating.toFixed(1)}</span>
                                                <span className="text-gray-500">({Math.floor(doctor.rating * 20 + 50)} reviews)</span>
                                            </div>
                                        </div>

                                        {/* Expertise Tags */}
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {doctor.expertise.slice(0, 3).map((exp, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-blue-50 border border-blue-300 text-blue-700 text-xs font-medium"
                                                >
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Available Slots */}
                                        <div className="mt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-bold text-gray-900">
                                                    Available Today:
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {doctor.available_slots.slice(0, 4).map((slot, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-green-50 border border-green-400 text-green-700 text-xs font-medium"
                                                    >
                                                        {slot}
                                                    </span>
                                                ))}
                                                {doctor.available_slots.length > 4 && (
                                                    <span className="px-3 py-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs font-medium">
                                                        +{doctor.available_slots.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:w-40">
                                        <button
                                            onClick={() => {
                                                sessionStorage.setItem('selectedDoctor', JSON.stringify(doctor));
                                                window.location.href = '/booking';
                                            }}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 border-2 border-blue-700 transition-colors"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredDoctors.length === 0 && (
                    <div className="text-center py-12 bg-white border-2 border-gray-200">
                        <p className="text-gray-600 text-lg mb-2">No doctors found matching your criteria</p>
                        <button
                            onClick={clearFilters}
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            Clear filters and try again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
