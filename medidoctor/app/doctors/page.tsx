'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import { apiService, Doctor } from '@/services/api';
import { MapPin, Star, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DoctorsPage() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [injuryContext, setInjuryContext] = useState<{ injury_type: string; risk_level: string } | null>(null);
    const [reminder, setReminder] = useState({ active: false, time: '' });

    useEffect(() => {
        const savedReminder = localStorage.getItem('medidoctor_reminder');
        if (savedReminder) {
            setReminder(JSON.parse(savedReminder));
        }
    }, []);

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            // Get injury context from session
            const contextStr = sessionStorage.getItem('injuryContext');
            let context = null;

            if (contextStr) {
                context = JSON.parse(contextStr);
                setInjuryContext(context);
            }

            // Fetch doctors
            const doctorList = await apiService.getDoctors(
                context?.injury_type,
                context?.risk_level
            );

            setDoctors(doctorList);
        } catch (error) {
            console.error('Failed to load doctors:', error);
            alert('Failed to load doctors. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectDoctor = (doctor: Doctor) => {
        // Store selected doctor
        sessionStorage.setItem('selectedDoctor', JSON.stringify(doctor));
        router.push('/booking');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <LoadingSpinner message="Finding nearby doctors..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar reminderActive={reminder.active} reminderTime={reminder.time} />

            {/* Header */}
            <div className="bg-white border-b-2 border-gray-200">
                <div className="container mx-auto px-4 py-4 max-w-6xl">
                    <Link href="/results">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-3">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Results</span>
                        </button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Recommended Doctors</h1>
                    {injuryContext && (
                        <p className="text-sm text-gray-600 mt-1">
                            Specialists for <strong>{injuryContext.injury_type}</strong> ({injuryContext.risk_level} risk)
                        </p>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">

                {/* Doctor Cards */}
                <div className="space-y-4">
                    {doctors.map((doctor) => (
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
                                            </div>
                                        </div>

                                        {/* Available Slots */}
                                        <div className="mt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-bold text-gray-900">
                                                    Available Slots:
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {doctor.available_slots.slice(0, 3).map((slot, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-green-50 border border-green-400 text-green-700 text-xs font-medium"
                                                    >
                                                        {slot}
                                                    </span>
                                                ))}
                                                {doctor.available_slots.length > 3 && (
                                                    <span className="px-3 py-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs font-medium">
                                                        +{doctor.available_slots.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:w-40">
                                        <button
                                            onClick={() => handleSelectDoctor(doctor)}
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

                {doctors.length === 0 && (
                    <div className="text-center py-12 bg-white border-2 border-gray-200">
                        <p className="text-gray-600 text-lg">No doctors found. Please try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
