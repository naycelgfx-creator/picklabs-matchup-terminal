import React from 'react';
import { Game } from '../../../data/mockGames';
import { NBAGameLeaders } from './NBAGameLeaders';
import { NBAShotChart } from './NBAShotChart';
import { NBATeamStats } from './NBATeamStats';
import { NBANewsAndStandings } from './NBANewsAndStandings';

import { PlayerPropsForm } from '../PlayerPropsForm';
import { BetPick } from '../../../App';

interface NBAMatchupDashboardProps {
    game: Game;
    onAddBet?: (bet: Omit<BetPick, 'id'>) => void;
}

export const NBAMatchupDashboard: React.FC<NBAMatchupDashboardProps> = ({ game, onAddBet }) => {
    return (
        <div className="space-y-6">
            <NBAGameLeaders game={game} />

            {onAddBet && (
                <div className="py-4">
                    <PlayerPropsForm game={game} onAddBet={onAddBet} />
                </div>
            )}

            <div className="grid grid-cols-12 gap-6">
                <NBAShotChart game={game} />
                <NBATeamStats game={game} />
            </div>

            <NBANewsAndStandings game={game} />
        </div>
    );
};
