import React from 'react';
import { SPORTS } from '../../data/mockGames';

// ── Sport logos — 2-tier fallback ────────────────────────────────────────────
// Tier 1 (primary): ESPN CDN — best quality, real league logos for major US sports
// Tier 2 (fallback): CBS Sports SVG CDN — sport category icons (confirmed working)
// Tier 3: Material Symbols icon (always available)
const SPORT_LOGOS: Record<string, { primary: string; fallback: string }> = {
    NBA: {
        primary: 'https://a.espncdn.com/i/teamlogos/leagues/500/nba.png',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/basketball.svg',
    },
    NFL: {
        primary: 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/football.svg',
    },
    MLB: {
        primary: 'https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/baseball.svg',
    },
    NHL: {
        primary: 'https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/hockey.svg',
    },
    WNBA: {
        primary: 'https://a.espncdn.com/i/teamlogos/leagues/500/wnba.png',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/basketball.svg',
    },
    NCAAB: {
        primary: 'https://sports.cbsimg.net/fly/images/icon-logos/basketball.svg',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/basketball.svg',
    },
    NCAAW: {
        primary: 'https://sports.cbsimg.net/fly/images/icon-logos/basketball.svg',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/basketball.svg',
    },
    // Soccer/Tennis/Golf — CBS Sports SVGs confirmed working
    Soccer: {
        primary: 'https://sports.cbsimg.net/fly/images/icon-logos/soccer.svg',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/soccer.svg',
    },
    Tennis: {
        primary: 'https://sports.cbsimg.net/fly/images/icon-logos/tennis.svg',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/tennis.svg',
    },
    Golf: {
        primary: 'https://sports.cbsimg.net/fly/images/icon-logos/golf.svg',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/golf.svg',
    },
    UFC: {
        primary: 'https://a.espncdn.com/i/teamlogos/leagues/500/ufc.png',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/boxing.svg',
    },
    Esports: {
        primary: 'https://a.espncdn.com/i/teamlogos/leagues/500/esports.png',
        fallback: 'https://sports.cbsimg.net/fly/images/icon-logos/esports.svg',
    },
};

// Material Symbols icon — last-resort fallback
const SPORT_ICON_MATERIAL: Record<string, string> = {
    NBA: 'sports_basketball',
    NFL: 'sports_football',
    MLB: 'sports_baseball',
    NHL: 'sports_hockey',
    WNBA: 'sports_basketball',
    Soccer: 'sports_soccer',
    Tennis: 'sports_tennis',
    Golf: 'sports_golf',
    UFC: 'sports_mma',
    Esports: 'sports_esports',
    NCAAB: 'sports_basketball',
    NCAAW: 'sports_basketball',
};

interface SportsNavProps {
    activeSport: string;
    onSelectSport: (sport: string) => void;
}

export const SportsNav: React.FC<SportsNavProps> = ({ activeSport, onSelectSport }) => {
    return (
        <div className="bg-white dark:bg-neutral-900/40 border-b border-border-muted z-40 w-full">
            <div className="max-w-[1536px] mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-start xl:justify-center gap-3 xl:gap-8 overflow-x-auto custom-scrollbar pb-2 scrollbar-hide">
                    {SPORTS.map(sport => {
                        const entry = SPORT_LOGOS[sport];
                        const primarySrc = entry?.primary;
                        const fallbackSrc = entry?.fallback;
                        const materialIcon = SPORT_ICON_MATERIAL[sport] ?? 'sports';
                        return (
                            <div
                                key={sport}
                                className={`sport-chip flex items-center gap-2 ${activeSport === sport ? 'active' : ''}`}
                                onClick={() => onSelectSport(sport)}
                            >
                                <span className="relative flex items-center justify-center w-4 h-4 shrink-0">
                                    <img
                                        src={primarySrc}
                                        alt={sport}
                                        className="h-4 w-4 object-contain"
                                        onError={e => {
                                            const img = e.currentTarget;
                                            if (fallbackSrc && img.src !== fallbackSrc) {
                                                // Try CBS Sports SVG fallback
                                                img.src = fallbackSrc;
                                            } else {
                                                // Last resort: Material Symbols icon
                                                img.style.display = 'none';
                                                const icon = img.nextElementSibling as HTMLElement | null;
                                                if (icon) icon.style.display = 'inline';
                                            }
                                        }}
                                    />
                                    <span
                                        className="material-symbols-outlined text-[14px] text-text-muted"
                                        style={{ display: 'none' }}
                                    >
                                        {materialIcon}
                                    </span>
                                </span>
                                {sport}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
