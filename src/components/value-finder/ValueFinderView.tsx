import React, { useState } from 'react';

// Mock Value Bet data
interface ValueBet {
    id: string;
    sport: 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'NCAAB';
    matchup: string;
    play: string;
    bookOdds: string;
    modelOdds: string;
    edge: string;
    confidence: 'High' | 'Medium' | 'Low';
    analysis: string;
}

const mockValueBets: ValueBet[] = [
    {
        id: 'vb-1',
        sport: 'NBA',
        matchup: 'LAL @ GSW',
        play: 'LeBron James Under 25.5 Points',
        bookOdds: '-110 (52.4%)',
        modelOdds: '+140 (41.6%)',
        edge: '+10.8%',
        confidence: 'High',
        analysis: 'Books are overvaluing recent performance against weak defenses. Model projects 32 mins max in a blowout scenario against GSW.'
    },
    {
        id: 'vb-2',
        sport: 'NFL',
        matchup: 'KC @ SF',
        play: 'SF 49ers Moneyline',
        bookOdds: '+115 (46.5%)',
        modelOdds: '-130 (56.5%)',
        edge: '+10.0%',
        confidence: 'High',
        analysis: 'Public money is flowing heavily on KC, shifting the line incorrectly. AI models SF defensive pressure creating 2+ turnovers.'
    },
    {
        id: 'vb-3',
        sport: 'NCAAB',
        matchup: 'UCONN @ MARQ',
        play: 'Marquette +4.5',
        bookOdds: '-110 (52.4%)',
        modelOdds: '+115 (46.5%)',
        edge: '+5.9%',
        confidence: 'Medium',
        analysis: 'Home court advantage metric is being undervalued by 1.5 points. Marquette shoots 8% better at home.'
    },
    {
        id: 'vb-4',
        sport: 'MLB',
        matchup: 'NYY @ BOS',
        play: 'First 5 Innings Under 4.5',
        bookOdds: '-125 (55.6%)',
        modelOdds: '-165 (62.3%)',
        edge: '+6.7%',
        confidence: 'Medium',
        analysis: 'Umpire tendency combined with specific wind patterns in Fenway pushing in from left field strongly suppresses early power.'
    },
    {
        id: 'vb-5',
        sport: 'NBA',
        matchup: 'BOS @ MIA',
        play: 'Jayson Tatum Over 4.5 Assists',
        bookOdds: '+135 (42.5%)',
        modelOdds: '+105 (48.8%)',
        edge: '+6.3%',
        confidence: 'Medium',
        analysis: 'Miami blitzes pick-and-roll at the highest rate in the league. Tatum\'s potential assist rate spikes to 12.4 in these exact scenarios.'
    },
    {
        id: 'vb-6',
        sport: 'NHL',
        matchup: 'EDM @ FLA',
        play: 'Edmonton 60 Min ML',
        bookOdds: '+145 (40.8%)',
        modelOdds: '+110 (47.6%)',
        edge: '+6.8%',
        confidence: 'Medium',
        analysis: 'Florida starting backup goaltender on a back-to-back. Market hasn\'t fully adjusted for the drop-off in GSAx (Goals Saved Above Expected).'
    }
];

export const ValueFinderView: React.FC = () => {
    const [valueBets] = useState<ValueBet[]>(mockValueBets);

    return (
        <div className="w-full flex justify-center bg-background-dark py-8 px-6 min-h-[calc(100vh-200px)]">
            <div className="max-w-[1536px] w-full flex flex-col gap-6 animate-fade-in">

                {/* Header Section */}
                <div className="flex items-center gap-4 border-b border-border-muted pb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-accent-blue text-3xl">troubleshoot</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-text-main uppercase italic tracking-tight">AI Value Finder</h2>
                        <p className="text-text-muted text-sm font-medium mt-1">High-edge opportunities where our predictive model disagrees with public sportsbooks.</p>
                    </div>
                </div>

                {/* Info Bar */}
                <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-lg p-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-blue">info</span>
                    <p className="text-sm text-text-muted">
                        <span className="font-bold text-text-main">How it works:</span> We simulate every matchup 10,000 times to generate true probabilities. If our implied probability is significantly higher than the books, it appears here.
                    </p>
                </div>

                {/* Value Bets Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {valueBets.map(bet => (
                        <div key={bet.id} className="glass-panel p-6 border border-border-muted hover:border-accent-blue/50 transition-colors flex flex-col h-full bg-[#111] group relative overflow-hidden">
                            {/* Subtle Glow */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-blue/5 rounded-full blur-3xl group-hover:bg-accent-blue/10 transition-colors pointer-events-none"></div>

                            {/* Top Info */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between w-full min-w-[200px] mb-1">
                                        <span className="text-[10px] font-black text-text-main bg-white/10 px-2 py-0.5 rounded uppercase tracking-widest">{bet.sport}</span>
                                        <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20">{bet.matchup}</span>
                                    </div>
                                    <h3 className="text-lg font-black text-text-main mt-2 leading-tight">{bet.play}</h3>
                                </div>

                                {/* Edge Badge */}
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Model Edge</span>
                                    <span className="text-xl font-black text-primary bg-primary/10 px-3 py-1 rounded shadow-inner border border-primary/20">{bet.edge}</span>
                                </div>
                            </div>

                            {/* Odds Comparison */}
                            <div className="grid grid-cols-2 gap-4 mb-5 relative z-10">
                                <div className="bg-white dark:bg-neutral-900/40 border border-red-500/20 rounded-lg p-3 flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Sportsbook Line</span>
                                    <span className="text-sm font-black text-text-main">{bet.bookOdds}</span>
                                </div>
                                <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-3 flex flex-col">
                                    <span className="text-[10px] text-accent-blue font-bold uppercase tracking-widest mb-1">AI True Line</span>
                                    <span className="text-sm font-black text-text-main">{bet.modelOdds}</span>
                                </div>
                            </div>

                            {/* AI Analysis */}
                            <div className="flex-1 mb-6 relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-[14px] text-text-muted">psychology</span>
                                    <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">Model Analysis</span>
                                </div>
                                <p className="text-sm text-text-muted italic leading-relaxed border-l-2 border-border-muted pl-3 group-hover:border-accent-blue/50 transition-colors">"{bet.analysis}"</p>
                            </div>

                            {/* Action Row */}
                            <div className="mt-auto border-t border-border-muted pt-4 flex justify-between items-center relative z-10">
                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">verified_user</span> Sharp Play Recommended
                                </span>
                                <button className="bg-accent-blue/20 text-accent-blue border border-accent-blue/50 hover:bg-accent-blue hover:text-black transition-colors px-6 py-2 rounded font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                    Add to Slip <span className="material-symbols-outlined text-sm">add_circle</span>
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
