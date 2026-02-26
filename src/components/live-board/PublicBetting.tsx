import React, { useState } from 'react';
import { Game } from '../../data/mockGames';

interface PublicBettingProps {
    game: Game;
    onMatchDetailsClick?: () => void;
}

export const PublicBetting: React.FC<PublicBettingProps> = ({ game, onMatchDetailsClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Simple deterministic PRNG based on string hash for stable random numbers per game
    const pseudoRandom = (seedStr: string) => {
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            hash = Math.imul(31, hash) + seedStr.charCodeAt(i) | 0;
        }
        hash = Math.imul(1597334677, hash);
        return ((hash ^ hash >>> 15) & 255) / 256;
    };

    // Generate random but deterministic percentages
    const generateStats = (seed: string) => {
        const betPct = Math.floor(40 + pseudoRandom(seed + 'bets') * 40);
        const moneyPct = Math.floor(35 + pseudoRandom(seed + 'money') * 50);
        return {
            awayBets: betPct,
            homeBets: 100 - betPct,
            awayMoney: moneyPct,
            homeMoney: 100 - moneyPct
        };
    };

    const mlStats = generateStats(game.matchupId + 'ml');
    const spreadStats = generateStats(game.matchupId + 'spread');

    // For O/U, away is Over, home is Under
    const ouStats = generateStats(game.matchupId + 'ou');

    const getWidthClass = (pct: number) => {
        const rounded = Math.round(pct / 5) * 5;
        const widthMap: Record<number, string> = {
            0: 'w-0', 5: 'w-[5%]', 10: 'w-[10%]', 15: 'w-[15%]', 20: 'w-[20%]',
            25: 'w-1/4', 30: 'w-[30%]', 35: 'w-[35%]', 40: 'w-[40%]', 45: 'w-[45%]',
            50: 'w-1/2', 55: 'w-[55%]', 60: 'w-[60%]', 65: 'w-[65%]', 70: 'w-[70%]',
            75: 'w-3/4', 80: 'w-[80%]', 85: 'w-[85%]', 90: 'w-[90%]', 95: 'w-[95%]', 100: 'w-full'
        };
        return widthMap[rounded] || 'w-1/2';
    };

    const renderProgressBar = (leftPct: number, rightPct: number, leftColor: string, rightColor: string) => (
        <div className="flex w-full h-1 mt-1 gap-1">
            <div className={`h-full rounded-l-full ${leftColor} ${getWidthClass(leftPct)}`}></div>
            <div className={`h-full rounded-r-full ${rightColor} ${getWidthClass(rightPct)}`}></div>
        </div>
    );

    const awayColor = "bg-blue-600";
    const homeColor = "bg-yellow-500";
    const overColor = "bg-emerald-500";
    const underColor = "bg-blue-600";

    return (
        <div className="w-full flex flex-col font-sans">
            {/* Header Row */}
            <div className="flex justify-between items-center bg-white dark:bg-neutral-900/40 py-2 px-4 border-t border-border-muted cursor-pointer hover:bg-white dark:bg-neutral-900/40 transition-colors"
                onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-2 group">
                    <span className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-widest group-hover:text-white transition-colors">
                        Public Betting
                    </span>
                    <span className={`material-symbols-outlined text-text-muted text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </div>
                {onMatchDetailsClick && (
                    <div
                        onClick={(e) => { e.stopPropagation(); onMatchDetailsClick(); }}
                        className="flex items-center gap-1 group cursor-pointer"
                    >
                        <span className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-widest group-hover:text-white transition-colors">
                            Match Details
                        </span>
                        <span className="material-symbols-outlined text-text-muted text-sm group-hover:text-white transition-colors">
                            chevron_right
                        </span>
                    </div>
                )}
            </div>

            {/* Expanded Content */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white dark:bg-neutral-900/40 overflow-hidden transition-all duration-300 ease-in-out px-4 ${isOpen ? 'max-h-[800px] py-4 border-t border-border-dark' : 'max-h-0 py-0'}`}>

                {/* Money Line */}
                <div className="flex flex-col gap-3 lg:border-r border-border-dark lg:pr-6">
                    <div className="flex justify-between items-center mb-1">
                        <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = game.sportLogo; }} />
                        <span className="text-xs font-bold text-text-muted">Money Line</span>
                        <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = game.sportLogo; }} />
                    </div>

                    <div>
                        <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-white">{mlStats.awayBets}%</span>
                            <span className="text-slate-500">% of Bets</span>
                            <span className="text-white">{mlStats.homeBets}%</span>
                        </div>
                        {renderProgressBar(mlStats.awayBets, mlStats.homeBets, awayColor, homeColor)}
                    </div>

                    <div>
                        <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-white">{mlStats.awayMoney}%</span>
                            <span className="text-slate-500">% of Money</span>
                            <span className="text-white">{mlStats.homeMoney}%</span>
                        </div>
                        {renderProgressBar(mlStats.awayMoney, mlStats.homeMoney, awayColor, homeColor)}
                    </div>
                </div>

                {/* Spread */}
                <div className="flex flex-col gap-3 lg:border-r border-border-dark lg:pr-6">
                    <div className="flex justify-between items-center mb-1">
                        <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = game.sportLogo; }} />
                        <span className="text-xs font-bold text-text-muted">Spread</span>
                        <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = game.sportLogo; }} />
                    </div>

                    <div>
                        <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-white">{spreadStats.awayBets}%</span>
                            <span className="text-slate-500">% of Bets</span>
                            <span className="text-white">{spreadStats.homeBets}%</span>
                        </div>
                        {renderProgressBar(spreadStats.awayBets, spreadStats.homeBets, awayColor, homeColor)}
                    </div>

                    <div>
                        <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-white">{spreadStats.awayMoney}%</span>
                            <span className="text-slate-500">% of Money</span>
                            <span className="text-white">{spreadStats.homeMoney}%</span>
                        </div>
                        {renderProgressBar(spreadStats.awayMoney, spreadStats.homeMoney, awayColor, homeColor)}
                    </div>
                </div>

                {/* Total O/U */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-text-main uppercase tracking-wider">Over</span>
                        <span className="text-xs font-bold text-text-muted">Total O/U</span>
                        <span className="text-xs font-bold text-text-main uppercase tracking-wider">Under</span>
                    </div>

                    <div>
                        <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-white">{ouStats.awayBets}%</span>
                            <span className="text-slate-500">% of Bets</span>
                            <span className="text-white">{ouStats.homeBets}%</span>
                        </div>
                        {renderProgressBar(ouStats.awayBets, ouStats.homeBets, overColor, underColor)}
                    </div>

                    <div>
                        <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-white">{ouStats.awayMoney}%</span>
                            <span className="text-slate-500">% of Money</span>
                            <span className="text-white">{ouStats.homeMoney}%</span>
                        </div>
                        {renderProgressBar(ouStats.awayMoney, ouStats.homeMoney, overColor, underColor)}
                    </div>
                </div>

            </div>
        </div>
    );
};
