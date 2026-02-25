import React, { useMemo } from 'react';
import { Game } from '../../../data/mockGames';
import { generateMockPlayers } from '../../../data/mockPlayers';
import { useESPNRoster } from '../../../data/useESPNRoster';

interface NBAGameLeadersProps {
    game: Game;
}

const statFromId = (id: string, offset: number, min: number, max: number): number => {
    const seed = id.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
    return Math.round(((seed * 7 + offset * 13) % (max - min) * 10) + min * 10) / 10;
};

const AVATAR = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111827&color=39ff14&rounded=true`;

export const NBAGameLeaders: React.FC<NBAGameLeadersProps> = ({ game }) => {
    const { players: awayRoster, loading: awayLoading } = useESPNRoster(game.awayTeam.name, 'NBA');
    const { players: homeRoster, loading: homeLoading } = useESPNRoster(game.homeTeam.name, 'NBA');

    const awayPlayers = useMemo(() => {
        if (!awayRoster.length) return generateMockPlayers(game.awayTeam.name, 'NBA', 3);
        return awayRoster.slice(0, 3).map(p => ({
            id: p.id,
            name: p.shortName ?? p.fullName,
            photoUrl: p.photoUrl,
            position: p.position?.abbreviation ?? '—',
            seasonAvg: {
                stat1: statFromId(p.id, 1, 15, 30).toFixed(1),
                stat2: statFromId(p.id, 2, 4, 11).toFixed(1),
                stat3: statFromId(p.id, 3, 3, 9).toFixed(1),
            }
        }));
    }, [awayRoster, game.awayTeam.name]);

    const homePlayers = useMemo(() => {
        if (!homeRoster.length) return generateMockPlayers(game.homeTeam.name, 'NBA', 3);
        return homeRoster.slice(0, 3).map(p => ({
            id: p.id,
            name: p.shortName ?? p.fullName,
            photoUrl: p.photoUrl,
            position: p.position?.abbreviation ?? '—',
            seasonAvg: {
                stat1: statFromId(p.id, 1, 15, 30).toFixed(1),
                stat2: statFromId(p.id, 2, 4, 11).toFixed(1),
                stat3: statFromId(p.id, 3, 3, 9).toFixed(1),
            }
        }));
    }, [homeRoster, game.homeTeam.name]);

    const renderLeaders = (players: typeof awayPlayers, teamName: string, logo?: string, loading?: boolean) => (
        <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 border-b border-border-muted pb-2">
                {logo ? (
                    <img src={logo} alt={teamName} className="w-8 h-8 object-contain" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-500 text-sm">sports_esports</span>
                    </div>
                )}
                <h3 className="font-black text-text-main uppercase italic tracking-widest">{teamName} Leaders</h3>
                {loading && <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-auto"></div>}
            </div>
            <div className="space-y-3">
                {players.map((player) => (
                    <div key={player.id} className={`flex items-center justify-between bg-white dark:bg-neutral-900/40 p-3 rounded border border-border-muted transition-colors ${loading ? 'animate-pulse opacity-50' : 'hover:border-primary/50'}`}>
                        <div className="flex items-center gap-3">
                            <img src={player.photoUrl} alt={player.name} className="w-10 h-10 rounded-full bg-neutral-800 border border-border-muted object-cover" onError={(e) => { (e.target as HTMLImageElement).src = AVATAR(player.name); }} />
                            <div>
                                <p className="text-xs font-bold text-text-main">{player.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black">{player.position}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-center">
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">PTS</p>
                                <p className="text-sm font-black text-primary">{player.seasonAvg.stat1}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">REB</p>
                                <p className="text-sm font-black text-text-main">{player.seasonAvg.stat2}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">AST</p>
                                <p className="text-sm font-black text-text-main">{player.seasonAvg.stat3}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="terminal-panel p-6 neon-glow-green col-span-12">
            <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-xl">social_leaderboard</span>
                <h2 className="text-xl font-black text-text-main uppercase italic tracking-[0.2em]">Game Leaders</h2>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
                {renderLeaders(awayPlayers, game.awayTeam.name, game.awayTeam.logo, awayLoading)}
                <div className="hidden lg:flex items-center justify-center">
                    <div className="h-full w-px bg-border-muted relative">
                        <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background-dark text-slate-600 font-black text-[10px] italic px-2">VS</span>
                    </div>
                </div>
                {renderLeaders(homePlayers, game.homeTeam.name, game.homeTeam.logo, homeLoading)}
            </div>
        </div>
    );
};
