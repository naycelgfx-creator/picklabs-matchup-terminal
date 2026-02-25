import React, { useState, useEffect } from 'react';
import { Game } from '../../data/mockGames';
import { generateMockPlayers, Player } from '../../data/mockPlayers';
import { BetPick } from '../../App';
import { RookieTooltip } from '../ui/RookieTooltip';

interface PlayerPropsFormProps {
    game: Game;
    onAddBet: (bet: BetPick) => void;
}

export const PlayerPropsForm: React.FC<PlayerPropsFormProps> = ({ game, onAddBet }) => {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        // Regenerate mock players whenever the game changes
        const away = generateMockPlayers(game.awayTeam.name, game.sport, 5);
        const home = generateMockPlayers(game.homeTeam.name, game.sport, 5);
        const allPlayers = [...away, ...home];
        setPlayers(allPlayers);
    }, [game]);

    if (players.length === 0) return null;

    const handleAddProp = (player: Player, propType: string, position: 'Over' | 'Under', line: number, odds: string) => {
        const bet: BetPick = {
            id: `prop-${Date.now()}`,
            gameId: game.id,
            type: 'Prop',
            team: `${player.name} ${position} ${line} ${propType}`,
            odds: odds,
            matchupStr: `${game.awayTeam.name} @ ${game.homeTeam.name}`,
            stake: 25.00
        };
        onAddBet(bet);
    };

    return (
        <div className="terminal-panel overflow-hidden">
            <div className="p-4 border-b border-border-muted flex justify-between items-center bg-white/5">
                <h3 className="text-xs font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-purple text-sm">person_search</span>
                    Player Prop Form (Last 5 Games)
                </h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-[9px] text-text-muted font-bold uppercase">Over</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-[9px] text-text-muted font-bold uppercase">Under</span>
                    </div>
                </div>
            </div>

            <div className="p-6 overflow-x-auto custom-scrollbar">
                <div className="flex gap-6 min-w-max">
                    {players.map(player => {
                        // For demonstration, we'll just look at their primary prop
                        const prop = player.props[0];
                        if (!prop) return null;

                        // Calculate trend
                        const overs = player.recentLogs.filter(log => log.stat1 > prop.line).length;
                        const isHot = overs >= 3;

                        return (
                            <div key={player.id} className="w-[320px] bg-neutral-800/40 border border-border-muted rounded-xl p-4 hover:border-accent-purple/50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="text-sm font-black text-text-main uppercase tracking-wide">{player.name}</h4>
                                        <p className={`text-[10px] ${isHot ? 'text-primary' : 'text-accent-purple'} font-bold uppercase cursor-pointer hover:underline`}
                                            onClick={() => handleAddProp(player, prop.type, isHot ? 'Over' : 'Under', prop.line, isHot ? prop.overOdds : prop.underOdds)}
                                            title={`Click to add ${isHot ? 'Over' : 'Under'} ${prop.line} bet`}
                                        >
                                            {prop.type} Prop: {prop.line}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] px-2 py-0.5 ${isHot ? 'bg-primary/10 text-primary border-primary/30' : 'bg-accent-purple/10 text-accent-purple border-accent-purple/30'} border rounded font-black uppercase`}>
                                            Trend: {overs}/5 Over
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-2 mt-4">
                                    {player.recentLogs.map((log) => {
                                        const isOver = log.stat1 > prop.line;
                                        return (
                                            <div key={log.id} className="flex flex-col items-center gap-1">
                                                <RookieTooltip
                                                    title={isOver ? "Hit!" : "Miss!"}
                                                    description={`In the game against ${log.opponent}, ${player.name} recorded ${log.stat1} ${prop.type}, which is ${isOver ? 'OVER' : 'UNDER'} the current line of ${prop.line}.`}
                                                    position="top"
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border-2 cursor-help transition-transform hover:scale-110 ${isOver ? 'bg-primary text-black border-primary/20' : 'bg-red-500 text-white border-red-500/20'}`}>
                                                        {log.stat1}
                                                    </div>
                                                </RookieTooltip>
                                                <span className="text-[8px] text-slate-500 font-bold max-w-[40px] truncate text-center" title={log.opponent}>
                                                    {log.opponent}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
