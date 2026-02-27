import React, { useMemo, useState } from 'react';
import { Game } from '../../data/mockGames';

interface BasketballCourtProps {
    game: Game;
}

// Viewbox: 940 x 500 (NBA standard proportion)
const W = 940;
const H = 500;
const CX = W / 2;
const CY = H / 2;

// Shot dot component
const ShotDot: React.FC<{ cx: number; cy: number; made: boolean; color: string; tip: string }> = ({ cx, cy, made, color, tip }) => (
    <circle
        cx={cx} cy={cy} r={5}
        fill={made ? color : 'none'}
        stroke={made ? color : '#ef4444'}
        strokeWidth={made ? 0 : 1.5}
        opacity={0.85}
        style={{ filter: made ? `drop-shadow(0 0 4px ${color})` : undefined }}
    >
        <title>{tip}</title>
    </circle>
);

const generateShots = (count: number, halfRight: boolean) =>
    Array.from({ length: count }, (_, i) => {
        const zone = Math.random();
        let x: number, y: number;
        if (zone < 0.3) { // paint
            x = 60 + Math.random() * 120;
            y = CY - 60 + Math.random() * 120;
        } else if (zone < 0.6) { // mid
            x = 100 + Math.random() * 190;
            y = CY - 130 + Math.random() * 260;
        } else { // 3pt
            const angle = (Math.random() * 180) * Math.PI / 180;
            const r = 240 + Math.random() * 80;
            x = 50 + r * Math.cos(angle);
            y = CY + r * Math.sin(angle - Math.PI / 2);
        }
        x = Math.max(10, Math.min(W / 2 - 5, x));
        y = Math.max(10, Math.min(H - 10, y));
        if (halfRight) x = W - x;
        return { id: `s${i}`, x, y, made: Math.random() > 0.43 };
    });

