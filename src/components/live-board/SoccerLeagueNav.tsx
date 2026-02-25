import React from 'react';
import { SOCCER_LEAGUES, SportKey } from '../../data/espnScoreboard';

interface SoccerLeagueNavProps {
    activeLeague: SportKey;
    onSelectLeague: (league: SportKey) => void;
}

export const SoccerLeagueNav: React.FC<SoccerLeagueNavProps> = ({ activeLeague, onSelectLeague }) => {
    return (
        <div className="border-b border-border-muted/60 bg-neutral-950/60 backdrop-blur-sm z-30">
            <div className="max-w-[1536px] mx-auto px-6 py-2.5">
                <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
                    {/* League label */}
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 shrink-0 mr-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">sports_soccer</span>
                        League
                    </span>

                    {SOCCER_LEAGUES.map(league => {
                        const isActive = activeLeague === league.key;
                        return (
                            <button
                                key={league.key}
                                onClick={() => onSelectLeague(league.key)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap transition-all duration-150 shrink-0 border ${isActive
                                    ? 'bg-primary border-primary text-black shadow-[0_0_8px_rgba(34,197,94,0.15)]'
                                    : 'bg-transparent border-border-muted/30 text-slate-400 hover:text-slate-200 hover:bg-neutral-800/60'
                                    }`}
                            >
                                {/* League crest */}
                                <img
                                    src={league.logo}
                                    alt={league.label}
                                    className="h-4 w-4 object-contain"
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <span className="flex items-center gap-1">
                                    <img src={league.flag} alt={league.country} className="w-4 h-3 object-cover rounded-sm shadow-sm opacity-90" />
                                    <span className={`uppercase tracking-wider ${isActive ? 'text-black' : ''}`}>{league.label}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
