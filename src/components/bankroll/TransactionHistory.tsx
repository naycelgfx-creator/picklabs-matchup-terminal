import React from 'react';

export const TransactionHistory: React.FC = () => {
    return (
        <div className="terminal-panel overflow-hidden">
            <div className="p-4 border-b border-border-muted bg-white dark:bg-neutral-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-text-muted">history</span>
                    <h3 className="text-xs font-black text-text-main uppercase tracking-[0.2em]">Transaction & Bet History</h3>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-[9px] text-slate-500 hover:text-white uppercase font-black tracking-widest transition-colors">Download CSV</button>
                    <div className="h-4 w-[1px] bg-border-muted"></div>
                    <button className="text-[9px] text-primary hover:text-primary/80 uppercase font-black tracking-widest transition-colors flex items-center gap-1">
                        Filter: All Settled <span className="material-symbols-outlined text-[10px]">expand_more</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-white dark:bg-neutral-900/40 border-b border-border-muted">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Matchup</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Bet Type</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Odds</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Stake</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Result</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center whitespace-nowrap">AI Confidence</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-muted">

                        {/* Transaction Row 1 */}
                        <tr className="hover:bg-neutral-800/50 transition-colors group cursor-pointer">
                            <td className="px-6 py-4 text-xs text-text-muted font-medium">Feb 12, 19:42</td>
                            <td className="px-6 py-4">
                                <p className="text-xs font-bold text-text-main group-hover:text-primary transition-colors">LAL Lakers @ BOS Celtics</p>
                                <p className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">Anthony Davis O 12.5 Reb</p>
                            </td>
                            <td className="px-6 py-4 text-xs text-text-muted font-medium whitespace-nowrap">Player Prop</td>
                            <td className="px-6 py-4 text-xs text-text-main font-bold whitespace-nowrap">-110</td>
                            <td className="px-6 py-4 text-xs text-text-main font-bold whitespace-nowrap">$250.00</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-black uppercase border border-primary/20 shadow-[0_0_5px_rgba(13,242,13,0.1)]">Win (+$227)</span>
                            </td>
                            <td className="px-6 py-4 min-w-[150px]">
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-[10px] font-black text-primary italic">94.2%</span>
                                    <div className="w-20 h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-border-muted">
                                        <div className="h-full bg-primary w-[94%] shadow-[0_0_8px_#0df20d]"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* Transaction Row 2 */}
                        <tr className="hover:bg-neutral-800/50 transition-colors group cursor-pointer">
                            <td className="px-6 py-4 text-xs text-text-muted font-medium">Feb 12, 18:15</td>
                            <td className="px-6 py-4">
                                <p className="text-xs font-bold text-text-main group-hover:text-primary transition-colors">PHX Suns @ GSW Warriors</p>
                                <p className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">GSW -3.5 Spread</p>
                            </td>
                            <td className="px-6 py-4 text-xs text-text-muted font-medium whitespace-nowrap">Main Spread</td>
                            <td className="px-6 py-4 text-xs text-text-main font-bold whitespace-nowrap">-105</td>
                            <td className="px-6 py-4 text-xs text-text-main font-bold whitespace-nowrap">$100.00</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-black uppercase border border-red-500/20">Loss (-$100)</span>
                            </td>
                            <td className="px-6 py-4 min-w-[150px]">
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-[10px] font-black text-text-muted italic">68.1%</span>
                                    <div className="w-20 h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-border-muted">
                                        <div className="h-full bg-slate-600 w-[68%]"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* Transaction Row 3 */}
                        <tr className="hover:bg-neutral-800/50 transition-colors group cursor-pointer">
                            <td className="px-6 py-4 text-xs text-text-muted font-medium">Feb 11, 22:30</td>
                            <td className="px-6 py-4">
                                <p className="text-xs font-bold text-text-main group-hover:text-primary transition-colors">NYK Knicks @ PHI 76ers</p>
                                <p className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">Jalen Brunson O 6.5 Ast</p>
                            </td>
                            <td className="px-6 py-4 text-xs text-text-muted font-medium whitespace-nowrap">Player Prop</td>
                            <td className="px-6 py-4 text-xs text-text-main font-bold whitespace-nowrap">+115</td>
                            <td className="px-6 py-4 text-xs text-text-main font-bold whitespace-nowrap">$150.00</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-black uppercase border border-primary/20 shadow-[0_0_5px_rgba(13,242,13,0.1)]">Win (+$172)</span>
                            </td>
                            <td className="px-6 py-4 min-w-[150px]">
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-[10px] font-black text-accent-purple italic">88.5%</span>
                                    <div className="w-20 h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-border-muted">
                                        <div className="h-full bg-accent-purple w-[88%] shadow-[0_0_8px_#a855f7]"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <button className="w-full py-4 bg-white dark:bg-neutral-900/40 text-[10px] font-black text-slate-500 hover:text-white hover:bg-neutral-800/80 uppercase tracking-[0.3em] transition-all border-t border-border-muted">
                Load Full 365-Day Transaction Ledger
            </button>
        </div>
    );
};
