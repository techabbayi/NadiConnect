'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RiskBadge from '@/components/RiskBadge';
import ConfidenceMeter from '@/components/ConfidenceMeter';
import Disclaimer from '@/components/Disclaimer';
import { ScanResult } from '@/services/api';
import { capitalizeFirst } from '@/lib/utils';
import { ArrowRight, Phone, MapPin, Download, Hospital, Share2, Bell, FileText, Activity } from 'lucide-react';

export default function ResultsPage() {
    const router = useRouter();
    const [result, setResult] = useState<ScanResult | null>(null);
    const [showFollowUp, setShowFollowUp] = useState(false);

    useEffect(() => {
        const storedResult = sessionStorage.getItem('scanResult');
        if (storedResult) {
            setResult(JSON.parse(storedResult));
        } else {
            router.push('/scan');
        }
    }, [router]);

    const handleEmergencyCall = () => {
        if (confirm('Call emergency ambulance service?')) {
            window.location.href = 'tel:108';
        }
    };

    const handleShareLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const message = `Emergency! Medical help needed. Location: https://maps.google.com/?q=${lat},${lng}`;

                if (navigator.share) {
                    navigator.share({ title: 'Emergency Location', text: message });
                } else {
                    alert(`Location: ${lat}, ${lng}\n\nShare this with emergency contact!`);
                }
            });
        } else {
            alert('Geolocation not supported on this device');
        }
    };

    const handleDownloadPDF = () => {
        if (!result) return;

        const reportText = `
MediDoctor AI - Medical Report
==============================

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
        `;

        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MediDoctor_Report_${result.scan_id}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        alert('Report downloaded successfully');
    };

    const handleViewNearbyHospitals = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                window.open(`https://www.google.com/maps/search/hospitals/@${lat},${lng},14z`, '_blank');
            });
        } else {
            window.open('https://www.google.com/maps/search/hospitals/', '_blank');
        }
    };

    const handleFindDoctors = () => {
        sessionStorage.setItem('injuryContext', JSON.stringify({
            injury_type: result?.injury_type,
            risk_level: result?.risk_level
        }));
        router.push('/doctors');
    };

    if (!result) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Loading results...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b-2 border-gray-200">
                <div className="container mx-auto px-4 py-4 max-w-6xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
                            <p className="text-sm text-gray-600">AI-Generated Injury Assessment</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Risk Status Bar */}
                <div className="mb-6">
                    <RiskBadge riskLevel={result.risk_level} className="w-full justify-center" />
                </div>

                {/* Emergency Actions */}
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

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-white border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold py-4 px-4 transition-colors flex flex-col items-center gap-2 shadow-sm"
                    >
                        <Download className="w-6 h-6" />
                        <span className="text-xs">Download Report</span>
                    </button>
                    <button
                        onClick={handleViewNearbyHospitals}
                        className="bg-white border-2 border-gray-300 hover:border-green-600 text-gray-700 hover:text-green-600 font-semibold py-4 px-4 transition-colors flex flex-col items-center gap-2 shadow-sm"
                    >
                        <Hospital className="w-6 h-6" />
                        <span className="text-xs">Hospitals</span>
                    </button>
                    <button
                        onClick={handleShareLocation}
                        className="bg-white border-2 border-gray-300 hover:border-purple-600 text-gray-700 hover:text-purple-600 font-semibold py-4 px-4 transition-colors flex flex-col items-center gap-2 shadow-sm"
                    >
                        <MapPin className="w-6 h-6" />
                        <span className="text-xs">Location</span>
                    </button>
                    <button
                        onClick={() => setShowFollowUp(!showFollowUp)}
                        className="bg-white border-2 border-gray-300 hover:border-yellow-600 text-gray-700 hover:text-yellow-600 font-semibold py-4 px-4 transition-colors flex flex-col items-center gap-2 shadow-sm"
                    >
                        <Bell className="w-6 h-6" />
                        <span className="text-xs">Reminder</span>
                    </button>
                </div>

                {/* Follow-up Reminder */}
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
                                <button className="bg-white border-2 border-yellow-400 hover:bg-yellow-50 text-gray-900 font-medium py-3 transition-colors">
                                    Remind in 6 hours
                                </button>
                                <button className="bg-white border-2 border-yellow-400 hover:bg-yellow-50 text-gray-900 font-medium py-3 transition-colors">
                                    Remind in 24 hours
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Demo mode: Production would send SMS/WhatsApp notifications
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Left Column: Injury Details */}
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
                                                <span className="w-6 h-6 bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs border border-blue-300">
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

                    {/* Right Column: Risk & Guidance */}
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
                                            <span className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
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

                {/* Hospital Map */}
                <div className="bg-white border-2 border-gray-200 shadow-md mb-6">
                    <div className="border-b-2 border-gray-200 px-6 py-4 flex items-center gap-3">
                        <Hospital className="w-6 h-6 text-green-600" />
                        <h2 className="font-bold text-gray-900">Nearby Medical Facilities</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center p-4 border-2 border-gray-200 hover:border-green-600 transition-colors">
                                <div>
                                    <p className="font-bold text-gray-900">City General Hospital</p>
                                    <p className="text-xs text-gray-600">Emergency & Trauma Center</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-600">2.3 km</p>
                                    <p className="text-xs text-gray-500">~8 min</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border-2 border-gray-200 hover:border-green-600 transition-colors">
                                <div>
                                    <p className="font-bold text-gray-900">Apollo Clinic</p>
                                    <p className="text-xs text-gray-600">Multispecialty Clinic</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-600">3.7 km</p>
                                    <p className="text-xs text-gray-500">~12 min</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleViewNearbyHospitals}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 border-2 border-green-700 transition-colors flex items-center justify-center gap-3"
                        >
                            <MapPin className="w-5 h-5" />
                            View on Google Maps
                        </button>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                            Demo: Uses actual GPS for real hospital locations
                        </p>
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
        </div>
    );
}
