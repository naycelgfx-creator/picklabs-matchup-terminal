import React from 'react';
import { ArbitrageFinder } from './ArbitrageFinder';
import { EVOpportunities } from './EVOpportunities';
import { SharpFlow } from './SharpFlow';
import { ActiveSharpMatchups } from './ActiveSharpMatchups';
import { SharpIntelligenceFeed } from './SharpIntelligenceFeed';
import { Game } from '../../data/mockGames';

export const SharpToolsView: React.FC<{ selectedGame?: Game | null }> = ({ selectedGame }) => {
    return (
        <main className="max-w-[1440px] mx-auto p-6 space-y-6">
            <div className="grid grid-cols-12 gap-6">
                <ArbitrageFinder />
                <EVOpportunities />
                <SharpFlow />
            </div>

            <div className="grid grid-cols-12 gap-6">
                <ActiveSharpMatchups game={selectedGame} />
                <SharpIntelligenceFeed />
            </div>
        </main>
    );
};
