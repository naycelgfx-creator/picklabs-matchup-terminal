/**
 * apiClient.ts
 * Unified frontend service connecting to the local Node.js Picklabs Master Engine (Port 5000)
 */

const BASE_URL = 'http://localhost:5000/api/data';

/**
 * Universal interface for an ESPN Team
 */
export interface ESPNTeam {
    id: string;
    uid: string;
    slug: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    name: string;
    nickname: string;
    location: string;
    color: string;
    alternateColor: string;
    isActive: boolean;
    isAllStar: boolean;
    logos: {
        href: string;
        alt: string;
        rel: string[];
        width: number;
        height: number;
    }[];
    links: {
        language: string;
        rel: string[];
        href: string;
        text: string;
        shortText: string;
        isExternal: boolean;
        isPremium: boolean;
    }[];
}

/**
 * Universal interface for an ESPN Game/Event
 */
export interface ESPNGame {
    id: string;
    uid: string;
    date: string;
    name: string;
    shortName: string;
    season: {
        year: number;
        type: number;
        slug: string;
    };
    competitions: {
        id: string;
        uid: string;
        date: string;
        attendance: number;
        type: {
            id: string;
            abbreviation: string;
        };
        timeValid: boolean;
        neutralSite: boolean;
        conferenceCompetition: boolean;
        playByPlayAvailable: boolean;
        recent: boolean;
        venue: {
            id: string;
            fullName: string;
            address: {
                city: string;
                state: string;
            };
            capacity: number;
            indoor: boolean;
        };
        competitors: {
            id: string;
            uid: string;
            type: string;
            order: number;
            homeAway: 'home' | 'away';
            winner: boolean;
            team: ESPNTeam;
            score: string;
            linescores?: { value: number }[];
            statistics: any[];
            leaders?: any[];
            records: { name: string; abbreviation?: string; type: string; summary: string }[];
        }[];
        notes: any[];
        status: {
            clock: number;
            displayClock: string;
            period: number;
            type: {
                id: string;
                name: string;
                state: 'pre' | 'in' | 'post';
                completed: boolean;
                description: string;
                detail: string;
                shortDetail: string;
            };
        };
        broadcasts: {
            market: string;
            names: string[];
        }[];
        format: {
            regulation: {
                periods: number;
            };
        };
        odds?: {
            provider: {
                id: string;
                name: string;
                priority: number;
            };
            details: string; // e.g. "UTA -1.5"
            overUnder: number;
            spread?: number;
            overOdds?: number;
            underOdds?: number;
            awayTeamOdds?: {
                favorite: boolean;
                underdog: boolean;
                moneyLine: number;
                spreadOdds: number;
            };
            homeTeamOdds?: {
                favorite: boolean;
                underdog: boolean;
                moneyLine: number;
                spreadOdds: number;
            };
        }[];
    }[];
    links: {
        language: string;
        rel: string[];
        href: string;
        text: string;
        shortText: string;
        isExternal: boolean;
        isPremium: boolean;
    }[];
    status: {
        clock: number;
        displayClock: string;
        period: number;
        type: {
            id: string;
            name: string;
            state: 'pre' | 'in' | 'post';
            completed: boolean;
            description: string;
            detail: string;
        };
    };
    sport?: string; // Appended by our router/client
    league?: string; // Appended by our router/client
}

export type SportKey =
    | 'nfl'
    | 'nba'
    | 'mlb'
    | 'nhl'
    | 'wnba'
    | 'ncaaf'
    | 'ncaam'
    | 'ncaaw'
    | 'cfl'
    | 'ufc'
    | 'boxing'
    | 'mls'
    | 'epl'
    | 'ligamx'
    | 'f1'
    | 'nascar'
    | 'nascar-xfinity'
    | 'nascar-truck'
    | 'pga'
    | 'ncaabaseball'
    | 'ncaasoftball'
    | 'wbc'
    | 'llb'
    | 'dwl'
    | 'mwl'
    | 'ncaahockey'
    | 'efl'
    | 'laliga'
    | 'seriea'
    | 'bundesliga'
    | 'ligue1'
    | 'ucl'
    | 'uel'
    | 'worldcup'
    | 'soccer'
    | 'indycar'
    | 'lpga'
    | 'eur'
    | 'atp'
    | 'wta'
    | 'ncaamvb'
    | 'ncaawvb'
    | 'ncaamlax'
    | 'ncaawlax';

