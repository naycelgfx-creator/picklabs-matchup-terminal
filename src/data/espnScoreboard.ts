// ESPN Scoreboard API Service
// Fetches real live/recent game data for 8 sports

export type SportKey =
    | 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'CFB' | 'CBB' | 'UFC'
    | 'Baseball.WBC'
    | 'Baseball.CWS'
    | 'Soccer.EPL'
    | 'Soccer.UCL'
    | 'Soccer.LALIGA'
    | 'Soccer.BUNDESLIGA'
    | 'Soccer.SERIEA'
    | 'Soccer.LIGUE1'
    | 'Soccer.MLS'
    | 'Soccer.LIGAMX'
    | 'Soccer.EREDIVISIE'
    | 'Soccer.BRASILEIRAO'
    | 'Soccer.LIGAPROFESIONAL'
    | 'Soccer.SCOTTISH'
    | 'Soccer.SUPERLIG'
    | 'Soccer.FIFA'
    | 'Soccer.COLOMBIA'
    | 'Soccer.ECUADOR'
    | 'Tennis.ATP'
    | 'Tennis.WTA'
    | 'Golf.PGA';

export const ESPN_SCOREBOARD_URLS: Record<SportKey, string> = {
    NBA: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
    NFL: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
    MLB: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
    'Baseball.WBC': 'https://site.api.espn.com/apis/site/v2/sports/baseball/world-baseball-classic/scoreboard',
    'Baseball.CWS': 'https://site.api.espn.com/apis/site/v2/sports/baseball/caribbean-series/scoreboard',
    NHL: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
    CFB: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard',
    CBB: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard',
    UFC: 'https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard',
    // ── Soccer leagues ──
    'Soccer.EPL': 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
    'Soccer.UCL': 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard',
    'Soccer.LALIGA': 'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard',
    'Soccer.BUNDESLIGA': 'https://site.api.espn.com/apis/site/v2/sports/soccer/ger.1/scoreboard',
    'Soccer.SERIEA': 'https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/scoreboard',
    'Soccer.LIGUE1': 'https://site.api.espn.com/apis/site/v2/sports/soccer/fra.1/scoreboard',
    'Soccer.MLS': 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard',
    'Soccer.LIGAMX': 'https://site.api.espn.com/apis/site/v2/sports/soccer/mex.1/scoreboard',
    'Soccer.EREDIVISIE': 'https://site.api.espn.com/apis/site/v2/sports/soccer/ned.1/scoreboard',
    'Soccer.BRASILEIRAO': 'https://site.api.espn.com/apis/site/v2/sports/soccer/bra.1/scoreboard',
    'Soccer.LIGAPROFESIONAL': 'https://site.api.espn.com/apis/site/v2/sports/soccer/arg.1/scoreboard',
    'Soccer.SCOTTISH': 'https://site.api.espn.com/apis/site/v2/sports/soccer/sco.1/scoreboard',
    'Soccer.SUPERLIG': 'https://site.api.espn.com/apis/site/v2/sports/soccer/tur.1/scoreboard',
    'Soccer.FIFA': 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard',
    'Soccer.COLOMBIA': 'https://site.api.espn.com/apis/site/v2/sports/soccer/col.1/scoreboard',
    'Soccer.ECUADOR': 'https://site.api.espn.com/apis/site/v2/sports/soccer/ecu.1/scoreboard',
    // ── Tennis tours ──
    'Tennis.ATP': 'https://site.api.espn.com/apis/site/v2/sports/tennis/atp/scoreboard',
    'Tennis.WTA': 'https://site.api.espn.com/apis/site/v2/sports/tennis/wta/scoreboard',
    // ── Golf ──
    'Golf.PGA': 'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard',
};

// Baseball league metadata
export interface BaseballLeague {
    key: SportKey;
    label: string;
    flag: string;
    logo: string;
}

