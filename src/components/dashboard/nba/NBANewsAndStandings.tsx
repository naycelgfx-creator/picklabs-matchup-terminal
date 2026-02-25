import React, { useMemo } from 'react';
import { Game } from '../../../data/mockGames';
import { getMockNbaNews, generateMockStandings } from '../../../data/mockNbaData';

interface NBANewsAndStandingsProps {
    game: Game;
}

export const NBANewsAndStandings: React.FC<NBANewsAndStandingsProps> = ({ game }) => {
    const news = useMemo(() => getMockNbaNews(game.awayTeam.name, game.homeTeam.name), [game]);
    const standings = useMemo(() => generateMockStandings(game.awayTeam.name, game.homeTeam.name), [game]);

    return (
        <div className="col-span-12 lg:col-span-8 terminal-panel p-6 neon-glow-purple grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* News Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border-muted pb-2">
                    <span className="material-symbols-outlined text-accent-purple text-xl">newspaper</span>
                    <h2 className="text-sm font-black text-text-main uppercase italic tracking-[0.2em]">Latest NBA News</h2>
                </div>
                <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                    {news.map(item => (
                        <div key={item.id} className="bg-white dark:bg-neutral-900/40 p-3 rounded border border-border-muted cursor-pointer hover:border-accent-purple/50 transition-colors group">
                            <p className="text-[10px] text-accent-purple font-bold uppercase mb-1">{item.source} • {item.date}</p>
                            <p className="text-xs font-bold text-text-main group-hover:text-primary transition-colors leading-relaxed">
                                {item.headline}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Standings Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border-muted pb-2">
                    <span className="material-symbols-outlined text-accent-purple text-xl">format_list_numbered</span>
                    <h2 className="text-sm font-black text-text-main uppercase italic tracking-[0.2em]">25-26 Standings</h2>
                </div>
                <div className="bg-white dark:bg-neutral-900/40 rounded border border-border-muted overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white dark:bg-neutral-900/40 text-[9px] text-slate-500 uppercase tracking-widest border-b border-border-muted">
                                <th className="p-2 pl-3 font-black">Rank</th>
                                <th className="p-2 font-black">Team</th>
                                <th className="p-2 font-black text-center">W-L</th>
                                <th className="p-2 pr-3 font-black text-right">GB</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standings.map(team => {
                                const isMatchupTeam = team.team === game.awayTeam.name || team.team === game.homeTeam.name;
                                return (
                                    <tr key={team.team} className={`border-b border-border-muted/30 text-[10px] ${isMatchupTeam ? 'bg-primary/10 text-primary font-bold' : 'text-text-muted hover:bg-neutral-800/50'}`}>
                                        <td className="p-2 pl-3 text-center w-8">{team.rank}</td>
                                        <td className={`p-2 uppercase italic font-black ${isMatchupTeam ? 'text-white' : ''}`}>
                                            {team.team}
                                        </td>
                                        <td className="p-2 text-center tracking-wider">{team.wins}-{team.losses}</td>
                                        <td className="p-2 pr-3 text-right">{team.gb}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
