'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, Doctor, BookingRequest } from '@/services/api';
import { ArrowLeft, CheckCircle, User, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import { QRCodeSVG } from 'qrcode.react';

export default function BookingPage() {
    const router = useRouter();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [tokenNumber, setTokenNumber] = useState('');
    const [reminder, setReminder] = useState({ active: false, time: '' });

    useEffect(() => {
        const savedReminder = localStorage.getItem('medidoctor_reminder');
        if (savedReminder) {
            setReminder(JSON.parse(savedReminder));
        }
    }, []);

    useEffect(() => {
        // Get selected doctor from session
        const doctorStr = sessionStorage.getItem('selectedDoctor');
        if (doctorStr) {
            setDoctor(JSON.parse(doctorStr));
        } else {
            router.push('/doctors');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!doctor || !selectedSlot || !patientName || !patientPhone) {
            alert('Please fill in all fields');
            return;
        }

        setIsBooking(true);

        try {
            const injuryContext = sessionStorage.getItem('injuryContext');
            const injury_type = injuryContext ? JSON.parse(injuryContext).injury_type : undefined;

            const bookingRequest: BookingRequest = {
                doctor_id: doctor.id,
                patient_name: patientName,
                patient_phone: patientPhone,
                appointment_slot: selectedSlot,
                injury_type,
            };

            const response = await apiService.bookAppointment(bookingRequest);
            setTokenNumber(response.token_number);
            setBookingComplete(true);
        } catch (error) {
            console.error('Booking failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Booking failed. Please try again.';
            alert(errorMessage);
        } finally {
            setIsBooking(false);
        }
    };

    if (!doctor) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <LoadingSpinner message="Loading..." />
            </div>
        );
    }

    if (bookingComplete) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar reminderActive={reminder.active} reminderTime={reminder.time} />

                <div className="container mx-auto px-4 py-6 max-w-5xl">
                    {/* Compact Success Header */}
                    <div className="bg-green-600 border-2 border-green-700 p-4 mb-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-white flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Booking Confirmed!</h1>
                            <p className="text-green-100 text-sm">Your appointment has been scheduled</p>
                        </div>
                    </div>

                    {/* Main Compact Card */}
                    <div className="bg-white border-2 border-gray-200 shadow-lg">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Left: QR Code & Token */}
                            <div className="border-r-2 border-gray-200 p-6 bg-green-50">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Scan QR Code</p>

                                    {/* QR Code */}
                                    <div className="bg-white p-4 border-2 border-green-600 mb-4">
                                        <QRCodeSVG
                                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/admin?token=${tokenNumber}`}
                                            size={180}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    </div>

                                    {/* Token Number */}
                                    <div className="bg-white border-2 border-green-600 p-4 w-full mb-2">
                                        <p className="text-xs text-gray-600 text-center mb-1">Token Number</p>
                                        <p className="text-4xl font-black text-green-600 text-center">{tokenNumber}</p>
                                    </div>
                                    <p className="text-xs text-gray-600 text-center">Show this at hospital reception</p>
                                    <p className="text-xs text-blue-600 font-semibold text-center mt-2">💡 Scan to view in Admin Dashboard</p>
                                </div>
                            </div>

                            {/* Right: Booking Details */}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gray-200">Appointment Details</h2>

                                <div className="space-y-4">
                                    {/* Patient Name */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-600 flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Patient Name</p>
                                            <p className="font-bold text-gray-900">{patientName}</p>
                                        </div>
                                    </div>

                                    {/* Doctor */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-600 flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Doctor</p>
                                            <p className="font-bold text-gray-900">{doctor.name}</p>
                                            <p className="text-sm text-blue-600">{doctor.specialization}</p>
                                        </div>
                                    </div>

                                    {/* Time Slot */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-600 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Appointment Time</p>
                                            <p className="font-bold text-gray-900">{selectedSlot}</p>
                                        </div>
                                    </div>

                                    {/* Hospital */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-600 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Hospital</p>
                                            <p className="font-bold text-gray-900">{doctor.hospital}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Demo Notice - Compact */}
                                <div className="mt-6 bg-yellow-50 border-2 border-yellow-500 p-3">
                                    <p className="text-xs text-yellow-900">
                                        <span className="font-bold">DEMO:</span> This is a prototype. No real appointment created.
                                    </p>
                                </div>

                                {/* Action Buttons - Compact */}
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => router.push('/')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border-2 border-blue-700 transition-colors text-sm"
                                    >
                                        Home
                                    </button>
                                    <button
                                        onClick={() => router.push('/scan')}
                                        className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-semibold py-2 px-4 transition-colors text-sm"
                                    >
                                        New Scan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar reminderActive={reminder.active} reminderTime={reminder.time} />

            {/* Header */}
            <div className="bg-white border-b-2 border-gray-200">
                <div className="container mx-auto px-4 py-4 max-w-3xl">
                    <Link href="/doctors">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-3">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Doctors</span>
                        </button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Complete the form to confirm your appointment
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Doctor Info Card */}
                <div className="bg-white border-2 border-blue-600 shadow-sm p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-blue-600 font-semibold mb-2">{doctor.specialization}</p>
                    <p className="text-sm text-gray-600">{doctor.hospital}</p>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 shadow-md">
                    <div className="border-b-2 border-gray-200 px-8 py-4">
                        <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
                    </div>
                    <div className="p-8 space-y-6">
                        {/* Patient Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-base transition-colors"
                                placeholder="e.g., Rahul Kumar"
                                required
                            />
                        </div>

                        {/* Patient Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                value={patientPhone}
                                onChange={(e) => setPatientPhone(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-base transition-colors"
                                placeholder="e.g., +91 98765 43210"
                                required
                            />
                        </div>

                        {/* Time Slot Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                                Select Time Slot *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {doctor.available_slots.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-3 px-4 border-2 font-semibold transition-all ${selectedSlot === slot
                                            ? 'bg-blue-600 text-white border-blue-700'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isBooking}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 border-2 border-green-700 disabled:border-gray-500 transition-colors"
                        >
                            {isBooking ? 'Booking...' : 'Confirm Appointment'}
                        </button>
                    </div>
                </form>

                {/* Demo Notice */}
                <div className="mt-6 bg-yellow-50 border-2 border-yellow-500 p-4">
                    <p className="font-bold text-yellow-900 mb-1">Demo Notice:</p>
                    <p className="text-sm text-yellow-800">
                        This is a prototype booking system. No real appointments will be created.
                    </p>
                </div>
            </div>
        </div>
    );
}