export const BASEBALL_LEAGUES: BaseballLeague[] = [
    { key: 'MLB', label: 'MLB', flag: '🇺🇸', logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png' },
    { key: 'Baseball.WBC', label: 'World Baseball Classic', flag: '🌎', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/World_Baseball_Classic_logo.svg/330px-World_Baseball_Classic_logo.svg.png' },
    { key: 'Baseball.CWS', label: 'Caribbean Series', flag: '🌴', logo: 'https://upload.wikimedia.org/wikipedia/en/0/07/Caribbean_Series_logo.png' },
];

// Soccer league metadata for the sub-nav selector
export interface SoccerLeague {
    key: SportKey;
    label: string;
    flag: string;      // flag image URL
    logo: string;      // league crest URL
    country: string;   // Country name (e.g. USA, England, etc)
}

export const SOCCER_LEAGUES: SoccerLeague[] = [
    { key: 'Soccer.EPL', label: 'Premier League', flag: 'https://flagcdn.com/w40/gb-eng.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png', country: 'England' },
    { key: 'Soccer.UCL', label: 'Champions League', flag: 'https://flagcdn.com/w40/eu.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/2.png', country: 'Europe' },
    { key: 'Soccer.LALIGA', label: 'La Liga', flag: 'https://flagcdn.com/w40/es.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png', country: 'Spain' },
    { key: 'Soccer.BUNDESLIGA', label: 'Bundesliga', flag: 'https://flagcdn.com/w40/de.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/10.png', country: 'Germany' },
    { key: 'Soccer.SERIEA', label: 'Serie A', flag: 'https://flagcdn.com/w40/it.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/12.png', country: 'Italy' },
    { key: 'Soccer.LIGUE1', label: 'Ligue 1', flag: 'https://flagcdn.com/w40/fr.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/9.png', country: 'France' },
    { key: 'Soccer.MLS', label: 'MLS', flag: 'https://flagcdn.com/w40/us.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/19.png', country: 'USA' },
    { key: 'Soccer.LIGAMX', label: 'Liga MX', flag: 'https://flagcdn.com/w40/mx.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/22.png', country: 'Mexico' },
    { key: 'Soccer.EREDIVISIE', label: 'Eredivisie', flag: 'https://flagcdn.com/w40/nl.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/11.png', country: 'Netherlands' },
    { key: 'Soccer.BRASILEIRAO', label: 'Brasileirão', flag: 'https://flagcdn.com/w40/br.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/85.png', country: 'Brazil' },
    { key: 'Soccer.LIGAPROFESIONAL', label: 'Liga Profesional', flag: 'https://flagcdn.com/w40/ar.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1.png', country: 'Argentina' },
    { key: 'Soccer.SCOTTISH', label: 'Scottish Premiership', flag: 'https://flagcdn.com/w40/gb-sct.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/45.png', country: 'Scotland' },
    { key: 'Soccer.SUPERLIG', label: 'Süper Lig', flag: 'https://flagcdn.com/w40/tr.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/18.png', country: 'Turkey' },
    { key: 'Soccer.FIFA', label: 'FIFA World Cup', flag: 'https://flagcdn.com/w40/un.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/4.png', country: 'International' },
    { key: 'Soccer.COLOMBIA', label: 'Primera A', flag: 'https://flagcdn.com/w40/co.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1543.png', country: 'Colombia' },
    { key: 'Soccer.ECUADOR', label: 'Liga Pro', flag: 'https://flagcdn.com/w40/ec.png', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/1944.png', country: 'Ecuador' },
];

// Tennis tour metadata for the sub-nav selector
export interface TennisTour {
    key: SportKey;
    label: string;
    flag: string;
    description: string;
}

export const TENNIS_TOURS: TennisTour[] = [
    { key: 'Tennis.ATP', label: 'ATP Tour', flag: '🎾', description: "Men's" },
    { key: 'Tennis.WTA', label: 'WTA Tour', flag: '🎾', description: "Women's" },
];

export interface ESPNTeamInfo {
    id: string;
    displayName: string;
    abbreviation: string;
    logo: string;
    color: string;          // primary hex (no #)
    alternateColor: string;
    score: string;
    record: string;         // e.g. "42-14"
    homeAway: 'home' | 'away';
    winner: boolean;
    linescores: { period: number; value: number; displayValue: string }[];
}

export interface ESPNGameLeader {
    category: string;       // "Points", "Rebounds", "Assists"
    name: string;
    shortName: string;
    displayValue: string;   // "25"
    headshot: string;
    position: string;
    teamId: string;
}

export interface ESPNGame {
    id: string;
    sport: SportKey;
    name: string;           // "San Antonio Spurs at Detroit Pistons"
    shortName: string;      // "SA @ DET"
    date: string;           // ISO string
    status: 'pre' | 'in' | 'post';
    statusDetail: string;   // "Final" | "Q3 4:23" | "7:30 PM ET"
    statusClock?: string;
    period?: number;
    venue: string;
    city: string;
    broadcast: string;
    homeTeam: ESPNTeamInfo;
    awayTeam: ESPNTeamInfo;
    leaders: ESPNGameLeader[];
    headline?: string;      // Game recap headline
}

// Internal raw ESPN API shapes (loose typed for JSON deserialization)
type RawObj = Record<string, unknown>;

// Parse a raw ESPN competition into our ESPNGame shape
const parseCompetition = (event: RawObj, sport: SportKey): ESPNGame | null => {
    try {
        const comp = (event.competitions as RawObj[])?.[0];
        if (!comp) return null;

        const competitors: ESPNTeamInfo[] = (comp.competitors as RawObj[]).map((c: RawObj) => {
            const team = c.team as RawObj;
            const records = c.records as RawObj[] | undefined;
            const linescores = c.linescores as RawObj[] | undefined;
            return {
                id: team.id as string,
                displayName: team.displayName as string,
                abbreviation: team.abbreviation as string,
                logo: (team.logo as string) ?? `https://a.espncdn.com/i/teamlogos/nba/500/${(team.abbreviation as string)?.toLowerCase()}.png`,
                color: (team.color as string) ?? '1a1a2e',
                alternateColor: (team.alternateColor as string) ?? 'ffffff',
                score: (c.score as string) ?? '0',
                record: (records?.[0]?.summary as string) ?? '',
                homeAway: c.homeAway as 'home' | 'away',
                winner: (c.winner as boolean) ?? false,
                linescores: (linescores ?? []).map((ls: RawObj) => ({
                    period: ls.period as number,
                    value: ls.value as number,
                    displayValue: ls.displayValue as string,
                })),
            };
        });

        const homeTeam = competitors.find(c => c.homeAway === 'home')!;
        const awayTeam = competitors.find(c => c.homeAway === 'away')!;
        if (!homeTeam || !awayTeam) return null;

        // Extract leaders
        const leaders: ESPNGameLeader[] = [];
        const leaderCategories = ['points', 'rebounds', 'assists', 'completions', 'rushingYards', 'receivingYards', 'saves'];
        for (const cat of leaderCategories) {
            const catData = (comp.competitors as RawObj[]).flatMap((c: RawObj) =>
                ((c.leaders as RawObj[]) ?? []).filter((l: RawObj) => l.name === cat).flatMap((l: RawObj) =>
                    ((l.leaders as RawObj[]) ?? []).map((pl: RawObj) => {
                        const athlete = pl.athlete as RawObj | undefined;
                        const pos = athlete?.position as RawObj | undefined;
                        const team = pl.team as RawObj | undefined;
                        return {
                            category: l.displayName as string,
                            name: (athlete?.fullName as string) ?? '',
                            shortName: (athlete?.shortName as string) ?? '',
                            displayValue: (pl.displayValue as string) ?? '',
                            headshot: (athlete?.headshot as string) ?? '',
                            position: (pos?.abbreviation as string) ?? '',
                            teamId: (team?.id as string) ?? '',
                        };
                    })
                )
            );
            leaders.push(...catData.slice(0, 1));
        }

        const statusType = (event.status as RawObj)?.type as RawObj | undefined;
        let status: 'pre' | 'in' | 'post' = 'pre';
        if (statusType?.state === 'in') status = 'in';
        else if (statusType?.state === 'post') status = 'post';

        const venue = comp.venue as RawObj | undefined;
        const venueAddress = venue?.address as RawObj | undefined;
        const broadcast = (comp.broadcast as string) || (event.broadcast as string) || '';
        const headlines = comp.headlines as RawObj[] | undefined;
        const headline = (headlines?.[0]?.shortLinkText as string) ?? (event.name as string);

        return {
            id: event.id as string,
            sport,
            name: event.name as string,
            shortName: event.shortName as string,
            date: event.date as string,
            status,
            statusDetail: (statusType?.detail as string) ?? (statusType?.description as string) ?? '',
            statusClock: (event.status as RawObj)?.displayClock as string | undefined,
            period: (event.status as RawObj)?.period as number | undefined,
            venue: (venue?.fullName as string) ?? '',
            city: (venueAddress?.city as string) ?? '',
            broadcast,
            homeTeam,
            awayTeam,
            leaders,
            headline,
        };
    } catch {
        return null;
    }
};

// Fetch scoreboard for a given sport
export const fetchESPNScoreboard = async (sport: SportKey): Promise<ESPNGame[]> => {
    const url = ESPN_SCOREBOARD_URLS[sport];
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`ESPN ${sport} scoreboard failed: ${res.status}`);
        const data = await res.json() as RawObj;

        const events: ESPNGame[] = ((data.events as RawObj[]) ?? [])
            .map((e: RawObj) => parseCompetition(e, sport))
            .filter((g): g is ESPNGame => g !== null);

        // Sort: Live (in) first, Upcoming (pre) second, Final (post) last.
        return events.sort((a, b) => {
            const order = { 'in': 1, 'pre': 2, 'post': 3 };
            return order[a.status] - order[b.status];
        });
    } catch (err) {
        console.warn(`ESPN Scoreboard [${sport}] error:`, err);
        return [];
    }
};

// Fetch multiple sports in parallel
export const fetchMultiSportScoreboard = async (sports: SportKey[]): Promise<Record<SportKey, ESPNGame[]>> => {
    const results = await Promise.allSettled(sports.map(s => fetchESPNScoreboard(s)));
    const out = {} as Record<SportKey, ESPNGame[]>;
    sports.forEach((sport, i) => {
        const r = results[i];
        out[sport] = r.status === 'fulfilled' ? r.value : [];
    });
    return out;
};

// Map app sport names to ESPN sport keys
export const APP_SPORT_TO_ESPN: Record<string, SportKey | null> = {
    'NBA': 'NBA',
    'NFL': 'NFL',
    'MLB': 'MLB',
    'Baseball.WBC': 'Baseball.WBC',
    'Baseball.CWS': 'Baseball.CWS',
    'NHL': 'NHL',
    'NCAAB': 'CBB',
    'NCAAW': null,
    // Soccer: default to EPL; LiveBoard overrides with sub-league selection
    'Soccer': 'Soccer.EPL',
    'Soccer.EPL': 'Soccer.EPL',
    'Soccer.UCL': 'Soccer.UCL',
    'Soccer.LALIGA': 'Soccer.LALIGA',
    'Soccer.BUNDESLIGA': 'Soccer.BUNDESLIGA',
    'Soccer.SERIEA': 'Soccer.SERIEA',
    'Soccer.LIGUE1': 'Soccer.LIGUE1',
    'Soccer.MLS': 'Soccer.MLS',
    'Soccer.LIGAMX': 'Soccer.LIGAMX',
    'Soccer.EREDIVISIE': 'Soccer.EREDIVISIE',
    'Soccer.BRASILEIRAO': 'Soccer.BRASILEIRAO',
    'Soccer.LIGAPROFESIONAL': 'Soccer.LIGAPROFESIONAL',
    'Soccer.SCOTTISH': 'Soccer.SCOTTISH',
    'Soccer.SUPERLIG': 'Soccer.SUPERLIG',
    'Soccer.FIFA': 'Soccer.FIFA',
    'Soccer.COLOMBIA': 'Soccer.COLOMBIA',
    'Soccer.ECUADOR': 'Soccer.ECUADOR',
    'UFC': 'UFC',
    // Tennis: default to ATP; LiveBoard overrides with sub-tour selection
    'Tennis': 'Tennis.ATP',
    'Tennis.ATP': 'Tennis.ATP',
    'Tennis.WTA': 'Tennis.WTA',
    // Golf: PGA only for now
    'Golf': 'Golf.PGA',
    'Golf.PGA': 'Golf.PGA',
    'Esports': null,
};

// Fetch scoreboard for a specific date (YYYY-MM-DD)
export const fetchESPNScoreboardByDate = async (sport: SportKey, dateStr: string): Promise<ESPNGame[]> => {
    const baseUrl = ESPN_SCOREBOARD_URLS[sport];
    // ESPN uses dates= param with format YYYYMMDD
    const espnDate = dateStr.replace(/-/g, '');
    const url = `${baseUrl}?dates=${espnDate}`;
    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json() as RawObj;
        const events: ESPNGame[] = ((data.events as RawObj[]) ?? [])
            .map((e: RawObj) => parseCompetition(e, sport))
            .filter((g): g is ESPNGame => g !== null);

        // Sort: Live (in) first, Upcoming (pre) second, Final (post) last.
        return events.sort((a, b) => {
            const order = { 'in': 1, 'pre': 2, 'post': 3 };
            return order[a.status] - order[b.status];
        });
    } catch {
        return [];
    }
};

// For a given sport, fetch the next N days' game counts for calendar display
export const fetchGameCountsByDate = async (
    sport: SportKey,
    dates: string[]  // YYYY-MM-DD strings
): Promise<Record<string, number>> => {
    const results = await Promise.allSettled(
        dates.map(d => fetchESPNScoreboardByDate(sport, d))
    );
    const counts: Record<string, number> = {};
    dates.forEach((d, i) => {
        const r = results[i];
        counts[d] = r.status === 'fulfilled' ? r.value.length : 0;
    });
    return counts;
};

