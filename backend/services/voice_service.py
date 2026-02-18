"""
Voice-to-Text Service for Health Assessment
============================================
Provides speech-to-text conversion and audio processing
"""

import io
import re
from typing import Dict, Optional


class VoiceService:
    """
    Handles voice input processing and conversion to text.
    In production, this would integrate with services like:
    - Google Cloud Speech-to-Text
    - Azure Speech Services
    - OpenAI Whisper API

    For this prototype, we simulate voice-to-text conversion.
    """

    def __init__(self):
        # Common pain-related keywords for simulation
        self.pain_keywords = {
            'mild': ['slight', 'little', 'minor', 'small', 'barely'],
            'moderate': ['moderate', 'noticeable', 'some', 'medium', 'hurts'],
            'severe': ['severe', 'intense', 'extreme', 'unbearable', 'terrible', 'excruciating'],
            'throbbing': ['throbbing', 'pulsing', 'beating'],
            'sharp': ['sharp', 'stabbing', 'piercing', 'cutting'],
            'dull': ['dull', 'aching', 'sore'],
            'burning': ['burning', 'hot', 'stinging']
        }

        self.body_parts = [
            'knee', 'ankle', 'wrist', 'elbow', 'shoulder', 'back', 'neck',
            'head', 'chest', 'abdomen', 'leg', 'arm', 'hand', 'foot', 'finger'
        ]

    def process_audio(self, audio_data: bytes, filename: str) -> Dict:
        """
        Process audio file and convert to text.
        In production, this would use actual speech-to-text API.

        Args:
            audio_data: Raw audio bytes (WAV, MP3, etc.)
            filename: Original filename

        Returns:
            dict with transcribed_text, confidence, detected_language
        """

        # Simulate voice-to-text conversion based on audio characteristics
        # In production, this would call actual API like:
        # - Google Cloud Speech-to-Text
        # - Whisper API
        # - Azure Speech

        audio_size = len(audio_data)

        # Simulate different transcriptions based on audio size
        simulated_transcriptions = [
            "I have severe pain in my knee with significant swelling. It hurts when I walk and there's moderate redness around the joint area.",
            "There's a sharp burning sensation on my arm with visible swelling. The pain is intense and it started after I fell yesterday.",
            "I feel a dull aching pain in my lower back. The swelling is mild but the discomfort is constant throughout the day.",
            "My ankle has moderate swelling and throbbing pain. I can barely put weight on it and there's some bruising visible.",
            "There's severe stabbing pain in my wrist with significant inflammation. The area is red and warm to touch.",
            "I have mild pain in my shoulder with slight swelling. It's a dull ache that gets worse when I move my arm."
        ]

        # Select transcription based on audio size (for demo consistency)
        selected_index = (audio_size % len(simulated_transcriptions))
        transcribed_text = simulated_transcriptions[selected_index]

        # Simulate confidence score
        confidence = 0.92 if audio_size > 50000 else 0.85

        return {
            "transcribed_text": transcribed_text,
            "confidence": confidence,
            "detected_language": "en-US",
            "duration_seconds": audio_size / 16000,  # Approximate duration
            "audio_quality": "good" if audio_size > 50000 else "fair"
        }

    def extract_health_info_from_text(self, text: str) -> Dict:
        """
        Extract structured health information from transcribed text
        using NLP and pattern matching.

        Args:
            text: Transcribed text from voice

        Returns:
            dict with extracted pain_level, swelling, location, duration, etc.
        """

        text_lower = text.lower()

        # Extract pain level
        pain_level = "moderate"
        pain_descriptors = []

        for level, keywords in self.pain_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    if level in ['mild', 'moderate', 'severe']:
                        pain_level = level
                    pain_descriptors.append(level)

        # Extract swelling severity
        swelling = "moderate"
        if any(word in text_lower for word in ['significant', 'severe', 'major', 'large']):
            swelling = "severe"
        elif any(word in text_lower for word in ['mild', 'slight', 'minor', 'little']):
            swelling = "mild"

        # Extract affected body part
        affected_area = "unknown"
        for body_part in self.body_parts:
            if body_part in text_lower:
                affected_area = body_part
                break

        # Extract additional symptoms
        symptoms = []
        if 'red' in text_lower or 'redness' in text_lower:
            symptoms.append("redness")
        if 'warm' in text_lower or 'hot' in text_lower:
            symptoms.append("warmth")
        if 'bruise' in text_lower or 'bruising' in text_lower:
            symptoms.append("bruising")
        if 'difficulty moving' in text_lower or 'hard to move' in text_lower or 'barely' in text_lower:
            symptoms.append("limited_mobility")

        # Extract timing
        duration = "recent"
        if 'yesterday' in text_lower or 'last night' in text_lower:
            duration = "1-2 days"
        elif 'week' in text_lower:
            duration = "1 week+"
        elif 'today' in text_lower or 'just now' in text_lower:
            duration = "less than 24 hours"

        return {
            "pain_level": pain_level,
            "pain_descriptors": pain_descriptors,
            "swelling_severity": swelling,
            "affected_area": affected_area,
            "additional_symptoms": symptoms,
            "duration": duration,
            "original_text": text
        }

    def validate_audio_format(self, filename: str) -> bool:
        """
        Validate if audio file format is supported.

        Args:
            filename: Audio filename

        Returns:
            bool indicating if format is supported
        """
        supported_formats = ['.wav', '.mp3', '.m4a', '.ogg', '.webm', '.flac']
        return any(filename.lower().endswith(fmt) for fmt in supported_formats)