export const BasketballCourt: React.FC<BasketballCourtProps> = ({ game }) => {
    const [teamSide, setTeamSide] = useState<'both' | 'home' | 'away'>('both');

    const awayShots = useMemo(() => generateShots(20, false), []);
    const homeShots = useMemo(() => generateShots(20, true), []);

    const homeColor = '#0ca810';
    const awayColor = '#3b82f6';

    const visibleShots = [
        ...(teamSide !== 'home' ? awayShots.map(s => ({ ...s, color: awayColor, team: 'away' })) : []),
        ...(teamSide !== 'away' ? homeShots.map(s => ({ ...s, color: homeColor, team: 'home' })) : []),
    ];

    return (
        <div className="terminal-panel mt-6 overflow-hidden col-span-12">
            {/* Header */}
            <div className="p-4 border-b border-border-muted flex flex-wrap items-center justify-between gap-3 bg-white/5">
                <h3 className="text-xs font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500 text-sm">sports_basketball</span>
                    Shot Chart · Full Court
                </h3>
                <div className="flex gap-1">
                    {(['both', 'away', 'home'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setTeamSide(s)}
                            className={`text-[9px] font-black uppercase px-2.5 py-1 rounded border transition-all ${teamSide === s ? 'bg-primary/20 border-primary text-primary' : 'border-border-muted text-slate-500 hover:border-slate-500'}`}
                        >
                            {s === 'both' ? 'Both Teams' : s === 'away' ? game.awayTeam.name : game.homeTeam.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Court SVG */}
            <div className="p-4 bg-background-dark">
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label="Basketball court shot chart"
                >
                    {/* Court surface */}
                    <rect x={0} y={0} width={W} height={H} fill="#8B4513" rx={8} />
                    <rect x={2} y={2} width={W - 4} height={H - 4} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2} rx={7} />

                    {/* Wood grain lines */}
                    {Array.from({ length: 20 }, (_, i) => (
                        <line key={i} x1={0} y1={i * 26} x2={W} y2={i * 26} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
                    ))}

                    {/* === LEFT HALF (away offense) === */}
                    {/* Paint */}
                    <rect x={0} y={CY - 80} width={188} height={160} fill="rgba(0,60,120,0.25)" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                    {/* Restricted area */}
                    <path d={`M 0 ${CY - 40} A 40 40 0 0 1 0 ${CY + 40}`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
                    {/* Free throw lane */}
                    <rect x={0} y={CY - 60} width={188} height={120} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                    {/* FT Circle */}
                    <circle cx={188} cy={CY} r={60} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                    {/* FT Circle (back half dashed) */}
                    <circle cx={188} cy={CY} r={60} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} strokeDasharray="6 6" />
                    {/* 3PT arc */}
                    <path d={`M 30 ${CY - 220} A 238 238 0 0 1 30 ${CY + 220}`} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={2} clipPath="url(#leftClip)" />
                    {/* 3PT corner lines */}
                    <line x1={0} y1={CY - 220} x2={30} y2={CY - 220} stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
                    <line x1={0} y1={CY + 220} x2={30} y2={CY + 220} stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
                    {/* Backboard */}
                    <line x1={0} y1={CY - 30} x2={0} y2={CY + 30} stroke="white" strokeWidth={4} />
                    {/* Hoop */}
                    <circle cx={22} cy={CY} r={10} fill="none" stroke="#ff4500" strokeWidth={3} style={{ filter: 'drop-shadow(0 0 5px rgba(255,69,0,0.7))' }} />

                    {/* === RIGHT HALF (home offense) === */}
                    {/* Paint */}
                    <rect x={W - 188} y={CY - 80} width={188} height={160} fill="rgba(0,120,30,0.25)" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                    <rect x={W - 188} y={CY - 60} width={188} height={120} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                    <circle cx={W - 188} cy={CY} r={60} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                    <path d={`M ${W - 30} ${CY - 220} A 238 238 0 0 0 ${W - 30} ${CY + 220}`} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={2} clipPath="url(#rightClip)" />
                    <line x1={W} y1={CY - 220} x2={W - 30} y2={CY - 220} stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
                    <line x1={W} y1={CY + 220} x2={W - 30} y2={CY + 220} stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
                    {/* Backboard */}
                    <line x1={W} y1={CY - 30} x2={W} y2={CY + 30} stroke="white" strokeWidth={4} />
                    {/* Hoop */}
                    <circle cx={W - 22} cy={CY} r={10} fill="none" stroke="#ff4500" strokeWidth={3} style={{ filter: 'drop-shadow(0 0 5px rgba(255,69,0,0.7))' }} />

                    {/* === CENTER === */}
                    <line x1={CX} y1={0} x2={CX} y2={H} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                    <circle cx={CX} cy={CY} r={60} fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                    <circle cx={CX} cy={CY} r={6} fill="rgba(255,255,255,0.4)" />

                    {/* Home team logo center */}
                    {game.homeTeam.logo && (
                        <image
                            href={game.homeTeam.logo}
                            x={CX - 30} y={CY - 30}
                            width={60} height={60}
                            opacity={0.18}
                            preserveAspectRatio="xMidYMid meet"
                        />
                    )}

                    {/* Clip paths */}
                    <defs>
                        <clipPath id="leftClip">
                            <rect x={0} y={0} width={CX} height={H} />
                        </clipPath>
                        <clipPath id="rightClip">
                            <rect x={CX} y={0} width={CX} height={H} />
                        </clipPath>
                    </defs>

                    {/* Shot dots */}
                    {visibleShots.map(s => (
                        <ShotDot
                            key={s.id}
                            cx={s.x} cy={s.y}
                            made={s.made}
                            color={s.color}
                            tip={`${s.team === 'home' ? game.homeTeam.name : game.awayTeam.name} — ${s.made ? 'Made ✓' : 'Missed ✗'}`}
                        />
                    ))}

                    {/* Team label badges */}
                    <text x={W * 0.18} y={18} textAnchor="middle" fontSize={11} fontWeight={900} fill={awayColor} opacity={0.8} fontFamily="monospace">{game.awayTeam.name.toUpperCase()}</text>
                    <text x={W * 0.82} y={18} textAnchor="middle" fontSize={11} fontWeight={900} fill={homeColor} opacity={0.8} fontFamily="monospace">{game.homeTeam.name.toUpperCase()}</text>
                </svg>
            </div>

            {/* Legend */}
            <div className="p-3 border-t border-border-muted flex flex-wrap justify-center gap-5 bg-background-dark">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: awayColor, boxShadow: `0 0 6px ${awayColor}` }} />
                    <span className="text-[9px] text-slate-400 font-black uppercase">{game.awayTeam.name} made</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: homeColor, boxShadow: `0 0 6px ${homeColor}` }} />
                    <span className="text-[9px] text-slate-400 font-black uppercase">{game.homeTeam.name} made</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full border border-red-500" />
                    <span className="text-[9px] text-slate-400 font-black uppercase">missed</span>
                </div>
            </div>
        </div>
    );
};
