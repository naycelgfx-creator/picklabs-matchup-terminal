/**
 * Local mock for AI Prediction engine to simulate espnTeams functionality
 * This replaces the legacy API logic that was purged in the backend overhaul.
 */

export function generateAIPrediction(
    _homeRecord: string,
    _awayRecord: string,
    _sport: string,
    _homeForm: unknown[],
    _awayForm: unknown[]
) {
    // Basic deterministic mock to simulate AI
    return {
        awayWinProb: 45,
        homeWinProb: 55,
        moneylineHome: "-120",
        moneylineAway: "+100",
        spread: "-2.5",
        total: 215.5,
        overUnderPick: "OVER" as const,
        confidence: 88,
        insight: "Home court advantage trends strong.",
    };
}

export async function fetchTeamLastFive(_teamName: string, _sport: string): Promise<('W' | 'L' | 'D')[]> {
    return ['W', 'L', 'W', 'W', 'L'];
}

export interface ESPNScheduleGame {
    id: string;
    date: string;
    name: string;
    shortName: string;
    homeTeam: string;
    awayTeam: string;
    result: string;
    teamScore: number | null;
    opponentScore: number | null;
    isHome: boolean;
    opponentName: string;
    opponentAbbr: string;
    opponentLogo?: string;
}

export async function fetchESPNTeamSchedule(_teamId: string, _sportKey: string): Promise<ESPNScheduleGame[]> {
    return []; // Mock return for now as the master router doesn't strictly define this endpoint yet
}
