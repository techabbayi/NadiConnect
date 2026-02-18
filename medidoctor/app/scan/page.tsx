'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CameraCapture from '@/components/CameraCapture';
import LoadingSpinner from '@/components/LoadingSpinner';
import Disclaimer from '@/components/Disclaimer';
import Navbar from '@/components/Navbar';
import { apiService } from '@/services/api';
import { ArrowLeft, Camera, Info, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ScanPage() {
    const router = useRouter();
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [reminder, setReminder] = useState({ active: false, time: '' });

    useEffect(() => {
        const savedReminder = localStorage.getItem('medidoctor_reminder');
        if (savedReminder) {
            setReminder(JSON.parse(savedReminder));
        }
    }, []);

    const handleCapture = (file: File) => {
        setCapturedFile(file);
    };

    const handleScan = async () => {
        if (!capturedFile) return;

        setIsScanning(true);

        try {
            const result = await apiService.scanInjury(capturedFile);
            sessionStorage.setItem('scanResult', JSON.stringify(result));
            router.push('/results');
        } catch (error) {
            console.error('Scan failed:', error);
            alert('Scan failed. Please try again.');
            setIsScanning(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar reminderActive={reminder.active} reminderTime={reminder.time} />

            {/* Header */}
            <div className="bg-white border-b-2 border-gray-200">
                <div className="container mx-auto px-4 py-4 max-w-4xl">
                    <Link href="/">
                        <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors mb-3 font-medium">
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Injury Scan
                            </h1>
                            <p className="text-sm text-gray-600">
                                Upload injury photograph for AI analysis
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Disclaimer */}
                <Disclaimer className="mb-6" />

                {/* AMD ROCm Notice */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 shadow-sm mb-6">
                    <div className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                AMD
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-gray-900 text-sm mb-1">🚀 Future: AMD ROCm-Powered AI Models</div>
                                <div className="text-xs text-gray-700">
                                    <strong>Current:</strong> Rule-based prototype for demonstration | <strong>Planned:</strong> Real deep learning models powered by AMD ROCm platform and Instinct GPUs for production-grade injury detection with 40% lower costs
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Scan Area */}
                <div className="bg-white border-2 border-gray-200 shadow-md mb-6">
                    <div className="border-b-2 border-gray-200 px-6 py-4">
                        <h2 className="font-bold text-gray-900">Upload Injury Image</h2>
                        <p className="text-sm text-gray-600 mt-1">Capture or select a clear photograph of the affected area</p>
                    </div>
                    <div className="p-6">
                        {isScanning ? (
                            <div className="py-12">
                                <LoadingSpinner message="Analyzing injury with AI..." />
                            </div>
                        ) : (
                            <CameraCapture onCapture={handleCapture} />
                        )}
                    </div>
                </div>

                {/* Analyze Button */}
                {capturedFile && !isScanning && (
                    <button
                        onClick={handleScan}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 border-2 border-blue-700 shadow-sm transition-colors mb-4"
                    >
                        Analyze with AI
                    </button>
                )}

                {/* Alternative: Health Assessment */}
                <div className="bg-green-50 border-2 border-green-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Activity className="w-6 h-6 text-green-600" />
                        <h3 className="font-bold text-gray-900">Don&apos;t have an image?</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                        Get AI-powered health analysis by answering questions or using voice input
                    </p>
                    <Link href="/health-assessment">
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 border-2 border-green-700 shadow-sm transition-colors flex items-center justify-center gap-2">
                            <Activity className="w-5 h-5" />
                            <span>Know Your Health - Voice & Questions</span>
                        </button>
                    </Link>
                </div>

                {/* Image Guidelines */}
                <div className="bg-white border-2 border-gray-200 shadow-sm">
                    <div className="border-b-2 border-gray-200 px-6 py-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-gray-900">Image Guidelines</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Required</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold">✓</span>
                                        <span>Well-lit, clear image</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold">✓</span>
                                        <span>Focused injury area</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold">✓</span>
                                        <span>Appropriate distance (10-30cm)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold">✓</span>
                                        <span>Stable, non-blurry capture</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Avoid</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-600 font-bold">✗</span>
                                        <span>Dark or shadowy images</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-600 font-bold">✗</span>
                                        <span>Blurry or out-of-focus shots</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-600 font-bold">✗</span>
                                        <span>Too close or too far angles</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-600 font-bold">✗</span>
                                        <span>Covered or obscured injuries</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
