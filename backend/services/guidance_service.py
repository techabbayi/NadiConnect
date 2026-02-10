"""
Smart Guidance Engine
=====================
Provides contextual first-aid advice and warnings.
"""


class GuidanceEngine:
    """
    Generates treatment guidance based on injury type and risk.
    All advice includes medical disclaimers.
    """

    def generate_guidance(self, injury_type: str, risk_level: str) -> dict:
        """
        Generate contextual guidance for injury.

        Returns:
            dict with first_aid_steps, warnings, follow_up, disclaimer
        """

        guidance_map = {
            "cut": {
                "first_aid_steps": [
                    "Clean the wound with clean water",
                    "Apply gentle pressure with clean cloth to stop bleeding",
                    "Apply antiseptic solution if available",
                    "Cover with sterile bandage",
                    "Keep wound clean and dry"
                ],
                "warnings": [
                    "Seek immediate care if bleeding doesn't stop after 10 minutes",
                    "Watch for signs of infection (redness, swelling, pus)",
                    "Get medical help if wound is deep or gaping"
                ],
                "follow_up": "Change bandage daily and monitor for infection"
            },

            "burn": {
                "first_aid_steps": [
                    "Remove from heat source immediately",
                    "Cool the burn with running cool water for 10-20 minutes",
                    "Do NOT use ice directly on burn",
                    "Cover with sterile, non-stick bandage",
                    "Do not apply butter, oils, or ointments"
                ],
                "warnings": [
                    "Seek immediate medical care for severe burns",
                    "Watch for blistering or charred skin",
                    "Electrical or chemical burns require emergency care"
                ],
                "follow_up": "Monitor for signs of infection; severe burns need professional treatment"
            },

            "swelling": {
                "first_aid_steps": [
                    "Rest the affected area",
                    "Apply ice pack for 15-20 minutes",
                    "Elevate the swollen area if possible",
                    "Avoid putting weight or pressure on area",
                    "Consider over-the-counter anti-inflammatory medication"
                ],
                "warnings": [
                    "Seek care if swelling worsens or doesn't improve in 48 hours",
                    "Watch for severe pain, numbness, or color changes",
                    "Sudden severe swelling requires immediate evaluation"
                ],
                "follow_up": "RICE method: Rest, Ice, Compression, Elevation"
            },

            "bruise": {
                "first_aid_steps": [
                    "Apply ice pack to reduce swelling",
                    "Rest the affected area",
                    "Elevate if possible",
                    "Avoid massaging the bruised area",
                    "Pain relievers may help with discomfort"
                ],
                "warnings": [
                    "Seek care if bruise is very large or painful",
                    "Watch for unexplained frequent bruising",
                    "Severe pain or inability to move requires evaluation"
                ],
                "follow_up": "Bruising should fade over 1-2 weeks"
            },

            "fracture": {
                "first_aid_steps": [
                    "DO NOT move the injured area",
                    "Immobilize with splint if trained to do so",
                    "Apply ice pack to reduce swelling",
                    "Seek emergency medical care immediately",
                    "Do not try to realign the bone"
                ],
                "warnings": [
                    "Suspected fractures require X-ray evaluation",
                    "Do not apply pressure to fractured area",
                    "Open fractures (bone visible) need emergency care"
                ],
                "follow_up": "Professional medical evaluation required for all suspected fractures"
            },

            "rash": {
                "first_aid_steps": [
                    "Avoid scratching the affected area",
                    "Keep area clean and dry",
                    "Apply cool compress for relief",
                    "Consider over-the-counter anti-itch cream",
                    "Identify and avoid potential allergens"
                ],
                "warnings": [
                    "Seek care if rash spreads rapidly",
                    "Watch for fever, breathing difficulty, or severe swelling",
                    "Painful or blistering rashes need medical evaluation"
                ],
                "follow_up": "Monitor for 24-48 hours; consult doctor if persistent"
            }
        }

        # Get guidance for injury type or use default
        guidance = guidance_map.get(
            injury_type,
            {
                "first_aid_steps": [
                    "Keep area clean",
                    "Monitor for changes",
                    "Seek professional medical advice"
                ],
                "warnings": [
                    "When in doubt, consult a healthcare provider"
                ],
                "follow_up": "Medical evaluation recommended"
            }
        )

        # Add risk-specific urgency
        if risk_level == "HIGH":
            guidance["urgency"] = "⚠️ SEEK IMMEDIATE MEDICAL ATTENTION"
        elif risk_level == "MEDIUM":
            guidance["urgency"] = "⏰ Consult healthcare provider within 24 hours"
        else:
            guidance["urgency"] = "ℹ️ Monitor and apply first aid"

        # Always include disclaimer
        guidance["disclaimer"] = (
            "This is a prototype for demonstration purposes only. "
            "Not intended for medical diagnosis or treatment. "
            "Always consult qualified healthcare professionals for medical advice."
        )

        return guidance
