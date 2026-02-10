'use client';

import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
    riskLevel: string;
    className?: string;
}

export default function RiskBadge({ riskLevel, className = '' }: RiskBadgeProps) {
    const config = {
        LOW: {
            bg: 'bg-white',
            border: 'border-green-600',
            text: 'text-green-700',
            icon: <CheckCircle className="w-6 h-6" />,
            label: 'Low Risk'
        },
        MEDIUM: {
            bg: 'bg-white',
            border: 'border-orange-500',
            text: 'text-orange-700',
            icon: <AlertTriangle className="w-6 h-6" />,
            label: 'Medium Risk'
        },
        HIGH: {
            bg: 'bg-white',
            border: 'border-red-600',
            text: 'text-red-700',
            icon: <AlertCircle className="w-6 h-6" />,
            label: 'High Risk'
        }
    }[riskLevel] || {
        bg: 'bg-white',
        border: 'border-gray-400',
        text: 'text-gray-700',
        icon: <AlertCircle className="w-6 h-6" />,
        label: 'Unknown Risk'
    };

    return (
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg border-2 ${config.border} ${config.bg} ${className} shadow-sm`}>
            <span className={config.text}>{config.icon}</span>
            <div>
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Risk Level</div>
                <div className={`text-lg font-bold ${config.text} leading-none mt-1`}>{config.label}</div>
            </div>
        </div>
    );
}
