/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { SPORT_LOGOS } from '../../data/mockGames';
import { TeamDetails } from './TeamDetails';
import { SoccerLeagueNav } from '../live-board/SoccerLeagueNav';
import { BaseballSubNav } from '../live-board/BaseballSubNav';
import { TennisSubNav } from '../live-board/TennisSubNav';
import { SportKey, SOCCER_LEAGUES } from '../../data/espnScoreboard';

// ── ESPN Teams API ─────────────────────────────────────────────────────────
// Maps app sport names to ESPN API slugs
const ESPN_TEAM_ENDPOINTS: Record<string, string> = {
    NBA: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams?limit=100',
    WNBA: 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams?limit=100',
    NCAAB: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams?limit=50&groups=50',
    NCAAW: 'https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/teams?limit=50&groups=50',
    NFL: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=100',
    MLB: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams?limit=100',
    NHL: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams?limit=100',
    // We will dynamically override Soccer's URL based on the sub-league selection
    Soccer: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams?limit=50',
    // Tennis uses the rankings endpoint to get a fully populated list of players
    Tennis: 'https://site.api.espn.com/apis/site/v2/sports/tennis/atp/rankings'
};

const WORLD_CUP_WINNERS: Record<string, number> = {
    'Brazil': 5,
    'Germany': 4,
    'Italy': 4,
    'Argentina': 3,
    'France': 2,
    'Uruguay': 2,
    'England': 1,
    'Spain': 1,
};

interface ESPNTeam {
    id: string;
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    logo: string;
    color: string;
    alternateColor: string;
    location: string;
}

function parseESPNTeams(data: Record<string, any>, sport: string = ''): ESPNTeam[] {
    const isTennis = sport === 'Tennis';
    // ── Tennis Athletes ──
    if (isTennis && data?.rankings) {
        return data.rankings.map((r: any) => {
            const a = r.athlete || {};
            const flagUrl = a.flag ?? a.flagAltText ?? '';
            return {
                id: a.id ?? '',
                name: a.displayName ?? '',
                abbreviation: a.shortname ?? '',
                displayName: a.displayName ?? '',
                shortDisplayName: a.shortname ?? '',
                logo: flagUrl, // We'll use the country flag as their "logo"
                color: '0df20d', // picklabs bright green default
                alternateColor: '000000',
                location: a.birthPlace?.summary ?? a.citizenshipCountry ?? '',
            };
        });
    }

    const sports = data?.sports ?? [];
    if (sports.length > 0) {
        const leagues = sports[0]?.leagues ?? [];
        if (leagues.length > 0) {
            const rawTeams = leagues[0]?.teams ?? [];
            return rawTeams.map((t: Record<string, any>) => {
                const team = t.team ?? t;
                const logos: Record<string, any>[] = team.logos ?? [];
                let logo = logos[0]?.href ?? logos.find((l: Record<string, any>) => l.href)?.href ?? '';

                return {
                    id: team.id ?? '',
                    name: team.name ?? '',
                    abbreviation: team.abbreviation ?? '',
                    displayName: team.displayName ?? team.name ?? '',
                    shortDisplayName: team.shortDisplayName ?? team.name ?? '',
                    logo,
                    color: team.color ?? '',
                    alternateColor: team.alternateColor ?? '',
                    location: team.location ?? '',
                };
            });
        }
    }
    // Fallback: flat teams array
    const rawTeams = data?.teams ?? [];
    return rawTeams.map((t: Record<string, any>) => {
        const team = t.team ?? t;
        const logos: Record<string, any>[] = team.logos ?? [];
        let logo = logos[0]?.href ?? '';

        return {
            id: team.id ?? '',
            name: team.name ?? '',
            abbreviation: team.abbreviation ?? '',
            displayName: team.displayName ?? team.name ?? '',
            shortDisplayName: team.shortDisplayName ?? team.name ?? '',
            logo,
            color: team.color ?? '',
            alternateColor: team.alternateColor ?? '',
            location: team.location ?? '',
        };
    });
}