export const APP_SPORT_TO_ESPN: Record<SportKey, { sport: string; league: string }> = {
    'nfl': { sport: 'football', league: 'nfl' },
    'nba': { sport: 'basketball', league: 'nba' },
    'mlb': { sport: 'baseball', league: 'mlb' },
    'nhl': { sport: 'hockey', league: 'nhl' },
    'wnba': { sport: 'basketball', league: 'wnba' },
    'ncaaf': { sport: 'football', league: 'college-football' },
    'ncaam': { sport: 'basketball', league: 'mens-college-basketball' },
    'ncaaw': { sport: 'basketball', league: 'womens-college-basketball' },
    'cfl': { sport: 'football', league: 'cfl' },
    'ufc': { sport: 'mma', league: 'ufc' },
    'boxing': { sport: 'boxing', league: 'boxing' },
    'mls': { sport: 'soccer', league: 'usa.1' }, // Major League Soccer
    'epl': { sport: 'soccer', league: 'eng.1' }, // English Premier League
    'ligamx': { sport: 'soccer', league: 'mex.1' }, // Liga MX
    'f1': { sport: 'racing', league: 'f1' },
    'nascar': { sport: 'racing', league: 'nascar' },
    'nascar-xfinity': { sport: 'racing', league: 'xfinity' },
    'nascar-truck': { sport: 'racing', league: 'truck' },
    'pga': { sport: 'golf', league: 'pga' },

    // College / World Baseball
    'ncaabaseball': { sport: 'baseball', league: 'college-baseball' },
    'ncaasoftball': { sport: 'baseball', league: 'college-softball' },
    'wbc': { sport: 'baseball', league: 'world-baseball-classic' },
    'llb': { sport: 'baseball', league: 'llb' },
    'dwl': { sport: 'baseball', league: 'dominican-winter-league' },
    'mwl': { sport: 'baseball', league: 'mexican-winter-league' },

    // Hockey
    'ncaahockey': { sport: 'hockey', league: 'mens-college-hockey' },

    // Global Soccer
    'efl': { sport: 'soccer', league: 'eng.2' },
    'laliga': { sport: 'soccer', league: 'esp.1' },
    'seriea': { sport: 'soccer', league: 'ita.1' },
    'bundesliga': { sport: 'soccer', league: 'ger.1' },
    'ligue1': { sport: 'soccer', league: 'fra.1' },
    'ucl': { sport: 'soccer', league: 'uefa.champions' },
    'uel': { sport: 'soccer', league: 'uefa.europa' },
    'worldcup': { sport: 'soccer', league: 'fifa.world' },
    'soccer': { sport: 'soccer', league: 'all' },

    // Racing
    'indycar': { sport: 'racing', league: 'indycar' },

    // Golf & Tennis
    'lpga': { sport: 'golf', league: 'lpga' },
    'eur': { sport: 'golf', league: 'eur' },
    'atp': { sport: 'tennis', league: 'atp' },
    'wta': { sport: 'tennis', league: 'wta' },

    // Niche College
    'ncaamvb': { sport: 'volleyball', league: 'mens-college-volleyball' },
    'ncaawvb': { sport: 'volleyball', league: 'womens-college-volleyball' },
    'ncaamlax': { sport: 'lacrosse', league: 'mens-college-lacrosse' },
    'ncaawlax': { sport: 'lacrosse', league: 'womens-college-lacrosse' }
};

export const ESPN_SCOREBOARD_URLS: Record<string, string> = {
    UFC: 'https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard',
    Boxing: 'https://site.api.espn.com/apis/site/v2/sports/boxing/match/scoreboard',
    NASCAR: 'https://site.api.espn.com/apis/site/v2/sports/racing/nascar/scoreboard',
    Tennis: 'https://site.api.espn.com/apis/site/v2/sports/tennis/atp/scoreboard',
    'Tennis-WTA': 'https://site.api.espn.com/apis/site/v2/sports/tennis/wta/scoreboard'
};

