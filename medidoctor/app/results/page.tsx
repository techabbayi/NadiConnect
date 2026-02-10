'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RiskBadge from '@/components/RiskBadge';
import ConfidenceMeter from '@/components/ConfidenceMeter';
import Disclaimer from '@/components/Disclaimer';
import Toast from '@/components/Toast';
import Navbar from '@/components/Navbar';
import { ScanResult } from '@/services/api';
import { capitalizeFirst } from '@/lib/utils';
import { ArrowRight, Phone, MapPin, Download, Hospital, Share2, Bell, Activity, Navigation } from 'lucide-react';

interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface HospitalData {
    name: string;
    type: string;
    city: string;
    distance: string;
    time: string;
}

interface ReminderState {
    active: boolean;
    time: string;
}

export default function ResultsPage() {
    const router = useRouter();
    const [result, setResult] = useState<ScanResult | null>(null);
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
    const [hospitals, setHospitals] = useState<HospitalData[]>([]);
    const [reminder, setReminder] = useState<ReminderState>({ active: false, time: '' });

    useEffect(() => {
        // Get result from sessionStorage
        const storedResult = sessionStorage.getItem('scanResult');
        if (storedResult) {
            setResult(JSON.parse(storedResult));
        } else {
            // No result found, redirect to scan page
            router.push('/scan');
        }

        // Generate random hospitals from a single city
        const cities = ['Chittoor', 'Hyderabad', 'Tirupati'];
        const selectedCity = cities[Math.floor(Math.random() * cities.length)];
        const hospitalNames = [
            { name: 'Apollo Hospitals', type: 'Multi-Specialty Hospital' },
            { name: 'KIMS Hospital', type: 'Super Specialty Hospital' },
            { name: 'Yashoda Hospitals', type: 'Multi-Specialty Hospital' },
            { name: 'Care Hospitals', type: 'Emergency & Trauma Center' },
            { name: 'Medicover Hospitals', type: 'Multi-Specialty Hospital' },
            { name: 'Rainbow Hospitals', type: 'Children & Multi-Specialty' },
        ];

        const generatedHospitals = hospitalNames.slice(0, 4).map((hospital) => ({
            ...hospital,
            city: selectedCity,
            distance: `${(Math.random() * 8 + 1).toFixed(1)} km`,
            time: `${Math.floor(Math.random() * 20 + 5)} min`
        }));

        setHospitals(generatedHospitals);

        // Load reminder from localStorage
        const savedReminder = localStorage.getItem('medidoctor_reminder');
        if (savedReminder) {
            setReminder(JSON.parse(savedReminder));
        }
    }, [router]);

    const setReminderAndSave = (hours: number) => {
        const reminderTime = `Check wound in ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        const newReminder = { active: true, time: reminderTime };
        setReminder(newReminder);
        localStorage.setItem('medidoctor_reminder', JSON.stringify(newReminder));
        showToast(`Reminder set for ${hours} hours`, 'success');
        setShowFollowUp(false);
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ show: true, message, type });
    };

    const handleEmergencyCall = () => {
        if (confirm('Call emergency ambulance service?')) {
            window.location.href = 'tel:108';
        }
    };

    const handleShareLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const locationUrl = `https://maps.google.com/?q=${lat},${lng}`;
                    const message = `🚨 Emergency! I need medical help. My location: ${locationUrl}`;

                    if (navigator.share) {
                        try {
                            await navigator.share({
                                title: 'Emergency Location',
                                text: `🚨 Emergency! I need medical help.`,
                                url: locationUrl
                            });
                            showToast('Location shared successfully!', 'success');
                        } catch (error: any) {
                            if (error.name === 'AbortError') {
                                // User cancelled the share
                                showToast('Share cancelled', 'info');
                            } else {
                                // Share failed, copy to clipboard instead
                                await navigator.clipboard.writeText(message);
                                showToast('Location copied to clipboard!', 'success');
                            }
                        }
                    } else {
                        await navigator.clipboard.writeText(message);
                        showToast('Location copied to clipboard!', 'success');
                    }
                },
                () => {
                    showToast('Unable to access location', 'error');
                }
            );
        } else {
            showToast('Geolocation not supported', 'error');
        }
    };

    const handleDownloadPDF = () => {
        if (!result) return;

        // Mock PDF generation (in real app, use jsPDF or backend API)
        const reportText = `
======================
MEDIDOCTOR AI REPORT
======================

Scan ID: ${result.scan_id}
Date: ${new Date(result.timestamp).toLocaleString()}

INJURY DETECTED: ${result.injury_type.toUpperCase()}
Confidence: ${(result.confidence * 100).toFixed(0)}%
Risk Level: ${result.risk_level}

VISUAL INDICATORS:
${result.visual_indicators?.map((ind, i) => `${i + 1}. ${ind}`).join('\n') || 'N/A'}

RISK FACTORS:
${result.risk_factors?.map((f, i) => `${i + 1}. ${f}`).join('\n') || result.risk_reason}

FIRST AID GUIDANCE:
${result.guidance.first_aid_steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

WARNINGS:
${result.guidance.warnings.map((w, i) => `${i + 1}. ${w}`).join('\n')}

DISCLAIMER:
${result.disclaimer}

======================
        `;

        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MediDoctor_Report_${result.scan_id}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('Report downloaded successfully!', 'success');
    };

    const handleViewNearbyHospitals = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const mapsUrl = `https://www.google.com/maps/search/hospitals/@${lat},${lng},14z`;
                    window.open(mapsUrl, '_blank');
                    showToast('Opening hospitals in Google Maps', 'info');
                },
                () => {
                    window.open('https://www.google.com/maps/search/hospitals/', '_blank');
                    showToast('Opening hospitals map', 'info');
                }
            );
        } else {
            window.open('https://www.google.com/maps/search/hospitals/', '_blank');
            showToast('Opening hospitals map', 'info');
        }
    };

    const handleOpenHospitalOnMap = (hospital: HospitalData) => {
        const searchQuery = `${hospital.name} ${hospital.city}`;
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
        window.open(mapsUrl, '_blank');
        showToast(`Opening ${hospital.name} on map`, 'info');
    };

    if (!result) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-600">Loading results...</p>
            </div>
        );
    }

    const handleFindDoctors = () => {
        // Store for doctors page
        sessionStorage.setItem('injuryContext', JSON.stringify({
            injury_type: result.injury_type,
            risk_level: result.risk_level
        }));
        router.push('/doctors');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar with SOS and Reminder */}
            <Navbar reminderActive={reminder.active} reminderTime={reminder.time} />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Page Title */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
                        <p className="text-sm text-gray-600">AI-Generated Injury Assessment</p>
                    </div>
                </div>
                {/* Risk Badge */}
                <div className="mb-6">
                    <RiskBadge riskLevel={result.risk_level} className="w-full justify-center" />
                </div>

                {/* Emergency SOS Section */}
                {result.risk_level === 'HIGH' && (
                    <div className="bg-white border-l-4 border-red-600 shadow-md mb-6">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                                Emergency Actions Required
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <button
                                    onClick={handleEmergencyCall}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 transition-colors flex items-center justify-center gap-3 border-2 border-red-700"
                                >
                                    <Phone className="w-5 h-5" />
                                    Call Ambulance (108)
                                </button>
                                <button
                                    onClick={handleShareLocation}
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 transition-colors flex items-center justify-center gap-3 border-2 border-orange-700"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Share Location
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <button
                        onClick={() => {
                            setShowFollowUp(false);
                            handleDownloadPDF();
                        }}
                        className="bg-white border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold py-4 px-4 transition-colors flex flex-col items-center gap-2 shadow-sm"
                    >
                        <Download className="w-6 h-6" />
                        <span className="text-xs">Download Report</span>
                    </button>
                    <button
                        onClick={() => {
                            setShowFollowUp(false);
                            handleViewNearbyHospitals();
                        }}
                        className="bg-white border-2 border-gray-300 hover:border-green-600 text-gray-700 hover:text-green-600 font-semibold py-4 px-4 transition-colors flex flex-col items-center gap-2 shadow-sm"
                    >
                        <Hospital className="w-6 h-6" />
                        <span className="text-xs">Hospitals</span>
                    </button>
                    <button
                        onClick={() => {
                            setShowFollowUp(false);
                            handleShareLocation();
                        }}
                        className="bg-white border-2 border-gray-300 hover:border-purple-600 text-gray-700 hover:text-purple-600 font-semibold py-4 px-4 transition-colors flex flex-col items-center gap-2 shadow-sm"
                    >
                        <MapPin className="w-6 h-6" />
                        <span className="text-xs">Location</span>
                    </button>
                    <button
                        onClick={() => {
                            setShowFollowUp(!showFollowUp);
                            if (!showFollowUp) {
                                showToast('Reminder options opened', 'info');
                            }
                        }}
                        className="bg-white border-2 border-gray-300 hover:border-yellow-600 text-gray-700 hover:text-yellow-600 font-semibold py-4 px-4 transition-colors flex flex-col items-center gap-2 shadow-sm"
                    >
                        <Bell className="w-6 h-6" />
                        <span className="text-xs">Reminder</span>
                    </button>
                </div>

                {/* Follow-up Alert Section */}
                {showFollowUp && (
                    <div className="bg-white border-2 border-yellow-500 shadow-sm mb-6">
                        <div className="p-6">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-yellow-600" />
                                Follow-up Reminder Settings
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Set a reminder to monitor wound progress:
                            </p>
                            <div className="grid md:grid-cols-2 gap-3">
                                <button
                                    onClick={() => setReminderAndSave(6)}
                                    className="bg-white border-2 border-yellow-400 hover:bg-yellow-50 text-gray-900 font-medium py-3 transition-colors"
                                >
                                    Remind in 6 hours
                                </button>
                                <button
                                    onClick={() => setReminderAndSave(24)}
                                    className="bg-white border-2 border-yellow-400 hover:bg-yellow-50 text-gray-900 font-medium py-3 transition-colors"
                                >
                                    Remind in 24 hours
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Demo mode: Production would send SMS/WhatsApp notifications
                            </p>
                        </div>
                    </div>
                )}

                {/* Hospitals Section */}
                <div className="bg-white border-2 border-gray-200 shadow-md mb-6">
                    <div className="border-b-2 border-gray-200 px-6 py-4 flex items-center gap-3">
                        <Hospital className="w-6 h-6 text-green-600" />
                        <h2 className="font-bold text-gray-900">Hospitals Near You</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4 mb-6">
                            {hospitals.map((hospital, index) => (
                                <div key={index} className="border-2 border-gray-200 hover:border-green-600 transition-colors">
                                    <div className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 mb-1">{hospital.name}</p>
                                                <p className="text-xs text-gray-600 mb-1">{hospital.type}</p>
                                                <p className="text-xs text-blue-600 font-medium">{hospital.city}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-bold text-blue-600">{hospital.distance}</p>
                                                    <p className="text-xs text-gray-500">~{hospital.time}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleOpenHospitalOnMap(hospital)}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 border-2 border-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    <Navigation className="w-4 h-4" />
                                                    Get Direction
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleViewNearbyHospitals}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 border-2 border-green-700 transition-colors flex items-center justify-center gap-3"
                        >
                            <MapPin className="w-5 h-5" />
                            View All Hospitals on Google Maps
                        </button>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                            Demo: Uses actual GPS for real hospital locations
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Injury Type */}
                        <div className="bg-white border-2 border-gray-200 shadow-sm">
                            <div className="border-b-2 border-gray-200 px-6 py-3">
                                <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">Detected Injury</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-2xl font-bold text-gray-900">
                                    {result.injury_type === 'cut' ? 'Open Cut / Laceration' : capitalizeFirst(result.injury_type)}
                                </p>
                            </div>
                        </div>

                        {/* Visual Indicators */}
                        {result.visual_indicators && result.visual_indicators.length > 0 && (
                            <div className="bg-white border-2 border-gray-200 shadow-sm">
                                <div className="border-b-2 border-gray-200 px-6 py-3">
                                    <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">Visual Indicators</h3>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3">
                                        {result.visual_indicators.map((indicator, index) => (
                                            <li key={index} className="flex items-start gap-3 text-sm">
                                                <span className="w-6 h-6 bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs border border-blue-300">
                                                    {index + 1}
                                                </span>
                                                <span className="text-gray-700 leading-relaxed">{indicator}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Confidence Score */}
                        <div className="bg-white border-2 border-gray-200 shadow-sm">
                            <div className="p-6">
                                <ConfidenceMeter confidence={result.confidence} riskLevel={result.risk_level} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Risk Classification */}
                        <div className="bg-white border-2 border-gray-200 shadow-sm">
                            <div className="border-b-2 border-gray-200 px-6 py-3">
                                <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">Risk Assessment</h3>
                            </div>
                            <div className="p-6">
                                {result.risk_factors && result.risk_factors.length > 0 ? (
                                    <ul className="space-y-2">
                                        {result.risk_factors.map((factor, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm">
                                                <span className="text-red-600 mt-1">●</span>
                                                <span className="text-gray-700">{factor}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-700">{result.risk_reason}</p>
                                )}
                            </div>
                        </div>

                        {/* First Aid */}
                        <div className="bg-white border-2 border-gray-200 shadow-sm">
                            <div className="border-b-2 border-gray-200 px-6 py-3">
                                <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">First-Aid Steps</h3>
                            </div>
                            <div className="p-6">
                                <ol className="space-y-3">
                                    {result.guidance.first_aid_steps.map((step, index) => (
                                        <li key={index} className="flex gap-3 text-sm">
                                            <span className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-700 leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        {/* Warnings */}
                        <div className="bg-white border-2 border-red-300 shadow-sm">
                            <div className="border-b-2 border-red-300 px-6 py-3 bg-red-50">
                                <h3 className="font-bold text-red-900 uppercase tracking-wide text-sm">Warning Signs</h3>
                            </div>
                            <div className="p-6 bg-red-50">
                                <ul className="space-y-2">
                                    {result.guidance.warnings.map((warning, index) => (
                                        <li key={index} className="flex gap-2 text-sm">
                                            <span className="text-red-600 font-bold">!</span>
                                            <span className="text-red-900">{warning}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Disclaimer */}
                <Disclaimer className="mb-6" />

                {/* Action Buttons */}
                <div className="grid md:grid-cols-2 gap-4">
                    <button
                        onClick={handleFindDoctors}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 border-2 border-blue-700 transition-colors flex items-center justify-center gap-3"
                    >
                        <span>Find Doctors & Book Appointment</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => router.push('/scan')}
                        className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 transition-colors"
                    >
                        Scan Another Injury
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    );
}
