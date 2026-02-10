'use client';

import React from 'react';
import { formatConfidence } from '@/lib/utils';

interface ConfidenceMeterProps {
    confidence: number;
    riskLevel: string;
}

export default function ConfidenceMeter({ confidence, riskLevel }: ConfidenceMeterProps) {
    const percentage = confidence * 100;

    return (
        <div className="w-full bg-white border-2 border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">AI Confidence Score</span>
                <span className="text-2xl font-bold text-blue-600">{formatConfidence(confidence)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-md h-3 overflow-hidden border border-gray-300">
                <div
                    className="h-full bg-blue-600 transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="mt-2 text-xs text-gray-600">
                Analysis confidence based on visual pattern recognition
            </div>
        </div>
    );
}
