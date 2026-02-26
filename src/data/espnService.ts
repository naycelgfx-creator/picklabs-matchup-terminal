// ESPN Athletes API Service — supports NBA, NFL, MLB, NHL
// Base URL: https://sports.core.api.espn.com/v2/sports/...

export interface ESPNAthlete {
    id: string;
    fullName: string;
    shortName: string;
    firstName: string;
    lastName: string;
    jersey?: string;
    age?: number;
    displayHeight?: string;
    displayWeight?: string;
    position?: {
        abbreviation: string;
        displayName: string;
    };
    headshot?: {
        href: string;
        alt: string;
    };
    college?: string;
    salary?: number;
    active?: boolean;
    experience?: { years: number };
    team?: string;
}

export interface ESPNRosterAthlete extends ESPNAthlete {
    photoUrl: string;
    salaryFormatted: string;
    collegeName: string;
}

const ESPN_NBA_BASE = 'https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba';

// ─── Team ID maps ────────────────────────────────────────────────────────────

export const NBA_TEAM_IDS: Record<string, number> = {
    'Hawks': 1, 'Celtics': 2, 'Nets': 17, 'Hornets': 30, 'Bulls': 4,
    'Cavaliers': 5, 'Mavericks': 6, 'Nuggets': 7, 'Pistons': 8, 'Warriors': 9,
    'Rockets': 10, 'Pacers': 11, 'Clippers': 12, 'Lakers': 13, 'Heat': 14,
    'Bucks': 15, 'Timberwolves': 16, 'Pelicans': 3, 'Knicks': 18, 'Thunder': 25,
    'Magic': 19, '76ers': 20, 'Suns': 21, 'Trail Blazers': 22, 'Kings': 23,
    'Spurs': 24, 'Raptors': 28, 'Jazz': 26, 'Wizards': 27, 'Grizzlies': 29
};

export const NFL_TEAM_IDS: Record<string, number> = {
    'Bills': 2, 'Dolphins': 15, 'Patriots': 17, 'Jets': 20,
    'Ravens': 33, 'Bengals': 4, 'Browns': 5, 'Steelers': 23,
    'Texans': 34, 'Colts': 11, 'Jaguars': 30, 'Titans': 10,
    'Broncos': 7, 'Chiefs': 12, 'Raiders': 13, 'Chargers': 24,
    'Cowboys': 6, 'Giants': 19, 'Eagles': 21, 'Commanders': 28,
    'Bears': 3, 'Lions': 8, 'Packers': 9, 'Vikings': 16,
    'Falcons': 1, 'Panthers': 29, 'Saints': 18, 'Buccaneers': 27,
    'Cardinals': 22, 'Rams': 14, '49ers': 25, 'Seahawks': 26
};

export const MLB_TEAM_IDS: Record<string, number> = {
    'Yankees': 10, 'Red Sox': 2, 'Blue Jays': 14, 'Rays': 30, 'Orioles': 1,
    'White Sox': 4, 'Guardians': 5, 'Tigers': 6, 'Royals': 7, 'Twins': 9,
    'Astros': 18, 'Angels': 3, 'Athletics': 11, 'Mariners': 12, 'Rangers': 13,
    'Braves': 15, 'Marlins': 28, 'Mets': 21, 'Phillies': 22, 'Nationals': 20,
    'Cubs': 16, 'Reds': 17, 'Brewers': 8, 'Pirates': 23, 'Cardinals': 24,
    'Diamondbacks': 29, 'Rockies': 27, 'Dodgers': 19, 'Padres': 25, 'Giants': 26
};

export const NHL_TEAM_IDS: Record<string, number> = {
    'Bruins': 1, 'Sabres': 2, 'Red Wings': 3, 'Panthers': 13, 'Canadiens': 8,
    'Senators': 9, 'Lightning': 14, 'Maple Leafs': 10, 'Hurricanes': 12,
    'Blackhawks': 16, 'Avalanche': 17, 'Stars': 25, 'Wild': 30, 'Predators': 18,
    'Blues': 19, 'Jets': 52, 'Ducks': 24, 'Flames': 20, 'Oilers': 22,
    'Kings': 26, 'Sharks': 28, 'Kraken': 55, 'Canucks': 23, 'Golden Knights': 54,
    'Capitals': 15, 'Blue Jackets': 29, 'Devils': 1, 'Islanders': 6, 'Rangers': 7
};

// ─── Sport routing config ────────────────────────────────────────────────────

interface SportConfig { sport: string; league: string; headshotSport: string; season: number; }

const ESPN_SPORT_CONFIG: Record<string, SportConfig> = {
    'NBA': { sport: 'basketball', league: 'nba', headshotSport: 'nba', season: 2026 },
    'NFL': { sport: 'football', league: 'nfl', headshotSport: 'nfl', season: 2025 },
    'MLB': { sport: 'baseball', league: 'mlb', headshotSport: 'mlb', season: 2025 },
    'NHL': { sport: 'hockey', league: 'nhl', headshotSport: 'nhl', season: 2026 },
};

