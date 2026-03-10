export interface ESPNNewsItem {
    id: string;
    headline: string;
    description: string;
    source: string;
    link: string;
    published: string;
    imageUrl?: string;
    images?: { url?: string; url1?: string }[];
    category?: 'injury' | 'trade' | 'game' | 'game-preview' | 'general';
    sport?: string;
}

export const CATEGORY_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
    injury: { icon: 'medical_services', color: 'text-red-400', label: 'Injury' },
    trade: { icon: 'swap_horiz', color: 'text-blue-400', label: 'Trade' },
    game: { icon: 'sports_esports', color: 'text-green-400', label: 'Game Info' },
    'game-preview': { icon: 'query_stats', color: 'text-primary', label: 'Preview' },
    general: { icon: 'article', color: 'text-slate-400', label: 'News' }
};

export async function fetchESPNNews(_sportKey: string): Promise<ESPNNewsItem[]> {
    console.log(_sportKey);
    return []; // Mock return for now
}

export async function fetchMultiSportNews(_sports: string[] = []): Promise<ESPNNewsItem[]> {
    console.log(_sports);
    return []; // Mock return for now
}

export function timeAgo(_dateString: string): string {
    console.log(_dateString);
    return "1 hr ago"; // Simple mock
}
