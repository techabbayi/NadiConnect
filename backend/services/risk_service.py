"""
Risk Classification Engine
==========================
Rule-based risk assessment: LOW / MEDIUM / HIGH
"""


class RiskClassifier:
    """
    Classifies injury risk level based on type and confidence.
    Uses simple rule-based logic.
    """

    def classify_risk(self, injury_type: str, confidence: float, visual_notes: str) -> dict:
        """
        Determine risk level using enhanced predefined rules.

        Returns:
            dict with risk_level, risk_reason, risk_color, risk_factors
        """

        risk_level = "MEDIUM"  # Default
        risk_reason = ""
        risk_color = ""
        risk_factors = []

        # HIGH RISK keywords and conditions
        high_risk_keywords = ["fracture", "large", "severe", "deep", "extensive", "active bleeding",
                              "open wound", "exposed", "active bleeding detected"]
        critical_keywords = ["active bleeding",
                             "open laceration", "bone", "fracture"]

        # Analyze visual notes for risk indicators
        notes_lower = visual_notes.lower()
        has_bleeding = "bleed" in notes_lower or "blood" in notes_lower
        has_open_wound = "open wound" in notes_lower or "laceration" in notes_lower
        has_bruising = "bruis" in notes_lower or "purple" in notes_lower or "discoloration" in notes_lower

        # CUT/LACERATION with bleeding = HIGH RISK
        if injury_type == "cut" and has_bleeding and has_open_wound:
            risk_level = "HIGH"
            risk_factors = [
                "Open laceration present",
                "Active bleeding detected",
                "Bruising suggests possible deeper tissue impact" if has_bruising else "Risk of infection",
                "Requires immediate medical attention"
            ]
            risk_reason = "\n• ".join([""] + risk_factors)
            risk_color = "red"

        # FRACTURE = HIGH RISK
        elif injury_type in ["fracture"]:
            risk_level = "HIGH"
            risk_factors = [
                "Possible bone fracture",
                "Immediate medical evaluation required",
                "Risk of displacement",
                "Potential complications if untreated"
            ]
            risk_reason = "\n• ".join([""] + risk_factors)
            risk_color = "red"

        # SEVERE BURN = HIGH RISK
        elif injury_type == "burn" and confidence > 0.75:
            risk_level = "HIGH"
            risk_factors = [
                "Thermal injury detected",
                "Burns require professional treatment",
                "Risk of infection",
                "Prevent complications and scarring"
            ]
            risk_reason = "\n• ".join([""] + risk_factors)
            risk_color = "red"

        # Check for critical keywords
        elif any(keyword in notes_lower for keyword in critical_keywords):
            risk_level = "HIGH"
            risk_factors = [
                "Severity indicators detected",
                "Professional medical attention needed",
                "Potential complications present"
            ]
            risk_reason = "\n• ".join([""] + risk_factors)
            risk_color = "red"

        # MEDIUM RISK conditions
        elif injury_type == "cut" and not has_bleeding:
            risk_level = "MEDIUM"
            risk_factors = [
                "Minor laceration",
                "Monitor for infection signs",
                "Keep wound clean"
            ]
            risk_reason = "\n• ".join([""] + risk_factors)
            risk_color = "yellow"

        elif injury_type in ["swelling", "bruise"]:
            risk_level = "MEDIUM"
            risk_factors = [
                f"{injury_type.capitalize()} detected",
                "Monitor and seek care if worsening",
                "Apply RICE method (Rest, Ice, Compression, Elevation)"
            ]
            risk_reason = "\n• ".join([""] + risk_factors)
            risk_color = "yellow"

        elif injury_type == "burn":
            risk_level = "MEDIUM"
            risk_factors = [
                "Burn detected",
                "Professional evaluation recommended",
                "Prevent infection"
            ]
            risk_reason = "\n• ".join([""] + risk_factors)
            risk_color = "yellow"

        elif injury_type == "rash":
            risk_level = "MEDIUM"
            risk_factors = [
                "Skin condition detected",
                "May require medical evaluation if persistent",
                "Monitor for worsening symptoms"
            ]
            risk_reason = "\n• ".join([""] + risk_factors)
            risk_color = "yellow"

        # LOW RISK conditions
        elif confidence < 0.60:
            risk_level = "MEDIUM"
            risk_factors = [
                "Unclear injury pattern",
                "Medical evaluation recommended for proper assessment"
            ]
            risk_reason = "\n• ".join([""] + risk_factors)
            risk_color = "yellow"

        else:
            risk_level = "LOW"
            risk_factors = [
                "Minor injury detected",
                "Basic first aid recommended",
                "Monitor and seek care if symptoms worsen"
            ]
            risk_reason = "\n• ".join([""] + risk_factors)
            risk_color = "green"

        return {
            "risk_level": risk_level,
            "risk_reason": risk_reason,
            "risk_color": risk_color,
            "risk_factors": risk_factors
        }

    def get_urgency_level(self, risk_level: str) -> str:
        """Map risk level to urgency"""
        urgency_map = {
            "HIGH": "Seek medical attention immediately",
            "MEDIUM": "Consult healthcare provider within 24 hours",
            "LOW": "Monitor and apply basic first aid"
        }
        return urgency_map.get(risk_level, "Consult healthcare provider")
