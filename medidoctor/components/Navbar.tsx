'use client';

import { useState } from 'react';
import { Phone, Bell, Activity, Stethoscope, MapPin } from 'lucide-react';
import Link from 'next/link';
import SOSModal from './SOSModal';

interface NavbarProps {
    reminderActive?: boolean;
    reminderTime?: string;
}

export default function Navbar({ reminderActive = false, reminderTime }: NavbarProps) {
    const [showSOSModal, setShowSOSModal] = useState(false);

    return (
        <>
            <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">MediDoctor AI</h1>
                                <p className="text-xs text-gray-600">Visual Triage Platform</p>
                            </div>
                        </Link>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-3">
                            {/* Doctors Link */}
                            <Link
                                href="/all-doctors"
                                className="hidden md:flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-4 py-2 transition-colors"
                            >
                                <Stethoscope className="w-4 h-4" />
                                <span>Doctors</span>
                            </Link>

                            {/* Find Hospitals Link */}
                            <Link
                                href="/find-hospitals"
                                className="hidden md:flex items-center gap-2 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold px-4 py-2 transition-colors"
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Hospitals</span>
                            </Link>

                            {/* Reminder Notification */}
                            {reminderActive && (
                                <div className="bg-yellow-50 border-2 border-yellow-500 px-4 py-2 flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-yellow-600" />
                                    <div className="text-xs">
                                        <p className="font-bold text-yellow-900">Reminder Set</p>
                                        <p className="text-yellow-700">{reminderTime}</p>
                                    </div>
                                </div>
                            )}

                            {/* SOS Button */}
                            <button
                                onClick={() => setShowSOSModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 border-2 border-red-700 transition-colors flex items-center gap-2"
                            >
                                <Phone className="w-5 h-5" />
                                <span className="hidden sm:inline">SOS</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* SOS Modal */}
            {showSOSModal && <SOSModal onClose={() => setShowSOSModal(false)} />}
        </>
    );
}
