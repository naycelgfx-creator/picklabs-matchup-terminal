import { useState } from 'react';

export interface BoxScorePlayer {
    id: string;
    name: string;
    shortName: string;
    position: string;
    jersey?: string;
    headshot?: string;
    starter: boolean;
    didNotPlay: boolean;
    hotScore: number;
    stats?: {
        pts: number | string;
        reb: number | string;
        ast: number | string;
        stl: number | string;
        blk: number | string;
        to: number | string;
        min: string;
        fg: string;
        fg3: string;
        ft: string;
        oreb: number | string;
        dreb: number | string;
        pf: number | string;
        plusMinus: number | string;
        fgPct: number;
        fg3Pct: number;
        ftPct: number;
    };
}

export interface GameLeader {
    name: string;
    headshot?: string;
    summary?: string;
    value: string | number;
    label: string;
}

export interface TeamBoxLeaders {
    team?: { displayName: string; logo: string; abbreviation: string };
    leaders?: GameLeader[];
    players: BoxScorePlayer[];
    teamName: string;
    teamLogo?: string;
    teamAbbr?: string;
    points: GameLeader | null;
    rebounds: GameLeader | null;
    assists: GameLeader | null;
    threePointers: GameLeader | null;
    steals: GameLeader | null;
    blocks: GameLeader | null;
}

export function useESPNBoxScore(sport: string, eventId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    return { data, loading, error: null };
}
