import React, { useState } from 'react';
import { Game } from '../../data/mockGames';
import { TeamMatchupCard } from './TeamMatchupCard';
import { WeatherImpact } from './WeatherImpact';
import { HeadCoachMatchup } from './HeadCoachMatchup';
import { MatchupScouting } from './MatchupScouting';
import { BasketballCourt } from './BasketballCourt';
import { PlayerPropsForm } from './PlayerPropsForm';
import { SimulationResults } from './SimulationResults';
import { OffenseVsDefense } from './OffenseVsDefense';
import { MarketFlow } from './MarketFlow';
import { TeamRankings } from './TeamRankings';
import { MatchupRecords } from './MatchupRecords';
import { NBAMatchupDashboard } from './nba/NBAMatchupDashboard';
import { AITopBets } from './AITopBets';
import { BetSlip } from '../live-board/BetSlip';
import { BetPick } from '../../App';
import { BaseballMatchupView } from './baseball/BaseballMatchupView';
import { SoccerMatchupView } from './soccer/SoccerMatchupView';

interface MatchupTerminalViewProps {
    game: Game;
    onAddBet: (bet: Omit<BetPick, 'id'>) => void;
    hasSimulated: boolean;
    onRunSimulation: () => void;
    betSlip: BetPick[];
    setBetSlip: React.Dispatch<React.SetStateAction<BetPick[]>>;
}

export const MatchupTerminalView: React.FC<MatchupTerminalViewProps> = ({
    game,
    onAddBet,
    hasSimulated,
    onRunSimulation,
    betSlip,
    setBetSlip
}) => {
    const [showHandleGaps, setShowHandleGaps] = useState(false);
    const [isBetSlipVisible, setIsBetSlipVisible] = useState(false);

    return (
        <main className="max-w-[1536px] mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative">
            <div className={`col-span-1 ${isBetSlipVisible ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6 transition-all duration-300`}>
                <div className="flex flex-col items-center justify-center py-4 gap-4">
                    <div className="flex items-center gap-4">
                        <a
                            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-accent-purple rounded-full text-text-main font-black uppercase tracking-[0.2em] italic hover:scale-105 transition-transform animate-neon-pulse overflow-hidden cursor-pointer"
                            onClick={onRunSimulation}
                        >
                            <span className="material-symbols-outlined text-2xl group-hover:rotate-180 transition-transform duration-500">model_training</span>
                            {hasSimulated ? 'Re-run AI Simulations' : 'Run 10,000 AI Simulations'}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                        </a>
                        <button
                            className={`hidden md:flex px-8 py-5 border-2 rounded-full font-black uppercase tracking-[0.2em] italic transition-all items-center gap-3 ${showHandleGaps ? 'border-primary bg-primary/20 text-white' : 'border-primary/40 bg-primary/5 text-primary hover:bg-primary/10'}`}
                            onClick={() => setShowHandleGaps(!showHandleGaps)}
                        >
                            <span className="material-symbols-outlined">query_stats</span>
                            {showHandleGaps ? 'Hide Handle Gaps' : 'Show Handle Gaps'}
                        </button>
                        <button
                            className={`flex px-6 py-5 border-2 rounded-full font-black uppercase tracking-[0.2em] italic transition-all items-center gap-3 ${isBetSlipVisible ? 'border-accent-purple bg-accent-purple/20 text-accent-purple' : 'border-border-muted bg-transparent text-text-muted hover:text-white hover:bg-white/5'}`}
                            onClick={() => setIsBetSlipVisible(!isBetSlipVisible)}
                        >
                            <span className="material-symbols-outlined">receipt_long</span>
                            <span className="hidden sm:inline">Bet Slip</span>
                            {betSlip.length > 0 && (
                                <span className="bg-primary text-black text-xs font-black w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                    {betSlip.length}
                                </span>
                            )}
                        </button>
                    </div>
                    <p className="mt-2 text-[10px] text-accent-purple/60 font-bold uppercase tracking-widest">Quantum Predictive Engine v4.2.1-10k</p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${showHandleGaps ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">verified</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary hidden sm:inline">Filtering for Significant Handle Gaps (&gt;10% Diff)</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary sm:hidden">Handle Gaps (&gt;10%)</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Total Volume: <span className="text-white">$4.2M</span></div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold hidden sm:block">Public Edge <span className="text-[#ef4444]">-14%</span></div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold hidden sm:block">Sharp Edge <span className="text-[#10b981]">+22%</span></div>
                        </div>
                    </div>
                </div>

                <TeamMatchupCard game={game} />

                <WeatherImpact game={game} />

                <HeadCoachMatchup game={game} />

                <MatchupScouting game={game} />

                <BasketballCourt game={game} />

                <BaseballMatchupView game={game} />

                <SoccerMatchupView game={game} />

                {game.sport === 'NBA' && (
                    <div className="mt-8 border-t-2 border-primary/30 pt-8" id="nba-context-dashboard">
                        <NBAMatchupDashboard game={game} onAddBet={onAddBet} />
                    </div>
                )}

                <div className="grid grid-cols-12 gap-6" id="ai-top-bets-section">
                    <div className="col-span-12">
                        <SimulationResults game={game} />
                        {hasSimulated && <AITopBets game={game} onAddBet={onAddBet} />}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6 items-stretch">
                    <div className="col-span-12 lg:col-span-7">
                        <TeamRankings game={game} />
                    </div>
                    <div className="col-span-12 lg:col-span-5">
                        <MatchupRecords game={game} />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6 items-stretch pt-6 border-t border-neutral-800/50 mt-6">
                    <div className="col-span-12 lg:col-span-8">
                        <OffenseVsDefense game={game} />
                    </div>
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        <MarketFlow />
                    </div>
                </div>

                {game.sport !== 'NBA' && (
                    <div className="pb-12">
                        <PlayerPropsForm game={game} onAddBet={onAddBet} />
                    </div>
                )}

            </div>
            {isBetSlipVisible && (
                <div className="col-span-1 lg:col-span-3 transition-opacity duration-300">
                    <BetSlip betSlip={betSlip} setBetSlip={setBetSlip} />
                </div>
            )}
        </main>
    );
};
