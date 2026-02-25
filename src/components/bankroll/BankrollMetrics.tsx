import React from 'react';

export const BankrollMetrics: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="terminal-panel p-4 border-l-4 border-l-slate-500">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Total Balance</p>
                <h2 className="text-2xl font-black text-text-main">$42,650.00</h2>
                <p className="text-[10px] text-text-muted mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">account_balance</span> 4 Books Integrated
                </p>
            </div>

            <div className="terminal-panel p-4 border-l-4 border-l-primary shadow-[0_0_15px_rgba(13,242,13,0.1)]">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Net Profit/Loss</p>
                <h2 className="text-2xl font-black text-primary">+$12,410.82</h2>
                <p className="text-[10px] text-primary mt-2 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">trending_up</span> +14.2% This Month
                </p>
            </div>

            <div className="terminal-panel p-4 border-l-4 border-l-accent-purple">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">ROI %</p>
                <h2 className="text-2xl font-black text-accent-purple">21.4%</h2>
                <p className="text-[10px] text-text-muted mt-2 font-bold">vs 4.2% Market Avg</p>
            </div>

            <div className="terminal-panel p-4 border-l-4 border-l-slate-700">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Yield</p>
                <h2 className="text-2xl font-black text-text-main">8.7%</h2>
                <p className="text-[10px] text-text-muted mt-2 font-bold">Across 412 Bets</p>
            </div>

            <div className="terminal-panel p-4 border-l-4 border-l-slate-700">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Profit Factor</p>
                <h2 className="text-2xl font-black text-text-main">1.84</h2>
                <p className="text-[10px] text-text-muted mt-2 font-bold">Risk Management: Optimal</p>
            </div>
        </div>
    );
};
