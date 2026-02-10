'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
    className?: string;
}

export default function Disclaimer({ className = '' }: DisclaimerProps) {
    return (
        <div className={`bg-white border-l-4 border-red-600 shadow-sm p-5 ${className}`}>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">Medical Disclaimer</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        This is a <strong className="text-gray-900">prototype demonstration system</strong>.
                        Not intended for actual medical diagnosis or treatment.
                        Always consult qualified healthcare professionals for medical advice.
                        In emergencies, call your local emergency services immediately.
                    </p>
                </div>
            </div>
        </div>
    );
}
