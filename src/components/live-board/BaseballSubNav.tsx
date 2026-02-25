import React from 'react';
import { SportKey, BASEBALL_LEAGUES } from '../../data/espnScoreboard';

interface BaseballSubNavProps {
    activeLeague: SportKey;
    onSelectLeague: (league: SportKey) => void;
}

export const BaseballSubNav: React.FC<BaseballSubNavProps> = ({ activeLeague, onSelectLeague }) => {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                League
            </span>
            <div className="h-4 w-px bg-border-muted/30 mx-1"></div>
            {BASEBALL_LEAGUES.map((league) => {
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
                        {/* League logo */}
                        <img
                            src={league.logo}
                            alt={league.label}
                            className="h-4 w-4 object-contain brightness-125"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <span className="flex items-center gap-1">
                            <span className="text-sm">{league.flag}</span>
                            <span className={`uppercase tracking-wider ${isActive ? 'text-black' : ''}`}>{league.label}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
