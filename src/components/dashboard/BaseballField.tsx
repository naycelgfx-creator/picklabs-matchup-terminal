import React, { useMemo, useState } from 'react';
import { Game } from '../../data/mockGames';
import { MatchupEfficiencySection } from './MatchupEfficiencySection';

interface BaseballFieldProps {
    game: Game;
}

const W = 900;
const H = 840;
const HOME_X = W / 2;
const HOME_Y = H - 120;
const BASE_DIST = 220;
const OUTFIELD_R = 530;
const LF_R = 480;
const RF_R = 480;
const FIRST_X = HOME_X + BASE_DIST / Math.SQRT2;
const FIRST_Y = HOME_Y - BASE_DIST / Math.SQRT2;
const SECOND_X = HOME_X;
const SECOND_Y = HOME_Y - BASE_DIST * Math.SQRT2;
const THIRD_X = HOME_X - BASE_DIST / Math.SQRT2;
const THIRD_Y = HOME_Y - BASE_DIST / Math.SQRT2;
const MOUND_X = HOME_X;
const MOUND_Y = HOME_Y - BASE_DIST * Math.SQRT2 * 0.45;

type PlayType = 'hit' | 'out' | 'strikeout' | 'homerun' | 'walk';
const playColor: Record<PlayType, string> = {
    hit: '#22d3ee',
    out: '#ef4444',
    strikeout: '#f97316',
    homerun: '#facc15',
    walk: '#a855f7',
};

const generatePlays = (count: number, isHome: boolean) =>
    Array.from({ length: count }, (_, i) => {
        const type: PlayType = ['hit', 'out', 'strikeout', 'homerun', 'walk'][Math.floor(Math.random() * 5)] as PlayType;
        let x: number, y: number;
        if (type === 'homerun') {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.7;
            const r = OUTFIELD_R - 20 + Math.random() * 30;
            x = HOME_X + r * Math.cos(angle); y = HOME_Y + r * Math.sin(angle);
        } else if (type === 'hit') {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.75;
            const r = 150 + Math.random() * 200;
            x = HOME_X + r * Math.cos(angle); y = HOME_Y + r * Math.sin(angle);
        } else {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
            const r = 80 + Math.random() * 260;
            x = HOME_X + r * Math.cos(angle); y = HOME_Y + r * Math.sin(angle);
        }
        x = Math.max(50, Math.min(W - 50, x));
        y = Math.max(50, Math.min(H - 50, y));
        return { id: `p${i}${isHome ? 'h' : 'a'}`, x, y, type };
    });