// ── Sport logos displayed in the header ───────────────────────────────────
const EXTRA_SPORT_LOGOS: Record<string, string> = {
    ...SPORT_LOGOS,
    NBA: 'https://cdn.nba.com/logos/nba/nba-logoman-word-white.svg',
    NFL: 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png',
    MLB: 'https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png',
    NHL: 'https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png',
    WNBA: 'https://a.espncdn.com/i/teamlogos/leagues/500/wnba.png',
    NCAAB: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/NCAA_logo.svg',
    NCAAW: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/NCAA_logo.svg',
    Soccer: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/Premier_League_Logo.svg/1200px-Premier_League_Logo.svg.png',
    Tennis: 'https://a.espncdn.com/i/tennislos/atp/500/wimbledon.png',
};

const SPORTS_WITH_ESPN_API = Object.keys(ESPN_TEAM_ENDPOINTS);

export const TeamsDirectory: React.FC = () => {
    const [selectedSport, setSelectedSport] = useState<string>(SPORTS_WITH_ESPN_API[0]);
    const [activeSoccerLeague, setActiveSoccerLeague] = useState<SportKey>('Soccer.EPL');
    const [activeBaseballLeague, setActiveBaseballLeague] = useState<SportKey>('MLB');
    const [activeTennisTour, setActiveTennisTour] = useState<SportKey>('Tennis.ATP');
    const [selectedTeam, setSelectedTeam] = useState<{ id: string; name: string; abbr: string; url?: string; leagueSlug?: string; coreSport?: string; seasonYear?: number } | null>(null);
    const [teams, setTeams] = useState<ESPNTeam[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTeams = useCallback(async (sport: string, soccerLeague: SportKey, baseballLeague: SportKey, tennisTour: SportKey) => {
        let url = ESPN_TEAM_ENDPOINTS[sport];

        // Dynamically build the baseball URL
        if (sport === 'MLB' || sport === 'Baseball') {
            (window as any)._currentCoreSport = 'baseball';
            let espnSlug = 'mlb';
            if (baseballLeague === 'MLB') {
                url = 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams?limit=100';
            } else if (baseballLeague === 'Baseball.WBC') {
                url = 'https://site.api.espn.com/apis/site/v2/sports/baseball/world-baseball-classic/teams?limit=100';
                espnSlug = 'world-baseball-classic';
            } else if (baseballLeague === 'Baseball.CWS') {
                url = 'https://site.api.espn.com/apis/site/v2/sports/baseball/caribbean-series/teams?limit=50';
                espnSlug = 'caribbean-series';
            }
            (window as any)._currentSoccerLeagueSlug = espnSlug;
        }
        // Dynamically build the soccer URL based on the selected sub-league
        else if (sport === 'Soccer') {
            const leagueParts = soccerLeague.split('.');
            let espnSlug = 'eng.1'; // fallback
            if (leagueParts[1] === 'EPL') espnSlug = 'eng.1';
            else if (leagueParts[1] === 'UCL') espnSlug = 'uefa.champions';
            else if (leagueParts[1] === 'LALIGA') espnSlug = 'esp.1';
            else if (leagueParts[1] === 'BUNDESLIGA') espnSlug = 'ger.1';
            else if (leagueParts[1] === 'SERIEA') espnSlug = 'ita.1';
            else if (leagueParts[1] === 'LIGUE1') espnSlug = 'fra.1';
            else if (leagueParts[1] === 'MLS') espnSlug = 'usa.1';
            else if (leagueParts[1] === 'LIGAMX') espnSlug = 'mex.1';
            else if (leagueParts[1] === 'EREDIVISIE') espnSlug = 'ned.1';
            else if (leagueParts[1] === 'BRASILEIRAO') espnSlug = 'bra.1';
            else if (leagueParts[1] === 'LIGAPROFESIONAL') espnSlug = 'arg.1';
            else if (leagueParts[1] === 'SCOTTISH') espnSlug = 'sco.1';
            else if (leagueParts[1] === 'SUPERLIG') espnSlug = 'tur.1';
            else if (leagueParts[1] === 'FIFA') espnSlug = 'fifa.world';
            else if (leagueParts[1] === 'COLOMBIA') espnSlug = 'col.1';
            else if (leagueParts[1] === 'ECUADOR') espnSlug = 'ecu.1';

            url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${espnSlug}/teams?limit=100`;
            (window as any)._currentSoccerLeagueSlug = espnSlug;
            (window as any)._currentCoreSport = 'soccer';
        } else if (sport === 'Tennis') {
            const tourSlug = tennisTour === 'Tennis.WTA' ? 'wta' : 'atp';
            url = `https://site.api.espn.com/apis/site/v2/sports/tennis/${tourSlug}/rankings`;
        }

        if (!url) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`ESPN returned ${res.status}`);
            const data = await res.json();
            const parsed = parseESPNTeams(data, sport);
            // Sort alphabetically by display name (or leave as ranked for Tennis)
            if (sport !== 'Tennis') {
                parsed.sort((a, b) => a.displayName.localeCompare(b.displayName));
            }
            setTeams(parsed);
        } catch {
            setError(`Could not load ${sport} teams from ESPN.`);
            setTeams([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeams(selectedSport, activeSoccerLeague, activeBaseballLeague, activeTennisTour);
        setSearchQuery('');
    }, [selectedSport, activeSoccerLeague, activeBaseballLeague, activeTennisTour, fetchTeams]);

    const filteredTeams = searchQuery.trim()
        ? teams.filter(t =>
            t.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : teams;

    // Helper to get active soccer league details
    const activeSoccerLeagueDetails = selectedSport === 'Soccer'
        ? SOCCER_LEAGUES.find(l => l.key === activeSoccerLeague)
        : null;

    // If viewing a team detail
    if (selectedTeam) {
        return (
            <TeamDetails
                team={selectedTeam}
                sport={selectedSport}
                onBack={() => setSelectedTeam(null)}
            />
        );
    }

    return (
        <div className="w-full flex flex-col items-center bg-background-dark py-8 px-6 min-h-screen">
            <div className="max-w-[1536px] w-full flex flex-col gap-8">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        {/* Sport logo */}
                        <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-border-muted flex items-center justify-center p-2 shadow-[0_0_20px_rgba(13,242,13,0.08)]">
                            <img
                                src={EXTRA_SPORT_LOGOS[selectedSport]}
                                alt={selectedSport}
                                className="w-full h-full object-contain"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-text-main uppercase italic tracking-tight">
                                {selectedSport} Teams
                            </h2>
                            <p className="text-text-muted text-sm mt-0.5">
                                {loading ? 'Loading teams…' : `${filteredTeams.length} teams · PickLabs Live Data`}
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Search teams…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-neutral-800 border border-border-muted rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main">
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Sport Selection Tabs ── */}
                <div className="bg-neutral-900 border border-border-muted p-1.5 flex gap-1 overflow-x-auto no-scrollbar rounded-xl">
                    {SPORTS_WITH_ESPN_API.map(sport => (
                        <button
                            key={sport}
                            onClick={() => setSelectedSport(sport)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${selectedSport === sport
                                ? 'bg-primary text-black shadow-[0_0_15px_rgba(13,242,13,0.25)]'
                                : 'text-text-muted hover:text-text-main hover:bg-neutral-800'
                                }`}
                        >
                            {EXTRA_SPORT_LOGOS[sport] && (
                                <img
                                    src={EXTRA_SPORT_LOGOS[sport]}
                                    alt={sport}
                                    className={`w-4 h-4 object-contain ${selectedSport === sport ? 'brightness-0' : 'brightness-200 opacity-60'}`}
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            )}
                            {sport}
                        </button>
                    ))}
                </div>

                {/* ── Soccer Sub Navigation ── */}
                {selectedSport === 'Soccer' && (
                    <div className="mt-2 text-white">
                        <SoccerLeagueNav
                            activeLeague={activeSoccerLeague}
                            onSelectLeague={setActiveSoccerLeague}
                        />
                    </div>
                )}

                {/* ── Baseball Sub Navigation ── */}
                {selectedSport === 'MLB' && (
                    <div className="mt-2 text-white">
                        <BaseballSubNav
                            activeLeague={activeBaseballLeague}
                            onSelectLeague={setActiveBaseballLeague}
                        />
                    </div>
                )}

                {/* ── Tennis Sub Navigation ── */}
                {selectedSport === 'Tennis' && (
                    <div className="mt-2 text-white">
                        <TennisSubNav
                            activeTour={activeTennisTour}
                            onSelectTour={setActiveTennisTour}
                        />
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        <span className="material-symbols-outlined text-lg">wifi_off</span>
                        {error}
                        <button onClick={() => fetchTeams(selectedSport, activeSoccerLeague, activeBaseballLeague, activeTennisTour)} className="ml-auto text-xs underline hover:no-underline">Retry</button>
                    </div>
                )}

                {/* ── Active League Header (Soccer only) ── */}
                {selectedSport === 'Soccer' && activeSoccerLeagueDetails && !loading && !error && filteredTeams.length > 0 && (
                    <div className="flex flex-col gap-1 pb-4 border-b border-border-muted/30">
                        <div className="flex items-center gap-3">
                            {activeSoccerLeagueDetails.logo && (
                                <img src={activeSoccerLeagueDetails.logo} alt={activeSoccerLeagueDetails.label} className="w-10 h-10 object-contain drop-shadow-md" />
                            )}
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-wider flex items-center gap-2">
                                <img src={activeSoccerLeagueDetails.flag} alt={activeSoccerLeagueDetails.country} className="w-8 h-6 object-cover rounded-sm shadow-md opacity-90" />
                                {activeSoccerLeagueDetails.label}
                            </h3>
                        </div>
                        <p className="text-slate-400 text-sm pl-[52px]">
                            {filteredTeams.length} clubs · {activeSoccerLeagueDetails.country}
                        </p>
                    </div>
                )}

                {/* ── Teams Grid ── */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center gap-3 animate-pulse">
                                <div className="w-16 h-16 rounded-full bg-neutral-800"></div>
                                <div className="h-3 bg-neutral-800 rounded w-3/4"></div>
                                <div className="h-2 bg-neutral-800/50 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredTeams.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredTeams.map(team => (
                            <div
                                key={team.id}
                                onClick={() => {
                                    const cSport = (window as any)._currentCoreSport || (selectedSport === 'NBA' ? 'basketball' : selectedSport === 'NFL' ? 'football' : selectedSport === 'NHL' ? 'hockey' : '');
                                    const lSlug = (window as any)._currentSoccerLeagueSlug || (selectedSport === 'NBA' ? 'nba' : selectedSport === 'NFL' ? 'nfl' : selectedSport === 'NHL' ? 'nhl' : '');
                                    const season = lSlug === 'fifa.world' ? 2022 : (selectedSport === 'NFL' ? 2024 : new Date().getFullYear());
                                    setSelectedTeam({ id: team.id, name: team.displayName, abbr: team.abbreviation, url: team.logo, leagueSlug: lSlug, coreSport: cSport, seasonYear: season });
                                }}
                                className="group bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/30 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                                style={team.color ? { '--team-color': `#${team.color}` } as React.CSSProperties : undefined}
                            >
                                <div className="w-20 h-20 relative flex items-center justify-center">
                                    {team.logo ? (
                                        <img
                                            src={team.logo}
                                            alt={team.displayName}
                                            className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg ${selectedSport === 'Tennis' ? 'rounded-md shadow-md' : ''}`}
                                            onError={e => {
                                                const img = e.currentTarget;
                                                img.onerror = null;
                                                img.src = `https://ui-avatars.com/api/?name=${team.abbreviation}&background=121a12&color=0df20d&bold=true&rounded=true`;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
                                            <span className="text-xl font-black text-slate-500">{team.abbreviation.substring(0, 2)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-bold text-text-main text-center leading-tight group-hover:text-white transition-colors block">
                                        {team.displayName}
                                    </span>
                                    {selectedSport === 'Soccer' && activeSoccerLeague === 'Soccer.FIFA' && WORLD_CUP_WINNERS[team.displayName] ? (
                                        <div className="flex flex-col items-center mt-1.5 gap-1">
                                            <span className="text-[12px] text-white tracking-widest block leading-none">
                                                {'★'.repeat(WORLD_CUP_WINNERS[team.displayName])}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5 block">{team.abbreviation}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !loading && !error ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">search_off</span>
                        <h3 className="text-text-main font-bold text-lg mb-1">No teams found</h3>
                        <p className="text-text-muted text-sm">Try a different sport or clear your search.</p>
                    </div>
                ) : null}

            </div>
        </div>
    );
};
