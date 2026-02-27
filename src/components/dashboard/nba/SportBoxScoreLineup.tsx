/**
 * SportBoxScoreLineup — generic lineup table for any sport
 * Fetches ESPN summary box score and displays players in a table
 * with sport-appropriate stat columns.
 */
import React, { useMemo, useState } from 'react';
import { Game } from '../../../data/mockGames';
import { useESPNBoxScore, BoxScorePlayer } from '../../../hooks/useESPNBoxScore';

interface SportBoxScoreLineupProps {
    game: Game;
}

// Stat columns per sport
const SPORT_COLS: Record<string, { key: keyof BoxScorePlayer | string; label: string }[]> = {
    NFL: [
        { key: 'PTS', label: 'PTS' },
        { key: 'REB', label: 'YDS' },
        { key: 'AST', label: 'TD' },
        { key: 'TO', label: 'INT' },
        { key: 'STL', label: 'SCK' },
    ],
    MLB: [
        { key: 'PTS', label: 'R' },
        { key: 'REB', label: 'H' },
        { key: 'AST', label: 'RBI' },
        { key: 'TO', label: 'SO' },
        { key: 'BLK', label: 'BB' },
    ],
    NHL: [
        { key: 'PTS', label: 'PTS' },
        { key: 'REB', label: 'G' },
        { key: 'AST', label: 'A' },
        { key: 'TO', label: '+/-' },
        { key: 'STL', label: 'SOG' },
    ],
};

const getSoccerCols = () => [
    { key: 'PTS' as keyof BoxScorePlayer, label: 'G' },
    { key: 'REB' as keyof BoxScorePlayer, label: 'A' },
    { key: 'AST' as keyof BoxScorePlayer, label: 'SHT' },
    { key: 'TO' as keyof BoxScorePlayer, label: 'YC' },
    { key: 'STL' as keyof BoxScorePlayer, label: 'TKL' },
];

function getCols(sport: string) {
    const s = sport as string;
    if (s.startsWith('Soccer')) return getSoccerCols();
    if (s === 'NFL' || s === 'CFB') return SPORT_COLS.NFL;
    if (s === 'MLB') return SPORT_COLS.MLB;
    if (s === 'NHL') return SPORT_COLS.NHL;
    // Default basketball
    return [
        { key: 'MIN' as keyof BoxScorePlayer, label: 'MIN' },
        { key: 'PTS' as keyof BoxScorePlayer, label: 'PTS' },
        { key: 'REB' as keyof BoxScorePlayer, label: 'REB' },
        { key: 'AST' as keyof BoxScorePlayer, label: 'AST' },
        { key: 'STL' as keyof BoxScorePlayer, label: 'STL' },
        { key: 'BLK' as keyof BoxScorePlayer, label: 'BLK' },
    ];
}

function sportLabel(sport: string) {
    if (sport.startsWith('Soccer')) return 'Match Lineup';
    if (sport === 'NFL' || sport === 'CFB') return 'Game Roster';
    if (sport === 'MLB') return 'Game Lineup';
    if (sport === 'NHL') return 'Game Roster';
    return 'Game Lineup';
}

function sportIcon(sport: string) {
    if (sport.startsWith('Soccer')) return 'sports_soccer';
    if (sport === 'NFL' || sport === 'CFB') return 'sports_football';
    if (sport === 'MLB') return 'sports_baseball';
    if (sport === 'NHL') return 'sports_hockey';
    return 'sports_basketball';
}

const PlayerAvatar: React.FC<{ player: BoxScorePlayer; initials: string }> = ({ player, initials }) => {
    const [err, setErr] = useState(false);
    if (!err && player.headshot) {
        return <img src={player.headshot} alt={player.name} className="w-8 h-8 rounded-full object-cover border border-border-muted" onError={() => setErr(true)} />;
    }
    return (
        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-border-muted flex items-center justify-center text-[9px] font-black text-slate-400">
            {initials}
        </div>
    );
};

