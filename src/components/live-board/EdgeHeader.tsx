import React from 'react';
import { SPORTS } from '../../data/mockGames';
import { SPORT_LOGOS, SPORT_ICON_MATERIAL } from './SportsNav'; // Re-use the existing mappings

interface EdgeHeaderProps {
    activeSport: string;
    onSelectSport: (sport: string) => void;
    viewMode: 'TEAMS' | 'PLAYERS';
    onSelectViewMode: (mode: 'TEAMS' | 'PLAYERS') => void;
    analyticsMode: 'STANDARD' | 'ADVANCED';
    onToggleAnalyticsMode: () => void;
}

export const EdgeHeader: React.FC<EdgeHeaderProps> = ({
    activeSport,
    onSelectSport,
    viewMode,
    onSelectViewMode,
    analyticsMode,
    onToggleAnalyticsMode
}) => {
    return (
        <div className="sticky top-[var(--header-h,60px)] md:top-[var(--header-h,80px)] z-40 bg-background-dark/95 backdrop-blur-md border-b border-border-muted w-full overflow-hidden shadow-xl">
            {/* Level 2A: The Sport Selector (Horizontal Scroll) */}
            <div className="max-w-[1536px] mx-auto px-2 sm:px-6 pt-3 sm:pt-4">
                <div className="flex overflow-x-auto scrollbar-hide lg:flex-wrap items-center lg:justify-center gap-2 sm:gap-3 xl:gap-6 pb-2 w-full snap-x">
                    {SPORTS.map(sport => {
                        const entry = SPORT_LOGOS[sport as keyof typeof SPORT_LOGOS];
                        const primarySrc = entry?.primary;
                        const fallbackSrc = entry?.fallback;
                        const materialIcon = SPORT_ICON_MATERIAL[sport as keyof typeof SPORT_ICON_MATERIAL] ?? 'sports';
                        const isActive = activeSport === sport;

                        return (
                            <button
                                key={sport}
                                className={`shrink-0 snap-start flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1.5 sm:gap-2 px-4 sm:px-3 py-2 sm:py-2.5 rounded-full transition-all duration-300 font-black uppercase tracking-widest text-[10px] sm:text-[11px] border min-w-[70px] sm:min-w-[100px]
                                    ${isActive
                                        ? 'bg-primary/20 text-primary border-primary shadow-[0_0_15px_rgba(163,255,0,0.15)] scale-105'
                                        : 'bg-neutral-900 border-border-muted text-slate-400 hover:text-white hover:border-slate-600 hover:bg-neutral-800'
                                    }`}
                                onClick={() => onSelectSport(sport)}
                            >
                                <span className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 shrink-0">
                                    <img
                                        src={primarySrc}
                                        alt={sport}
                                        className={`w-full h-full object-contain transition-all duration-300 ${!isActive ? 'opacity-60 grayscale' : 'opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`}
                                        onError={e => {
                                            const img = e.currentTarget;
                                            if (fallbackSrc && img.src !== fallbackSrc) {
                                                img.src = fallbackSrc;
                                            } else {
                                                img.style.display = 'none';
                                                const icon = img.nextElementSibling as HTMLElement | null;
                                                if (icon) icon.style.display = 'inline';
                                            }
                                        }}
                                    />
                                    <span
                                        className={`material-symbols-outlined text-[16px] sm:text-[18px] ${isActive ? 'text-primary' : 'text-slate-500'}`}
                                        style={{ display: 'none' }}
                                    >
                                        {materialIcon}
                                    </span>
                                </span>
                                <span className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                    {sport === 'CFB' ? "NCAAF" : sport}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Level 2B: Sub-Tabs & View Toggles */}
            <div className="max-w-[1536px] mx-auto px-2 sm:px-6 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-muted/50">
                {/* Team vs Player Toggle */}
                <div className="flex bg-neutral-900 border border-border-muted rounded-full p-1 w-full sm:w-auto relative shadow-inner">
                    <button
                        onClick={() => onSelectViewMode('TEAMS')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-300 z-10
                            ${viewMode === 'TEAMS'
                                ? 'text-white'
                                : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[14px]">groups</span>
                        Teams
                    </button>
                    <button
                        onClick={() => onSelectViewMode('PLAYERS')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-300 z-10
                            ${viewMode === 'PLAYERS'
                                ? 'text-white'
                                : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        Players
                    </button>

                    {/* Sliding background pill */}
                    <div
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-neutral-700 shadow shadow-black/50 transition-transform duration-300 ease-out z-0`}
                        style={{
                            transform: viewMode === 'TEAMS' ? 'translateX(0)' : 'translateX(100%)',
                            left: '4px'
                        }}
                    />
                </div>

                {/* View Toggles (Advanced Analytics / Settings) */}
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                    {/* Advanced Analytics Toggle */}
                    <button
                        onClick={onToggleAnalyticsMode}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all shrink-0
                            ${analyticsMode === 'ADVANCED'
                                ? 'bg-accent-blue/10 border-accent-blue/40 text-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                                : 'bg-neutral-900 border-border-muted text-slate-400 hover:text-white hover:bg-neutral-800'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[14px]">
                            {analyticsMode === 'ADVANCED' ? 'monitoring' : 'bar_chart'}
                        </span>
                        <span>{analyticsMode === 'ADVANCED' ? 'Advanced Analytics' : 'Standard View'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
