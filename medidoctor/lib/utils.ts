/**
 * Utility Functions
 */

export function getRiskColor(riskLevel: string): string {
    const colors: Record<string, string> = {
        LOW: 'bg-green-500',
        MEDIUM: 'bg-yellow-500',
        HIGH: 'bg-red-500',
    };
    return colors[riskLevel] || 'bg-gray-500';
}

export function getRiskTextColor(riskLevel: string): string {
    const colors: Record<string, string> = {
        LOW: 'text-green-600',
        MEDIUM: 'text-yellow-600',
        HIGH: 'text-red-600',
    };
    return colors[riskLevel] || 'text-gray-600';
}

export function getRiskBgColor(riskLevel: string): string {
    const colors: Record<string, string> = {
        LOW: 'bg-green-50 border-green-200',
        MEDIUM: 'bg-yellow-50 border-yellow-200',
        HIGH: 'bg-red-50 border-red-200',
    };
    return colors[riskLevel] || 'bg-gray-50 border-gray-200';
}

export function formatConfidence(confidence: number): string {
    return `${(confidence * 100).toFixed(0)}%`;
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
}

export function capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
