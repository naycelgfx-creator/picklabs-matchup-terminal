import React from 'react';
import { Game } from '../../data/mockGames';
import { PublicBetting } from './PublicBetting';
import { BetPick } from '../../App';
import { useRookieMode } from '../../contexts/RookieModeContext';
import { GlossaryTooltip } from '../ui/GlossaryTooltip';
import { PulsingBeacon } from '../ui/PulsingBeacon';
import { useLiveOddsShift, applyOddsShift } from '../../hooks/useLiveOddsShift';

interface GameCardProps {
    game: Game;
    viewMode?: 'TEAMS' | 'PLAYERS';
    onSelectGame: () => void;
    onAddBet: (bet: Omit<BetPick, 'id'>) => void;
    betSlip: BetPick[];
    publicBettingOpen?: boolean;
    onPublicBettingToggle?: () => void;
    isUnlocked?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, viewMode = 'TEAMS', onSelectGame, onAddBet, betSlip, publicBettingOpen = false, onPublicBettingToggle, isUnlocked = false }) => {
    const isLive = game.status === 'LIVE' || (game.status as string) === 'in';
    const isFinished = game.status === 'FINAL' || (game.status as string) === 'post';

    // Check if game has less than 15 seconds left (e.g., "00:05", "00:12")
    const isLateGame = React.useMemo(() => {
        if (!isLive || !game.timeLabel) return false;
        const match = game.timeLabel.match(/00:([0-1][0-9])/);
        if (match && parseInt(match[1]) <= 15) return true;
        return false;
    }, [game.timeLabel, isLive]);

    const isLocked = isFinished || isLateGame;
    const [shakeOdds, setShakeOdds] = React.useState(false);

    const handleBetClick = (e: React.MouseEvent, type: BetPick['type'], team: string, oddsVal: string, stakeAmt: number) => {
        e.stopPropagation();
        if (isLocked) {
            setShakeOdds(true);
            setTimeout(() => setShakeOdds(false), 500); // Reset shake after animation
            return;
        }
        onAddBet({
            gameId: game.id,
            type,
            team,
            odds: oddsVal,
            matchupStr: `${game.awayTeam.name} @ ${game.homeTeam.name}`,
            stake: stakeAmt,
            gameStatus: game.status,
            gameDate: game.date
        });
    };

    const { isRookieModeActive } = useRookieMode();
    const shifts = useLiveOddsShift(game.status, game.id);

    // Which bet types are already in slip for this game?
    const selectedTypes = new Set(betSlip.filter(b => b.gameId === game.id).map(b => b.type));
    const isSel = (t: BetPick['type']) => selectedTypes.has(t);
    // Inline style for a lit/selected odds button
    const selStyle = { background: 'rgba(17,248,183,0.15)', borderColor: 'rgba(17,248,183,0.75)', color: 'rgb(17,248,183)', boxShadow: '0 0 10px rgba(17,248,183,0.25)' } as React.CSSProperties;

    // Build plain-English translations for rookie mode
    const baseSpreadNum = parseFloat(game.odds.spread);
    const spreadShift = game.homeTeam.name === game.awayTeam.name ? shifts.spreadShift : -shifts.spreadShift; // Just use negative for away to be consistent 
    const spreadNum = baseSpreadNum + spreadShift;

    // ML Rookie translation
    const mlOdds = applyOddsShift(game.odds.moneyline, -shifts.mlShift);
    const mlText = "To Win the Game";

    // Spread Rookie translation
    const spreadVal = spreadNum; // the numeric value
    let awaySpreadText = 'N/A';
    if (!isNaN(spreadVal)) {
        if (spreadVal < 0) {
            awaySpreadText = `To Win by ${Math.abs(spreadVal) + 0.5} or more`;
        } else {
            awaySpreadText = `To Win, or lose by ${spreadVal - 0.5} or less`;
        }
    } else {
        awaySpreadText = `${game.awayTeam.name} must cover the spread.`;
    }

    // O/U Rookie translation
    const ouVal = applyOddsShift(game.odds.overUnder.value.toString(), shifts.totalShift);
    const ouPick = game.odds.overUnder.pick;
    const parsedOuVal = parseFloat(ouVal);
    let ouText = `Combined score must be ${ouPick === 'Over' ? 'above' : 'below'} ${ouVal} total points.`;
    if (!isNaN(parsedOuVal)) {
        if (ouPick === 'Over') {
            ouText = `Total score ${parsedOuVal + 0.5} or higher`;
        } else {
            ouText = `Total score ${parsedOuVal - 0.5} or lower`;
        }
    }

    // Profit calculation for Rookie Odds
    const getRookieOdds = (americanOddsStr: string) => {
        const americanOdds = parseInt(americanOddsStr.replace('+', ''));
        if (isNaN(americanOdds)) return americanOddsStr;
        let profit = 0;
        if (americanOdds > 0) {
            profit = (10 / 100) * americanOdds;
        } else {
            profit = (10 / Math.abs(americanOdds)) * 100;
        }
        return `Bet $10, Profit $${profit.toFixed(2)}`;
    };


    // Dynamic Win Probs
    const awayWinProb = isLive ? Math.min(99, Math.max(1, (game.aiData ? (100 - game.aiData.ai_probability) : game.awayTeam.winProb) - shifts.confidenceShift)) : (game.aiData ? (100 - game.aiData.ai_probability) : game.awayTeam.winProb);
    const homeWinProb = isLive ? Math.min(99, Math.max(1, (game.aiData ? game.aiData.ai_probability : game.homeTeam.winProb) + shifts.confidenceShift)) : (game.aiData ? game.aiData.ai_probability : game.homeTeam.winProb);


    return (
        <div className="terminal-panel p-5 space-y-6 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <img src={game.sportLogo} alt={game.sport} className="h-3.5 object-contain mr-1 opacity-80" />
                        {isFinished ? (
                            <span className="text-[9px] font-black bg-neutral-800 text-slate-400 px-2 py-0.5 rounded italic">FINAL</span>
                        ) : isLive ? (
                            <span className="text-[9px] font-black bg-red-500 text-white px-2 py-0.5 rounded italic">LIVE</span>
                        ) : (
                            <span className="text-[9px] font-black bg-neutral-800 text-text-muted px-2 py-0.5 rounded">UPCOMING</span>
                        )}
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isLateGame ? 'text-red-500 animate-pulse' : 'text-text-muted'}`}>
                            {isLocked && !isFinished ? (
                                <>
                                    <span className="material-symbols-outlined text-[10px] mr-1 align-middle">lock</span>
                                    {game.timeLabel} (LOCKED)
                                </>
                            ) : game.timeLabel}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-text-muted font-black uppercase tracking-tighter">Matchup ID</p>
                        <p className="text-[10px] text-text-main font-mono">{game.matchupId}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-border-muted/30 pt-3 text-[9px] font-bold text-text-muted uppercase tracking-widest">
                    {/* Broadcast: icon + text label only, no image */}
                    <div className="flex items-center gap-1.5 opacity-80">
                        <span className="material-symbols-outlined text-[11px] text-slate-600">tv</span>
                        <span>{game.broadcast}</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                        <span className="material-symbols-outlined text-[11px] text-slate-600">location_on</span>
                        <span className="truncate max-w-[150px] text-right">{game.venue.name}, {game.venue.location}</span>
                    </div>
                </div>
            </div>


            {/* ─── Team Matchup Row ─── */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 sm:gap-4 items-center flex-grow">

                {/* Away Team */}
                <div className="col-span-1 sm:col-span-2 flex flex-col items-center text-center">
                    {game.awayTeam.logo ? (
                        <img
                            alt={game.awayTeam.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto object-contain mb-1.5 drop-shadow-md"
                            src={game.awayTeam.logo}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = game.sportLogo;
                            }}
                        />
                    ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center mb-1.5">
                            <span className="material-symbols-outlined text-slate-500 text-3xl">
                                {game.sport.startsWith('Soccer') ? 'sports_soccer' :
                                    game.sport.startsWith('Tennis') ? 'sports_tennis' :
                                        game.sport.startsWith('Golf') ? 'golf_course' :
                                            game.sport === 'NFL' || game.sport === 'CFB' ? 'sports_football' :
                                                game.sport === 'MLB' ? 'sports_baseball' :
                                                    game.sport === 'NHL' ? 'sports_hockey' : 'sports_basketball'}
                            </span>
                        </div>
                    )}
                    {/* Show abbreviated last word on xs, full name on sm+ */}
                    <h3 className="text-[10px] sm:text-[11px] md:text-sm font-black text-text-main uppercase italic leading-none sm:leading-tight w-full text-center">
                        <div className="sm:hidden mb-0.5">
                            {game.awayTeam.name.includes(' ')
                                ? game.awayTeam.name.split(' ').pop()
                                : game.awayTeam.name}
                        </div>
                        <span className="hidden sm:block truncate">{game.awayTeam.name}</span>
                        {isLive && game.awayTeam.score !== undefined &&
                            <div className="mt-0.5 sm:mt-0 sm:ml-1 text-primary text-[11px] sm:text-sm inline-block">{game.awayTeam.score}</div>}
                    </h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">{game.awayTeam.record}</p>
                    <div className="mt-2 flex gap-0.5 sm:gap-1 justify-center flex-wrap">
                        {game.awayTeam.recentForm.map((f, i) => (
                            <span key={i} className={f === 'W' ? 'form-badge-w' : 'form-badge-l'}>{f}</span>
                        ))}
                    </div>
                </div>

                {/* Center: Unified Win Prob Bar */}
                <div className="col-span-2 sm:col-span-3 flex flex-col items-center justify-center gap-1">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">AI Win Probability</p>
                    <div className="w-full flex rounded-full overflow-hidden h-3">
                        <div className="bg-primary transition-all duration-700" style={{ width: `${awayWinProb}%` }} />
                        <div className="bg-accent-purple transition-all duration-700" style={{ width: `${homeWinProb}%` }} />
                    </div>
                    <div className="flex justify-between w-full">
                        <span className="text-[9px] font-black text-primary">{awayWinProb.toFixed(0)}%</span>
                        <span className="text-[9px] font-black text-accent-purple">{homeWinProb.toFixed(0)}%</span>
                    </div>
                </div>

                {/* Home Team */}
                <div className="col-span-1 sm:col-span-2 flex flex-col items-center text-center">
                    {game.homeTeam.logo ? (
                        <img
                            alt={game.homeTeam.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto object-contain mb-1.5 drop-shadow-md"
                            src={game.homeTeam.logo}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = game.sportLogo;
                            }}
                        />
                    ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center mb-1.5">
                            <span className="material-symbols-outlined text-slate-500 text-3xl">
                                {game.sport === 'Soccer' ? 'sports_soccer' :
                                    game.sport === 'NFL' ? 'sports_football' :
                                        game.sport === 'MLB' ? 'sports_baseball' : 'sports_basketball'}
                            </span>
                        </div>
                    )}
                    <h3 className="text-[10px] sm:text-[11px] md:text-sm font-black text-text-main uppercase italic leading-none sm:leading-tight w-full text-center">
                        <div className="sm:hidden mb-0.5">
                            {game.homeTeam.name.includes(' ')
                                ? game.homeTeam.name.split(' ').pop()
                                : game.homeTeam.name}
                        </div>
                        <span className="hidden sm:block truncate">{game.homeTeam.name}</span>
                        {isLive && game.homeTeam.score !== undefined &&
                            <div className="mt-0.5 sm:mt-0 sm:ml-1 text-primary text-[11px] sm:text-sm inline-block">{game.homeTeam.score}</div>}
                    </h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">{game.homeTeam.record}</p>
                    <div className="mt-2 flex gap-0.5 sm:gap-1 justify-center flex-wrap">
                        {game.homeTeam.recentForm.map((f, i) => (
                            <span key={i} className={f === 'W' ? 'form-badge-w' : 'form-badge-l'}>{f}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* MIDDLE: The Edge Analysis */}
            {game.aiData && (
                <div className="border-t border-primary/20 pt-3 space-y-2">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black text-primary flex items-center gap-1 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[12px]">smart_toy</span>
                            PickLabs AI Engine
                            {game.aiData.expectedScore && (
                                <span className="ml-2 text-[9px] font-bold text-slate-400 normal-case tracking-normal">
                                    Proj: <span className="text-white">{game.aiData.expectedScore.away}–{game.aiData.expectedScore.home}</span>
                                </span>
                            )}
                        </h4>
                        {game.aiData.edge >= 5 ? (
                            <span className="text-[9px] font-black text-primary bg-primary/20 border border-primary/40 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(163,255,0,0.3)] animate-pulse">
                                🔥 HIGH VALUE +{game.aiData.edge}%
                            </span>
                        ) : game.aiData.edge > 0 ? (
                            <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded">
                                +{game.aiData.edge}% EDGE
                            </span>
                        ) : (
                            <span className="text-[9px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">NO EDGE</span>
                        )}
                    </div>
                    {/* ML / Spread / O/U chips */}
                    <div className="grid grid-cols-3 gap-2">
                        <div
                            className={`odd-box cursor-pointer transition-all border border-primary/20 relative overflow-hidden flex flex-col items-center justify-center p-2 rounded-lg ${shakeOdds ? 'animate-shake border-red-500/50' : ''}`}
                            style={isSel('ML') ? selStyle : { backgroundColor: 'rgba(163,255,0,0.04)' }}
                            onClick={(e) => {
                                const fav = game.aiData!.ai_probability >= 50 ? game.homeTeam.name : game.awayTeam.name;
                                handleBetClick(e, 'ML', fav, game.odds.moneyline, game.aiData!.suggestions.kelly || 10);
                            }}
                        >
                            <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider">
                                {game.aiData!.ai_probability >= 50 ? game.homeTeam.name : game.awayTeam.name} ML
                            </span>
                            <span className="text-sm font-black text-white">{game.odds.moneyline}</span>
                            {isSel('ML') && <span className="material-symbols-outlined absolute top-1 right-1 text-[10px] text-primary">check</span>}
                        </div>
                        <div
                            className={`odd-box cursor-pointer transition-all border border-blue-500/20 flex flex-col items-center justify-center p-2 rounded-lg ${shakeOdds ? 'animate-shake border-red-500/50' : ''}`}
                            style={isSel('Spread') ? selStyle : { backgroundColor: 'rgba(59,130,246,0.04)' }}
                            onClick={(e) => {
                                const fav = game.aiData!.ai_probability >= 50 ? game.homeTeam.name : game.awayTeam.name;
                                handleBetClick(e, 'Spread', `${fav} ${game.odds.spread}`, '-110', game.aiData!.suggestions.fixed || 10);
                            }}
                        >
                            <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Spread</span>
                            <span className="text-sm font-black text-white">{game.odds.spread}</span>
                            {isSel('Spread') && <span className="material-symbols-outlined absolute top-1 right-1 text-[10px] text-primary">check</span>}
                        </div>
                        <div
                            className={`odd-box cursor-pointer transition-all border border-purple-500/20 flex flex-col items-center justify-center p-2 rounded-lg ${shakeOdds ? 'animate-shake border-red-500/50' : ''}`}
                            style={isSel(game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under') ? selStyle : { backgroundColor: 'rgba(168,85,247,0.04)' }}
                            onClick={(e) => handleBetClick(e, game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under', `${game.odds.overUnder.pick} ${game.odds.overUnder.value}`, '-110', game.aiData!.suggestions.target || 10)}
                        >
                            <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider">O/U {game.odds.overUnder.value}</span>
                            <span className="text-sm font-black text-white">{game.odds.overUnder.pick}</span>
                            {isSel(game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under') && <span className="material-symbols-outlined absolute top-1 right-1 text-[10px] text-primary">check</span>}
                        </div>
                    </div>
                </div>
            )}

            {/* BOTTOM: TEAMS / PLAYERS Split View */}
            {viewMode === 'TEAMS' && game.teamStats ? (
                <div className="border-t border-border-muted pt-3 space-y-1.5">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Team Analysis</p>
                    {[
                        { label: 'Off RTG', away: game.teamStats.away.offRtg, home: game.teamStats.home.offRtg, higher: true },
                        { label: 'Def RTG', away: game.teamStats.away.defRtg, home: game.teamStats.home.defRtg, higher: false },
                        { label: 'FG %', away: game.teamStats.away.fgPct, home: game.teamStats.home.fgPct, higher: true },
                        ...(game.teamStats.away.pace !== undefined ? [{ label: 'Pace', away: game.teamStats.away.pace, home: game.teamStats.home.pace, higher: true }] : []),
                    ].map(row => {
                        const awayWins = row.higher ? (row.away ?? 0) > (row.home ?? 0) : (row.away ?? 0) < (row.home ?? 0);
                        return (
                            <div key={row.label} className="flex justify-between items-center text-[9px]">
                                <span className={`font-black ${awayWins ? 'text-primary' : 'text-slate-400'}`}>{row.away?.toFixed(1)}</span>
                                <span className="text-slate-600 uppercase font-bold tracking-wider">{row.label}</span>
                                <span className={`font-black ${!awayWins ? 'text-primary' : 'text-slate-400'}`}>{row.home?.toFixed(1)}</span>
                            </div>
                        );
                    })}
                    {(game.teamStats.away.b2b || game.teamStats.home.b2b) && (
                        <div className="flex justify-between text-[8px] mt-1">
                            <span className={game.teamStats.away.b2b ? 'text-red-400 font-bold' : 'text-slate-600'}>
                                {game.teamStats.away.b2b ? '⚠ B2B' : '—'}
                            </span>
                            <span className="text-slate-600 font-bold">Back-to-Back</span>
                            <span className={game.teamStats.home.b2b ? 'text-red-400 font-bold' : 'text-slate-600'}>
                                {game.teamStats.home.b2b ? '⚠ B2B' : '—'}
                            </span>
                        </div>
                    )}
                </div>
            ) : viewMode === 'PLAYERS' && game.leaders && game.leaders.length > 0 ? (
                <div className="border-t border-border-muted pt-3">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Prop Forecast</p>
                    <table className="w-full text-[9px]">
                        <thead>
                            <tr className="text-slate-600 uppercase font-bold">
                                <td className="pb-1">Player</td>
                                <td className="pb-1 text-center">AI Proj</td>
                                <td className="pb-1 text-right">Line</td>
                            </tr>
                        </thead>
                        <tbody>
                            {game.leaders.slice(0, 4).map((l, i) => {
                                const proj = parseFloat(l.displayValue);
                                const line = proj * (0.9 + Math.random() * 0.2);
                                const hasEdge = proj > line;
                                return (
                                    <tr key={i} className={hasEdge ? 'text-primary' : 'text-slate-400'}>
                                        <td className="py-0.5 font-bold">{l.shortName} <span className="text-slate-600 font-normal">{l.category}</span></td>
                                        <td className="py-0.5 text-center font-black">{proj}</td>
                                        <td className="py-0.5 text-right">{line.toFixed(1)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : null}

            {/* Non-AI odds fallback */}
            {!game.aiData && (
                isRookieModeActive ? (
                    <div id="rookie-odds-row" className="grid grid-cols-3 gap-2 border-t border-border-muted pt-4">
                        <div className={`cursor-pointer rounded-xl p-2.5 transition-all border flex flex-col justify-between ${shakeOdds ? 'animate-shake border-red-500' : ''}`} style={isSel('ML') ? selStyle : undefined} onClick={(e) => handleBetClick(e, 'ML', game.awayTeam.name, game.odds.moneyline, 10)}>
                            <div className="flex items-center gap-1 mb-1">{isSel('ML') ? <span className="material-symbols-outlined text-[11px] text-primary">check_circle</span> : <PulsingBeacon color="yellow" />}<GlossaryTooltip term="Moneyline" definition="Pick which team wins outright." example={`If ${game.awayTeam.name} win, you win.`} /></div>
                            <p className="text-[10px] leading-snug mb-2 font-bold text-[#39FF14]">{mlText}</p>
                            <div className="mt-auto"><span className="text-[10px] sm:text-[11px] font-black text-[#B026FF]">{getRookieOdds(mlOdds)}</span></div>
                        </div>
                        <div className={`cursor-pointer rounded-xl p-2.5 transition-all border flex flex-col justify-between ${shakeOdds ? 'animate-shake border-red-500' : ''}`} style={isSel('Spread') ? selStyle : undefined} onClick={(e) => handleBetClick(e, 'Spread', `${game.awayTeam.name} ${spreadNum > 0 ? `+${spreadNum.toFixed(1)}` : spreadNum.toFixed(1)}`, '-110', 10)}>
                            <div className="flex items-center gap-1 mb-1">{isSel('Spread') ? <span className="material-symbols-outlined text-[11px] text-primary">check_circle</span> : <PulsingBeacon color="yellow" />}<GlossaryTooltip term="Point Spread" definition="The predicted score gap." example={awaySpreadText} /></div>
                            <p className="text-[10px] leading-snug mb-2 font-bold text-[#39FF14]">{awaySpreadText}</p>
                            <div className="mt-auto"><span className="text-[10px] sm:text-[11px] font-black text-[#B026FF]">{getRookieOdds('-110')}</span></div>
                        </div>
                        <div className={`cursor-pointer rounded-xl p-2.5 transition-all border flex flex-col justify-between ${shakeOdds ? 'animate-shake border-red-500' : ''}`} style={isSel(ouPick === 'Over' ? 'Over' : 'Under') ? selStyle : undefined} onClick={(e) => handleBetClick(e, ouPick === 'Over' ? 'Over' : 'Under', `${ouPick} ${ouVal}`, '-110', 10)}>
                            <div className="flex items-center gap-1 mb-1">{isSel(ouPick === 'Over' ? 'Over' : 'Under') ? <span className="material-symbols-outlined text-[11px] text-primary">check_circle</span> : <PulsingBeacon color="yellow" />}<GlossaryTooltip term="Over/Under" definition="Bet on combined total score." example={ouText} /></div>
                            <p className="text-[10px] leading-snug mb-2 font-bold text-[#39FF14]">{ouText}</p>
                            <div className="mt-auto"><span className="text-[10px] sm:text-[11px] font-black text-[#B026FF]">{getRookieOdds('-110')}</span></div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-3 border-t border-border-muted pt-4">
                        <div className={`odd-box cursor-pointer transition-all ${shakeOdds ? 'animate-shake border border-red-500' : ''}`} style={isSel('ML') ? selStyle : {}} onClick={(e) => handleBetClick(e, 'ML', game.awayTeam.name, game.odds.moneyline, 50)}>
                            <span className="text-[8px] uppercase font-black" style={isSel('ML') ? { color: 'rgb(17,248,183)' } : { color: 'rgb(100,116,139)' }}>{game.awayTeam.name} ML</span>
                            <span className="text-xs font-black" style={isSel('ML') ? { color: 'rgb(17,248,183)' } : {}}>{mlOdds}</span>
                            {isSel('ML') && <span className="material-symbols-outlined text-[10px] mt-0.5" style={{ color: 'rgb(17,248,183)' }}>check</span>}
                        </div>
                        <div className={`odd-box cursor-pointer transition-all ${shakeOdds ? 'animate-shake border border-red-500' : ''}`} style={isSel('Spread') ? selStyle : {}} onClick={(e) => handleBetClick(e, 'Spread', `${game.awayTeam.name} ${spreadNum > 0 ? `+${spreadNum.toFixed(1)}` : spreadNum.toFixed(1)}`, '-110', 50)}>
                            <span className="text-[8px] uppercase font-black" style={isSel('Spread') ? { color: 'rgb(17,248,183)' } : { color: 'rgb(100,116,139)' }}>Spread</span>
                            <span className="text-xs font-black" style={isSel('Spread') ? { color: 'rgb(17,248,183)' } : {}}>{spreadNum > 0 ? `+${spreadNum.toFixed(1)}` : spreadNum.toFixed(1)}</span>
                            {isSel('Spread') && <span className="material-symbols-outlined text-[10px] mt-0.5" style={{ color: 'rgb(17,248,183)' }}>check</span>}
                        </div>
                        <div className={`odd-box cursor-pointer transition-all ${shakeOdds ? 'animate-shake border border-red-500' : ''}`} style={isSel(game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under') ? selStyle : {}} onClick={(e) => handleBetClick(e, game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under', `${game.odds.overUnder.pick} ${ouVal}`, '-110', 50)}>
                            <span className="text-[8px] uppercase font-black" style={isSel(game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under') ? { color: 'rgb(17,248,183)' } : { color: 'rgb(100,116,139)' }}>O/U {ouVal}</span>
                            <span className="text-xs font-black" style={isSel(game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under') ? { color: 'rgb(17,248,183)' } : {}}>{game.odds.overUnder.pick}</span>
                            {isSel(game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under') && <span className="material-symbols-outlined text-[10px] mt-0.5" style={{ color: 'rgb(17,248,183)' }}>check</span>}
                        </div>
                    </div>
                )
            )}

            <div className="mt-4 -mx-5 -mb-5 rounded-b-xl overflow-hidden flex flex-col">
                <div className="flex justify-between items-center bg-background-darker px-5 py-3 border-t border-border-muted">
                    <div className="flex items-center gap-2">
                        {isLive ? (
                            <span className="text-[9px] text-primary font-black animate-glow-hot">{game.streakLabel}</span>
                        ) : (
                            <span className="text-[9px] text-slate-500 font-black">{game.streakLabel}</span>
                        )}
                    </div>
                </div>
                <PublicBetting game={game} onMatchDetailsClick={onSelectGame} isOpen={publicBettingOpen ?? false} onToggle={onPublicBettingToggle ?? (() => { })} isUnlocked={isUnlocked} />

            </div>
        </div>
    );
};
