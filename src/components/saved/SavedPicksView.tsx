import React, { useState } from 'react';

// Mock Saved Pick data
interface SavedPick {
    id: string;
    sport: 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'NCAAB';
    dateSaved: string;
    matchup: string;
    type: string;
    description: string;
    odds: string;
    status: 'Pending' | 'Won' | 'Lost';
}

const mockSavedPicks: SavedPick[] = [
    {
        id: 'sp-1',
        sport: 'NBA',
        dateSaved: '10 mins ago',
        matchup: 'LAL @ GSW',
        type: 'Player Prop',
        description: 'LeBron James Over 25.5 Points',
        odds: '-110',
        status: 'Pending'
    },
    {
        id: 'sp-2',
        sport: 'NFL',
        dateSaved: '1 hr ago',
        matchup: 'KC @ SF',
        type: 'Same Game Parlay',
        description: 'Mahomes 2+ Pass TDs, Kelce Anytime TD',
        odds: '+350',
        status: 'Pending'
    },
    {
        id: 'sp-3',
        sport: 'NCAAB',
        dateSaved: '2 days ago',
        matchup: 'DUKE @ UNC',
        type: 'Moneyline',
        description: 'Duke Moneyline',
        odds: '+145',
        status: 'Won'
    }
];

export const SavedPicksView: React.FC = () => {
    const [savedPicks] = useState<SavedPick[]>(mockSavedPicks);

    return (
        <div className="w-full flex justify-center bg-background-dark py-8 px-6 min-h-[calc(100vh-200px)]">
            <div className="max-w-[1536px] w-full flex flex-col gap-6 animate-fade-in">

                {/* Header Section */}
                <div className="flex items-center gap-4 border-b border-border-muted pb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-3xl">bookmark</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">Saved Picks</h2>
                        <p className="text-text-muted text-sm font-medium mt-1">Your bookmarked betting opportunities.</p>
                    </div>
                </div>

                {/* Saved Picks List */}
                <div className="flex flex-col gap-4">
                    {savedPicks.length === 0 ? (
                        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center gap-4 border border-border-muted rounded-xl">
                            <span className="material-symbols-outlined text-6xl text-slate-600 block mb-2">bookmark_border</span>
                            <h3 className="text-xl font-bold text-white">No Saved Picks</h3>
                            <p className="text-text-muted font-medium">When you find a High Value pick or piece together an SGP, save it to track here later.</p>
                        </div>
                    ) : (
                        savedPicks.map(pick => (
                            <div key={pick.id} className="glass-panel p-6 border border-border-muted hover:border-primary/50 transition-colors flex items-center justify-between rounded-xl bg-[#111] group">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-center justify-center gap-1 min-w-[60px]">
                                        <span className="text-[10px] font-black text-text-main bg-white/10 px-2 py-0.5 rounded uppercase tracking-widest">{pick.sport}</span>
                                        <span className="text-[9px] text-slate-500 font-bold uppercase">{pick.dateSaved}</span>
                                    </div>
                                    <div className="h-10 w-px bg-border-muted"></div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-white tracking-wide">{pick.matchup}</span>
                                            <span className="text-[10px] font-bold text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-2 py-0.5 rounded uppercase tracking-widest">{pick.type}</span>
                                        </div>
                                        <span className="text-sm font-medium text-text-muted">{pick.description}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Odds</span>
                                        <span className="text-lg font-black text-accent-secondary">{pick.odds}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 min-w-[80px]">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${pick.status === 'Won' ? 'bg-primary/20 text-primary border-primary/50' :
                                                pick.status === 'Lost' ? 'bg-red-500/20 text-red-500 border-red-500/50' :
                                                    'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
                                            }`}>{pick.status}</span>
                                    </div>
                                    <button className="h-10 w-10 rounded-full border border-border-muted flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-colors text-slate-500" title="Remove Pick">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};
