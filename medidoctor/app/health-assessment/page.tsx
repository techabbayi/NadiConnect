'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Disclaimer from '@/components/Disclaimer';
import VoiceRecorder from '@/components/VoiceRecorder';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiService, HealthAssessmentResponse, Doctor } from '@/services/api';
import { ArrowLeft, MessageSquare, Mic, CheckCircle, AlertTriangle, Activity, Phone, MapPin, Download, Hospital, Navigation, Bell } from 'lucide-react';
import Link from 'next/link';

type InputMode = 'questions' | 'voice';

export default function HealthAssessmentPage() {
    const router = useRouter();
    const [reminder, setReminder] = useState({ active: false, time: '' });
    const [inputMode, setInputMode] = useState<InputMode>('questions');
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<HealthAssessmentResponse | null>(null);
    const [voiceFile, setVoiceFile] = useState<File | null>(null);
    const [nearbyDoctors, setNearbyDoctors] = useState<Doctor[]>([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);

    // Questionnaire responses
    const [responses, setResponses] = useState({
        pain_level: '',
        swelling: '',
        duration: '',
        affected_area: '',
        movement_difficulty: '',
        redness: '',
        warmth: '',
        additional_notes: ''
    });

    useEffect(() => {
        const savedReminder = localStorage.getItem('medidoctor_reminder');
        if (savedReminder) {
            setReminder(JSON.parse(savedReminder));
        }
    }, []);

    const questions = [
        {
            id: 'pain_level',
            question: 'How would you rate your pain level?',
            options: [
                { value: 'mild', label: 'Mild - Barely noticeable, doesn\'t interfere with activities' },
                { value: 'moderate', label: 'Moderate - Noticeable pain, somewhat limiting' },
                { value: 'severe', label: 'Severe - Intense pain, significantly limiting' }
            ],
            icon: AlertTriangle
        },
        {
            id: 'swelling',
            question: 'How much swelling do you have?',
            options: [
                { value: 'none', label: 'None - No visible swelling' },
                { value: 'mild', label: 'Mild - Slight swelling, barely noticeable' },
                { value: 'moderate', label: 'Moderate - Noticeable swelling' },
                { value: 'severe', label: 'Severe - Significant swelling' }
            ],
            icon: Activity
        },
        {
            id: 'duration',
            question: 'How long have you had these symptoms?',
            options: [
                { value: 'less than 24 hours', label: 'Less than 24 hours' },
                { value: '1-2 days', label: '1-2 days ago' },
                { value: '3-7 days', label: '3-7 days ago' },
                { value: '1 week+', label: 'More than a week' },
                { value: '2 weeks+', label: 'More than 2 weeks' }
            ],
            icon: CheckCircle
        },
        {
            id: 'affected_area',
            question: 'Which body area is affected?',
            options: [
                { value: 'knee', label: 'Knee' },
                { value: 'ankle', label: 'Ankle' },
                { value: 'wrist', label: 'Wrist' },
                { value: 'elbow', label: 'Elbow' },
                { value: 'shoulder', label: 'Shoulder' },
                { value: 'back', label: 'Back' },
                { value: 'neck', label: 'Neck' },
                { value: 'other', label: 'Other area' }
            ],
            icon: Activity
        },
        {
            id: 'movement_difficulty',
            question: 'How difficult is it to move the affected area?',
            options: [
                { value: 'none', label: 'No difficulty - Normal movement' },
                { value: 'mild', label: 'Mild difficulty - Slightly limited' },
                { value: 'moderate', label: 'Moderate difficulty - Significantly limited' },
                { value: 'severe', label: 'Severe difficulty - Very hard to move' },
                { value: 'unable', label: 'Unable to move' }
            ],
            icon: Activity
        },
        {
            id: 'inflammatory_signs',
            question: 'Do you notice any of these signs?',
            type: 'multiple',
            subQuestions: [
                { id: 'redness', question: 'Redness in the area?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
                { id: 'warmth', question: 'Area feels warm or hot?', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] }
            ],
            icon: AlertTriangle
        }
    ];

    const handleResponse = (questionId: string, value: string) => {
        setResponses(prev => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        const currentQuestion = questions[currentStep];
        if (currentQuestion.type === 'multiple') {
            return currentQuestion.subQuestions?.every(sq => responses[sq.id as keyof typeof responses]);
        }
        return responses[currentQuestion.id as keyof typeof responses] !== '';
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await apiService.analyzeHealthAssessment(responses);
            setAnalysisResult(result);

            // Fetch nearby doctors/hospitals for HIGH and MEDIUM risk
            if (result.risk_level === 'HIGH' || result.risk_level === 'MEDIUM') {
                fetchNearbyDoctors(result.affected_area, result.risk_level);
            }
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleVoiceAnalyze = async () => {
        if (!voiceFile) return;

        setIsAnalyzing(true);
        try {
            const result = await apiService.analyzeVoice(voiceFile);
            // Convert voice analysis to health assessment response format
            setAnalysisResult(result.analysis);

            // Fetch nearby doctors/hospitals for HIGH and MEDIUM risk
            if (result.analysis.risk_level === 'HIGH' || result.analysis.risk_level === 'MEDIUM') {
                fetchNearbyDoctors(result.analysis.affected_area, result.analysis.risk_level);
            }
        } catch (error) {
            console.error('Voice analysis failed:', error);
            alert('Voice analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const fetchNearbyDoctors = async (injuryType: string, riskLevel: string) => {
        setLoadingDoctors(true);
        try {
            const doctors = await apiService.getDoctors(injuryType, riskLevel, 4);
            setNearbyDoctors(doctors);
        } catch (error) {
            console.error('Failed to fetch d octors:', error);
        } finally {
            setLoadingDoctors(false);
        }
    };

    const handleCallAmbulance = () => {
        const phoneNumber = '100'; // Emergency number
        window.location.href = `tel:${phoneNumber}`;
    };

    const handleShareLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const message = `Emergency! I need help. My location: https://maps.google.com/?q=${latitude},${longitude}`;

                    // Try to share via Web Share API
                    if (navigator.share) {
                        navigator.share({
                            title: 'Emergency Location',
                            text: message,
                        }).catch(() => {
                            // Fallback: copy to clipboard
                            navigator.clipboard.writeText(message);
                            alert('Location copied to clipboard!');
                        });
                    } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(message);
                        alert('Location copied to clipboard!');
                    }
                },
                () => {
                    alert('Unable to get location. Please enable location services.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleVoiceRecording = (audioBlob: Blob, audioFile: File) => {
        setVoiceFile(audioFile);
    };

    const currentQuestion = questions[currentStep];

    if (analysisResult) {
        return (
            <div className="min-h-screen bg-gray-50">
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
                        <h1 className="text-2xl font-bold text-gray-900">Health Assessment Results</h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Risk Level */}
                    <div className={`border-2 p-6 mb-6 ${analysisResult.risk_level === 'HIGH' ? 'bg-red-50 border-red-300' :
                        analysisResult.risk_level === 'MEDIUM' ? 'bg-orange-50 border-orange-300' :
                            'bg-green-50 border-green-300'
                        }`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 flex items-center justify-center border-2 ${analysisResult.risk_level === 'HIGH' ? 'bg-red-600 border-red-700' :
                                analysisResult.risk_level === 'MEDIUM' ? 'bg-orange-600 border-orange-700' :
                                    'bg-green-600 border-green-700'
                                }`}>
                                <AlertTriangle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Risk Level: {analysisResult.risk_level}
                                </h2>
                                <p className="text-gray-700 font-semibold">
                                    Urgency: {analysisResult.urgency.toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border-2 border-gray-200 p-4">
                            <p className="font-semibold text-gray-900 mb-2">Risk Score: {analysisResult.risk_score}/10</p>
                            <div className="w-full bg-gray-200 h-4 border-2 border-gray-300">
                                <div
                                    className={`h-full ${analysisResult.risk_level === 'HIGH' ? 'bg-red-600' :
                                        analysisResult.risk_level === 'MEDIUM' ? 'bg-orange-600' :
                                            'bg-green-600'
                                        }`}
                                    style={{ width: `${(analysisResult.risk_score / 10) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Actions - Only for HIGH and MEDIUM Risk */}
                    {(analysisResult.risk_level === 'HIGH' || analysisResult.risk_level === 'MEDIUM') && (
                        <div className="bg-white border-2 border-red-300 shadow-md mb-6">
                            <div className="bg-red-50 border-b-2 border-red-300 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    <h3 className="font-bold text-red-900 uppercase">Emergency Actions Required</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <button
                                        onClick={handleCallAmbulance}
                                        className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 border-2 border-red-700 shadow-sm transition-colors"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>Call Ambulance (100)</span>
                                    </button>
                                    <button
                                        onClick={handleShareLocation}
                                        className="flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 border-2 border-orange-700 shadow-sm transition-colors"
                                    >
                                        <MapPin className="w-5 h-5" />
                                        <span>Share Location</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        <button className="flex flex-col items-center gap-2 bg-white border-2 border-gray-200 hover:border-blue-400 p-4 transition-colors">
                            <Download className="w-6 h-6 text-gray-700" />
                            <span className="text-xs font-semibold text-gray-700">Download Report</span>
                        </button>
                        <button
                            onClick={() => router.push('/find-hospitals')}
                            className="flex flex-col items-center gap-2 bg-white border-2 border-gray-200 hover:border-blue-400 p-4 transition-colors"
                        >
                            <Hospital className="w-6 h-6 text-gray-700" />
                            <span className="text-xs font-semibold text-gray-700">Hospitals</span>
                        </button>
                        <button
                            onClick={handleShareLocation}
                            className="flex flex-col items-center gap-2 bg-white border-2 border-gray-200 hover:border-blue-400 p-4 transition-colors"
                        >
                            <Navigation className="w-6 h-6 text-gray-700" />
                            <span className="text-xs font-semibold text-gray-700">Location</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 bg-white border-2 border-gray-200 hover:border-blue-400 p-4 transition-colors">
                            <Bell className="w-6 h-6 text-gray-700" />
                            <span className="text-xs font-semibold text-gray-700">Reminder</span>
                        </button>
                    </div>

                    {/* Hospitals Near You - Only for HIGH and MEDIUM Risk */}
                    {(analysisResult.risk_level === 'HIGH' || analysisResult.risk_level === 'MEDIUM') && (
                        <div className="bg-white border-2 border-gray-200 shadow-md mb-6">
                            <div className="border-b-2 border-gray-200 px-6 py-4 flex items-center gap-2">
                                <Hospital className="w-5 h-5 text-green-600" />
                                <h3 className="font-bold text-gray-900">Hospitals Near You</h3>
                            </div>
                            <div className="p-6">
                                {loadingDoctors ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="text-sm text-gray-600 mt-2">Finding nearby hospitals...</p>
                                    </div>
                                ) : nearbyDoctors.length > 0 ? (
                                    <div className="space-y-4">
                                        {nearbyDoctors.map((doctor) => (
                                            <div key={doctor.id} className="flex items-center justify-between p-4 border-2 border-gray-200 hover:border-blue-400 transition-colors">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900">{doctor.hospital}</h4>
                                                    <p className="text-sm text-gray-600">{doctor.specialization} - {doctor.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{doctor.hospital}</p>
                                                </div>
                                                <div className="text-right mr-4">
                                                    <p className="text-blue-600 font-bold">{doctor.distance_km} km</p>
                                                    <p className="text-xs text-gray-500">~{Math.round(doctor.distance_km * 2)} min</p>
                                                </div>
                                                <button
                                                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(doctor.hospital)}`, '_blank')}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 border-2 border-green-700 transition-colors flex items-center gap-2"
                                                >
                                                    <Navigation className="w-4 h-4" />
                                                    Get Directions
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank')}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 border-2 border-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <MapPin className="w-5 h-5" />
                                            View All Hospitals on Google Maps
                                        </button>
                                        <p className="text-xs text-gray-500 text-center mt-2">
                                            Routes based on GPS for best hospital locations
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Hospital className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600">No hospitals data available</p>
                                        <button
                                            onClick={() => window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank')}
                                            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 border-2 border-green-700 transition-colors"
                                        >
                                            Find Hospitals on Google Maps
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Detected Health Issue */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white border-2 border-gray-200 shadow-md">
                            <div className="border-b-2 border-gray-200 px-6 py-4">
                                <h3 className="font-bold text-gray-900">Detected Health Issue</h3>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <h4 className="font-bold text-xl text-gray-900 mb-2">
                                        {analysisResult.affected_area.charAt(0).toUpperCase() + analysisResult.affected_area.slice(1)} - {responses.pain_level} pain
                                    </h4>
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wide">Visual Indicators</h5>
                                    <ul className="space-y-1">
                                        {analysisResult.detected_patterns.map((pattern, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-blue-600 font-bold mt-0.5">●</span>
                                                <span className="text-sm text-gray-700">{pattern.replace(/_/g, ' ').toUpperCase()}</span>
                                            </li>
                                        ))}
                                        {responses.redness === 'yes' && (
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 font-bold mt-0.5">●</span>
                                                <span className="text-sm text-gray-700">Redness present</span>
                                            </li>
                                        )}
                                        {responses.warmth === 'yes' && (
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 font-bold mt-0.5">●</span>
                                                <span className="text-sm text-gray-700">Warmth detected</span>
                                            </li>
                                        )}
                                        {responses.swelling !== 'none' && (
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 font-bold mt-0.5">●</span>
                                                <span className="text-sm text-gray-700">{responses.swelling.charAt(0).toUpperCase() + responses.swelling.slice(1)} swelling</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className="mt-6">
                                    <div className="bg-gray-100 border-2 border-gray-200 p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold text-gray-700">AI CONFIDENCE SCORE</span>
                                            <span className="text-2xl font-bold text-blue-600">{Math.round(analysisResult.confidence_score * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-300 h-3 border border-gray-400">
                                            <div
                                                className="h-full bg-blue-600"
                                                style={{ width: `${analysisResult.confidence_score * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">
                                            Analysis confidence based on visual pattern recognition
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-gray-200 shadow-md">
                            <div className="border-b-2 border-gray-200 px-6 py-4">
                                <h3 className="font-bold text-gray-900">Risk Assessment</h3>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-3">
                                    {analysisResult.risk_factors.map((factor, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-red-600 font-bold mt-0.5">●</span>
                                            <span className="text-sm text-gray-700">{factor}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* First-Aid Steps */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white border-2 border-gray-200 shadow-md">
                            <div className="border-b-2 border-gray-200 px-6 py-4">
                                <h3 className="font-bold text-gray-900">First-Aid Steps</h3>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-3">
                                    {analysisResult.treatment_guidance.immediate_care.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="shrink-0 w-6 h-6 bg-blue-600 text-white flex items-center justify-center font-bold text-sm border border-blue-700">
                                                {idx + 1}
                                            </div>
                                            <span className="text-sm text-gray-700 flex-1">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-gray-200 shadow-md">
                            <div className="border-b-2 border-gray-200 px-6 py-4">
                                <h3 className="font-bold text-gray-900">Warning Signs</h3>
                            </div>
                            <div className="p-6">
                                <div className="bg-red-50 border-2 border-red-200 p-4">
                                    <ul className="space-y-2">
                                        {analysisResult.treatment_guidance.warning_signs.slice(0, 3).map((sign, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-red-600 font-bold mt-0.5">!</span>
                                                <span className="text-sm text-red-800">{sign}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Risk Factors - Original Section (keep for backwards compatibility) */}
                    {analysisResult.risk_factors.length > 0 && (
                        <div className="bg-white border-2 border-gray-200 shadow-md mb-6">
                            <div className="border-b-2 border-gray-200 px-6 py-4">
                                <h3 className="font-bold text-gray-900">Risk Factors Identified</h3>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-2">
                                    {analysisResult.risk_factors.map((factor, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                                            <span className="text-red-600 font-bold mt-1">⚠</span>
                                            <span>{factor}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Possible Conditions */}
                    <div className="bg-white border-2 border-gray-200 shadow-md mb-6">
                        <div className="border-b-2 border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-900">AI Analysis - Possible Conditions</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Analysis Method: {analysisResult.analysis_method}
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            {analysisResult.possible_conditions.map((condition, idx) => (
                                <div key={idx} className="border-2 border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-gray-900">{condition.name}</h4>
                                        <span className={`px-3 py-1 text-sm font-bold border-2 ${condition.probability === 'high' ? 'bg-red-100 border-red-300 text-red-800' :
                                            condition.probability === 'medium' ? 'bg-orange-100 border-orange-300 text-orange-800' :
                                                'bg-yellow-100 border-yellow-300 text-yellow-800'
                                            }`}>
                                            {condition.probability.toUpperCase()} PROBABILITY
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{condition.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white border-2 border-gray-200 shadow-md mb-6">
                        <div className="border-b-2 border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-900">AI-Powered Recommendations</h3>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                {analysisResult.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                                        <span className="text-blue-600 font-bold mt-1">✓</span>
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Treatment Guidance */}
                    <div className="bg-white border-2 border-gray-200 shadow-md mb-6">
                        <div className="border-b-2 border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-900">Treatment Guidance</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Immediate Care */}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">Immediate Care</h4>
                                <ul className="space-y-2">
                                    {analysisResult.treatment_guidance.immediate_care.map((item, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                            <span className="text-green-600 font-bold">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Warning Signs */}
                            <div className="bg-red-50 border-2 border-red-200 p-4">
                                <h4 className="font-bold text-red-900 mb-2 text-sm uppercase tracking-wide">
                                    ⚠️ Warning Signs - Seek Immediate Medical Attention If:
                                </h4>
                                <ul className="space-y-2">
                                    {analysisResult.treatment_guidance.warning_signs.map((sign, idx) => (
                                        <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                                            <span className="text-red-600 font-bold">!</span>
                                            <span>{sign}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-yellow-50 border-2 border-yellow-300 p-6 mb-6">
                        <p className="text-sm text-yellow-900">
                            <strong>DISCLAIMER:</strong> {analysisResult.disclaimer}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/doctors')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 border-2 border-blue-700 shadow-sm transition-colors"
                        >
                            Find Doctors
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 border-2 border-gray-300 transition-colors"
                        >
                            New Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
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
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Know Your Health
                            </h1>
                            <p className="text-sm text-gray-600">
                                AI-powered health assessment with voice integration
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Disclaimer className="mb-6" />

                {/* Input Mode Selection */}
                <div className="bg-white border-2 border-gray-200 shadow-md mb-6">
                    <div className="border-b-2 border-gray-200 px-6 py-4">
                        <h2 className="font-bold text-gray-900">Choose Input Method</h2>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setInputMode('questions')}
                            className={`flex items-center gap-3 p-4 border-2 transition-all ${inputMode === 'questions'
                                ? 'bg-blue-50 border-blue-600'
                                : 'bg-white border-gray-300 hover:border-blue-400'
                                }`}
                        >
                            <MessageSquare className={`w-8 h-8 ${inputMode === 'questions' ? 'text-blue-600' : 'text-gray-600'}`} />
                            <div className="text-left">
                                <h3 className="font-bold text-gray-900">Answer Questions</h3>
                                <p className="text-sm text-gray-600">Step-by-step questionnaire</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setInputMode('voice')}
                            className={`flex items-center gap-3 p-4 border-2 transition-all ${inputMode === 'voice'
                                ? 'bg-blue-50 border-blue-600'
                                : 'bg-white border-gray-300 hover:border-blue-400'
                                }`}
                        >
                            <Mic className={`w-8 h-8 ${inputMode === 'voice' ? 'text-blue-600' : 'text-gray-600'}`} />
                            <div className="text-left">
                                <h3 className="font-bold text-gray-900">Voice Input</h3>
                                <p className="text-sm text-gray-600">Describe symptoms by voice</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Question Mode */}
                {inputMode === 'questions' && !isAnalyzing && (
                    <div className="bg-white border-2 border-gray-200 shadow-md">
                        <div className="border-b-2 border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">
                                    Question {currentStep + 1} of {questions.length}
                                </h3>
                                <div className="text-sm text-gray-600">
                                    {Math.round(((currentStep + 1) / questions.length) * 100)}% Complete
                                </div>
                            </div>
                            <div className="mt-3 w-full bg-gray-200 h-2 border border-gray-300">
                                <div
                                    className="h-full bg-blue-600 transition-all"
                                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                {currentQuestion.icon && <currentQuestion.icon className="w-8 h-8 text-blue-600" />}
                                <h2 className="text-xl font-bold text-gray-900">
                                    {currentQuestion.question}
                                </h2>
                            </div>

                            {currentQuestion.type === 'multiple' ? (
                                <div className="space-y-6">
                                    {currentQuestion.subQuestions?.map(subQ => (
                                        <div key={subQ.id}>
                                            <p className="font-semibold text-gray-800 mb-3">{subQ.question}</p>
                                            <div className="space-y-2">
                                                {subQ.options.map(option => (
                                                    <label
                                                        key={option.value}
                                                        className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-all ${responses[subQ.id as keyof typeof responses] === option.value
                                                            ? 'bg-blue-50 border-blue-600'
                                                            : 'bg-white border-gray-300 hover:border-blue-400'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={subQ.id}
                                                            value={option.value}
                                                            checked={responses[subQ.id as keyof typeof responses] === option.value}
                                                            onChange={(e) => handleResponse(subQ.id, e.target.value)}
                                                            className="w-5 h-5"
                                                        />
                                                        <span className="font-medium text-gray-900">{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {currentQuestion.options?.map(option => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-all ${responses[currentQuestion.id as keyof typeof responses] === option.value
                                                ? 'bg-blue-50 border-blue-600'
                                                : 'bg-white border-gray-300 hover:border-blue-400'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={currentQuestion.id}
                                                value={option.value}
                                                checked={responses[currentQuestion.id as keyof typeof responses] === option.value}
                                                onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
                                                className="w-5 h-5"
                                            />
                                            <span className="font-medium text-gray-900">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="border-t-2 border-gray-200 px-6 py-4 flex justify-between">
                            <button
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-800 font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            {currentStep < questions.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!canProceed()}
                                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold border-2 border-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Analyze with AI
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Voice Mode */}
                {inputMode === 'voice' && !isAnalyzing && (
                    <div className="bg-white border-2 border-gray-200 shadow-md">
                        <div className="border-b-2 border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-900">Voice Input Analysis</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Describe your symptoms and our AI will analyze them
                            </p>
                        </div>
                        <div className="p-8">
                            <VoiceRecorder
                                onRecordingComplete={handleVoiceRecording}
                                disabled={isAnalyzing}
                            />
                        </div>
                        {voiceFile && (
                            <div className="border-t-2 border-gray-200 px-6 py-4">
                                <button
                                    onClick={handleVoiceAnalyze}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 border-2 border-green-700 shadow-sm transition-colors"
                                >
                                    Analyze Voice Input with AI
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {isAnalyzing && (
                    <div className="bg-white border-2 border-gray-200 shadow-md p-12">
                        <LoadingSpinner message="Analyzing with AI/ML and Medical Rule-Based Systems..." />
                        <p className="text-center text-sm text-gray-600 mt-4">
                            Processing your health information using advanced algorithms
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