const SPORT_TEAM_IDS: Record<string, Record<string, number>> = {
    'NBA': NBA_TEAM_IDS,
    'NFL': NFL_TEAM_IDS,
    'MLB': MLB_TEAM_IDS,
    'NHL': NHL_TEAM_IDS,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const formatSalary = (salary?: number): string => {
    if (!salary) return 'N/A';
    if (salary >= 1_000_000) return `$${(salary / 1_000_000).toFixed(1)}M`;
    if (salary >= 1_000) return `$${(salary / 1_000).toFixed(0)}K`;
    return `$${salary}`;
};

const parseAthleteDetail = (d: Record<string, unknown>, sport: string): ESPNRosterAthlete => {
    const salary = ((d.contract as Record<string, unknown>)?.salary as number) ?? undefined;
    const pos = d.position as Record<string, string> | undefined;
    const headshot = d.headshot as Record<string, string> | undefined;
    const config = ESPN_SPORT_CONFIG[sport];
    const espnHeadshot = config
        ? `https://a.espncdn.com/i/headshots/${config.headshotSport}/players/full/${d.id}.png`
        : undefined;
    const photoUrl = headshot?.href
        ?? espnHeadshot
        ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(d.fullName as string)}&background=1a1a2e&color=39ff14&rounded=true`;

    return {
        id: String(d.id ?? ''),
        fullName: String(d.fullName ?? ''),
        shortName: String(d.shortName ?? d.fullName ?? ''),
        firstName: String(d.firstName ?? ''),
        lastName: String(d.lastName ?? ''),
        jersey: d.jersey as string | undefined,
        age: d.age as number | undefined,
        displayHeight: d.displayHeight as string | undefined,
        displayWeight: d.displayWeight as string | undefined,
        position: pos ? { abbreviation: pos.abbreviation, displayName: pos.displayName } : undefined,
        headshot: headshot ? { href: headshot.href, alt: headshot.alt } : undefined,
        salary,
        active: d.active as boolean | undefined,
        experience: d.experience as { years: number } | undefined,
        photoUrl,
        salaryFormatted: formatSalary(salary),
        collegeName: 'N/A',
    };
};

// ─── Generic multi-sport roster fetch ────────────────────────────────────────

export const fetchESPNRosterBySport = async (teamName: string, sport: string): Promise<ESPNRosterAthlete[]> => {
    const config = ESPN_SPORT_CONFIG[sport];
    const teamIds = SPORT_TEAM_IDS[sport];
    if (!config || !teamIds) return [];

    // Find team ID — exact match first, then partial/last-word match
    let teamId = teamIds[teamName];
    if (!teamId) {
        const lastWord = (teamName.toLowerCase().split(' ').pop() ?? '');
        const key = Object.keys(teamIds).find(k =>
            teamName.toLowerCase().includes(k.toLowerCase()) ||
            k.toLowerCase().includes(lastWord)
        );
        if (key) teamId = teamIds[key];
    }
    if (!teamId) return [];

    const rosterUrl = `https://sports.core.api.espn.com/v2/sports/${config.sport}/leagues/${config.league}/seasons/${config.season}/teams/${teamId}/athletes?limit=60`;

    try {
        const rosterRes = await fetch(rosterUrl);
        if (!rosterRes.ok) throw new Error('Fetch failed');
        const rosterData = await rosterRes.json();

        const refs: string[] = (rosterData.items || []).map((item: { $ref: string }) => item.$ref);
        const limit = sport === 'NFL' ? 30 : 25;

        const details = await Promise.allSettled(
            refs.slice(0, limit).map(ref => fetch(ref).then(r => r.json()))
        );

        return details
            .filter(r => r.status === 'fulfilled')
            .map(r => parseAthleteDetail((r as PromiseFulfilledResult<Record<string, unknown>>).value, sport));
    } catch (err) {
        console.warn(`ESPN ${sport} roster fetch failed for ${teamName}:`, err);
        return [];
    }
};

// Backward-compat: used by LiveRoster component
export const fetchESPNTeamRoster = async (teamName: string): Promise<ESPNRosterAthlete[]> => {
    return fetchESPNRosterBySport(teamName, 'NBA');
};

// ─── All active NBA athletes (used by discovery/search) ──────────────────────

export const fetchAllNBAAthetes = async (limit = 100): Promise<ESPNRosterAthlete[]> => {
    try {
        const res = await fetch(`${ESPN_NBA_BASE}/athletes?limit=${limit}&active=true`);
        if (!res.ok) throw new Error('Failed to fetch athletes list');
        const data = await res.json();
        const refs: string[] = (data.items || []).map((item: { $ref: string }) => item.$ref);
        const details = await Promise.allSettled(
            refs.slice(0, limit).map(ref => fetch(ref.replace('http://', 'https://')).then(r => r.json()))
        );
        return details
            .filter(r => r.status === 'fulfilled')
            .map(r => parseAthleteDetail((r as PromiseFulfilledResult<Record<string, unknown>>).value, 'NBA'));
    } catch (err) {
        console.error('ESPN athletes fetch failed:', err);
        return [];
    }
};
