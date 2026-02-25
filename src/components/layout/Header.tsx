import React, { useState, useEffect } from 'react';
import { useRookieMode } from '../../contexts/RookieModeContext';

type ViewType = 'live-board' | 'matchup-terminal' | 'sharp-tools' | 'bankroll' | 'teams-directory' | 'popular-bets' | 'saved-picks' | 'value-finder';

interface HeaderProps {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
    onAIPick?: () => void;
    isAIPickLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onAIPick, isAIPickLoading = false }) => {
    const { isRookieModeActive, toggleRookieMode } = useRookieMode();
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return true;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, [isDark]);

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [currentView]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // Hide if scrolling down past 50px, show if scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 border-b border-border-muted bg-background-dark/90 backdrop-blur-md px-6 py-3 transition-transform duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-[1536px] mx-auto flex items-center justify-between">

                <div className="flex items-center gap-10">
                    <a
                        className="flex items-center gap-3 text-primary cursor-pointer group"
                        onClick={(e) => { e.preventDefault(); setCurrentView('landing-page' as ViewType); }}
                    >
                        <img
                            src="/picklabs-logo.svg"
                            alt="Logo"
                            className="h-8 w-auto mr-1 transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(34,197,94,0.6)] group-hover:scale-105"
                        />
                    </a>

                    <nav className="hidden xl:flex items-center gap-8">
                        <a
                            className={`text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${currentView === 'live-board'
                                ? 'text-primary border-b-2 border-primary pb-1'
                                : 'text-text-muted hover:text-primary'
                                }`}
                            onClick={(e) => { e.preventDefault(); setCurrentView('live-board'); }}
                        >
                            Live Board
                        </a>
                        <a
                            className={`text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${currentView === 'matchup-terminal'
                                ? 'text-primary border-b-2 border-primary pb-1'
                                : 'text-text-muted hover:text-primary'
                                }`}
                            onClick={(e) => { e.preventDefault(); setCurrentView('matchup-terminal'); }}
                        >
                            Matchup Terminal
                        </a>
                        <a
                            className={`text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${currentView === 'teams-directory'
                                ? 'text-primary border-b-2 border-primary pb-1'
                                : 'text-text-muted hover:text-primary'
                                }`}
                            onClick={(e) => { e.preventDefault(); setCurrentView('teams-directory'); }}
                        >
                            Teams
                        </a>
                        <a
                            className={`text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${currentView === 'sharp-tools'
                                ? 'text-primary border-b-2 border-primary pb-1'
                                : 'text-text-muted hover:text-primary'
                                }`}
                            onClick={(e) => { e.preventDefault(); setCurrentView('sharp-tools'); }}
                        >
                            Sharp Tools
                        </a>
                        <a
                            className={`text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${currentView === 'bankroll'
                                ? 'text-primary border-b-2 border-primary pb-1'
                                : 'text-text-muted hover:text-primary'
                                }`}
                            onClick={(e) => { e.preventDefault(); setCurrentView('bankroll'); }}
                        >
                            Bankroll
                        </a>
                        <div className="h-4 w-px bg-border-muted mx-2"></div>
                        <a
                            className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${currentView === 'popular-bets'
                                ? 'text-orange-500 border-b-2 border-orange-500 pb-1'
                                : 'text-orange-500/70 hover:text-orange-400'
                                }`}
                            onClick={(e) => { e.preventDefault(); setCurrentView('popular-bets'); }}
                        >
                            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                            Popular
                        </a>
                        <a
                            className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${currentView === 'saved-picks'
                                ? 'text-primary border-b-2 border-primary pb-1'
                                : 'text-text-muted hover:text-primary'
                                }`}
                            onClick={(e) => { e.preventDefault(); setCurrentView('saved-picks'); }}
                        >
                            <span className="material-symbols-outlined text-[14px]">bookmark</span>
                            Saved
                        </a>
                        <a
                            className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${currentView === 'value-finder'
                                ? 'text-accent-blue border-b-2 border-accent-blue pb-1'
                                : 'text-text-muted hover:text-accent-blue'
                                }`}
                            onClick={(e) => { e.preventDefault(); setCurrentView('value-finder'); }}
                        >
                            <span className="material-symbols-outlined text-[14px]">manage_search</span>
                            Value Finder
                        </a>
                    </nav>
                </div>

                <div className="flex items-center gap-2 md:gap-4 xl:gap-6">

                    <button
                        onClick={toggleRookieMode}
                        className={`hidden md:flex items-center gap-2 px-4 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 ${isRookieModeActive
                            ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                            : 'bg-neutral-800 text-slate-500 border-border-muted hover:text-white'
                            }`}
                        title={isRookieModeActive ? "Disable Rookie Mode" : "Turn on Rookie Mode for helpful tips!"}
                    >
                        <span className="material-symbols-outlined text-sm">{isRookieModeActive ? 'school' : 'help_center'}</span>
                        <span>Rookie Mode</span>
                    </button>

                    <button
                        onClick={onAIPick}
                        disabled={isAIPickLoading}
                        className={`hidden md:flex items-center gap-2 px-4 py-2 bg-accent-purple/20 border border-accent-purple/40 rounded-full text-accent-purple text-[10px] font-black uppercase tracking-widest hover:bg-accent-purple hover:text-white transition-all transform hover:scale-105 active:scale-95 ${isAIPickLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <span className={`material-symbols-outlined text-sm ${isAIPickLoading ? 'animate-spin' : ''}`}>smart_toy</span>
                        <span>{isAIPickLoading ? 'Analyzing...' : 'AI Pick My Bets'}</span>
                    </button>

                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="hidden md:flex h-8 w-8 rounded bg-neutral-800 border border-border-muted items-center justify-center cursor-pointer hover:bg-neutral-800/70 transition-colors text-text-muted hover:text-text-main"
                        title="Toggle Theme"
                        aria-label="Toggle Theme"
                    >
                        <span className="material-symbols-outlined text-sm">
                            {isDark ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    <div className="hidden md:flex h-8 w-8 rounded bg-neutral-800 border border-border-muted items-center justify-center cursor-pointer hover:bg-neutral-800/70 transition-colors text-text-muted hover:text-text-main">
                        <span className="material-symbols-outlined text-sm">settings</span>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="xl:hidden h-10 w-10 flex items-center justify-center rounded-lg bg-neutral-800 border border-border-muted text-text-main hover:bg-neutral-700 transition"
                    >
                        <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>

            </div>

            {/* Mobile/Tablet Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="xl:hidden absolute top-full left-0 right-0 bg-background-dark/95 backdrop-blur-xl border-b border-border-muted shadow-2xl p-6 flex flex-col gap-6 max-h-[calc(100vh-60px)] overflow-y-auto">
                    <nav className="flex flex-col gap-4">
                        <a className={`text-sm font-bold uppercase tracking-widest cursor-pointer transition ${currentView === 'live-board' ? 'text-primary' : 'text-text-muted hover:text-white'}`} onClick={(e) => { e.preventDefault(); setCurrentView('live-board'); }}>Live Board</a>
                        <a className={`text-sm font-bold uppercase tracking-widest cursor-pointer transition ${currentView === 'matchup-terminal' ? 'text-primary' : 'text-text-muted hover:text-white'}`} onClick={(e) => { e.preventDefault(); setCurrentView('matchup-terminal'); }}>Matchup Terminal</a>
                        <a className={`text-sm font-bold uppercase tracking-widest cursor-pointer transition ${currentView === 'teams-directory' ? 'text-primary' : 'text-text-muted hover:text-white'}`} onClick={(e) => { e.preventDefault(); setCurrentView('teams-directory'); }}>Teams</a>
                        <a className={`text-sm font-bold uppercase tracking-widest cursor-pointer transition ${currentView === 'sharp-tools' ? 'text-primary' : 'text-text-muted hover:text-white'}`} onClick={(e) => { e.preventDefault(); setCurrentView('sharp-tools'); }}>Sharp Tools</a>
                        <a className={`text-sm font-bold uppercase tracking-widest cursor-pointer transition ${currentView === 'bankroll' ? 'text-primary' : 'text-text-muted hover:text-white'}`} onClick={(e) => { e.preventDefault(); setCurrentView('bankroll'); }}>Bankroll</a>
                        <div className="h-px bg-border-muted my-2"></div>
                        <a className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest cursor-pointer transition ${currentView === 'popular-bets' ? 'text-orange-500' : 'text-orange-500/70 hover:text-orange-400'}`} onClick={(e) => { e.preventDefault(); setCurrentView('popular-bets'); }}>
                            <span className="material-symbols-outlined text-sm">local_fire_department</span> Popular Bets
                        </a>
                        <a className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest cursor-pointer transition ${currentView === 'saved-picks' ? 'text-primary' : 'text-text-muted hover:text-white'}`} onClick={(e) => { e.preventDefault(); setCurrentView('saved-picks'); }}>
                            <span className="material-symbols-outlined text-sm">bookmark</span> Saved Picks
                        </a>
                        <a className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest cursor-pointer transition ${currentView === 'value-finder' ? 'text-accent-blue' : 'text-text-muted hover:text-white'}`} onClick={(e) => { e.preventDefault(); setCurrentView('value-finder'); }}>
                            <span className="material-symbols-outlined text-sm">manage_search</span> Value Finder
                        </a>
                    </nav>

                    <div className="md:hidden h-px bg-border-muted w-full my-2"></div>

                    <div className="md:hidden flex flex-col gap-4">
                        <button onClick={toggleRookieMode} className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg text-xs font-black uppercase tracking-widest transition ${isRookieModeActive ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50' : 'bg-neutral-800 text-slate-500 border-border-muted hover:text-white'}`}>
                            <span className="material-symbols-outlined text-sm">{isRookieModeActive ? 'school' : 'help_center'}</span>
                            Rookie Mode {isRookieModeActive ? 'ON' : 'OFF'}
                        </button>

                        <button onClick={onAIPick} disabled={isAIPickLoading} className={`flex items-center justify-center gap-2 px-4 py-3 bg-accent-purple/20 border border-accent-purple/40 rounded-lg text-accent-purple hover:bg-accent-purple hover:text-white transition text-xs font-black uppercase tracking-widest ${isAIPickLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            <span className={`material-symbols-outlined text-sm ${isAIPickLoading ? 'animate-spin' : ''}`}>smart_toy</span>
                            {isAIPickLoading ? 'Analyzing...' : 'AI Pick My Bets'}
                        </button>

                        <button onClick={() => setIsDark(!isDark)} className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 border border-border-muted hover:text-white transition rounded-lg text-text-muted text-xs font-black uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm">{isDark ? 'light_mode' : 'dark_mode'}</span>
                            {isDark ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};
