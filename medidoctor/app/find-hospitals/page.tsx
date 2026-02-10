'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { MapPin, Navigation, Search, ExternalLink, Phone, Clock } from 'lucide-react';

interface Hospital {
    id: number;
    name: string;
    address: string;
    city: string;
    phone: string;
    type: string;
    services: string[];
    distance?: string;
    rating?: number;
    openHours?: string;
}

export default function FindHospitalsPage() {
    const [reminder, setReminder] = useState({ active: false, time: '' });
    const [cityInput, setCityInput] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

    // Mock hospital data for different cities
    const allHospitals: Hospital[] = [
        // Chittoor
        {
            id: 1,
            name: 'SVIMS - Sri Venkateswara Institute of Medical Sciences',
            address: 'Alipiri Road, Tirupati',
            city: 'Chittoor',
            phone: '0877-2287777',
            type: 'Government Teaching Hospital',
            services: ['Emergency', 'ICU', 'Trauma Care', 'Surgery', 'Cardiology'],
            distance: '2.5 km',
            rating: 4.5,
            openHours: '24/7'
        },
        {
            id: 2,
            name: 'Balaji Institute of Surgery, Research and Rehabilitation',
            address: 'Renigunta Road, Tirupati',
            city: 'Chittoor',
            phone: '0877-2284999',
            type: 'Multi-Speciality Hospital',
            services: ['Emergency', 'Surgery', 'Orthopedics', 'Neurology'],
            distance: '3.8 km',
            rating: 4.3,
            openHours: '24/7'
        },
        {
            id: 3,
            name: 'Ramesh Hospitals',
            address: 'Vijayawada Road, Guntur',
            city: 'Chittoor',
            phone: '0863-2329999',
            type: 'Multi-Speciality Hospital',
            services: ['Emergency', 'Cardiology', 'Neurology', 'Oncology'],
            distance: '5.2 km',
            rating: 4.6,
            openHours: '24/7'
        },

        // Hyderabad
        {
            id: 4,
            name: 'Apollo Hospitals',
            address: 'Jubilee Hills, Hyderabad',
            city: 'Hyderabad',
            phone: '040-23607777',
            type: 'Multi-Speciality Hospital',
            services: ['Emergency', 'ICU', 'Cardiology', 'Neurology', 'Oncology', 'Trauma Care'],
            distance: '4.2 km',
            rating: 4.8,
            openHours: '24/7'
        },
        {
            id: 5,
            name: 'Yashoda Hospitals',
            address: 'Somajiguda, Hyderabad',
            city: 'Hyderabad',
            phone: '040-23554455',
            type: 'Multi-Speciality Hospital',
            services: ['Emergency', 'Surgery', 'Orthopedics', 'ICU', 'Trauma Care'],
            distance: '3.5 km',
            rating: 4.7,
            openHours: '24/7'
        },
        {
            id: 6,
            name: 'KIMS Hospital',
            address: 'Secunderabad, Hyderabad',
            city: 'Hyderabad',
            phone: '040-44885555',
            type: 'Multi-Speciality Hospital',
            services: ['Emergency', 'Cardiology', 'Neurosurgery', 'Oncology'],
            distance: '6.1 km',
            rating: 4.6,
            openHours: '24/7'
        },
        {
            id: 7,
            name: 'NIMS - Nizam\'s Institute of Medical Sciences',
            address: 'Punjagutta, Hyderabad',
            city: 'Hyderabad',
            phone: '040-23489000',
            type: 'Government Teaching Hospital',
            services: ['Emergency', 'ICU', 'Trauma Care', 'Surgery', 'All Specialties'],
            distance: '5.8 km',
            rating: 4.4,
            openHours: '24/7'
        },

        // Tirupati
        {
            id: 8,
            name: 'Arogyasri Ruia Hospital',
            address: 'Tiruchanur Road, Tirupati',
            city: 'Tirupati',
            phone: '0877-2289999',
            type: 'Multi-Speciality Hospital',
            services: ['Emergency', 'Surgery', 'Orthopedics', 'Cardiology'],
            distance: '1.8 km',
            rating: 4.2,
            openHours: '24/7'
        },
        {
            id: 9,
            name: 'Sri Govindaraja General Hospital',
            address: 'Korlagunta, Tirupati',
            city: 'Tirupati',
            phone: '0877-2233456',
            type: 'General Hospital',
            services: ['Emergency', 'General Medicine', 'Surgery', 'Pediatrics'],
            distance: '2.3 km',
            rating: 4.0,
            openHours: '24/7'
        },

        // Vijayawada
        {
            id: 10,
            name: 'Manipal Hospitals',
            address: 'Tadepalli, Vijayawada',
            city: 'Vijayawada',
            phone: '0866-6677777',
            type: 'Multi-Speciality Hospital',
            services: ['Emergency', 'ICU', 'Cardiology', 'Neurology', 'Trauma Care'],
            distance: '3.2 km',
            rating: 4.7,
            openHours: '24/7'
        },
        {
            id: 11,
            name: 'Andhra Hospitals',
            address: 'MG Road, Vijayawada',
            city: 'Vijayawada',
            phone: '0866-2578888',
            type: 'Multi-Speciality Hospital',
            services: ['Emergency', 'Surgery', 'Orthopedics', 'Cardiology'],
            distance: '2.1 km',
            rating: 4.5,
            openHours: '24/7'
        },

        // Visakhapatnam
        {
            id: 12,
            name: 'KIMS ICON Hospital',
            address: 'Dwaraka Nagar, Visakhapatnam',
            city: 'Visakhapatnam',
            phone: '0891-3989999',
            type: 'Multi-Speciality Hospital',
            services: ['Emergency', 'ICU', 'Cardiology', 'Neurology', 'Oncology'],
            distance: '4.5 km',
            rating: 4.8,
            openHours: '24/7'
        },
        {
            id: 13,
            name: 'Seven Hills Hospital',
            address: 'Rockdale Layout, Visakhapatnam',
            city: 'Visakhapatnam',
            phone: '0891-2777777',
            type: 'Multi-Speciality Hospital',
            services: ['Emergency', 'Surgery', 'Orthopedics', 'Trauma Care'],
            distance: '3.7 km',
            rating: 4.6,
            openHours: '24/7'
        }
    ];

    useEffect(() => {
        const savedReminder = localStorage.getItem('medidoctor_reminder');
        if (savedReminder) {
            setReminder(JSON.parse(savedReminder));
        }
        setHospitals(allHospitals);
    }, []);

    useEffect(() => {
        if (selectedCity) {
            const filtered = hospitals.filter(h =>
                h.city.toLowerCase() === selectedCity.toLowerCase()
            );
            setFilteredHospitals(filtered);
        } else {
            setFilteredHospitals([]);
        }
    }, [selectedCity, hospitals]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (cityInput.trim()) {
            setSelectedCity(cityInput.trim());
        }
    };

    const handleClearSearch = () => {
        setCityInput('');
        setSelectedCity('');
        setFilteredHospitals([]);
    };

    const openInMaps = (hospital: Hospital) => {
        const query = encodeURIComponent(`${hospital.name}, ${hospital.address}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    const findMoreHospitals = () => {
        const query = encodeURIComponent(`hospitals in ${selectedCity}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    const popularCities = ['Chittoor', 'Hyderabad', 'Tirupati', 'Vijayawada', 'Visakhapatnam'];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar reminderActive={reminder.active} reminderTime={reminder.time} />

            {/* Header */}
            <div className="bg-white border-b-2 border-gray-200">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Nearby Hospitals</h1>
                    <p className="text-gray-600">Search for hospitals in your city and get directions</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Search Section */}
                <div className="bg-white border-2 border-gray-200 shadow-md p-6 mb-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Enter City Name
                            </label>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={cityInput}
                                        onChange={(e) => setCityInput(e.target.value)}
                                        placeholder="e.g., Hyderabad, Tirupati, Vijayawada..."
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-green-600 focus:outline-none text-base"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 border-2 border-green-700 transition-colors"
                                >
                                    Search
                                </button>
                                {selectedCity && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3 transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Popular Cities Quick Select */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Popular Cities:</p>
                            <div className="flex flex-wrap gap-2">
                                {popularCities.map((city) => (
                                    <button
                                        key={city}
                                        type="button"
                                        onClick={() => {
                                            setCityInput(city);
                                            setSelectedCity(city);
                                        }}
                                        className={`px-4 py-2 border-2 font-medium transition-all ${selectedCity === city
                                                ? 'bg-green-600 text-white border-green-700'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
                                            }`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {selectedCity && (
                    <div className="space-y-4">
                        {/* Results Header */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Hospitals in {selectedCity}
                                <span className="text-lg font-normal text-gray-600 ml-3">
                                    ({filteredHospitals.length} found)
                                </span>
                            </h2>
                            <button
                                onClick={findMoreHospitals}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 border-2 border-blue-700 transition-colors"
                            >
                                <ExternalLink className="w-5 h-5" />
                                <span>Find More on Google Maps</span>
                            </button>
                        </div>

                        {/* Hospital Cards */}
                        {filteredHospitals.length > 0 ? (
                            <div className="grid gap-4">
                                {filteredHospitals.map((hospital) => (
                                    <div
                                        key={hospital.id}
                                        className="bg-white border-2 border-gray-200 hover:border-green-600 shadow-sm transition-all"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                        {hospital.name}
                                                    </h3>
                                                    <p className="text-green-600 font-semibold mb-2">
                                                        {hospital.type}
                                                    </p>
                                                    <div className="space-y-2 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span>{hospital.address}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                            <span>{hospital.phone}</span>
                                                        </div>
                                                        {hospital.openHours && (
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-gray-400" />
                                                                <span className="font-semibold text-green-600">
                                                                    {hospital.openHours}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {hospital.rating && (
                                                        <div className="bg-green-600 text-white px-3 py-1 font-bold">
                                                            ★ {hospital.rating}
                                                        </div>
                                                    )}
                                                    {hospital.distance && (
                                                        <div className="text-sm text-gray-600 font-semibold">
                                                            📍 {hospital.distance}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Services */}
                                            <div className="mb-4">
                                                <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                                    Available Services
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {hospital.services.map((service, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-blue-50 text-blue-700 px-3 py-1 text-sm font-medium border-2 border-blue-200"
                                                        >
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Get Directions Button */}
                                            <button
                                                onClick={() => openInMaps(hospital)}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 border-2 border-green-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Navigation className="w-5 h-5" />
                                                <span>Get Directions</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border-2 border-gray-200 p-12 text-center">
                                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    No hospitals found in {selectedCity}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Try searching for a different city or use the button below to find hospitals on Google Maps
                                </p>
                                <button
                                    onClick={findMoreHospitals}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 border-2 border-blue-700 transition-colors inline-flex items-center gap-2"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    <span>Search on Google Maps</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!selectedCity && (
                    <div className="bg-white border-2 border-gray-200 p-16 text-center">
                        <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Search for Hospitals
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Enter a city name above or select from popular cities to find nearby hospitals
                        </p>
                        <div className="bg-blue-50 border-2 border-blue-200 p-4 max-w-2xl mx-auto">
                            <p className="text-sm text-blue-900">
                                <strong>💡 Tip:</strong> You can search for hospitals in any city across Andhra Pradesh and Telangana.
                                Click on the hospital to view it on Google Maps and get real-time directions.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
