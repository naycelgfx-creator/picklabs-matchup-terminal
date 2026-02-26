import React, { useState } from 'react';
import { SPORT_LOGOS } from '../../data/mockGames';
import { PlayerPropsModule } from '../props/PlayerPropsModule';
import { RosterAndStats } from './RosterAndStats';
import { TeamOverview } from './TeamOverview';
import { DepthChart } from './DepthChart';
import { TeamSchedule } from './TeamSchedule';

interface Team {
    id: string;
    name: string;
    abbr: string;
    url?: string;
    leagueSlug?: string;
    coreSport?: string;
    seasonYear?: number;
}

interface TeamDetailsProps {
    team: Team;
    sport: string;
    onBack: () => void;
}

export const TeamDetails: React.FC<TeamDetailsProps> = ({ team, sport, onBack }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'roster' | 'depth' | 'props'>('overview');

    return (
        <div className="w-full flex justify-center bg-background-dark py-8 px-6 min-h-screen">
            <div className="max-w-[1536px] w-full flex flex-col gap-6">

                {/* Back Button & Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer group"
                    >
                        <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-background-light rounded-xl flex items-center justify-center border border-border-muted p-2 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                            <img
                                src={team.url}
                                alt={team.name}
                                className="w-full h-full object-contain drop-shadow-lg"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = SPORT_LOGOS[sport];
                                }}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">{team.name}</h2>
                                {SPORT_LOGOS[sport] && (
                                    <img src={SPORT_LOGOS[sport]} alt={sport} className="w-5 h-5 opacity-60 ml-2" />
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-text-muted font-medium">
                                <span className="bg-neutral-800 px-2 flex items-center rounded text-xs gap-1 border border-border-muted">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    {sport}
                                </span>
                                <span>{team.abbr.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Navigation Tabs */}
                <div className="flex items-center gap-6 border-b border-border-muted pb-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative ${activeTab === 'overview' ? 'text-primary' : 'text-slate-500 hover:text-text-main'
                            }`}
                    >
                        Overview
                        {activeTab === 'overview' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative ${activeTab === 'schedule' ? 'text-primary' : 'text-slate-500 hover:text-text-main'
                            }`}
                    >
                        Schedule
                        {activeTab === 'schedule' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('roster')}
                        className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative ${activeTab === 'roster' ? 'text-primary' : 'text-slate-500 hover:text-text-main'
                            }`}
                    >
                        Roster & Stats
                        {activeTab === 'roster' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('depth')}
                        className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative ${activeTab === 'depth' ? 'text-primary' : 'text-slate-500 hover:text-text-main'
                            }`}
                    >
                        Depth Chart
                        {activeTab === 'depth' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('props')}
                        className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative ${activeTab === 'props' ? 'text-accent-secondary' : 'text-slate-500 hover:text-text-main'
                            }`}
                    >
                        Player Props
                        {activeTab === 'props' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-secondary rounded-t-full shadow-[0_0_10px_rgba(0,255,255,0.5)]"></div>
                        )}
                    </button>
                </div>

                {/* Content Area */}
                <div className="animate-fade-in py-2">
                    {activeTab === 'overview' && (
                        <TeamOverview teamName={team.name} sport={sport} />
                    )}

                    {activeTab === 'schedule' && (
                        <TeamSchedule teamName={team.name} sport={sport} />
                    )}

                    {activeTab === 'roster' && (
                        <RosterAndStats teamName={team.name} sport={sport} team={team} />
                    )}

                    {activeTab === 'depth' && (
                        <DepthChart teamName={team.name} sport={sport} team={team} />
                    )}

                    {activeTab === 'props' && (
                        <PlayerPropsModule sport={sport} team={team} />
                    )}
                </div>

            </div>
        </div>
    );
};
