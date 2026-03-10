import { useState } from 'react';

export interface TeamInfo {
    winPct: number;
    wins: number;
    record: string;
    standing: string;
    streak: string;
    homeRecord: string;
    awayRecord: string;
    last10: string;
    headCoach: string;
    venue: string;
    injuries: { player: string; injury: string; status: string }[];
    recentForm: ('W' | 'L' | 'D')[];
}

export function useESPNTeamInfo(teamName: string, sport: string) {
    console.log(teamName, sport);
    const [info] = useState<TeamInfo | null>(null);
    const [loading] = useState(false);
    return { info, loading, error: null };
}
