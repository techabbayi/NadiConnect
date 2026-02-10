'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
    onCapture: (file: File) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onCapture(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
            />

            {!preview ? (
                <button
                    onClick={triggerFileInput}
                    className="w-full max-w-md mx-auto border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm py-12"
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-200">
                        <Camera className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-center px-4">
                        <p className="text-base font-semibold text-gray-900 mb-1">
                            Capture or Upload Image
                        </p>
                        <p className="text-sm text-gray-600">
                            Take a photo or select from your gallery
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Tap to Upload</span>
                    </div>
                </button>
            ) : (
                <div className="relative bg-white border-2 border-gray-300 shadow-sm max-w-md mx-auto">
                    <img
                        src={preview}
                        alt="Captured injury"
                        className="w-full h-auto max-h-96 object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-3">
                        <button
                            onClick={triggerFileInput}
                            className="w-full bg-white border-2 border-blue-600 text-blue-600 px-4 py-3 hover:bg-blue-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Retake Photo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
