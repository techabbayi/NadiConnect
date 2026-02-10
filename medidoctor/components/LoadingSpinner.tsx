'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message = 'Processing...' }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12">
            <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <p className="mt-6 text-gray-700 font-medium text-base">{message}</p>
            <p className="mt-2 text-gray-500 text-sm">Please wait...</p>
        </div>
    );
}
