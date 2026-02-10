'use client';

import { Phone, X, Ambulance, Shield, Heart, Users } from 'lucide-react';

interface SOSModalProps {
    onClose: () => void;
}

export default function SOSModal({ onClose }: SOSModalProps) {
    const emergencyContacts = [
        {
            name: 'Ambulance',
            number: '108',
            icon: Ambulance,
            color: 'red',
            description: 'Emergency Medical Services'
        },
        {
            name: 'Police',
            number: '100',
            icon: Shield,
            color: 'blue',
            description: 'Police Emergency'
        },
        {
            name: 'Medical Emergency',
            number: '102',
            icon: Heart,
            color: 'pink',
            description: 'Medical Helpline'
        },
        {
            name: 'Emergency Contact',
            number: '112',
            icon: Users,
            color: 'orange',
            description: 'National Emergency Number'
        }
    ];

    const handleCall = (number: string, name: string) => {
        if (confirm(`Call ${name} (${number})?`)) {
            const tel = document.createElement('a');
            tel.href = `tel:${number}`;
            tel.click();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white/90 backdrop-blur-lg border-4 border-red-600 shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Phone className="w-6 h-6" />
                        Emergency SOS
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-red-700 p-1 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Emergency Contacts */}
                <div className="p-6">
                    <p className="text-sm text-gray-700 mb-4 font-medium">
                        Select emergency service to call:
                    </p>

                    <div className="space-y-3">
                        {emergencyContacts.map((contact) => {
                            const Icon = contact.icon;
                            const bgColor = contact.color === 'red' ? 'bg-red-600 hover:bg-red-700 border-red-700' :
                                contact.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 border-blue-700' :
                                    contact.color === 'pink' ? 'bg-pink-600 hover:bg-pink-700 border-pink-700' :
                                        'bg-orange-600 hover:bg-orange-700 border-orange-700';

                            return (
                                <button
                                    key={contact.number}
                                    onClick={() => handleCall(contact.number, contact.name)}
                                    className={`w-full ${bgColor} text-white border-2 p-4 transition-colors flex items-center gap-4`}
                                >
                                    <div className="w-14 h-14 bg-white flex items-center justify-center shrink-0">
                                        <Icon className="w-8 h-8 text-gray-900 stroke-[2.5]" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-bold text-lg">{contact.name}</p>
                                        <p className="text-sm opacity-90">{contact.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-2xl">{contact.number}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-6 bg-yellow-50 border-2 border-yellow-500 p-4">
                        <p className="text-xs text-yellow-900 font-medium">
                            <strong>Important:</strong> Use emergency services responsibly.
                            False alarms can delay help for those who truly need it.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
