import React from 'react';

export const BankrollChart: React.FC = () => {
    return (
        <div className="terminal-panel p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">show_chart</span>
                    <h3 className="text-xs font-black text-text-main uppercase tracking-[0.2em]">Bankroll Growth Curve</h3>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-0.5 bg-primary"></span>
                        <span className="text-[10px] text-text-muted font-bold uppercase">Actual Growth</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-0.5 bg-slate-600 border-dashed border-t"></span>
                        <span className="text-[10px] text-text-muted font-bold uppercase">Baseline (S&P 500)</span>
                    </div>
                </div>
            </div>

            <div className="h-64 flex items-end justify-between relative gap-1 px-4">
                <div className="flex-1 bg-primary/10 rounded-t h-[20%] border-t border-primary/30 relative group">
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-white dark:bg-neutral-900 text-[10px] p-1 border border-primary rounded">$31k</div>
                </div>
                <div className="flex-1 bg-primary/15 rounded-t h-[25%] border-t border-primary/30"></div>
                <div className="flex-1 bg-primary/20 rounded-t h-[22%] border-t border-primary/30"></div>
                <div className="flex-1 bg-primary/25 rounded-t h-[35%] border-t border-primary/40"></div>
                <div className="flex-1 bg-primary/30 rounded-t h-[45%] border-t border-primary/40"></div>
                <div className="flex-1 bg-primary/35 rounded-t h-[40%] border-t border-primary/50"></div>
                <div className="flex-1 bg-primary/40 rounded-t h-[55%] border-t border-primary/50"></div>
                <div className="flex-1 bg-primary/45 rounded-t h-[70%] border-t border-primary/60"></div>
                <div className="flex-1 bg-primary/50 rounded-t h-[65%] border-t border-primary/60"></div>
                <div className="flex-1 bg-primary/60 rounded-t h-[85%] border-t border-primary/70"></div>
                <div className="flex-1 bg-primary/70 rounded-t h-[80%] border-t border-primary/80"></div>
                <div className="flex-1 bg-primary/80 rounded-t h-[95%] border-t border-primary shadow-[0_0_15px_rgba(13,242,13,0.3)]"></div>

                <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0 80 Q 25 75, 50 70 T 100 65" fill="none" stroke="#475569" strokeDasharray="4" strokeWidth="0.5"></path>
                        <path className="drop-shadow-[0_0_5px_rgba(13,242,13,0.5)]" d="M0 90 L 10 85 L 20 88 L 30 75 L 40 65 L 50 72 L 60 55 L 70 45 L 80 52 L 90 25 L 100 5" fill="none" stroke="#0df20d" strokeWidth="1.5"></path>
                    </svg>
                </div>
            </div>

            <div className="flex justify-between mt-4 px-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                <span>Oct 2023</span>
                <span>Nov 2023</span>
                <span>Dec 2023</span>
                <span>Jan 2024</span>
                <span>Feb 2024</span>
                <span>Current</span>
            </div>
        </div>
    );
};
