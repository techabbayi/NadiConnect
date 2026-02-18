'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff, Upload } from 'lucide-react';

interface VoiceRecorderProps {
    onRecordingComplete: (audioBlob: Blob, audioFile: File) => void;
    disabled?: boolean;
}

export default function VoiceRecorder({ onRecordingComplete, disabled = false }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioURL, setAudioURL] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);

                // Create File object
                const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
                onRecordingComplete(audioBlob, audioFile);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Unable to access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/ogg', 'audio/webm'];
            if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|m4a|ogg|webm)$/i)) {
                alert('Please upload a valid audio file (WAV, MP3, M4A, OGG, WEBM)');
                return;
            }

            const url = URL.createObjectURL(file);
            setAudioURL(url);
            onRecordingComplete(file, file);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-4">
            {/* Recording Controls */}
            <div className="flex items-center justify-center gap-4">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        disabled={disabled}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 border-2 border-blue-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Mic className="w-6 h-6" />
                        <span>Start Recording</span>
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 border-2 border-red-700 shadow-sm transition-colors animate-pulse"
                    >
                        <MicOff className="w-6 h-6" />
                        <span>Stop Recording</span>
                    </button>
                )}
            </div>

            {/* Recording Timer */}
            {isRecording && (
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-red-50 border-2 border-red-200 px-6 py-3">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="font-bold text-red-700 text-lg">
                            Recording: {formatTime(recordingTime)}
                        </span>
                    </div>
                </div>
            )}

            {/* File Upload Option */}
            <div className="text-center">
                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <p className="text-sm text-gray-600 mb-3">Or upload an audio file</p>
                    <label className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 border-2 border-gray-300 cursor-pointer transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>Upload Audio File</span>
                        <input
                            type="file"
                            accept="audio/*,.wav,.mp3,.m4a,.ogg,.webm"
                            onChange={handleFileUpload}
                            disabled={disabled || isRecording}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Audio Playback */}
            {audioURL && !isRecording && (
                <div className="bg-gray-50 border-2 border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Recorded Audio:</p>
                    <audio controls src={audioURL} className="w-full">
                        Your browser does not support audio playback.
                    </audio>
                </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border-2 border-blue-200 p-4">
                <h4 className="font-bold text-blue-900 mb-2 text-sm">Voice Recording Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Speak clearly and describe your pain, swelling, and symptoms</li>
                    <li>• Mention the affected area and how long you&apos;ve had symptoms</li>
                    <li>• Describe pain level (mild, moderate, or severe)</li>
                    <li>• Include any other relevant details about your condition</li>
                </ul>
            </div>
        </div>
    );
}
