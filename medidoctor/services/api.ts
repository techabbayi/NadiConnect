/**
 * API Service Layer
 * Handles all backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ScanResult {
    scan_id: number;
    injury_type: string;
    confidence: number;
    visual_notes: string;
    visual_indicators: string[];
    risk_level: string;
    risk_reason: string;
    risk_color: string;
    risk_factors?: string[];
    guidance: {
        first_aid_steps: string[];
        warnings: string[];
        follow_up: string;
        urgency: string;
        disclaimer: string;
    };
    timestamp: string;
    disclaimer: string;
}

export interface Doctor {
    id: number;
    name: string;
    specialization: string;
    hospital: string;
    distance_km: number;
    rating: number;
    available_slots: string[];
    expertise: string[];
}

export interface BookingRequest {
    doctor_id: number;
    patient_name: string;
    patient_phone: string;
    appointment_slot: string;
    injury_type?: string;
}

export interface BookingResponse {
    booking_id: number;
    token_number: string;
    doctor_name: string;
    specialization: string;
    appointment_slot: string;
    status: string;
    confirmation_message: string;
    disclaimer: string;
}

export interface AdminStats {
    total_scans: number;
    total_appointments: number;
    risk_distribution: Record<string, number>;
    injury_distribution: Record<string, number>;
    recent_scans: Array<{
        id: number;
        injury_type: string;
        risk_level: string;
        confidence: number;
        timestamp: string;
    }>;
    recent_appointments?: Array<{
        id: number;
        patient_name: string;
        patient_phone: string;
        appointment_slot: string;
        injury_type?: string;
        token_number: string;
        status: string;
        created_at: string;
        doctor_name?: string;
        hospital?: string;
    }>;
}

export interface HealthAssessmentRequest {
    pain_level: string;
    swelling: string;
    duration: string;
    affected_area: string;
    movement_difficulty: string;
    redness: string;
    warmth: string;
    additional_notes?: string;
}

export interface HealthAssessmentResponse {
    analysis_id: number;
    risk_level: string;
    risk_color: string;
    risk_score: number;
    risk_factors: string[];
    urgency: string;
    possible_conditions: Array<{
        name: string;
        probability: string;
        description: string;
    }>;
    detected_patterns: string[];
    recommendations: string[];
    treatment_guidance: {
        immediate_care: string[];
        medications: string[];
        activities: string[];
        warning_signs: string[];
    };
    affected_area: string;
    confidence_score: number;
    timestamp: string;
    analysis_method: string;
    disclaimer: string;
}

export interface VoiceAnalysisResponse {
    transcribed_text: string;
    confidence: number;
    detected_language: string;
    extracted_info: {
        pain_level: string;
        pain_descriptors: string[];
        swelling_severity: string;
        affected_area: string;
        additional_symptoms: string[];
        duration: string;
        original_text: string;
    };
    analysis: HealthAssessmentResponse;
    timestamp: string;
}

export interface ChatMessageRequest {
    message: string;
    context?: Record<string, unknown>;
}

export interface ChatMessageResponse {
    response: string;
    intent: string;
    confidence: number;
    follow_up_questions: string[];
    entities_detected: {
        body_parts: string[];
        symptoms: string[];
        intensity?: string;
        duration?: string;
    };
    timestamp: string;
    conversation_id: number;
}

class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    /**
     * Upload and scan injury image
     */
    async scanInjury(imageFile: File): Promise<ScanResult> {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${this.baseURL}/api/scan`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Scan failed');
        }

        return response.json();
    }

    /**
     * Get recommended doctors
     */
    async getDoctors(
        injuryType?: string,
        riskLevel?: string,
        limit: number = 10
    ): Promise<Doctor[]> {
        const params = new URLSearchParams();
        if (injuryType) params.append('injury_type', injuryType);
        if (riskLevel) params.append('risk_level', riskLevel);
        params.append('limit', limit.toString());

        const response = await fetch(
            `${this.baseURL}/api/doctors?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch doctors');
        }

        return response.json();
    }

    /**
     * Book appointment
     */
    async bookAppointment(booking: BookingRequest): Promise<BookingResponse> {
        const response = await fetch(`${this.baseURL}/api/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.detail || 'Booking failed. Please try again.';
            throw new Error(errorMessage);
        }

        return response.json();
    }

    /**
     * Get admin statistics
     */
    async getAdminStats(): Promise<AdminStats> {
        const response = await fetch(`${this.baseURL}/api/admin/stats`);

        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }

        return response.json();
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseURL}/`);
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Analyze health assessment questionnaire
     */
    async analyzeHealthAssessment(assessment: HealthAssessmentRequest): Promise<HealthAssessmentResponse> {
        const response = await fetch(`${this.baseURL}/api/health-assessment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assessment),
        });

        if (!response.ok) {
            throw new Error('Health assessment failed');
        }

        return response.json();
    }

    /**
     * Analyze voice input
     */
    async analyzeVoice(audioFile: File): Promise<VoiceAnalysisResponse> {
        const formData = new FormData();
        formData.append('audio', audioFile);

        const response = await fetch(`${this.baseURL}/api/voice-analysis`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Voice analysis failed');
        }

        return response.json();
    }

    /**
     * Send chat message
     */
    async sendChatMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
        const response = await fetch(`${this.baseURL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error('Chat request failed');
        }

        return response.json();
    }

    /**
     * Get chat conversation history
     */
    async getChatHistory(): Promise<{
        total_messages: number;
        intents_discussed: string[];
        entities_mentioned: Record<string, string[]>;
        conversation_history: unknown[];
    }> {
        const response = await fetch(`${this.baseURL}/api/chat/history`);

        if (!response.ok) {
            throw new Error('Failed to fetch chat history');
        }

        return response.json();
    }
}

export const apiService = new ApiService();