export const BaseballField: React.FC<BaseballFieldProps> = ({ game }) => {
    const [filter, setFilter] = useState<'both' | 'home' | 'away'>('both');
    const awayPlays = useMemo(() => generatePlays(15, false), []);
    const homePlays = useMemo(() => generatePlays(15, true), []);

    const visible = [
        ...(filter !== 'home' ? awayPlays.map(p => ({ ...p, team: 'away' as const })) : []),
        ...(filter !== 'away' ? homePlays.map(p => ({ ...p, team: 'home' as const })) : []),
    ];

    const outfieldPath = `M ${HOME_X - LF_R} ${HOME_Y - 60} Q ${HOME_X - OUTFIELD_R} ${HOME_Y - OUTFIELD_R} ${HOME_X} ${HOME_Y - OUTFIELD_R + 20} Q ${HOME_X + OUTFIELD_R} ${HOME_Y - OUTFIELD_R} ${HOME_X + RF_R} ${HOME_Y - 60}`;
    const infieldPath = `M ${HOME_X - 170} ${HOME_Y - 30} Q ${HOME_X} ${HOME_Y - 360} ${HOME_X + 170} ${HOME_Y - 30}`;

    // Mock stats
    const awayHits = awayPlays.filter(p => p.type === 'hit' || p.type === 'homerun').length;
    const homeHits = homePlays.filter(p => p.type === 'hit' || p.type === 'homerun').length;
    const awayHR = awayPlays.filter(p => p.type === 'homerun').length;
    const homeHR = homePlays.filter(p => p.type === 'homerun').length;
    const awayKs = awayPlays.filter(p => p.type === 'strikeout').length;
    const homeKs = homePlays.filter(p => p.type === 'strikeout').length;
    const awayTotal = awayPlays.length;
    const homeTotal = homePlays.length;
    const awayBA = awayTotal > 0 ? (awayHits / awayTotal * 1000) / 10 : 0;
    const homeBA = homeTotal > 0 ? (homeHits / homeTotal * 1000) / 10 : 0;

    const effRows = [
        { label: 'Batting Avg', awayVal: `.${String(Math.round(awayBA * 10)).padStart(3, '0')}`, homeVal: `.${String(Math.round(homeBA * 10)).padStart(3, '0')}`, awayPct: awayBA, homePct: homeBA },
        { label: 'Home Runs', awayVal: `${awayHR}`, homeVal: `${homeHR}`, awayPct: Math.min(awayHR * 15, 100), homePct: Math.min(homeHR * 15, 100) },
        { label: 'Strikeouts (K)', awayVal: `${awayKs}`, homeVal: `${homeKs}`, awayPct: Math.min(awayKs * 12, 100), homePct: Math.min(homeKs * 12, 100) },
        { label: 'OBP', awayVal: `.${Math.round(awayBA + 7)}0`, homeVal: `.${Math.round(homeBA + 7)}0`, awayPct: awayBA + 7, homePct: homeBA + 7 },
    ];

    return (
        <div className="terminal-panel mt-6 overflow-hidden col-span-12">
            <div className="p-4 border-b border-border-muted flex flex-wrap items-center justify-between gap-3 bg-white/5">
                <h3 className="text-xs font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-400 text-sm">sports_baseball</span>
                    Hit & Play Field Chart
                </h3>
                <div className="flex gap-1">
                    {(['both', 'away', 'home'] as const).map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`text-[9px] font-black uppercase px-2.5 py-1 rounded border transition-all ${filter === s ? 'bg-primary/20 border-primary text-primary' : 'border-border-muted text-slate-500 hover:border-slate-500'}`}
                        >
                            {s === 'both' ? 'Both' : s === 'away' ? game.awayTeam.name : game.homeTeam.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-background-dark flex justify-center">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl h-auto" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Baseball field">
                    <defs>
                        <radialGradient id="bbGrass2" cx="50%" cy="80%" r="80%">
                            <stop offset="0%" stopColor="#166534" /><stop offset="100%" stopColor="#14432a" />
                        </radialGradient>
                    </defs>
                    <rect x={0} y={0} width={W} height={H} fill="#0a1a0f" rx={6} />
                    <path d={`${outfieldPath} L ${HOME_X + RF_R} ${HOME_Y} L ${HOME_X - LF_R} ${HOME_Y} Z`} fill="url(#bbGrass2)" />
                    <path d={outfieldPath} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={4} />
                    <path d={`M ${HOME_X - LF_R + 5} ${HOME_Y - 65} Q ${HOME_X - OUTFIELD_R + 28} ${HOME_Y - OUTFIELD_R + 28} ${HOME_X} ${HOME_Y - OUTFIELD_R + 48} Q ${HOME_X + OUTFIELD_R - 28} ${HOME_Y - OUTFIELD_R + 28} ${HOME_X + RF_R - 5} ${HOME_Y - 65}`}
                        fill="none" stroke="rgba(180,130,50,0.35)" strokeWidth={20} />
                    <line x1={HOME_X} y1={HOME_Y} x2={HOME_X - LF_R} y2={HOME_Y - LF_R * 1.05} stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} />
                    <line x1={HOME_X} y1={HOME_Y} x2={HOME_X + RF_R} y2={HOME_Y - RF_R * 1.05} stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} />
                    <path d={`${infieldPath} L ${HOME_X} ${HOME_Y} Z`} fill="#92400e" opacity={0.85} />
                    <polygon points={`${HOME_X},${HOME_Y} ${FIRST_X},${FIRST_Y} ${SECOND_X},${SECOND_Y} ${THIRD_X},${THIRD_Y}`} fill="#a16207" opacity={0.8} />
                    <polygon points={`${HOME_X},${HOME_Y - 20} ${FIRST_X - 16},${FIRST_Y + 4} ${SECOND_X},${SECOND_Y + 22} ${THIRD_X + 16},${THIRD_Y + 4}`} fill="url(#bbGrass2)" opacity={0.7} />
                    <ellipse cx={MOUND_X} cy={MOUND_Y} rx={22} ry={14} fill="#92400e" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                    <ellipse cx={MOUND_X} cy={MOUND_Y - 2} rx={6} ry={4} fill="rgba(255,255,255,0.25)" />
                    {[[HOME_X, HOME_Y, FIRST_X, FIRST_Y], [FIRST_X, FIRST_Y, SECOND_X, SECOND_Y], [SECOND_X, SECOND_Y, THIRD_X, THIRD_Y], [THIRD_X, THIRD_Y, HOME_X, HOME_Y]].map(([x1, y1, x2, y2], i) => (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                    ))}
                    {[[FIRST_X, FIRST_Y], [SECOND_X, SECOND_Y], [THIRD_X, THIRD_Y]].map(([bx, by], i) => (
                        <rect key={i} x={bx - 9} y={by - 9} width={18} height={18} fill="white" opacity={0.9} rx={2} transform={`rotate(45, ${bx}, ${by})`} />
                    ))}
                    <polygon points={`${HOME_X},${HOME_Y - 10} ${HOME_X + 10},${HOME_Y} ${HOME_X + 10},${HOME_Y + 8} ${HOME_X - 10},${HOME_Y + 8} ${HOME_X - 10},${HOME_Y}`} fill="white" opacity={0.9} />

                    {/* BIGGER HOME LOGO */}
                    {game.homeTeam.logo && (
                        <image href={game.homeTeam.logo} x={HOME_X - 50} y={HOME_Y - BASE_DIST * Math.SQRT2 * 0.65} width={100} height={100} opacity={0.22} preserveAspectRatio="xMidYMid meet" />
                    )}

                    <text x={HOME_X} y={HOME_Y - OUTFIELD_R + 68} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.4)" fontFamily="monospace" fontWeight={900}>CF 400</text>
                    <text x={HOME_X - LF_R + 40} y={HOME_Y - 80} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.4)" fontFamily="monospace" fontWeight={900}>LF 330</text>
                    <text x={HOME_X + RF_R - 40} y={HOME_Y - 80} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.4)" fontFamily="monospace" fontWeight={900}>RF 330</text>
                    <text x={HOME_X - 220} y={80} textAnchor="middle" fontSize={12} fontWeight={900} fill="#93c5fd" opacity={0.85} fontFamily="monospace">{game.awayTeam.name.toUpperCase()}</text>
                    <text x={HOME_X + 220} y={80} textAnchor="middle" fontSize={12} fontWeight={900} fill="#6ee7b7" opacity={0.85} fontFamily="monospace">{game.homeTeam.name.toUpperCase()}</text>

                    {visible.map(p => {
                        const col = playColor[p.type];
                        const r = p.type === 'homerun' ? 7 : 5;
                        return (
                            <circle key={p.id} cx={p.x} cy={p.y} r={r} fill={col} opacity={0.85} style={{ filter: `drop-shadow(0 0 4px ${col})` }}>
                                <title>{`${p.team === 'home' ? game.homeTeam.name : game.awayTeam.name} • ${p.type}`}</title>
                            </circle>
                        );
                    })}
                </svg>
            </div>

            <div className="p-3 border-t border-border-muted flex flex-wrap justify-center gap-4 bg-background-dark">
                {Object.entries(playColor).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
                        <span className="text-[9px] font-black uppercase text-slate-400">{type}</span>
                    </div>
                ))}
            </div>

            {/* ── Matchup Efficiency ── */}
            <MatchupEfficiencySection
                game={game}
                icon="analytics"
                rows={effRows}
                footNote="MLB efficiency stats based on simulated at-bat data for this matchup"
            />
        </div>
    );
};