export const SOCCER_LEAGUES: { id: SportKey; label: string; logo?: string }[] = [
    { id: 'epl', label: 'Premier League', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png' },
    { id: 'mls', label: 'MLS', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/19.png' },
    { id: 'ligamx', label: 'Liga MX', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/22.png' }
];

export const TENNIS_TOURS: { id: SportKey; label: string; logo?: string }[] = [];

export const ACTIVE_LEAGUES: SportKey[] = [
    'nfl', 'nba', 'mlb', 'nhl', 'wnba', 'ncaaf', 'ncaam', 'ncaaw', 'cfl',
    'ufc', 'mls', 'epl', 'ligamx', 'f1', 'nascar', 'pga',
    'ncaabaseball', 'ncaasoftball', 'wbc', 'llb', 'ncaahockey',
    'ucl', 'efl', 'laliga', 'seriea', 'bundesliga', 'ligue1', 'worldcup', 'soccer',
    'ncaamvb', 'ncaawvb', 'ncaamlax', 'ncaawlax', 'atp', 'wta'
];

/**
 * Universal backend fetcher pointing to the node proxy
 */
export async function fetchFromBackend(endpoint: string, options?: RequestInit) {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Backend Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch from backend:`, error);
        return null; // Don't crash frontend on network failure
    }
}

// -------------------------------------------------------------
// Core API Methods
// -------------------------------------------------------------

export async function fetchScoreboard(sportKey: SportKey, dateString?: string): Promise<ESPNGame[]> {
    const routing = APP_SPORT_TO_ESPN[sportKey];
    if (!routing) return [];

    const qs = dateString ? `?dates=${dateString.replace(/-/g, '')}` : '';
    const data = await fetchFromBackend(`/${routing.sport}/${routing.league}/scoreboard${qs}`);

    // Inject sport and league into the root of each event
    const events: ESPNGame[] = data?.events || [];
    return events.map(e => ({
        ...e,
        sport: routing.sport,
        league: routing.league
    }));
}

export async function fetchGameSummary(sportKey: SportKey, eventId: string) {
    const routing = APP_SPORT_TO_ESPN[sportKey];
    if (!routing) return null;
    return await fetchFromBackend(`/${routing.sport}/${routing.league}/summary/${eventId}`);
}

export async function fetchTeams(sportKey: SportKey) {
    const routing = APP_SPORT_TO_ESPN[sportKey];
    if (!routing) return null;
    return await fetchFromBackend(`/${routing.sport}/${routing.league}/teams`);
}

export async function fetchStandings(sportKey: SportKey) {
    const routing = APP_SPORT_TO_ESPN[sportKey];
    if (!routing) return null;
    return await fetchFromBackend(`/${routing.sport}/${routing.league}/standings`);
}

export async function fetchLeaders(sportKey: SportKey) {
    const routing = APP_SPORT_TO_ESPN[sportKey];
    if (!routing) return null;
    return await fetchFromBackend(`/${routing.sport}/${routing.league}/leaders`);
}

export async function fetchNews(sportKey: SportKey) {
    const routing = APP_SPORT_TO_ESPN[sportKey];
    if (!routing) return null;
    return await fetchFromBackend(`/${routing.sport}/${routing.league}/news`);
}

export async function fetchAthleteDeepDive(sportKey: SportKey, athleteId: string) {
    const routing = APP_SPORT_TO_ESPN[sportKey];
    if (!routing) return null;
    return await fetchFromBackend(`/${routing.sport}/${routing.league}/athletes/${athleteId}`);
}

export async function fetchAthleteStatisticsLog(sportKey: SportKey, athleteId: string) {
    const routing = APP_SPORT_TO_ESPN[sportKey];
    if (!routing) return null;
    return await fetchFromBackend(`/${routing.sport}/${routing.league}/athletes/${athleteId}/statisticslog`);
}

export async function fetchSchedule(sportKey: SportKey) {
    const routing = APP_SPORT_TO_ESPN[sportKey];
    if (!routing) return null;
    return await fetchFromBackend(`/${routing.sport}/${routing.league}/schedule`);
}

/**
 * MOCK: Fetch game counts by date for DateFilter UI compilation
 */
export async function fetchGameCountsByDate(sport: SportKey, dates: string[]): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const d of dates) {
        counts[d] = 0;
    }
    return counts;
}

export interface ESPNRosterAthlete {
    id: string;
    fullName: string;
    shortName: string;
    photoUrl: string;
    jersey?: string;
    position?: { abbreviation: string; displayName: string };
    age?: number;
    displayHeight?: string;
    displayWeight?: string;
    experience?: { years: number };
    collegeName?: string;
    salary?: number;
    salaryFormatted?: string;
    headshot?: string;
}

export const NBA_TEAM_IDS: Record<string, number> = {
    'boston celtics': 1,
    'brooklyn nets': 2,
    'new york knicks': 3,
    'philadelphia 76ers': 4,
    'toronto raptors': 5,
    'chicago bulls': 6,
    'cleveland cavaliers': 7,
    'detroit pistons': 8,
    'indiana pacers': 9,
    'milwaukee bucks': 10,
    'atlanta hawks': 11,
    'charlotte hornets': 12,
    'miami heat': 13,
    'orlando magic': 14,
    'washington wizards': 15,
    'denver nuggets': 16,
    'minnesota timberwolves': 17,
    'oklahoma city thunder': 18,
    'portland trail blazers': 19,
    'utah jazz': 20,
    'golden state warriors': 21,
    'la clippers': 22,
    'los angeles lakers': 23,
    'phoenix suns': 24,
    'sacramento kings': 25,
    'dallas mavericks': 26,
    'houston rockets': 27,
    'memphis grizzlies': 28,
    'new orleans pelicans': 29,
    'san antonio spurs': 30
};
export const NFL_TEAM_IDS: Record<string, number> = {
    'kansas city chiefs': 15,
};
export const MLB_TEAM_IDS: Record<string, number> = {
    'arizona diamondbacks': 1,
    'atlanta braves': 2,
    'baltimore orioles': 3,
    'boston red sox': 4,
    'chicago cubs': 5,
    'chicago white sox': 6,
    'cincinnati reds': 7,
    'cleveland guardians': 8,
    'colorado rockies': 9,
    'detroit tigers': 10,
    'houston astros': 11,
    'kansas city royals': 12,
    'los angeles angels': 13,
    'los angeles dodgers': 14,
    'miami marlins': 15,
    'milwaukee brewers': 16,
    'minnesota twins': 17,
    'new york mets': 18,
    'new york yankees': 19,
    'oakland athletics': 20,
    'philadelphia phillies': 21,
    'pittsburgh pirates': 22,
    'san diego padres': 23,
    'san francisco giants': 24,
    'seattle mariners': 25,
    'st. louis cardinals': 26,
    'tampa bay rays': 27,
    'texas rangers': 28,
    'toronto blue jays': 29,
    'washington nationals': 30
};
export const NHL_TEAM_IDS: Record<string, number> = {
    'anaheim ducks': 1,
    'arizona coyotes': 2,
    'boston bruins': 3,
    'buffalo sabres': 4,
    'calgary flames': 5,
    'carolina hurricanes': 6,
    'chicago blackhawks': 7,
    'colorado avalanche': 8,
    'columbus blue jackets': 9,
    'dallas stars': 10,
    'detroit red wings': 12,
    'edmonton oilers': 13,
    'florida panthers': 14,
    'los angeles kings': 15,
    'minnesota wild': 16,
    'montreal canadiens': 17,
    'nashville predators': 18,
    'new jersey devils': 19,
    'new york islanders': 20,
    'new york rangers': 21,
    'ottawa senators': 22,
    'philadelphia flyers': 23,
    'pittsburgh penguins': 24,
    'san jose sharks': 25,
    'seattle kraken': 26,
    'st. louis blues': 28,
    'tampa bay lightning': 29,
    'toronto maple leafs': 30,
    'vancouver canucks': 31,
    'vegas golden knights': 52,
    'washington capitals': 53,
    'winnipeg jets': 54,
    'utah hockey club': 59
};
export const SPORTS_WITH_API_SPORTS: string[] = [];

export async function fetchESPNRosterBySport(teamName: string, sportKey: string): Promise<ESPNRosterAthlete[]> {
    const routing = APP_SPORT_TO_ESPN[sportKey.toLowerCase() as SportKey];
    if (!routing) return [];

    try {
        const searchName = teamName.toLowerCase().replace('st.', 'state');
        let teamId = null;

        // 1a. Fast-path ID lookup
        if (sportKey.toLowerCase() === 'nba') teamId = NBA_TEAM_IDS[searchName] || null;
        else if (sportKey.toLowerCase() === 'nfl') teamId = NFL_TEAM_IDS[searchName] || null;
        else if (sportKey.toLowerCase() === 'mlb') teamId = MLB_TEAM_IDS[searchName] || null;
        else if (sportKey.toLowerCase() === 'nhl') teamId = NHL_TEAM_IDS[searchName] || null;

        // 1b. Fallback live fetch
        if (!teamId) {
            const teamsRaw = await fetchTeams(sportKey as SportKey);
            const teams = teamsRaw?.sports?.[0]?.leagues?.[0]?.teams || [];

            for (const t of teams) {
                const tName = t.team.displayName.toLowerCase();
                const tAbbr = t.team.abbreviation?.toLowerCase();
                if (tName === searchName || tAbbr === searchName || tName.includes(searchName)) {
                    teamId = t.team.id;
                    break;
                }
            }
        }

        if (!teamId) {
            console.warn(`Could not find team ID for ${teamName} in ${sportKey}`);
            return [];
        }

        // 2. Fetch roster by team ID
        const rosterData = await fetchFromBackend(`/${routing.sport}/${routing.league}/teams/${teamId}/roster`);
        const athletes = rosterData?.athletes || [];

        return athletes.map((a: any) => ({
            id: a.id,
            fullName: a.fullName || a.displayName,
            shortName: a.shortName || a.displayName,
            photoUrl: a.headshot?.href || '',
            jersey: a.jersey,
            position: a.position,
            age: a.age,
            displayHeight: a.displayHeight,
            displayWeight: a.displayWeight,
            experience: a.experience,
            salary: a.contract?.salary,
            salaryFormatted: a.contract?.salary ? `\$${a.contract.salary.toLocaleString()}` : undefined
        }));
    } catch (e) {
        console.error('Error fetching ESPN Roster:', e);
        return [];
    }
}

export async function getApiSportsRoster(_sport: string, _teamName: string): Promise<ESPNRosterAthlete[]> {
    console.log(_sport, _teamName);
    return [];
}

export async function getApiSportsMMAFighters(): Promise<ESPNRosterAthlete[]> {
    return [];
}
