'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Disclaimer from '@/components/Disclaimer';
import Navbar from '@/components/Navbar';
import { Activity, Camera, Users, TrendingUp, Shield, Clock, CheckCircle } from 'lucide-react';

export default function Home() {
  const [reminder, setReminder] = useState({ active: false, time: '' });

  useEffect(() => {
    const savedReminder = localStorage.getItem('medidoctor_reminder');
    if (savedReminder) {
      setReminder(JSON.parse(savedReminder));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with SOS */}
      <Navbar reminderActive={reminder.active} reminderTime={reminder.time} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Disclaimer Banner */}
        <div className="mb-8">
          <Disclaimer />
        </div>

        {/* Main CTA Section */}
        <div className="bg-white border-2 border-gray-200 shadow-md mb-8">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              AI-Assisted Health Services
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Choose how you want to assess your health - scan injuries or get personalized health analysis
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <Link href="/scan">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 transition-colors flex items-center justify-center gap-3 shadow-sm border-2 border-blue-700">
                  <Camera className="w-6 h-6" />
                  <span className="text-lg">Scan Injury</span>
                </button>
              </Link>
              <Link href="/health-assessment">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 transition-colors flex items-center justify-center gap-3 shadow-sm border-2 border-green-700">
                  <Activity className="w-6 h-6" />
                  <span className="text-lg">Know Your Health</span>
                </button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-3 text-sm text-gray-500">
              <p>Capture or upload injury photographs</p>
              <p>Voice & questionnaire-based assessment</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 border-2 border-blue-200 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">AI Analysis</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Advanced pattern recognition for injury type detection with confidence scoring
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-50 border-2 border-orange-200 flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Risk Assessment</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Automated classification into Low, Medium, or High risk categories
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-50 border-2 border-green-200 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Doctor Matching</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Smart doctor recommendations based on injury type and severity
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white border-2 border-gray-200 shadow-md mb-8">
          <div className="border-b-2 border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold text-lg border-2 border-blue-700">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Capture Injury Photo</h4>
                  <p className="text-sm text-gray-600">
                    Use your device camera or upload an existing image of the injury
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold text-lg border-2 border-blue-700">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">AI Analysis & Classification</h4>
                  <p className="text-sm text-gray-600">
                    Receive instant injury type detection and risk level assessment
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold text-lg border-2 border-blue-700">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Medical Guidance</h4>
                  <p className="text-sm text-gray-600">
                    View personalized first-aid steps and warning signs to watch for
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold text-lg border-2 border-blue-700">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Book Appointment</h4>
                  <p className="text-sm text-gray-600">
                    Find nearby specialists and schedule appointments directly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Features */}
        <div className="bg-blue-50 border-2 border-blue-200 p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4 text-center">Platform Features</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Real-time injury analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Risk level classification</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">First-aid guidance</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Doctor recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Appointment booking</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Emergency SOS support</span>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center py-6 border-t-2 border-gray-200">
          <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
            System Admin Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
