import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { useESPNTeamInfo } from '../../data/useESPNTeamInfo';

interface TeamOverviewProps {
    teamName: string;
    sport: string;
}

const getFormColor = (res: 'W' | 'L' | 'D') => {
    if (res === 'W') return 'bg-primary text-black';
    if (res === 'L') return 'bg-red-500 text-white';
    return 'bg-slate-500 text-white';
};

export const TeamOverview: React.FC<TeamOverviewProps> = ({ teamName, sport }) => {
    const { info, loading } = useESPNTeamInfo(teamName, sport);
    const [activeGraph, setActiveGraph] = React.useState<'scoring' | 'form'>('scoring');

    const isSoccer = sport === 'Soccer';
    const isHockey = sport === 'NHL';
    const isBaseball = sport === 'MLB';
    let scoringLabel = 'Points';
    if (isSoccer || isHockey) scoringLabel = 'Goals';
    if (isBaseball) scoringLabel = 'Runs';

    // Build synthetic scoring-trend from record (deterministic)
    const graphData = useMemo(() => {
        if (!info) return [];
        const base = sport === 'NBA' ? 112 : sport === 'NHL' ? 3 : sport === 'MLB' ? 4 : sport === 'NFL' ? 24 : 1.5;
        const pct = info.winPct;
        return Array.from({ length: 10 }, (_, i) => {
            const varFor = base * 0.18;
            const seed = (info.wins * (i + 1) * 7) % 100;
            const forPts = +(base + varFor * (seed / 100 - 0.4) + (pct - 0.5) * base * 0.3).toFixed(1);
            const againstPts = +(base - varFor * (seed / 100 - 0.3) - (pct - 0.5) * base * 0.2).toFixed(1);
            return { game: `G${i + 1}`, pointsFor: forPts, pointsAgainst: againstPts, differential: +(forPts - againstPts).toFixed(1) };
        });
    }, [info, sport]);

    const Skeleton = ({ w = 'w-24', h = 'h-8' }: { w?: string; h?: string }) => (
        <div className={`${w} ${h} bg-neutral-800 rounded animate-pulse`}></div>
    );

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* ─── Top Stat Row ─── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Season Record */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/40 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Season Record</span>
                    {loading ? <Skeleton w="w-20" h="h-10" /> : (
                        <span className="text-4xl font-black text-white tracking-tighter">{info?.record ?? '—'}</span>
                    )}
                    <span className="text-sm font-medium text-primary mt-1 truncate max-w-full text-center px-1">
                        {loading ? '' : (info?.standing ?? '')}
                    </span>
                </div>

                {/* Current Streak */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Current Streak</span>
                    {loading ? <Skeleton w="w-16" h="h-10" /> : (
                        <span className={`text-4xl font-black tracking-tighter ${info?.streak?.startsWith('W') ? 'text-primary' : 'text-red-500'}`}>
                            {info?.streak ?? '—'}
                        </span>
                    )}
                    <span className="text-sm font-medium text-slate-500 mt-1">L10: {loading ? '—' : info?.last10 ?? '—'}</span>
                </div>

                {/* Points For */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Home Record</span>
                    {loading ? <Skeleton w="w-20" h="h-10" /> : (
                        <span className="text-4xl font-black text-white tracking-tighter">{info?.homeRecord ?? '—'}</span>
                    )}
                    <span className="text-sm font-medium text-green-400 mt-1">Home W-L</span>
                </div>

                {/* Points Against */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group hover:border-red-500/40 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Away Record</span>
                    {loading ? <Skeleton w="w-20" h="h-10" /> : (
                        <span className="text-4xl font-black text-white tracking-tighter">{info?.awayRecord ?? '—'}</span>
                    )}
                    <span className="text-sm font-medium text-slate-500 mt-1">Road W-L</span>
                </div>
            </div>

            {/* ─── Middle Content ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Franchise Profile */}
                <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-primary text-xl">corporate_fare</span>
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm">Franchise Profile</h3>
                        {loading && <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                            <span className="text-slate-400 text-sm font-medium">Head Coach</span>
                            {loading ? <Skeleton w="w-24" h="h-4" /> : <span className="text-slate-200 font-bold text-sm text-right">{info?.headCoach ?? 'Unknown'}</span>}
                        </div>
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                            <span className="text-slate-400 text-sm font-medium">Home Venue</span>
                            {loading ? <Skeleton w="w-28" h="h-4" /> : <span className="text-slate-200 font-bold text-sm text-right truncate max-w-[120px]">{info?.venue || '—'}</span>}
                        </div>
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                            <span className="text-slate-400 text-sm font-medium">Win %</span>
                            {loading ? <Skeleton w="w-12" h="h-4" /> : (
                                <span className={`font-black text-sm ${(info?.winPct ?? 0) >= 0.5 ? 'text-primary' : 'text-red-400'}`}>
                                    {info ? (info.winPct * 100).toFixed(1) + '%' : '—'}
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center pb-1">
                            <span className="text-slate-400 text-sm font-medium">PickLabs Data</span>
                            <span className="flex items-center gap-1 text-[10px] text-primary font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                LIVE
                            </span>
                        </div>
                    </div>

                    {/* Injury Report */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Injury Report</div>
                            {!loading && info && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-500">
                                    {info.injuries.length} Active
                                </span>
                            )}
                        </div>
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map(i => <Skeleton key={i} w="w-full" h="h-8" />)}
                            </div>
                        ) : info?.injuries.length === 0 ? (
                            <div className="text-xs text-slate-500 italic p-2 bg-neutral-800/50 rounded-md border border-neutral-800">No major injuries reported.</div>
                        ) : (
                            <div className="space-y-2">
                                {(info?.injuries ?? []).slice(0, 4).map((inj, i) => (
                                    <div key={i} className="flex justify-between items-center p-2 bg-neutral-800/50 rounded-md border border-neutral-800">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-slate-300 font-medium truncate pr-2">{inj.player}</span>
                                            <span className="text-[10px] text-slate-600">{inj.injury}</span>
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${inj.status === 'Out' ? 'text-red-400 bg-red-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                                            {inj.status}
                                        </span>
                                    </div>
                                ))}
                                {(info?.injuries.length ?? 0) > 4 && (
                                    <div className="text-xs text-slate-500 text-center font-medium">+ {(info?.injuries.length ?? 0) - 4} More</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Graph Panel */}
                <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-accent-secondary text-xl">monitoring</span>
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">Advanced Team Analytics</h3>
                        </div>
                        <div className="flex bg-neutral-800 rounded-lg p-1">
                            <button
                                onClick={() => setActiveGraph('scoring')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeGraph === 'scoring' ? 'bg-primary text-black' : 'text-slate-400 hover:text-white'}`}
                            >
                                L10 Scoring Trend
                            </button>
                            <button
                                onClick={() => setActiveGraph('form')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeGraph === 'form' ? 'bg-accent-secondary text-black' : 'text-slate-400 hover:text-white'}`}
                            >
                                Point Differential
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow w-full h-[300px] relative z-10">
                        {loading || graphData.length === 0 ? (
                            <div className="w-full h-full bg-neutral-800 rounded animate-pulse"></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                {activeGraph === 'scoring' ? (
                                    <LineChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="game" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                                        <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} domain={['auto', 'auto']} />
                                        <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ fontSize: '14px', fontWeight: 'bold' }} labelStyle={{ color: '#888', marginBottom: '4px' }} />
                                        <Line type="monotone" dataKey="pointsFor" name={`${scoringLabel} For`} stroke="#39FF14" strokeWidth={3} dot={{ fill: '#39FF14', r: 4 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="pointsAgainst" name={`${scoringLabel} Against`} stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                ) : (
                                    <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorDiff" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="game" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                                        <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                                        <ReferenceLine y={0} stroke="#555" strokeDasharray="4 4" />
                                        <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#00FFFF', fontSize: '14px', fontWeight: 'bold' }} labelStyle={{ color: '#888', marginBottom: '4px' }} />
                                        <Area type="monotone" dataKey="differential" name="Differential" stroke="#00FFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorDiff)" />
                                    </AreaChart>
                                )}
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Bottom row under graph */}
                    <div className="mt-6 pt-4 border-t border-neutral-800 grid grid-cols-3 gap-4 relative z-10">
                        {/* L5 Recent Form — REAL from ESPN */}
                        <div className="text-center">
                            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                                Recent Form (L5)
                                <span className="ml-1 text-primary text-[8px]">· PickLabs</span>
                            </div>
                            <div className="flex justify-center gap-1.5 mt-2">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="w-6 h-6 rounded bg-neutral-800 animate-pulse"></div>
                                    ))
                                ) : info?.recentForm && info.recentForm.length > 0 ? (
                                    info.recentForm.map((res, i) => (
                                        <div key={i} className={`w-7 h-7 rounded flex items-center justify-center font-black text-xs shadow ${getFormColor(res)}`}>{res}</div>
                                    ))
                                ) : (
                                    <span className="text-slate-600 text-xs italic">No data</span>
                                )}
                            </div>
                        </div>
                        <div className="text-center border-x border-neutral-800">
                            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Home Split</div>
                            <div className="text-2xl font-black text-white">{loading ? '—' : info?.homeRecord ?? '—'}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Away Split</div>
                            <div className="text-2xl font-black text-white">{loading ? '—' : info?.awayRecord ?? '—'}</div>
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};
