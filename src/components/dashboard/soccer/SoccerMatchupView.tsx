import React from 'react';
import { Game } from '../../../data/mockGames';

interface SoccerMatchupViewProps {
    game: Game;
}

export const SoccerMatchupView: React.FC<SoccerMatchupViewProps> = ({ game }) => {
    // Only render for Soccer matches. In our app, league could be "Soccer", "Soccer.EPL", etc.
    if (!game.sport.startsWith('Soccer') && game.league !== 'Soccer') return null;

    const awayColor = game.awayTeam.color || '#3b82f6';
    const homeColor = game.homeTeam.color || '#ef4444';

    // Mock Formations
    const awayFormation = [
        { name: 'GK', x: 10, y: 50 },
        { name: 'LB', x: 25, y: 15 },
        { name: 'CB', x: 22, y: 35 },
        { name: 'CB', x: 22, y: 65 },
        { name: 'RB', x: 25, y: 85 },
        { name: 'CM', x: 40, y: 30 },
        { name: 'CDM', x: 35, y: 50 },
        { name: 'CM', x: 40, y: 70 },
        { name: 'LW', x: 60, y: 20 },
        { name: 'ST', x: 70, y: 50 },
        { name: 'RW', x: 60, y: 80 },
    ];

    const homeFormation = [
        { name: 'GK', x: 90, y: 50 },
        { name: 'LB', x: 75, y: 85 },
        { name: 'CB', x: 78, y: 65 },
        { name: 'CB', x: 78, y: 35 },
        { name: 'RB', x: 75, y: 15 },
        { name: 'LM', x: 60, y: 80 },
        { name: 'CM', x: 55, y: 60 },
        { name: 'CM', x: 55, y: 40 },
        { name: 'RM', x: 60, y: 20 },
        { name: 'ST', x: 35, y: 60 },
        { name: 'ST', x: 35, y: 40 },
    ];

    const stats = [
        { label: 'Possession', away: '45%', home: '55%', awayBar: 45, homeBar: 55 },
        { label: 'Expected Goals (xG)', away: '1.24', home: '2.10', awayBar: 30, homeBar: 70 },
        { label: 'Shots on Target', away: '4', home: '7', awayBar: 36, homeBar: 64 },
        { label: 'Pass Accuracy', away: '82%', home: '88%', awayBar: 82, homeBar: 88 },
        { label: 'Corners', away: '3', home: '6', awayBar: 33, homeBar: 66 },
    ];

    return (
        <div className="terminal-panel flex flex-col mt-6 border border-border-muted rounded-xl bg-white/5 dark:bg-neutral-900/20 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-border-muted bg-white dark:bg-[#111]">
                <div className="flex items-center gap-4 w-full md:w-1/3 justify-start">
                    <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="w-12 h-12 object-contain" />
                    <div>
                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Away</div>
                        <div className="text-lg font-bold text-text-main leading-tight">{game.awayTeam.name}</div>
                        <div className="text-xs font-medium text-slate-400">Formation: 4-3-3</div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center w-full md:w-1/3 my-4 md:my-0">
                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Matchup Info</div>
                    <div className="text-2xl font-black text-text-main italic">VS</div>
                    <div className="text-xs font-bold text-slate-400 mt-1">{game.timeLabel}</div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-1/3 justify-end text-right">
                    <div>
                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Home</div>
                        <div className="text-lg font-bold text-text-main leading-tight">{game.homeTeam.name}</div>
                        <div className="text-xs font-medium text-slate-400">Formation: 4-4-2</div>
                    </div>
                    <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="w-12 h-12 object-contain" />
                </div>
            </div>

            <div className="flex flex-col xl:flex-row bg-white dark:bg-[#0a0a0a]">
                {/* Tactical Pitch Illustration */}
                <div className="flex-1 p-6 flex flex-col items-center justify-center border-b xl:border-b-0 xl:border-r border-border-muted bg-slate-50 dark:bg-[#111]/50 relative">
                    <h4 className="flex items-center gap-2 text-sm font-black text-text-main uppercase tracking-widest mb-6">
                        <span className="material-symbols-outlined text-primary">strategy</span>
                        Tactical Setup
                    </h4>

                    {/* SVG Soccer Pitch */}
                    <div className="relative w-full max-w-[600px] aspect-[1.5] bg-[#3b8a3e] border-2 border-white/60 shadow-lg rounded-sm overflow-hidden">
                        {/* Grass pattern (light/dark green stripes) */}
                        <div className="absolute inset-0 flex flex-col justify-around opacity-20">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-black/20' : 'bg-white/20'}`}></div>
                            ))}
                        </div>

                        {/* Pitch Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 66.6">
                            {/* Center Line */}
                            <line x1="50" y1="0" x2="50" y2="66.6" stroke="white" strokeWidth="0.5" opacity="0.6" />
                            {/* Center Circle */}
                            <circle cx="50" cy="33.3" r="10" stroke="white" strokeWidth="0.5" fill="none" opacity="0.6" />
                            <circle cx="50" cy="33.3" r="0.5" fill="white" opacity="0.6" />

                            {/* Left Penalty Area */}
                            <rect x="0" y="15" width="18" height="36" stroke="white" strokeWidth="0.5" fill="none" opacity="0.6" />
                            {/* Left Goal Area */}
                            <rect x="0" y="24" width="6" height="18" stroke="white" strokeWidth="0.5" fill="none" opacity="0.6" />
                            {/* Left Penalty Spot */}
                            <circle cx="12" cy="33.3" r="0.5" fill="white" opacity="0.6" />
                            {/* Left D */}
                            <path d="M 18,23 A 10,10 0 0,1 18,43" stroke="white" strokeWidth="0.5" fill="none" opacity="0.6" />

                            {/* Right Penalty Area */}
                            <rect x="82" y="15" width="18" height="36" stroke="white" strokeWidth="0.5" fill="none" opacity="0.6" />
                            {/* Right Goal Area */}
                            <rect x="94" y="24" width="6" height="18" stroke="white" strokeWidth="0.5" fill="none" opacity="0.6" />
                            {/* Right Penalty Spot */}
                            <circle cx="88" cy="33.3" r="0.5" fill="white" opacity="0.6" />
                            {/* Right D */}
                            <path d="M 82,23 A 10,10 0 0,0 82,43" stroke="white" strokeWidth="0.5" fill="none" opacity="0.6" />
                        </svg>

                        {/* Away Team Players */}
                        {awayFormation.map((p, i) => (
                            <div
                                key={`away-${i}`}
                                className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                            >
                                <div className="w-5 h-5 rounded-full border border-white shadow-md flex items-center justify-center text-[8px] font-black text-white" style={{ backgroundColor: awayColor }}>
                                    {p.name}
                                </div>
                            </div>
                        ))}

                        {/* Home Team Players */}
                        {homeFormation.map((p, i) => (
                            <div
                                key={`home-${i}`}
                                className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                            >
                                <div className="w-5 h-5 rounded-full border border-white shadow-md flex items-center justify-center text-[8px] font-black text-white" style={{ backgroundColor: homeColor }}>
                                    {p.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Match Stats */}
                <div className="w-full xl:w-[400px] p-6 lg:p-8 flex flex-col bg-white dark:bg-[#0a0a0a]">
                    <h4 className="flex items-center justify-center gap-2 text-sm font-black text-text-main uppercase tracking-widest mb-8">
                        Match Simulator Stats
                    </h4>

                    <div className="flex flex-col gap-6">
                        {stats.map((s, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between items-end text-xs font-bold px-1">
                                    <span style={{ color: awayColor }}>{s.away}</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">{s.label}</span>
                                    <span style={{ color: homeColor }}>{s.home}</span>
                                </div>
                                <div className="flex h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                    <div className="h-full relative" style={{ width: `${s.awayBar}%`, backgroundColor: awayColor }}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                                    </div>
                                    <div className="h-full relative" style={{ width: `${s.homeBar}%`, backgroundColor: homeColor }}>
                                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