const PlayerRow: React.FC<{
    player: BoxScorePlayer;
    cols: { key: string; label: string }[];
    colorClass: string;
}> = ({ player, cols, colorClass }) => {
    const [expanded, setExpanded] = useState(false);
    const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const hot = (player.hotScore ?? 0) >= 1.2;
    const cold = (player.hotScore ?? 0) <= 0.7;

    return (
        <>
            <tr
                className={`border-b border-border-muted/30 hover:bg-white/5 cursor-pointer transition-colors ${player.dnp ? 'opacity-40' : ''}`}
                onClick={() => setExpanded(e => !e)}
            >
                <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                        <PlayerAvatar player={player} initials={initials} />
                        <div>
                            <div className="text-[10px] font-black text-text-main leading-tight flex items-center gap-1">
                                {player.name}
                                {hot && <span title="Hot">🔥</span>}
                                {cold && <span title="Cold">❄️</span>}
                            </div>
                            <div className="text-[8px] text-slate-500 uppercase font-bold">{player.position}</div>
                        </div>
                        {player.starter && (
                            <span className={`ml-auto text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${colorClass} opacity-80`}>STR</span>
                        )}
                    </div>
                </td>
                {cols.map(col => {
                    const val = (player as Record<string, unknown>)[col.key];
                    const display = val !== undefined && val !== null ? String(val) : '—';
                    return (
                        <td key={col.key} className="py-2 px-3 text-center text-[10px] font-black text-text-main">
                            {display}
                        </td>
                    );
                })}
            </tr>
            {expanded && (
                <tr className="bg-neutral-900/60">
                    <td colSpan={cols.length + 1} className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                            {(['PTS', 'REB', 'AST', 'STL', 'BLK', 'TO'] as (keyof BoxScorePlayer)[]).map(k => {
                                const val = Number((player as Record<string, unknown>)[k] ?? 0);
                                return (
                                    <div key={k} className="text-center">
                                        <div className="text-xs font-black text-text-main">{val}</div>
                                        <div className="text-[8px] text-slate-500 uppercase font-bold">{k}</div>
                                    </div>
                                );
                            })}
                            {player.fg && (
                                <div className="text-center">
                                    <div className="text-xs font-black text-text-main">{player.fg}</div>
                                    <div className="text-[8px] text-slate-500 uppercase font-bold">FG</div>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

const TeamTable: React.FC<{
    label: string;
    players: BoxScorePlayer[];
    cols: { key: string; label: string }[];
    colorClass: string;
    badgeColor: string;
    teamLogo?: string;
}> = ({ label, players, cols, colorClass, badgeColor, teamLogo }) => {
    const starters = players.filter(p => p.starter && !p.dnp);
    const bench = players.filter(p => !p.starter && !p.dnp);
    const dnp = players.filter(p => p.dnp);
    const [showBench, setShowBench] = useState(true);

    if (players.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-slate-500 text-[10px] font-black uppercase">
                <span className="material-symbols-outlined text-3xl mb-2">person_off</span>
                No player data available
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border-muted bg-white/3">
                {teamLogo && <img src={teamLogo} alt="" className="w-7 h-7 object-contain" />}
                <h4 className="text-xs font-black uppercase tracking-widest text-text-main">{label}</h4>
                <span className="ml-auto text-[9px] text-slate-500">{players.length} players</span>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-border-muted bg-white/5">
                        <th className="py-2 px-3 text-[8px] font-black uppercase text-slate-500">Player</th>
                        {cols.map(c => (
                            <th key={c.key} className="py-2 px-3 text-center text-[8px] font-black uppercase text-slate-500">{c.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {starters.length > 0 && (
                        <>
                            <tr><td colSpan={cols.length + 1} className="px-3 py-1 text-[7px] font-black uppercase tracking-widest text-slate-600 bg-white/2">Starters</td></tr>
                            {starters.map(p => <PlayerRow key={p.id} player={p} cols={cols} colorClass={badgeColor} />)}
                        </>
                    )}
                    {bench.length > 0 && (
                        <>
                            <tr className="cursor-pointer" onClick={() => setShowBench(b => !b)}>
                                <td colSpan={cols.length + 1} className="px-3 py-1 text-[7px] font-black uppercase tracking-widest text-slate-600 bg-white/2">
                                    Bench {showBench ? '▲' : '▼'}
                                </td>
                            </tr>
                            {showBench && bench.map(p => <PlayerRow key={p.id} player={p} cols={cols} colorClass={badgeColor} />)}
                        </>
                    )}
                    {dnp.length > 0 && (
                        <>
                            <tr><td colSpan={cols.length + 1} className="px-3 py-1 text-[7px] font-black uppercase tracking-widest text-slate-600 bg-white/2">DNP / Inactive</td></tr>
                            {dnp.map(p => <PlayerRow key={p.id} player={p} cols={cols} colorClass={badgeColor} />)}
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export const SportBoxScoreLineup: React.FC<SportBoxScoreLineupProps> = ({ game }) => {
    const { awayPlayers, homePlayers, loading, error } = useESPNBoxScore(game);
    const cols = useMemo(() => getCols(game.sport as string), [game.sport]);
    const label = sportLabel(game.sport as string);
    const icon = sportIcon(game.sport as string);

    return (
        <div className="terminal-panel overflow-hidden col-span-12">
            <div className="p-4 border-b border-border-muted flex items-center gap-3 bg-white/5">
                <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
                <h3 className="text-lg font-black text-text-main uppercase italic tracking-[0.2em]">{label} · Side-by-Side</h3>
                {loading && <span className="ml-auto text-[9px] text-slate-500 animate-pulse">Loading...</span>}
                {error && !loading && <span className="ml-auto text-[9px] text-red-400">Live data unavailable</span>}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-slate-500 text-[10px] font-black uppercase animate-pulse">
                    <span className="material-symbols-outlined mr-2 animate-spin">refresh</span>
                    Fetching roster data...
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-border-muted">
                    <TeamTable
                        label={game.awayTeam.name}
                        players={awayPlayers}
                        cols={cols}
                        colorClass="bg-blue-500/20 text-blue-400"
                        badgeColor="bg-blue-500/20 text-blue-400"
                        teamLogo={game.awayTeam.logo}
                    />
                    <TeamTable
                        label={game.homeTeam.name}
                        players={homePlayers}
                        cols={cols}
                        colorClass="bg-primary/20 text-primary"
                        badgeColor="bg-primary/20 text-primary"
                        teamLogo={game.homeTeam.logo}
                    />
                </div>
            )}
        </div>
    );
};
