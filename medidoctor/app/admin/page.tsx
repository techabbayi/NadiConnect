'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiService, AdminStats } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Activity, Users, AlertTriangle, TrendingUp, Search, QrCode, X, User, Phone, Clock, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

export default function AdminPage() {
    const searchParams = useSearchParams();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchToken, setSearchToken] = useState('');
    const [foundAppointment, setFoundAppointment] = useState<{
        id: number;
        patient_name: string;
        patient_phone: string;
        appointment_slot: string;
        status: string;
        injury_type?: string;
        token_number: string;
        created_at: string;
    } | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<{
        id: number;
        patient_name: string;
        patient_phone: string;
        appointment_slot: string;
        status: string;
        injury_type?: string;
        token_number: string;
        created_at: string;
        doctor_name?: string;
        hospital?: string;
    } | null>(null);

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        // Check for token in URL params
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl && stats?.recent_appointments) {
            const found = stats.recent_appointments.find(
                (apt) => apt.token_number.toLowerCase() === tokenFromUrl.toLowerCase()
            );
            if (found) {
                setSearchToken(tokenFromUrl);
                setSelectedAppointment(found);
            }
        }
    }, [searchParams, stats]);

    const loadStats = async () => {
        try {
            const data = await apiService.getAdminStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
            alert('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchToken = (e: React.FormEvent) => {
        e.preventDefault();
        if (!stats?.recent_appointments || !searchToken.trim()) {
            setFoundAppointment(null);
            return;
        }

        const found = stats.recent_appointments.find(
            (apt) => apt.token_number.toLowerCase() === searchToken.trim().toLowerCase()
        );

        if (found) {
            setFoundAppointment(found);
        } else {
            setFoundAppointment(null);
            alert('Token not found');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <LoadingSpinner message="Loading statistics..." />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-red-600">Failed to load statistics</p>
            </div>
        );
    }

    const riskColors: Record<string, string> = {
        LOW: 'bg-green-500',
        MEDIUM: 'bg-yellow-500',
        HIGH: 'bg-red-500',
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </button>
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <p className="text-gray-600">Platform analytics and statistics</p>
                </div>

                {/* QR Token Scanner Section */}
                <div className="bg-white border-2 border-blue-600 shadow-lg mb-8">
                    <div className="border-b-2 border-blue-600 bg-blue-50 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <QrCode className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Token Scanner</h2>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Search for appointments by scanning QR code or entering token number</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSearchToken} className="mb-4">
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchToken}
                                        onChange={(e) => setSearchToken(e.target.value)}
                                        placeholder="Enter token number (e.g., MD1234) or scan QR code..."
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-base"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 border-2 border-blue-700 transition-colors"
                                >
                                    Search
                                </button>
                                {searchToken && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchToken('');
                                            setFoundAppointment(null);
                                        }}
                                        className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3 transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Search Result */}
                        {foundAppointment && (
                            <div className="bg-green-50 border-2 border-green-600 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-green-600 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Appointment Found!</h3>
                                        <p className="text-sm text-gray-600">Token: {foundAppointment.token_number}</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white border-2 border-gray-200 p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Patient Name</p>
                                        <p className="font-bold text-gray-900">{foundAppointment.patient_name}</p>
                                    </div>
                                    <div className="bg-white border-2 border-gray-200 p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                                        <p className="font-bold text-gray-900">{foundAppointment.patient_phone}</p>
                                    </div>
                                    <div className="bg-white border-2 border-gray-200 p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Appointment Time</p>
                                        <p className="font-bold text-gray-900">{foundAppointment.appointment_slot}</p>
                                    </div>
                                    <div className="bg-white border-2 border-gray-200 p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                                        <span className="px-3 py-1 bg-green-600 text-white font-bold uppercase text-sm">
                                            {foundAppointment.status}
                                        </span>
                                    </div>
                                    {foundAppointment.injury_type && (
                                        <div className="bg-white border-2 border-gray-200 p-4">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Injury Type</p>
                                            <p className="font-bold text-gray-900 capitalize">{foundAppointment.injury_type}</p>
                                        </div>
                                    )}
                                    <div className="bg-white border-2 border-gray-200 p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Booked At</p>
                                        <p className="font-bold text-gray-900">{new Date(foundAppointment.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {searchToken && !foundAppointment && (
                            <div className="bg-yellow-50 border-2 border-yellow-500 p-4 text-center">
                                <p className="text-yellow-900 font-semibold">
                                    💡 Tip: When you scan the QR code from the booking confirmation, paste the token number here to find the appointment details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Total Scans */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase">
                                Total Scans
                            </h3>
                            <Activity className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-4xl font-bold text-gray-900">{stats.total_scans}</p>
                    </div>

                    {/* Total Appointments */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase">
                                Total Appointments
                            </h3>
                            <Users className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-4xl font-bold text-gray-900">{stats.total_appointments}</p>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase">
                                Conversion Rate
                            </h3>
                            <AlertTriangle className="w-6 h-6 text-purple-500" />
                        </div>
                        <p className="text-4xl font-bold text-gray-900">
                            {stats.total_scans > 0
                                ? `${Math.round((stats.total_appointments / stats.total_scans) * 100)}%`
                                : '0%'}
                        </p>
                    </div>
                </div>

                {/* Risk Distribution */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Risk Level Distribution
                        </h2>
                        <div className="space-y-3">
                            {Object.entries(stats.risk_distribution).map(([level, count]) => {
                                const total = stats.total_scans || 1;
                                const percentage = ((count / total) * 100).toFixed(1);

                                return (
                                    <div key={level}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-gray-700">{level} Risk</span>
                                            <span className="text-sm text-gray-600">
                                                {count} ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full ${riskColors[level] || 'bg-gray-500'} transition-all`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {Object.keys(stats.risk_distribution).length === 0 && (
                                <p className="text-gray-500 text-center py-4">No data yet</p>
                            )}
                        </div>
                    </div>

                    {/* Injury Type Distribution */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Injury Type Distribution
                        </h2>
                        <div className="space-y-3">
                            {Object.entries(stats.injury_distribution)
                                .sort(([, a], [, b]) => b - a)
                                .map(([type, count]) => {
                                    const total = stats.total_scans || 1;
                                    const percentage = ((count / total) * 100).toFixed(1);

                                    return (
                                        <div key={type}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold text-gray-700 capitalize">
                                                    {type}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {count} ({percentage}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}

                            {Object.keys(stats.injury_distribution).length === 0 && (
                                <p className="text-gray-500 text-center py-4">No data yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Scans & Appointments */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Recent Scans */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Scans</h2>

                        {stats.recent_scans.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {stats.recent_scans.map((scan) => (
                                    <div key={scan.id} className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-gray-900 capitalize">
                                                {scan.injury_type}
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-bold text-white ${riskColors[scan.risk_level] || 'bg-gray-500'}`}
                                            >
                                                {scan.risk_level}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <div>Confidence: {(scan.confidence * 100).toFixed(0)}%</div>
                                            <div>{new Date(scan.timestamp).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No scans yet</p>
                        )}
                    </div>

                    {/* Recent Appointments */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Appointments</h2>

                        {stats.recent_appointments && stats.recent_appointments.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {stats.recent_appointments.map((apt) => (
                                    <div
                                        key={apt.id}
                                        onClick={() => setSelectedAppointment(apt)}
                                        className="border-2 border-green-200 rounded-lg p-3 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-bold text-gray-900">{apt.patient_name}</div>
                                                <div className="text-sm text-blue-600">{apt.token_number}</div>
                                            </div>
                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                                                {apt.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span>{apt.patient_phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{apt.appointment_slot}</span>
                                            </div>
                                            {apt.injury_type && (
                                                <div className="flex items-center gap-2">
                                                    <Activity className="w-3.5 h-3.5" />
                                                    <span className="capitalize">Injury: {apt.injury_type}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>Booked on: {new Date(apt.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No appointments yet</p>
                        )}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>MediDoctor AI Platform - Admin Dashboard</p>
                    <p className="mt-1">Prototype Version 1.0.0</p>
                </div>
            </div>

            {/* Appointment Detail Modal */}
            {selectedAppointment && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedAppointment(null)}
                >
                    <div
                        className="bg-white border-2 border-gray-200 shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-green-600 border-b-2 border-green-700 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Appointment Details</h2>
                                    <p className="text-green-100 text-sm">Token: {selectedAppointment.token_number}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="w-8 h-8 bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Left: QR Code */}
                                <div className="flex flex-col items-center justify-center bg-green-50 border-2 border-green-600 p-4">
                                    <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Scan QR Code</p>
                                    <div className="bg-white p-3 border-2 border-green-600 mb-3">
                                        <QRCodeSVG
                                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/admin?token=${selectedAppointment.token_number}`}
                                            size={120}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    </div>
                                    <div className="bg-white border-2 border-green-600 p-2 w-full mb-2">
                                        <p className="text-2xl font-black text-green-600 text-center">
                                            {selectedAppointment.token_number}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-600 text-center">Scan and paste token in search above</p>
                                </div>

                                {/* Right: Details */}
                                <div className="space-y-3">
                                    {/* Patient Name */}
                                    <div className="bg-gray-50 border-2 border-gray-200 p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-7 h-7 bg-blue-600 flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Patient Name</p>
                                        </div>
                                        <p className="text-base font-bold text-gray-900 pl-9">{selectedAppointment.patient_name}</p>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="bg-gray-50 border-2 border-gray-200 p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-7 h-7 bg-blue-600 flex items-center justify-center">
                                                <Phone className="w-4 h-4 text-white" />
                                            </div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Phone Number</p>
                                        </div>
                                        <p className="text-base font-bold text-gray-900 pl-9">{selectedAppointment.patient_phone}</p>
                                    </div>

                                    {/* Appointment Time */}
                                    <div className="bg-gray-50 border-2 border-gray-200 p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-7 h-7 bg-blue-600 flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-white" />
                                            </div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Appointment Time</p>
                                        </div>
                                        <p className="text-base font-bold text-gray-900 pl-9">{selectedAppointment.appointment_slot}</p>
                                    </div>

                                    {/* Injury Type */}
                                    {selectedAppointment.injury_type && (
                                        <div className="bg-yellow-50 border-2 border-yellow-500 p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-7 h-7 bg-yellow-600 flex items-center justify-center">
                                                    <AlertTriangle className="w-4 h-4 text-white" />
                                                </div>
                                                <p className="text-xs text-gray-700 uppercase tracking-wide font-bold">Injury Type</p>
                                            </div>
                                            <p className="text-base font-bold text-gray-900 capitalize pl-9">{selectedAppointment.injury_type}</p>
                                        </div>
                                    )}

                                    {/* Status */}
                                    <div className="bg-green-50 border-2 border-green-600 p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-7 h-7 bg-green-600 flex items-center justify-center">
                                                <Activity className="w-4 h-4 text-white" />
                                            </div>
                                            <p className="text-xs text-gray-700 uppercase tracking-wide font-bold">Status</p>
                                        </div>
                                        <p className="text-base font-bold text-green-600 uppercase pl-9">{selectedAppointment.status}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Metadata */}
                            <div className="mt-4 bg-blue-50 border-2 border-blue-200 p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <p className="text-xs text-blue-900 uppercase tracking-wide font-bold">Booking Information</p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600">Doctor:</p>
                                            <p className="font-bold text-gray-900">
                                                {selectedAppointment.doctor_name && selectedAppointment.doctor_name !== 'Unknown'
                                                    ? selectedAppointment.doctor_name
                                                    : 'Not Available'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Booked On:</p>
                                            <p className="font-bold text-gray-900">{new Date(selectedAppointment.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Hospital:</p>
                                        <p className="font-bold text-gray-900">
                                            {selectedAppointment.hospital && selectedAppointment.hospital !== 'Unknown'
                                                ? selectedAppointment.hospital
                                                : 'Not Available'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={() => setSelectedAppointment(null)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 border-2 border-blue-700 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-semibold py-3 px-6 transition-colors"
                                >
                                    Print Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
