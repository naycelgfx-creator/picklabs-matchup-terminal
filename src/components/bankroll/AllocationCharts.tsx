import React from 'react';

export const AllocationCharts: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="terminal-panel p-6 border-accent-purple/20 hover:border-accent-purple/50 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-accent-purple">pie_chart</span>
                    <h3 className="text-xs font-black text-text-main uppercase tracking-[0.2em]">Allocation by Sport</h3>
                </div>
                <div className="flex items-center justify-around">
                    <div className="relative w-40 h-40 group">
                        <svg className="w-full h-full transform -rotate-90 group-hover:scale-105 transition-transform" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" fill="none" r="16" stroke="#1e2e1e" strokeWidth="3"></circle>
                            <circle cx="18" cy="18" fill="none" r="16" stroke="#0df20d" strokeDasharray="45, 100" strokeDashoffset="25" strokeWidth="3" className="hover:opacity-80 transition-opacity cursor-pointer"></circle>
                            <circle cx="18" cy="18" fill="none" r="16" stroke="#a855f7" strokeDasharray="30, 100" strokeDashoffset="80" strokeWidth="3" className="hover:opacity-80 transition-opacity cursor-pointer"></circle>
                            <circle cx="18" cy="18" fill="none" r="16" stroke="#3b82f6" strokeDasharray="15, 100" strokeDashoffset="110" strokeWidth="3" className="hover:opacity-80 transition-opacity cursor-pointer"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs text-slate-500 font-bold uppercase transition-colors group-hover:text-accent-purple">Total</span>
                            <span className="text-xl font-black text-text-main group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">100%</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 group cursor-pointer hover:bg-neutral-800/50 p-2 rounded -ml-2 transition-colors">
                            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_5px_#0df20d] group-hover:scale-125 transition-transform"></div>
                            <div>
                                <p className="text-[10px] font-black text-text-main uppercase tracking-wider">NBA Basketball</p>
                                <p className="text-[9px] text-slate-500 font-bold">45.2% Allocation</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer hover:bg-neutral-800/50 p-2 rounded -ml-2 transition-colors">
                            <div className="w-3 h-3 rounded-full bg-accent-purple shadow-[0_0_5px_#a855f7] group-hover:scale-125 transition-transform"></div>
                            <div>
                                <p className="text-[10px] font-black text-text-main uppercase tracking-wider">NFL Football</p>
                                <p className="text-[9px] text-slate-500 font-bold">30.1% Allocation</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer hover:bg-neutral-800/50 p-2 rounded -ml-2 transition-colors">
                            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6] group-hover:scale-125 transition-transform"></div>
                            <div>
                                <p className="text-[10px] font-black text-text-main uppercase tracking-wider">NHL Hockey</p>
                                <p className="text-[9px] text-slate-500 font-bold">15.4% Allocation</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="terminal-panel p-6 border-primary/20 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary">donut_large</span>
                    <h3 className="text-xs font-black text-text-main uppercase tracking-[0.2em]">Allocation by Bet Type</h3>
                </div>
                <div className="flex items-center justify-around">
                    <div className="relative w-40 h-40 group">
                        <svg className="w-full h-full transform -rotate-90 group-hover:scale-105 transition-transform" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" fill="none" r="16" stroke="#1e2e1e" strokeWidth="3"></circle>
                            <circle cx="18" cy="18" fill="none" r="16" stroke="#0df20d" strokeDasharray="60, 100" strokeDashoffset="25" strokeWidth="3" className="hover:opacity-80 transition-opacity cursor-pointer"></circle>
                            <circle cx="18" cy="18" fill="none" r="16" stroke="#fbbf24" strokeDasharray="20, 100" strokeDashoffset="85" strokeWidth="3" className="hover:opacity-80 transition-opacity cursor-pointer"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs text-slate-500 font-bold uppercase transition-colors group-hover:text-primary">Volume</span>
                            <span className="text-xl font-black text-text-main group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">412</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 group cursor-pointer hover:bg-neutral-800/50 p-2 rounded -ml-2 transition-colors">
                            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_5px_#0df20d] group-hover:scale-125 transition-transform"></div>
                            <div>
                                <p className="text-[10px] font-black text-text-main uppercase tracking-wider">Player Props</p>
                                <p className="text-[9px] text-slate-500 font-bold">62.8% of bets</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer hover:bg-neutral-800/50 p-2 rounded -ml-2 transition-colors">
                            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_5px_#fbbf24] group-hover:scale-125 transition-transform"></div>
                            <div>
                                <p className="text-[10px] font-black text-text-main uppercase tracking-wider">Spreads/ML</p>
                                <p className="text-[9px] text-slate-500 font-bold">24.2% of bets</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer hover:bg-neutral-800/50 p-2 rounded -ml-2 transition-colors">
                            <div className="w-3 h-3 rounded-full bg-slate-600 shadow-[0_0_5px_#475569] group-hover:scale-125 transition-transform"></div>
                            <div>
                                <p className="text-[10px] font-black text-text-main uppercase tracking-wider">Others/Alt</p>
                                <p className="text-[9px] text-slate-500 font-bold">13.0% of bets</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
