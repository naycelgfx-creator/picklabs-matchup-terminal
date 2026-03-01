import React, { useState } from 'react';
import { BetPick } from '../../App';
import { searchPlayers } from '../../data/playerDB';
import { useLiveBets } from '../../contexts/LiveBetsContext';

interface LiveTicketPanelProps {
    activeTickets?: BetPick[][];
    onRemoveTicket?: (index: number) => void;
}

const americanToDecimal = (oddsStr: string): number => {
    if (!oddsStr || oddsStr === 'N/A') return 1.909;
    const odds = parseInt(oddsStr.replace('+', ''));
    if (isNaN(odds)) return 1.909;
    return odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1;
};

const decimalToAmerican = (decimal: number): string => {
    if (!decimal || isNaN(decimal) || decimal <= 1) return 'N/A';
    if (decimal >= 2) return `+${Math.round((decimal - 1) * 100)}`;
    return `${Math.round(-100 / (decimal - 1))}`;
};

const calculateParlayOdds = (picks: BetPick[]): string => {
    if (picks.length < 2) return picks.length === 1 ? picks[0].odds : 'N/A';
    const combined = picks.reduce((acc, pick) => acc * americanToDecimal(pick.odds), 1);
    return decimalToAmerican(combined);
};

const toWin = (stake: number, oddsStr: string): number => {
    if (!oddsStr || oddsStr === 'N/A' || stake <= 0) return 0;
    const odds = parseInt(oddsStr.replace('+', ''));
    if (isNaN(odds)) return 0;
    return odds > 0 ? stake * (odds / 100) : stake / (Math.abs(odds) / 100);
};

const getLogoForPick = (bet: BetPick) => {
    const isPlayerProp = ['Over', 'Under', 'Prop'].includes(bet.type);
    if (isPlayerProp) {
        // Remove betting terms to isolate the player name
        const playerCleanName = bet.team.replace(/(Over|Under|Prop|\+|-|[0-9.]+|Pts|Rebs|Asts|Threes|Points|Rebounds|Assists|Steals|Blocks|Turnovers|O\/U).*$/i, '').trim();
        const results = searchPlayers(playerCleanName);
        if (results.length > 0 && results[0].headshot) {
            return results[0].headshot;
        }
    }
    const cleanTeamName = bet.team.replace(/ (ML|Spread|PK|\+|-).*$/i, '').trim();
    // Attempt ESPN NBA by stripping words, or provide fallback
    // The logo will gracefully fallback via the onError handler in the img tag
    const abbr = cleanTeamName.split(' ')[0].substring(0, 3).toLowerCase();
    return `https://a.espncdn.com/i/teamlogos/nba/500/${abbr}.png`;
};

