import React from 'react';
import { Game } from '../../data/mockGames';

interface BasketballCourtProps {
    game: Game;
}

export const BasketballCourt: React.FC<BasketballCourtProps> = ({ game }) => {
    // Only show for NCAAB or NBA
    if (game.sport !== 'NCAAB' && game.sport !== 'NBA') return null;

    // Generate random shot data
    const generateShots = (count: number) => {
        return Array.from({ length: count }).map(() => ({
            id: Math.random().toString(),
            x: Math.random() * 100, // 0 to 100%
            y: Math.random() * 100, // 0 to 100% (0 is baseline)
            made: Math.random() > 0.45, // 55% miss rate
            isThree: Math.random() > 0.6
        }));
    };

    const awayShots = generateShots(15);
    const homeShots = generateShots(15);

    return (
        <div className="terminal-panel mt-6 overflow-hidden">
            <div className="p-4 border-b border-border-muted flex justify-between items-center bg-white/5">
                <h3 className="text-xs font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500 text-sm">sports_basketball</span>
                    Shot Chart Analysis (Last Game)
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-muted">
                {/* Away Team Chart */}
                <div className="bg-background-dark p-6 flex flex-col items-center">
                    <div className="flex justify-between w-full mb-4 items-center">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-text-main uppercase tracking-widest">{game.awayTeam.name}</h4>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block">Team eFG%</span>
                            <span className="text-xs font-black text-accent-purple">54.2%</span>
                        </div>
                    </div>

                    {/* Court Container (Half Court) */}
                    <div className="relative w-full max-w-[300px] aspect-[50/47] border-2 border-slate-700 bg-[#151515] rounded-t-xl overflow-hidden mt-2">
                        {/* Team Watermark Removed */}

                        {/* Paint Area */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[32%] h-[40%] border-x-2 border-t-2 border-slate-700 bg-orange-900/10"></div>

                        {/* Free Throw Circle */}
                        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-[32%] h-0 pt-[32%] border-2 border-slate-700 rounded-full border-b-0 transform translate-y-1/2"></div>

                        {/* Three Point Line */}
                        <div className="absolute bottom-0 left-[-10%] right-[-10%] h-[180%] border-2 border-slate-700 rounded-t-full pointer-events-none"></div>

                        {/* Backboard & Hoop */}
                        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[12%] h-[1px] bg-slate-500"></div>
                        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[4%] h-0 pt-[4%] border-2 border-orange-500 rounded-full transform translate-y-1/2"></div>

                        {/* Shots */}
                        {awayShots.map(shot => (
                            <div
                                key={shot.id}
                                className={`absolute w-3 h-3 rounded-full border -translate-x-1/2 translate-y-1/2 shadow-sm ${shot.made ? 'bg-primary border-primary/50' : 'bg-red-500/80 border-red-500/50'} left-[var(--x)] bottom-[var(--y)]`}
                                style={{ '--x': `${shot.x}%`, '--y': `${shot.y * 0.9}%` } as React.CSSProperties}
                                title={shot.made ? 'Made Shot' : 'Missed Shot'}
                            >
                                {shot.made ? '' : <span className="absolute inset-0 flex items-center justify-center text-[8px] text-text-main font-bold pb-[1px]">×</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Home Team Chart */}
                <div className="bg-background-dark p-6 flex flex-col items-center">
                    <div className="flex justify-between w-full mb-4 items-center flex-row-reverse">
                        <div className="flex items-center gap-2 flex-row-reverse">
                            <h4 className="text-sm font-black text-text-main uppercase tracking-widest">{game.homeTeam.name}</h4>
                        </div>
                        <div className="text-left">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block">Team eFG%</span>
                            <span className="text-xs font-black text-primary">56.8%</span>
                        </div>
                    </div>

                    {/* Court Container (Half Court) */}
                    <div className="relative w-full max-w-[300px] aspect-[50/47] border-2 border-slate-700 bg-[#151515] rounded-t-xl overflow-hidden mt-2">
                        {/* Paint Area */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[32%] h-[40%] border-x-2 border-t-2 border-slate-700 bg-orange-900/10"></div>

                        {/* Free Throw Circle */}
                        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-[32%] h-0 pt-[32%] border-2 border-slate-700 rounded-full border-b-0 transform translate-y-1/2"></div>

                        {/* Three Point Line */}
                        <div className="absolute bottom-0 left-[-10%] right-[-10%] h-[180%] border-2 border-slate-700 rounded-t-full pointer-events-none"></div>

                        {/* Backboard & Hoop */}
                        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[12%] h-[1px] bg-slate-500"></div>
                        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[4%] h-0 pt-[4%] border-2 border-orange-500 rounded-full transform translate-y-1/2"></div>

                        {/* Shots */}
                        {homeShots.map(shot => (
                            <div
                                key={shot.id}
                                className={`absolute w-3 h-3 rounded-full border -translate-x-1/2 translate-y-1/2 shadow-sm ${shot.made ? 'bg-primary border-primary/50' : 'bg-red-500/80 border-red-500/50'} left-[var(--x)] bottom-[var(--y)]`}
                                style={{ '--x': `${shot.x}%`, '--y': `${shot.y * 0.9}%` } as React.CSSProperties}
                                title={shot.made ? 'Made Shot' : 'Missed Shot'}
                            >
                                {shot.made ? '' : <span className="absolute inset-0 flex items-center justify-center text-[8px] text-text-main font-bold pb-[1px]">×</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900/40 p-3 flex justify-center items-center gap-6 border-t border-border-muted">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary border border-primary/50"></div>
                    <span className="text-[10px] text-text-muted font-bold uppercase">Made</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50 flex items-center justify-center"><span className="text-[8px] text-text-main font-bold pb-[1px]">×</span></div>
                    <span className="text-[10px] text-text-muted font-bold uppercase">Missed</span>
                </div>
            </div>
        </div>
    );
};
