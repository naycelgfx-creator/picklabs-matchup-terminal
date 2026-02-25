import React, { useState, useEffect } from 'react';
import { RookieTooltip } from '../ui/RookieTooltip';
import { useESPNRoster } from '../../data/useESPNRoster';
import { ESPNRosterAthlete } from '../../data/espnService';

interface PlayerPropsModuleProps {
    sport: string;
    team: { name: string; abbr: string; url?: string };
}

interface PropLine {
    id: string;
    player: string;
    photoUrl: string;
    position: string;
    propType: string;
    line: number;
    impliedProb: number;
    oppRank: { rank: number; team: string; color: 'green' | 'red' | 'yellow' };
    l5Logs: { val: number; opp: string; isHit: boolean }[];
    l5HitRate: number;
    l10: number[];
    l20: number[];
    h2h: number[];
    season2025: number[];
    dkOdds: string;
    fdOdds: string;
    mgmOdds: string;
    isTrending: boolean;
}

const AVATAR = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a2e&color=39ff14&rounded=true`;

// Deterministic pseudo-random from a string seed
const seededRand = (seed: string, offset: number): number => {
    const n = seed.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1 + offset), 0);
    return (n % 100) / 100;
};

const seededInt = (seed: string, offset: number, min: number, max: number): number =>
    Math.floor(seededRand(seed, offset) * (max - min)) + min;

const generateL5Logs = (seed: string, offset: number, count: number, line: number, sport: string) => {
    const nflOpps = ['DAL', 'PHI', 'NYG', 'WAS', 'KC', 'LV', 'DEN', 'LAC'];
    const nbaOpps = ['BOS', 'BKN', 'NYK', 'PHI', 'TOR', 'CHI', 'CLE', 'DET', 'IND', 'LAL', 'GSW', 'MIN'];
    const mlbOpps = ['NYY', 'BOS', 'TB', 'TOR', 'BAL', 'LAD', 'SF', 'SD'];
    const nhlOpps = ['BOS', 'TBL', 'FLA', 'TML', 'MTL', 'NYR', 'CAR', 'NJD'];
    const soccerOpps = ['MCI', 'ARS', 'LIV', 'CHE', 'MUN', 'TOT', 'AVL'];

    let opps = nbaOpps;
    if (sport === 'NFL') opps = nflOpps;
    if (sport === 'MLB') opps = mlbOpps;
    if (sport === 'NHL') opps = nhlOpps;
    if (sport === 'Soccer') opps = soccerOpps;

    return Array.from({ length: count }, (_, i) => {
        const opp = opps[seededInt(seed, offset + i, 0, opps.length - 1)];
        const variance = Math.max(1, Math.floor(line * 0.4));
        const val = Math.max(0, Math.floor(line) + seededInt(seed, offset + i + 100, -variance, variance + 1));
        const isHit = val >= line;
        return { val, opp, isHit };
    });
};

const generateTrendFromSeed = (seed: string, offset: number, count: number): number[] =>
    Array.from({ length: count }, (_, i) => seededInt(seed, offset + i, 10, 100));

// Build prop types per sport
const getPropTypes = (sport: string): string[] => {
    if (sport === 'NFL') return ['Passing Yards', 'Rushing Yards', 'Receiving Yards', 'Touchdowns', 'Receptions'];
    if (sport === 'MLB') return ['Strikeouts', 'Total Bases', 'Home Runs', 'RBIs', 'Hits'];
    if (sport === 'NHL') return ['Goals', 'Shots on Goal', 'Points', 'Assists', 'Saves'];
    if (sport === 'Soccer') return ['Goals', 'Shots on Target', 'Assists', 'Key Passes'];
    return ['Points', 'Rebounds', 'Assists', 'Three-Pointers', 'Steals'];
};

const getPropLine = (sport: string, propType: string, seed: string): number => {
    if (sport === 'NFL' && propType === 'Passing Yards') return 250.5 + seededInt(seed, 99, 0, 50);
    if (sport === 'NFL' && propType === 'Rushing Yards') return 50.5 + seededInt(seed, 98, 0, 40);
    if (sport === 'NFL' && propType === 'Receiving Yards') return 40.5 + seededInt(seed, 97, 0, 30);
    if (sport === 'NFL' && propType === 'Touchdowns') return 0.5 + seededInt(seed, 96, 0, 2);
    if (sport === 'NHL' && propType === 'Shots on Goal') return 2.5 + seededInt(seed, 95, 0, 3);
    if (sport === 'NHL' && propType === 'Saves') return 25.5 + seededInt(seed, 94, 0, 8);
    if (sport === 'MLB' && propType === 'Strikeouts') return 5.5 + seededInt(seed, 93, 0, 4);
    if (sport === 'MLB' && propType === 'Total Bases') return 1.5 + seededInt(seed, 92, 0, 2);
    return 0.5 + seededInt(seed, 91, 5, 30);
};

// Convert ESPN roster players into prop lines for a given sport
const buildPropsFromRoster = (players: ESPNRosterAthlete[], sport: string, teamAbbr: string): PropLine[] => {
    const propTypes = getPropTypes(sport);
    const lines: PropLine[] = [];

    // Use top players (limit to top 5 to avoid overwhelming the table)
    const top = players.slice(0, 5);

    top.forEach(player => {
        const mainProp = propTypes[0]; // primary prop for this player
        const seed = `${player.id}-${mainProp}`;
        const line = getPropLine(sport, mainProp, seed);
        const rank = seededInt(seed, 1, 1, 30);

        lines.push({
            id: `${teamAbbr}-${player.id}-${mainProp}`,
            player: player.shortName ?? player.fullName,
            photoUrl: player.photoUrl,
            position: player.position?.abbreviation ?? '—',
            propType: mainProp,
            line,
            impliedProb: seededInt(seed, 2, 42, 80),
            oppRank: {
                rank,
                team: 'OPP',
                color: rank <= 10 ? 'green' : rank >= 20 ? 'red' : 'yellow',
            },
            l5Logs: generateL5Logs(seed, 10, 5, line, sport),
            l5HitRate: 0, // Calculated below
            l10: generateTrendFromSeed(seed, 20, 5),
            l20: generateTrendFromSeed(seed, 30, 5),
            h2h: generateTrendFromSeed(seed, 40, 5),
            season2025: generateTrendFromSeed(seed, 50, 5),
            dkOdds: `-${seededInt(seed, 60, 110, 135)}`,
            fdOdds: `-${seededInt(seed, 70, 108, 130)}`,
            mgmOdds: `-${seededInt(seed, 80, 112, 138)}`,
            isTrending: seededRand(seed, 90) > 0.7,
        });

        // Add a second prop for the same player (variety)
        if (propTypes.length > 1) {
            const prop2 = propTypes[1 + (seededInt(seed, 11, 0, propTypes.length - 1))];
            const seed2 = `${player.id}-${prop2}`;
            const line2 = getPropLine(sport, prop2, seed2);
            const rank2 = seededInt(seed2, 1, 1, 30);
            lines.push({
                id: `${teamAbbr}-${player.id}-${prop2}`,
                player: player.shortName ?? player.fullName,
                photoUrl: player.photoUrl,
                position: player.position?.abbreviation ?? '—',
                propType: prop2,
                line: line2,
                impliedProb: seededInt(seed2, 2, 42, 80),
                oppRank: {
                    rank: rank2,
                    team: 'OPP',
                    color: rank2 <= 10 ? 'green' : rank2 >= 20 ? 'red' : 'yellow',
                },
                l5Logs: generateL5Logs(seed2, 10, 5, line2, sport),
                l5HitRate: 0,
                l10: generateTrendFromSeed(seed2, 20, 5),
                l20: generateTrendFromSeed(seed2, 30, 5),
                h2h: generateTrendFromSeed(seed2, 40, 5),
                season2025: generateTrendFromSeed(seed2, 50, 5),
                dkOdds: `-${seededInt(seed2, 60, 110, 135)}`,
                fdOdds: `-${seededInt(seed2, 70, 108, 130)}`,
                mgmOdds: `-${seededInt(seed2, 80, 112, 138)}`,
                isTrending: seededRand(seed2, 90) > 0.7,
            });
        }
    });

    lines.forEach(line => {
        line.l5HitRate = Math.round((line.l5Logs.filter(l => l.isHit).length / 5) * 100);
    });

    return lines;
};

const OrdinalSuffix = (n: number) => {
    if ([11, 12, 13].includes(n)) return 'th';
    if (n % 10 === 1) return 'st';
    if (n % 10 === 2) return 'nd';
    if (n % 10 === 3) return 'rd';
    return 'th';
};

export const PlayerPropsModule: React.FC<PlayerPropsModuleProps> = ({ sport, team }) => {
    const { players, loading: rosterLoading } = useESPNRoster(team.name, sport);
    const [propsData, setPropsData] = useState<PropLine[]>([]);

    useEffect(() => {
        if (!rosterLoading && players.length > 0) {
            setPropsData(buildPropsFromRoster(players, sport, team.abbr));
        }
    }, [players, rosterLoading, sport, team.abbr]);

    const isLoading = rosterLoading || (players.length > 0 && propsData.length === 0);

    return (
        <div className="flex flex-col gap-0 animate-fade-in w-full bg-[#111111] overflow-x-auto custom-scrollbar border border-border-muted rounded-xl">

            {/* Banner */}
            {!rosterLoading && players.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border-muted bg-[#151515]">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0"></span>
                    <span className="text-[10px] text-slate-500 font-medium">
                        Showing props for <span className="text-primary font-bold">{players.length} {team.name} players</span> · Real ESPN roster
                    </span>
                </div>
            )}

            {/* Table Header */}
            <div className="grid grid-cols-[300px_minmax(100px,_1fr)_minmax(180px,_2fr)_minmax(80px,_1fr)_minmax(100px,_1fr)_minmax(180px,_1fr)_minmax(80px,_1fr)_minmax(80px,_1fr)_minmax(80px,_1fr)_minmax(80px,_1fr)] gap-4 px-4 py-3 border-b border-border-muted bg-[#1A1A1A] sticky top-0 z-10 min-w-[1250px]">
                <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase flex items-center justify-center">Proposition</div>
                <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase flex items-center justify-center gap-1">Line <span className="material-symbols-outlined text-[10px]">swap_vert</span></div>

                <RookieTooltip title="Multi-Book Odds" description="Odds from different sportsbooks. Shopping for the best line maximizes your payout over time." example="-110 means you bet $110 to win $100." position="bottom">
                    <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase flex items-center justify-center gap-1 cursor-help">
                        Odds
                        <div className="flex gap-0.5 ml-1">
                            <img src="https://sportsbook.draftkings.com/favicon.ico" alt="DraftKings" className="w-3 h-3 rounded-sm opacity-50 grayscale" />
                            <img src="https://cdn.wagerwire.com/sportsbooks/fanduel.png" alt="FanDuel" className="w-3 h-3 rounded-sm opacity-50 grayscale" />
                        </div>
                        <span className="material-symbols-outlined text-[10px]">swap_vert</span>
                    </div>
                </RookieTooltip>

                <RookieTooltip title="Implied Probability" description="The percentage chance of a bet winning, converted directly from the odds." example="Odds of -150 equals an Implied Probability of 60%." position="bottom">
                    <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase flex items-center justify-center gap-1 cursor-help">IP <span className="material-symbols-outlined text-[10px]">swap_vert</span></div>
                </RookieTooltip>

                <RookieTooltip title="Opponent Rank" description="How well the opposing team defends against this specific statistical category." example="1st means they are the BEST at stopping it, which is bad for an Over." position="bottom">
                    <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase flex items-center justify-center gap-1 cursor-help">Opp Rank <span className="material-symbols-outlined text-[10px]">swap_vert</span></div>
                </RookieTooltip>

                <RookieTooltip title="Last 5 Games" description="The player's hit rate for this exact prop line over their last 5 games played." position="bottom">
                    <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase flex items-center justify-center gap-1 cursor-help">L5 <span className="material-symbols-outlined text-[10px]">arrow_upward</span></div>
                </RookieTooltip>

                <RookieTooltip title="Last 10 Games" description="The player's hit rate for this exact prop line over their last 10 games played." position="bottom">
                    <div className="text-[10px] font-bold text-text-main tracking-widest uppercase flex items-center justify-center gap-1 border-b-2 border-primary pb-1 cursor-help">L10 <span className="material-symbols-outlined text-[10px]">arrow_downward</span></div>
                </RookieTooltip>

                <RookieTooltip title="Last 20 Games" description="The player's hit rate for this exact prop line over their last 20 games played." position="bottom">
                    <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase flex items-center justify-center gap-1 cursor-help">L20 <span className="material-symbols-outlined text-[10px]">swap_vert</span></div>
                </RookieTooltip>

                <RookieTooltip title="Head-to-Head" description="The player's historical hit rate against this specific opposing team." position="bottom">
                    <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase flex items-center justify-center gap-1 cursor-help">H2H <span className="material-symbols-outlined text-[10px]">swap_vert</span></div>
                </RookieTooltip>

                <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase flex items-center justify-center gap-1">2025 <span className="material-symbols-outlined text-[10px]">arrow_upward</span></div>
            </div>

            {/* Loading skeleton */}
            {isLoading && (
                <div className="flex flex-col min-w-[1250px]">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-[300px_minmax(100px,_1fr)_minmax(180px,_2fr)_minmax(80px,_1fr)_minmax(100px,_1fr)_minmax(180px,_1fr)_minmax(80px,_1fr)_minmax(80px,_1fr)_minmax(80px,_1fr)_minmax(80px,_1fr)] gap-4 px-4 py-3 border-b border-border-muted/50 items-center bg-[#151515]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse shrink-0"></div>
                                <div className="w-28 h-4 bg-neutral-800 animate-pulse rounded"></div>
                            </div>
                            {Array.from({ length: 9 }).map((_, j) => (
                                <div key={j} className="h-4 bg-neutral-800 animate-pulse rounded mx-auto w-12"></div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Table Rows */}
            {!isLoading && (
                <div className="flex flex-col min-w-[1250px]">
                    {propsData.map((prop, idx) => (
                        <div key={prop.id} className={`grid grid-cols-[300px_minmax(100px,_1fr)_minmax(180px,_2fr)_minmax(80px,_1fr)_minmax(100px,_1fr)_minmax(180px,_1fr)_minmax(80px,_1fr)_minmax(80px,_1fr)_minmax(80px,_1fr)_minmax(80px,_1fr)] gap-4 px-4 py-2 hover:bg-[#222222] transition-colors border-b border-border-muted/50 items-center ${idx % 2 === 0 ? 'bg-[#151515]' : 'bg-[#181818]'}`}>

                            {/* Proposition */}
                            <div className="flex items-center gap-3">
                                <button className="w-5 h-5 rounded border border-border-muted flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors shrink-0">
                                    <span className="material-symbols-outlined text-xs">add</span>
                                </button>
                                {/* Real ESPN player headshot */}
                                <div className="w-9 h-9 rounded-full overflow-hidden border border-border-muted/50 bg-neutral-900 shrink-0">
                                    <img
                                        src={prop.photoUrl}
                                        alt={prop.player}
                                        className="w-full h-full object-cover"
                                        onError={e => { (e.target as HTMLImageElement).src = AVATAR(prop.player); }}
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-text-main truncate">{prop.player}</span>
                                        {prop.position !== '—' && (
                                            <span className="text-[9px] text-slate-600 font-bold bg-neutral-800 px-1 rounded">{prop.position}</span>
                                        )}
                                        {prop.isTrending && (
                                            <span className="text-[8px] text-amber-400 font-black">🔥</span>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-text-muted truncate">
                                        Under {prop.line} {prop.propType}
                                    </span>
                                </div>
                            </div>

                            {/* Line */}
                            <div className="text-sm font-bold text-text-muted text-center">{prop.line}</div>

                            {/* Odds */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="flex items-center gap-1.5 bg-white/5 border border-border-muted/50 rounded px-1.5 py-0.5">
                                    <img src="https://sportsbook.draftkings.com/favicon.ico" alt="DK" className="w-3 h-3 rounded-sm opacity-80" />
                                    <span className="text-[11px] font-bold text-text-muted">{prop.dkOdds}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 border border-border-muted/50 rounded px-1.5 py-0.5">
                                    <img src="https://cdn.wagerwire.com/sportsbooks/fanduel.png" alt="FD" className="w-3 h-3 rounded-sm opacity-80" />
                                    <span className="text-[11px] font-bold text-text-muted">{prop.fdOdds}</span>
                                </div>
                            </div>

                            {/* IP */}
                            <div className="text-xs font-bold text-text-muted text-center">{prop.impliedProb}%</div>

                            {/* Opp Rank */}
                            <div className="flex items-center justify-center gap-2">
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${prop.oppRank.color === 'green' ? 'text-primary border-primary/30 bg-primary/10' : prop.oppRank.color === 'red' ? 'text-red-500 border-red-500/30 bg-red-500/10' : 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10'}`}>
                                    {prop.oppRank.rank}{OrdinalSuffix(prop.oppRank.rank)}
                                </span>
                            </div>

                            {/* L5 */}
                            <div className="flex flex-col items-center justify-center py-1">
                                <span className={`text-[12px] font-black ${prop.l5HitRate >= 60 ? 'text-primary' : prop.l5HitRate <= 40 ? 'text-red-500' : 'text-yellow-500'}`}>{prop.l5HitRate}% Hit Rate</span>
                                <div className="flex gap-1.5 mt-1.5">
                                    {prop.l5Logs.map((log, i) => (
                                        <div key={i} className="flex flex-col items-center group/log relative cursor-help">
                                            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center justify-center w-7 ${log.isHit ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                                                {log.val}
                                            </div>
                                            <span className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 tracking-tight w-7 text-center overflow-hidden">{log.opp}</span>

                                            {/* Beautiful Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/log:flex flex-col items-center z-50 pointer-events-none">
                                                <div className="bg-neutral-900 border border-neutral-700 shadow-xl rounded-md px-3 py-1.5 whitespace-nowrap">
                                                    <span className="text-white text-[11px] font-bold block">{log.val} {prop.propType}</span>
                                                    <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider block mt-0.5">vs {log.opp}</span>
                                                </div>
                                                <div className="w-2 h-2 bg-neutral-900 border-r border-b border-neutral-700 rotate-45 -mt-1.5"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* L10 */}
                            <div className="flex flex-col items-center justify-center bg-white/5 border border-border-muted/50 rounded p-1">
                                <span className={`text-[12px] font-black ${prop.l10[0] >= 60 ? 'text-primary' : prop.l10[0] <= 40 ? 'text-red-500' : 'text-yellow-500'}`}>{prop.l10[0]}%</span>
                                <div className="flex gap-[1px] mt-1 opacity-80">
                                    {prop.l10.map((hit, i) => (
                                        <div key={i} className={`w-[3px] h-1 rounded-sm ${hit >= 50 ? 'bg-primary' : 'bg-red-500'}`}></div>
                                    ))}
                                </div>
                            </div>

                            {/* L20 */}
                            <div className="flex flex-col items-center justify-center">
                                <span className={`text-[12px] font-black ${prop.l20[0] >= 60 ? 'text-primary' : prop.l20[0] <= 40 ? 'text-red-500' : 'text-yellow-500'}`}>{prop.l20[0]}%</span>
                            </div>

                            {/* H2H */}
                            <div className="flex flex-col items-center justify-center">
                                <span className={`text-[12px] font-black ${prop.h2h[0] >= 60 ? 'text-primary' : prop.h2h[0] <= 40 ? 'text-red-500' : 'text-yellow-500'}`}>{prop.h2h[0]}%</span>
                            </div>

                            {/* 2025 */}
                            <div className="flex flex-col items-center justify-center">
                                <span className={`text-[12px] font-black ${prop.season2025[0] >= 60 ? 'text-primary' : prop.season2025[0] <= 40 ? 'text-red-500' : 'text-yellow-500'}`}>{prop.season2025[0]}%</span>
                            </div>
                        </div>
                    ))}

                    {propsData.length === 0 && !isLoading && (
                        <div className="p-10 text-center text-slate-600 font-medium">
                            No prop data available for this team.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