const TicketCard: React.FC<{ ticket: BetPick[]; onRemove?: () => void }> = ({ ticket, onRemove }) => {
    const ticketId = React.useMemo(() => Math.floor(1000000000 + Math.random() * 9000000000).toString(), []);
    const ticketDate = React.useMemo(() => {
        const d = new Date();
        return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }, []);

    if (!ticket || ticket.length === 0) return null;

    const totalLegs = ticket.length;

    // Create a stable random seed from the first ticket leg to mock realistic states
    const mockSeed = Array.from(ticket[0]?.id || ticketId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hasLostLeg = mockSeed % 4 === 0; // 25% chance this simulated ticket hit a loss
    const isTicketFinished = mockSeed % 3 === 0; // 33% chance all games are finished

    let ticketStatus = 'PENDING';
    if (hasLostLeg) {
        ticketStatus = 'LOST';
    } else if (isTicketFinished) {
        ticketStatus = 'WON';
    }

    let winningLegs = 0;
    if (ticketStatus === 'WON') {
        winningLegs = totalLegs;
    } else if (ticketStatus === 'LOST') {
        winningLegs = Math.max(0, totalLegs - 1); // Mock: last leg lost or is losing
    } else {
        winningLegs = Math.floor(totalLegs / 2); // Mock: some legs hit, rest pending
    }

    const hitPercent = totalLegs > 0 ? Math.round((winningLegs / totalLegs) * 100) : 0;
    const isParlay = totalLegs > 1;
    const combinedOddsStr = isParlay ? calculateParlayOdds(ticket) : (ticket[0]?.odds || 'N/A');
    const sumStakes = ticket.reduce((acc, b) => acc + (b.stake || 0), 0);
    const riskAmount = isParlay ? (sumStakes > 0 ? sumStakes : 50) : (sumStakes || 10);
    const payoutAmount = riskAmount + toWin(riskAmount, combinedOddsStr);

    return (
        <div className="w-full shrink-0 bg-[#0c0c0e] border border-neutral-800 rounded shadow-2xl font-sans mb-4 flex flex-col transition-all duration-300 relative group mt-3">

            {/* Floating Status Badge — Top right overlap */}
            {ticketStatus !== 'PENDING' && (
                <div className="absolute -top-3.5 right-4 z-20 flex px-4 py-1.5 rounded-full items-center justify-center pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    style={{ backgroundColor: ticketStatus === 'WON' ? '#A3FF00' : '#ef4444' }}>
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${ticketStatus === 'WON' ? 'text-black' : 'text-white'}`}>
                        {ticketStatus}
                    </span>
                </div>
            )}

            {/* Remove Button */}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="absolute -top-3 -left-3 w-6 h-6 flex items-center justify-center bg-black hover:bg-red-500 border border-neutral-700 hover:border-red-500 text-slate-400 hover:text-white rounded-full transition-colors z-30 opacity-0 group-hover:opacity-100"
                    title="Remove Ticket"
                >
                    <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
            )}

            {/* PickLabs Logo Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 relative z-0">
                <span className="text-[#A3FF00] font-black tracking-tighter italic text-2xl leading-none">
                    PICKLABS
                </span>
                <span className="text-[10px] font-black text-white tracking-widest uppercase pt-1">
                    SPORTSBOOK
                </span>
            </div>

            {/* Header (Pick Hitting / Bullish-Bearish) */}
            <div className="flex flex-col px-5 py-4 border-b border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${hitPercent >= 50 ? 'bg-[#A3FF00] shadow-[0_0_8px_rgba(163,255,0,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'} animate-pulse`} />
                        <span className="text-base font-black text-white tracking-widest uppercase">
                            PICKS HITTING <span className={`${hitPercent >= 50 ? 'text-[#A3FF00]' : 'text-red-500'} ml-1`}>{hitPercent}%</span>
                        </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                        {totalLegs} PICKS
                    </div>
                </div>
                {/* Full Width Gradient Bar */}
                <div className="h-1.5 w-[65%] max-w-[200px] bg-neutral-800 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-orange-500 to-[#A3FF00]"
                        style={{ width: `${hitPercent}%` }}
                    />
                </div>
            </div>

            {/* Pick List */}
            <div className="flex-1 overflow-y-auto max-h-[300px] custom-[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-800">
                {ticket.map((bet, i) => {
                    const isHitting = i < winningLegs;
                    let pickProgress = 0;
                    if (ticketStatus === 'WON') pickProgress = 100;
                    else if (ticketStatus === 'LOST' && i >= winningLegs) pickProgress = 20;
                    else pickProgress = isHitting ? 100 : 30 + (i * 25) % 65;

                    const logoUrl = getLogoForPick(bet);
                    const targetStringMatch = (bet.team + " " + bet.type).match(/[0-9.]+/);
                    const targetNum = targetStringMatch ? parseFloat(targetStringMatch[0]) : null;

                    let currentNum = 0;
                    if (targetNum !== null) {
                        currentNum = isHitting || ticketStatus === 'WON' ? targetNum : parseFloat(((targetNum * pickProgress) / 100).toFixed(1));
                        if (currentNum > targetNum) currentNum = targetNum;
                    }

                    const getColor = (prog: number) => {
                        if (prog < 33) return '#ef4444';
                        if (prog < 66) return '#f97316';
                        return '#A3FF00';
                    };
                    const barColor = getColor(pickProgress);
                    const cleanTeamName = bet.team.replace(/(Over|Under|Prop|ML|Spread|PK|\+|-|[0-9.]+|Pts|Rebs|Asts|Threes|Points|Rebounds|Assists|Steals|Blocks|Turnovers|O\/U).*$/i, '').trim();

                    const isMoneyline = bet.type === 'ML' || bet.type.toLowerCase().includes('moneyline');
                    let topText: string = bet.team;
                    let bottomText: string = bet.type;

                    if (isMoneyline) {
                        topText = bet.team;
                        bottomText = "MONEYLINE";
                    } else if (bet.type.toLowerCase().includes('over') || bet.type.toLowerCase().includes('under') || bet.type.toLowerCase().includes('spread')) {
                        const isUnder = bet.type.toLowerCase().includes('under');
                        const isOver = bet.type.toLowerCase().includes('over');
                        const valMatch = bet.type.match(/[0-9.]+/);
                        const val = valMatch ? valMatch[0] : '';
                        topText = `${bet.team} ${isUnder ? 'Under' : isOver ? 'Over' : ''} ${val}`.trim();
                        // For display like "UTAH JAZZ -2.9 - SPREAD" or "PROP"
                        if (bet.type.toLowerCase().includes('spread')) {
                            bottomText = `${bet.team.toUpperCase()} ${val} - SPREAD`;
                        } else {
                            bottomText = "PROP";
                        }
                    } else if (bet.type.toLowerCase().includes('+')) {
                        topText = bet.team;
                        bottomText = bet.type.toUpperCase();
                    }

                    let statusNode = null;
                    if (ticketStatus === 'WON' || isHitting) {
                        statusNode = (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#0c0c0e] border-[1.5px] border-[#A3FF00] relative z-20">
                                <span className="material-symbols-outlined text-[#A3FF00] text-[12px] font-bold">check</span>
                            </div>
                        );
                    } else if (ticketStatus === 'LOST' && i >= winningLegs) {
                        statusNode = (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#0c0c0e] border-[1.5px] border-red-500 relative z-20">
                                <span className="material-symbols-outlined text-red-500 text-[12px] font-bold">close</span>
                            </div>
                        );
                    } else {
                        statusNode = (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#0c0c0e] border-[1.5px] border-neutral-700 relative z-20" />
                        );
                    }

                    return (
                        <div key={bet.id} className="relative flex px-5 pt-6 hover:bg-white/[0.01] transition-colors group">
                            {/* Timeline Track & Node */}
                            <div className="flex flex-col items-center mr-5 relative z-10 w-5">
                                {i !== 0 && (
                                    <div className="absolute top-0 bottom-[calc(100%-1rem)] w-[1px] bg-neutral-800" />
                                )}
                                {i !== ticket.length - 1 && (
                                    <div className="absolute top-6 -bottom-6 w-[1px] bg-neutral-800" />
                                )}
                                <div className="mt-0.5">{statusNode}</div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0 pb-6 border-b border-neutral-800/80 group-last:border-b-0">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 min-w-0 pr-2">
                                        {logoUrl.includes('ui-avatars') ? (
                                            <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 shadow-inner">
                                                <span className="text-white text-[11px] font-bold">{cleanTeamName.substring(0, 2).toUpperCase()}</span>
                                            </div>
                                        ) : (
                                            <img src={logoUrl} alt={cleanTeamName} className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 object-cover shrink-0" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanTeamName)}&background=111&color=fff&rounded=true&bold=true`; }} />
                                        )}
                                        <div className="flex flex-col min-w-0 justify-center">
                                            <span className="text-base font-bold text-white truncate leading-tight mb-1">{topText}</span>
                                            <span className="text-[10px] text-slate-500 font-black truncate uppercase tracking-widest">{bottomText}</span>
                                        </div>
                                    </div>
                                    <span className="text-base text-white font-black shrink-0 tracking-tight">{bet.odds}</span>
                                </div>

                                {/* Progress Bar aligned with text */}
                                {!isMoneyline && targetNum !== null && (
                                    <div className="pl-12 pr-4 w-full relative">
                                        <div className="h-[2px] bg-neutral-800 w-full relative flex items-center rounded-full">
                                            <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(currentNum / targetNum) * 100}%`, backgroundColor: barColor }} />
                                            <div className="absolute right-0 w-6 h-6 flex items-center justify-center bg-[#0c0c0e] border border-neutral-600 text-[9px] font-black text-white rounded-full transition-all duration-500 ease-out z-10 translate-x-1/2 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                                                {targetNum}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* MoneyLine Score Mockup */}
                                {isMoneyline && (() => {
                                    const matchParts = bet.matchupStr ? bet.matchupStr.split(' vs ') : [];
                                    let opponentName = 'Opponent';
                                    if (matchParts.length === 2) {
                                        opponentName = matchParts[0].trim() === cleanTeamName ? matchParts[1].trim() : matchParts[0].trim();
                                    }
                                    const betSeed = Array.from(bet.id || "").reduce((acc, char) => acc + char.charCodeAt(0), i * 123);
                                    const q1A = 15 + (betSeed % 12);
                                    const q2A = 15 + ((betSeed * 2) % 15);
                                    const q3A = 15 + ((betSeed * 3) % 14);
                                    const q4A = 15 + ((betSeed * 5) % 18);
                                    const totalA = q1A + q2A + q3A + q4A;
                                    const q1B = 15 + ((betSeed * 7) % 13);
                                    const q2B = 15 + ((betSeed * 11) % 16);
                                    const q3B = 15 + ((betSeed * 13) % 12);
                                    const q4B = 15 + ((betSeed * 17) % 15);
                                    const totalB = q1B + q2B + q3B + q4B;

                                    let isTeamSelectedWinning = isHitting || ticketStatus === 'WON';
                                    if (ticketStatus === 'LOST' && i >= winningLegs) isTeamSelectedWinning = false;
                                    let finalScoreOpp = totalA;
                                    let finalScoreTeam = totalB;

                                    if (isTeamSelectedWinning && finalScoreTeam <= finalScoreOpp) {
                                        finalScoreTeam = finalScoreOpp + 1 + (betSeed % 8);
                                    } else if (!isTeamSelectedWinning && finalScoreTeam >= finalScoreOpp) {
                                        finalScoreOpp = finalScoreTeam + 1 + (betSeed % 8);
                                    }

                                    return (
                                        <div className="flex flex-col text-[10px] text-slate-400 font-mono mt-3 pl-12 pr-4 w-full">
                                            <div className="flex justify-between items-center py-1">
                                                <span className="truncate pr-2">{opponentName}</span>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span>{q1A}</span><span>{q2A}</span><span>{q3A}</span><span>{q4A}</span><span className="text-white font-bold ml-2">{finalScoreOpp}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-1">
                                                <span className="truncate pr-2">{cleanTeamName}</span>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span>{q1B}</span><span>{q2B}</span><span>{q3B}</span><span>{q4B}</span><span className={`font-bold ml-2 ${isTeamSelectedWinning ? 'text-[#A3FF00]' : 'text-white'}`}>{finalScoreTeam}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Odds / Risk / To Win Box */}
            <div className="px-5 py-6 border-t border-neutral-800 flex justify-between items-center text-center z-10 shrink-0">
                <div className="flex flex-col items-start min-w-[30%]">
                    <span className="text-[10px] font-black text-slate-500 tracking-widest mb-1.5 uppercase">ODDS</span>
                    <span className="text-lg font-black text-white">{combinedOddsStr}</span>
                </div>
                <div className="flex flex-col items-center flex-1 border-x border-neutral-800 px-4 py-1">
                    <span className="text-[10px] font-black text-slate-500 tracking-widest mb-1.5 uppercase">RISK</span>
                    <span className="text-lg font-black text-white">${riskAmount.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-end min-w-[30%]">
                    <span className="text-[10px] font-black text-slate-500 tracking-widest mb-1.5 uppercase">TO WIN</span>
                    <span className="text-lg font-black text-[#A3FF00]">${payoutAmount.toFixed(2)}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 font-mono tracking-widest uppercase shrink-0">
                <span>BET ID: {ticketId}</span>
                <span>{ticketDate.toUpperCase()}</span>
            </div>
        </div>
    );
};

export const LiveTicketPanel: React.FC<LiveTicketPanelProps> = ({ activeTickets, onRemoveTicket }) => {
    const { isLiveBetsActive } = useLiveBets();
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!activeTickets || activeTickets.length === 0) return null;

    if (isLiveBetsActive) {
        // Floating mode (Live Bets Tracker ON)
        const activeIdx = Math.min(currentIndex, activeTickets.length - 1);
        const ticket = activeTickets[activeIdx];
        return (
            <div className="fixed bottom-6 xl:bottom-10 right-6 xl:right-10 z-[100] flex flex-col items-end pointer-events-none">
                <div className="w-[340px] pointer-events-auto flex flex-col shadow-2xl">
                    {activeTickets.length > 1 && (
                        <div className="flex justify-between items-center bg-black px-4 py-2 border border-neutral-700 border-b-0">
                            <button onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : activeTickets.length - 1)} className="text-[#A3FF00] hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                            </button>
                            <span className="text-[10px] font-black text-white tracking-widest uppercase">
                                Ticket {activeIdx + 1} of {activeTickets.length}
                            </span>
                            <button onClick={() => setCurrentIndex(prev => prev < activeTickets.length - 1 ? prev + 1 : 0)} className="text-[#A3FF00] hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                    )}
                    <TicketCard ticket={ticket} onRemove={() => {
                        if (onRemoveTicket) onRemoveTicket(activeIdx);
                        setCurrentIndex(0);
                    }} />
                </div>
            </div>
        );
    }

    // Default inline scroll mode
    return (
        <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-neutral-800/80 [&::-webkit-scrollbar-track]:bg-transparent snap-x snap-mandatory flex gap-4 pb-4 px-1">
            {activeTickets.map((ticket, idx) => (
                <div key={idx} className="snap-center shrink-0 w-[90%] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] min-w-[280px]">
                    <TicketCard ticket={ticket} onRemove={onRemoveTicket ? () => onRemoveTicket(idx) : undefined} />
                </div>
            ))}
        </div>
    );
};
