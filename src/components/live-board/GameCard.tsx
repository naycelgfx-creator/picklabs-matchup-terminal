import React from 'react';
import { Game } from '../../data/mockGames';
import { PublicBetting } from './PublicBetting';
import { BetPick } from '../../App';
import { useRookieMode } from '../../contexts/RookieModeContext';
import { GlossaryTooltip } from '../ui/GlossaryTooltip';
import { RiskMeter } from '../ui/RiskMeter';
import { PulsingBeacon } from '../ui/PulsingBeacon';

interface GameCardProps {
    game: Game;
    onSelectGame: () => void;
    onAddBet: (bet: Omit<BetPick, 'id'>) => void;
    betSlip: BetPick[];
    publicBettingOpen?: boolean;
    onPublicBettingToggle?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelectGame, onAddBet, betSlip, publicBettingOpen = false, onPublicBettingToggle }) => {
    const isLive = game.status === 'LIVE';
    const { isRookieModeActive } = useRookieMode();

    // Which bet types are already in slip for this game?
    const selectedTypes = new Set(betSlip.filter(b => b.gameId === game.id).map(b => b.type));
    const isSel = (t: BetPick['type']) => selectedTypes.has(t);
    // Inline style for a lit/selected odds button
    const selStyle = { background: 'rgba(17,248,183,0.15)', borderColor: 'rgba(17,248,183,0.75)', color: 'rgb(17,248,183)', boxShadow: '0 0 10px rgba(17,248,183,0.25)' } as React.CSSProperties;

    // Build plain-English translations for rookie mode
    const spreadNum = parseFloat(game.odds.spread);
    const awaySpreadText = isNaN(spreadNum)
        ? `${game.awayTeam.name} must cover the spread.`
        : spreadNum < 0
            ? `${game.awayTeam.name} must win by more than ${Math.abs(spreadNum)} points.`
            : `${game.awayTeam.name} can lose by up to ${spreadNum} points and still win your bet.`;

    const mlOdds = game.odds.moneyline;
    const mlNum = parseInt(mlOdds.replace('+', ''));
    const mlText = !isNaN(mlNum) && mlNum < 0
        ? `${game.awayTeam.name} is the favorite — they must win outright.`
        : `${game.awayTeam.name} is the underdog — an upset wins your bet.`;

    const ouVal = game.odds.overUnder.value;
    const ouPick = game.odds.overUnder.pick;
    const ouText = `Combined score must be ${ouPick === 'Over' ? 'above' : 'below'} ${ouVal} total points.`;

    // Normalize colors for SVG strokes
    const getStrokeColor = (colorClass: string) => {
        if (colorClass.includes('primary')) return '#0df20d';
        if (colorClass.includes('accent')) return '#a855f7';
        return '#3b82f6';
    };


    return (
        <div className="terminal-panel p-5 space-y-6 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <img src={game.sportLogo} alt={game.sport} className="h-3.5 object-contain mr-1 opacity-80" />
                        {isLive ? (
                            <span className="text-[9px] font-black bg-red-500 text-white px-2 py-0.5 rounded italic">LIVE</span>
                        ) : (
                            <span className="text-[9px] font-black bg-neutral-800 text-text-muted px-2 py-0.5 rounded">UPCOMING</span>
                        )}
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{game.timeLabel}</span>
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
            <div className="grid grid-cols-7 gap-1 sm:gap-4 items-center flex-grow">

                {/* Away Team */}
                <div className="col-span-2 flex flex-col items-center text-center">
                    {game.awayTeam.logo ? (
                        <img
                            alt={game.awayTeam.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 mx-auto object-contain mb-1.5"
                            src={game.awayTeam.logo}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = game.sportLogo;
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-neutral-800 rounded-full flex items-center justify-center mb-1.5">
                            <span className="material-symbols-outlined text-slate-500 text-base">
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
                    <h3 className="text-[11px] sm:text-sm font-black text-text-main uppercase italic leading-tight w-full text-center">
                        <span className="sm:hidden">
                            {game.awayTeam.name.includes(' ')
                                ? game.awayTeam.name.split(' ').pop()
                                : game.awayTeam.name}
                        </span>
                        <span className="hidden sm:block truncate">{game.awayTeam.name}</span>
                        {isLive && game.awayTeam.score !== undefined &&
                            <span className="ml-1 text-primary">{game.awayTeam.score}</span>}
                    </h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">{game.awayTeam.record}</p>
                    <div className="mt-2 flex gap-0.5 sm:gap-1 justify-center flex-wrap">
                        {game.awayTeam.recentForm.map((f, i) => (
                            <span key={i} className={f === 'W' ? 'form-badge-w' : 'form-badge-l'}>{f}</span>
                        ))}
                    </div>
                </div>

                {/* Center: Win Prob circles + VS */}
                <div className="col-span-3 flex items-center justify-center gap-1 sm:gap-3">
                    {/* Away prob */}
                    <div className="text-center">
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-0.5 mx-auto">
                            <svg className="w-full h-full -rotate-90">
                                <circle className="text-neutral-800" cx="50%" cy="50%" fill="transparent" r="44%" stroke="currentColor" strokeWidth="4"></circle>
                                <circle
                                    className="transition-all duration-1000 ease-out"
                                    cx="50%" cy="50%" fill="transparent" r="44%"
                                    stroke={getStrokeColor(game.awayTeam.color)}
                                    strokeDasharray="176"
                                    strokeDashoffset={176 - (176 * (game.awayTeam.winProb / 100))}
                                    strokeLinecap="round" strokeWidth="4"
                                ></circle>
                            </svg>
                            <span className="absolute text-[9px] sm:text-[10px] font-black text-text-main italic">{game.awayTeam.winProb}%</span>
                        </div>
                        <p className={`text-[7px] sm:text-[8px] font-bold ${game.awayTeam.color} uppercase`}>Win Prob</p>
                    </div>

                    {/* VS divider */}
                    <div className="flex flex-col items-center justify-center px-0.5">
                        <span className="text-[10px] sm:text-xs font-black text-slate-600">VS</span>
                        <div className="h-6 w-[1px] bg-border-muted mt-1"></div>
                    </div>

                    {/* Home prob */}
                    <div className="text-center">
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-0.5 mx-auto">
                            <svg className="w-full h-full -rotate-90">
                                <circle className="text-neutral-800" cx="50%" cy="50%" fill="transparent" r="44%" stroke="currentColor" strokeWidth="4"></circle>
                                <circle
                                    className="transition-all duration-1000 ease-out"
                                    cx="50%" cy="50%" fill="transparent" r="44%"
                                    stroke={getStrokeColor(game.homeTeam.color)}
                                    strokeDasharray="176"
                                    strokeDashoffset={176 - (176 * (game.homeTeam.winProb / 100))}
                                    strokeLinecap="round" strokeWidth="4"
                                ></circle>
                            </svg>
                            <span className="absolute text-[9px] sm:text-[10px] font-black text-text-main italic">{game.homeTeam.winProb}%</span>
                        </div>
                        <p className={`text-[7px] sm:text-[8px] font-bold ${game.homeTeam.color} uppercase`}>Win Prob</p>
                    </div>
                </div>

                {/* Home Team */}
                <div className="col-span-2 flex flex-col items-center text-center">
                    {game.homeTeam.logo ? (
                        <img
                            alt={game.homeTeam.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 mx-auto object-contain mb-1.5"
                            src={game.homeTeam.logo}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = game.sportLogo;
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-neutral-800 rounded-full flex items-center justify-center mb-1.5">
                            <span className="material-symbols-outlined text-slate-500 text-base">
                                {game.sport === 'Soccer' ? 'sports_soccer' :
                                    game.sport === 'NFL' ? 'sports_football' :
                                        game.sport === 'MLB' ? 'sports_baseball' : 'sports_basketball'}
                            </span>
                        </div>
                    )}
                    <h3 className="text-[11px] sm:text-sm font-black text-text-main uppercase italic leading-tight w-full text-center">
                        <span className="sm:hidden">
                            {game.homeTeam.name.includes(' ')
                                ? game.homeTeam.name.split(' ').pop()
                                : game.homeTeam.name}
                        </span>
                        <span className="hidden sm:block truncate">{game.homeTeam.name}</span>
                        {isLive && game.homeTeam.score !== undefined &&
                            <span className="ml-1 text-primary">{game.homeTeam.score}</span>}
                    </h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">{game.homeTeam.record}</p>
                    <div className="mt-2 flex gap-0.5 sm:gap-1 justify-center flex-wrap">
                        {game.homeTeam.recentForm.map((f, i) => (
                            <span key={i} className={f === 'W' ? 'form-badge-w' : 'form-badge-l'}>{f}</span>
                        ))}
                    </div>
                </div>
            </div>


            {isRookieModeActive ? (
                /* ── ROOKIE ODDS ROW ── */
                <div id="rookie-odds-row" className="grid grid-cols-3 gap-2 border-t border-border-muted pt-4">
                    {/* ML */}
                    <div
                        className="cursor-pointer rounded-xl p-2.5 transition-all border"
                        style={isSel('ML') ? selStyle : {}}
                        onClick={() => onAddBet({ gameId: game.id, type: 'ML', team: game.awayTeam.name, odds: game.odds.moneyline, matchupStr: `${game.awayTeam.name} @ ${game.homeTeam.name}`, stake: 10 })}
                    >
                        <div className="flex items-center gap-1 mb-1">
                            {isSel('ML') ? <span className="material-symbols-outlined text-[11px]" style={{ color: 'rgb(17,248,183)' }}>check_circle</span> : <PulsingBeacon color="yellow" />}
                            <GlossaryTooltip term="Moneyline" definition="Pick which team wins outright." example={`If ${game.awayTeam.name} win, you win.`} />
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug mb-2">{mlText}</p>
                        <RiskMeter odds={game.odds.moneyline} />
                    </div>
                    {/* Spread */}
                    <div
                        className="cursor-pointer rounded-xl p-2.5 transition-all border"
                        style={isSel('Spread') ? selStyle : {}}
                        onClick={() => onAddBet({ gameId: game.id, type: 'Spread', team: `${game.awayTeam.name} ${game.odds.spread}`, odds: '-110', matchupStr: `${game.awayTeam.name} @ ${game.homeTeam.name}`, stake: 10 })}
                    >
                        <div className="flex items-center gap-1 mb-1">
                            {isSel('Spread') ? <span className="material-symbols-outlined text-[11px]" style={{ color: 'rgb(17,248,183)' }}>check_circle</span> : <PulsingBeacon color="yellow" />}
                            <GlossaryTooltip term="Point Spread" definition="The predicted score gap." example={awaySpreadText} />
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug mb-2">{awaySpreadText}</p>
                        <RiskMeter odds="-110" />
                    </div>
                    {/* O/U */}
                    <div
                        className="cursor-pointer rounded-xl p-2.5 transition-all border"
                        style={isSel(ouPick === 'Over' ? 'Over' : 'Under') ? selStyle : {}}
                        onClick={() => onAddBet({ gameId: game.id, type: ouPick === 'Over' ? 'Over' : 'Under', team: `${ouPick} ${ouVal}`, odds: '-110', matchupStr: `${game.awayTeam.name} @ ${game.homeTeam.name}`, stake: 10 })}
                    >
                        <div className="flex items-center gap-1 mb-1">
                            {isSel(ouPick === 'Over' ? 'Over' : 'Under') ? <span className="material-symbols-outlined text-[11px]" style={{ color: 'rgb(17,248,183)' }}>check_circle</span> : <PulsingBeacon color="yellow" />}
                            <GlossaryTooltip term="Over/Under" definition="Bet on combined total score." example={ouText} />
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug mb-2">{ouText}</p>
                        <RiskMeter odds="-110" />
                    </div>
                </div>
            ) : (
                /* ── STANDARD ODDS BOXES ── */
                <div className="grid grid-cols-3 gap-3 border-t border-border-muted pt-4">
                    {/* ML */}
                    <div
                        className="odd-box cursor-pointer transition-all"
                        style={isSel('ML') ? selStyle : {}}
                        onClick={() => onAddBet({ gameId: game.id, type: 'ML', team: game.awayTeam.name, odds: game.odds.moneyline, matchupStr: `${game.awayTeam.name} @ ${game.homeTeam.name}`, stake: 50 })}
                    >
                        <span className="text-[8px] uppercase font-black" style={isSel('ML') ? { color: 'rgb(17,248,183)' } : { color: 'rgb(100,116,139)' }}>Moneyline</span>
                        <span className="text-xs font-black" style={isSel('ML') ? { color: 'rgb(17,248,183)' } : {}}>{game.odds.moneyline}</span>
                        {isSel('ML') && <span className="material-symbols-outlined text-[10px] mt-0.5" style={{ color: 'rgb(17,248,183)' }}>check</span>}
                    </div>
                    {/* Spread */}
                    <div
                        className="odd-box cursor-pointer transition-all"
                        style={isSel('Spread') ? selStyle : {}}
                        onClick={() => onAddBet({ gameId: game.id, type: 'Spread', team: `${game.awayTeam.name} ${game.odds.spread}`, odds: '-110', matchupStr: `${game.awayTeam.name} @ ${game.homeTeam.name}`, stake: 50 })}
                    >
                        <span className="text-[8px] uppercase font-black" style={isSel('Spread') ? { color: 'rgb(17,248,183)' } : { color: 'rgb(100,116,139)' }}>Spread</span>
                        <span className="text-xs font-black" style={isSel('Spread') ? { color: 'rgb(17,248,183)' } : {}}>{game.odds.spread}</span>
                        {isSel('Spread') && <span className="material-symbols-outlined text-[10px] mt-0.5" style={{ color: 'rgb(17,248,183)' }}>check</span>}
                    </div>
                    {/* O/U */}
                    <div
                        className="odd-box cursor-pointer transition-all"
                        style={isSel(game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under') ? selStyle : {}}
                        onClick={() => onAddBet({ gameId: game.id, type: game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under', team: `${game.odds.overUnder.pick} ${game.odds.overUnder.value}`, odds: '-110', matchupStr: `${game.awayTeam.name} @ ${game.homeTeam.name}`, stake: 50 })}
                    >
                        <span className="text-[8px] uppercase font-black" style={isSel(game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under') ? { color: 'rgb(17,248,183)' } : { color: 'rgb(100,116,139)' }}>O/U {game.odds.overUnder.value}</span>
                        <span className="text-xs font-black" style={isSel(game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under') ? { color: 'rgb(17,248,183)' } : {}}>{game.odds.overUnder.pick}</span>
                        {isSel(game.odds.overUnder.pick === 'Over' ? 'Over' : 'Under') && <span className="material-symbols-outlined text-[10px] mt-0.5" style={{ color: 'rgb(17,248,183)' }}>check</span>}
                    </div>
                </div>
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
                <PublicBetting game={game} onMatchDetailsClick={onSelectGame} isOpen={publicBettingOpen ?? false} onToggle={onPublicBettingToggle ?? (() => { })} />

            </div>
        </div>
    );
};
