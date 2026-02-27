import React, { useState } from 'react';
import { Footer } from '../layout/Footer';
import { isAuthValid } from '../../utils/auth';
import { GlowingEffect } from '../ui/glowing-effect';

type ViewType = 'live-board' | 'matchup-terminal' | 'sharp-tools' | 'bankroll' | 'teams-directory' | 'popular-bets' | 'saved-picks' | 'value-finder' | 'landing-page' | 'login-page';

interface LandingPageViewProps {
    onNavigate: (view: ViewType) => void;
}

const MARQUEE_LOGOS = [
    { name: 'FanDuel', domain: 'fanduel.com' },
    { name: 'DraftKings', domain: 'draftkings.com' },
    { name: 'BetMGM', domain: 'betmgm.com' },
    { name: 'Caesars', domain: 'caesars.com' },
    { name: 'Bet365', domain: 'bet365.com' },
    { name: 'Kalshi', domain: 'kalshi.com' },
    { name: 'Underdog', domain: 'underdogfantasy.com' },
    { name: 'theScore Bet', domain: 'thescore.com' },
    { name: 'BetRivers', domain: 'betrivers.com' },
    { name: 'Fliff', domain: 'getfliff.com' },
    { name: 'Sleeper', domain: 'sleeper.com' },
    { name: 'Novig', domain: 'novig.us' },
    { name: 'ProphetX', domain: 'prophetx.co' },
    { name: 'PrizePicks', domain: 'prizepicks.com' },
    { name: 'Hard Rock', domain: 'hardrock.bet' }
];

const BETTING_STRATEGIES = [
    { title: 'NFL Betting', logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png', desc: 'Simulate weather impacts, offensive line grades, and sharp money flow to find high-value spreads and player props.' },
    { title: 'NBA Betting', logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/nba.png', desc: 'Track usage rates, minutes projections, and defensive matchups to beat the closing line on over/under markets.' },
    { title: 'MLB Betting', logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png', desc: 'Leverage deep pitch-type data and batter vs pitcher (BvP) metrics to uncover strikeout and total base props.' },
    { title: 'NHL Betting', logo: 'https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png', desc: 'Utilize expected goals (xG), high-danger chances, and goalie form to find the edge on pucklines and totals.' },
    { title: 'College Football', logo: 'https://www.google.com/s2/favicons?domain=cbssports.com&sz=128', desc: 'Exploit inefficiencies in lower-tier conferences and leverage advanced metrics to predict blowout scenarios.' },
    { title: 'College Basketball', logo: 'https://www.google.com/s2/favicons?domain=sports.yahoo.com&sz=128', desc: 'Analyze tempo, offensive efficiency, and home court advantage for precise spread and total predictions.' },
    { title: 'Soccer Betting', logo: 'https://www.google.com/s2/favicons?domain=sports.yahoo.com&sz=128', desc: 'Evaluate expected goals, possession stats, and team form to find value in 3-way moneylines and Asian handicaps.' },
    { title: 'Positive EV Betting', icon: 'query_stats', useIcon: true, desc: 'Scan across 20+ sportsbooks to find odds discrepancies and mathematically profitable (+EV) betting opportunities.' }
];

const AI_HELPERS = [
    { title: 'Player Props', icon: 'person', desc: 'Our AI analyzes thousands of historical games, parsing minute details like usage rate and matchup defense to predict exact player performance.' },
    { title: 'Team Props', icon: 'groups', desc: 'The generator evaluates team-wide metrics, weather conditions, and coaching tendencies to predict team totals and specific milestone achievements.' },
    { title: 'Game Lines', icon: 'sports_score', desc: 'Neural networks simulate the match over 10,000 times to formulate a highly accurate projected score, highlighting value on the spread or moneyline.' },
    { title: 'Parlays', icon: 'account_tree', desc: 'Intelligently identifies correlated outcomes (e.g., QB passing yards + WR receiving yards) to construct mathematically sound Same Game Parlays.' }
];

const COMMUNITY_REVIEWS = [
    { name: 'Ryan M.', platform: 'App Store', logo: 'https://www.google.com/s2/favicons?domain=apple.com&sz=128', text: '"Absolutely game changing. The AI terminal found two props I would have completely missed. Paid for itself on day one."', rating: 5 },
    { name: 'SharpShooter99', platform: 'Discord', logo: 'https://www.google.com/s2/favicons?domain=discord.com&sz=128', text: '"The community here is unmatched. The correlation matrix tools are what pros use, now available to us. Crazy value."', rating: 5 },
    { name: 'AlexTheBettor', platform: 'Twitter', logo: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=128', text: '"PickLabs just saved me from a massive bad beat by alerting me to a sharp money move against my team. Unreal." - @AlexTheBettor', rating: 5 },
    { name: 'Sammy_Sports', platform: 'Instagram', logo: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=128', text: '"Every single morning starts by checking the PickLabs terminal. The UI is sleek and the stats are deadly accurate. 🔥"', rating: 5 },
    { name: 'David L.', platform: 'App Store', logo: 'https://www.google.com/s2/favicons?domain=apple.com&sz=128', text: '"Finally an app that gives real data without the fluff. The +EV scanner prints. Period."', rating: 5 },
    { name: 'VegasInsider0', platform: 'Twitter', logo: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=128', text: '"Their model on NBA totals is hitting at ~62% this week. Unprecedented consistency from an AI tool. Highly recommend." - @VegasInsider0', rating: 5 },
    { name: 'PropKing', platform: 'Discord', logo: 'https://www.google.com/s2/favicons?domain=discord.com&sz=128', text: '"Joined the Discord, tailed the top 3 EV plays, woke up to green. Best investment I\'ve made all year."', rating: 5 },
    { name: 'Sarah J.', platform: 'App Store', logo: 'https://www.google.com/s2/favicons?domain=apple.com&sz=128', text: '"I was losing money blindly tailing picks online. Now I have the terminal to actually back up my bets with math. 5 stars."', rating: 5 }
];

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onNavigate }) => {
    const [isAnnual, setIsAnnual] = useState(false);

    const ALL_FEATURES = [
        "Trending Insights", "Thousands of Props & Games", "Advanced Visuals", "Injury Reports",
        "Odds Comparison", "Real Time Betting Alerts", "Real Time Odds Movement Charts",
        "EV+ Bet Indicators", "Positive EV Power Feed", "Sharp Book Odds", "Boost Index",
        "Arbitrage Feed", "Middle Betting"
    ];

    const PREMIUM_FEATURES = [
        "Trending Insights", "Thousands of Props & Games", "Advanced Visuals", "Injury Reports",
        "Odds Comparison", "Real Time Betting Alerts"
    ];

    const PREMIUM_PLUS_FEATURES = [
        ...PREMIUM_FEATURES,
        "Real Time Odds Movement Charts", "EV+ Bet Indicators"
    ];

    const handleScrollToPricing = (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById('pricing');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="overflow-x-hidden w-full font-display bg-background-dark text-slate-100 min-h-screen selection:bg-primary selection:text-black">
            <header className="px-6 py-8 max-w-7xl mx-auto flex items-center justify-between">
                <a className="brand-logo flex items-center gap-3 w-fit group" href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing-page'); }}>
                    <img
                        src="/picklabs-full-logo.svg"
                        alt="PickLabs Logo"
                        className="h-10 w-auto transition-transform duration-300 drop-shadow-[0_0_15px_rgba(13,242,13,0.3)] hover:scale-105"
                    />
                </a>
                <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <a className="hover:text-primary transition-colors" href="#how-it-works">How It Works</a>
                    <a className="hover:text-primary transition-colors" href="#pricing">Pricing</a>
                    <a className="hover:text-primary transition-colors" href="#how-it-works">Data Feed</a>
                    <a className="hover:text-primary transition-colors" href="#pricing">API</a>
                </nav>
                <button
                    onClick={() => onNavigate('login-page')}
                    className="px-6 py-2 bg-neutral-800 border border-border-muted rounded-full text-[10px] font-black uppercase tracking-widest text-text-main hover:border-primary/50 transition-all">
                    Login
                </button>
            </header>

            <section className="relative pt-20 pb-16 px-6 hero-gradient">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple text-[10px] font-black uppercase tracking-widest mb-4">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        v4.2 AI Simulation Engine Now Live
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tight text-text-main leading-tight">
                        Predict the <span className="text-primary">Unpredictable.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                        Professional-grade sports simulations and sharp betting alerts powered by proprietary neural networks. Built for the modern bettor.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={handleScrollToPricing}
                            className="w-full md:w-auto px-10 py-5 bg-primary text-black font-black uppercase tracking-[0.2em] italic rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(13,242,13,0.3)]">
                            Start 7-Day Free Trial
                        </button>
                        <button
                            onClick={() => onNavigate(isAuthValid() ? 'live-board' : 'login-page')}
                            className="w-full md:w-auto px-10 py-5 bg-slate-900 dark:bg-neutral-900 border border-neutral-700 text-white font-black uppercase tracking-[0.2em] italic rounded-xl hover:bg-black dark:hover:bg-neutral-800 transition-all">
                            View Live Board
                        </button>
                    </div>
                </div>
            </section>

            <div className="bg-background-dark border-y border-border-muted py-4 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Available on Windows, Mac, Android, and iOS</p>
                    <div className="flex items-center gap-6 text-text-main drop-shadow-[0_0_12px_rgba(0,0,0,0.2)] dark:text-white dark:drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">laptop_windows</span>
                            <span className="text-[9px] font-bold uppercase tracking-tighter">Windows</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">desktop_mac</span>
                            <span className="text-[9px] font-bold uppercase tracking-tighter">macOS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">android</span>
                            <span className="text-[9px] font-bold uppercase tracking-tighter">Android</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">phone_iphone</span>
                            <span className="text-[9px] font-bold uppercase tracking-tighter">iOS</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="marquee-container">
                <div className="marquee-content">
                    <div className="flex items-center gap-20">
                        {[...Array(2)].map((_, idx) => (
                            <React.Fragment key={idx}>
                                {MARQUEE_LOGOS.map((logo, logoIdx) => (
                                    <div key={logoIdx} className="marquee-logo-item flex items-center gap-3 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default hover:drop-shadow-[0_0_15px_rgba(13,242,13,0.3)] min-w-max">
                                        <img src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=128`} alt={logo.name} className="w-8 h-8 rounded-lg" />
                                        <span className="font-black italic text-xl uppercase whitespace-nowrap">{logo.name}</span>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-32 border-b border-border-muted">
                <div className="mb-20">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-4">The Methodology</h3>
                    <h2 className="text-4xl md:text-5xl font-black italic uppercase text-text-main">How It Works</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="terminal-panel p-8 group border-primary/10 relative">
                        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <span className="material-symbols-outlined">hub</span>
                        </div>
                        <h4 className="text-lg font-black italic uppercase text-text-main mb-3 leading-tight">Neural Network Simulations</h4>
                        <p className="text-sm text-slate-500 mb-6 font-medium">Proprietary engines running 10k+ game runs per matchup.</p>
                        <ul className="space-y-2">
                            <li className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full"></span> Monte Carlo v4.2
                            </li>
                            <li className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full"></span> Live Roster Sync
                            </li>
                        </ul>
                    </div>

                    <div className="terminal-panel p-8 group border-accent-purple/10 relative">
                        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                        <div className="w-12 h-12 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple mb-6 group-hover:bg-accent-purple group-hover:text-white transition-all">
                            <span className="material-symbols-outlined">visibility</span>
                        </div>
                        <h4 className="text-lg font-black italic uppercase text-white mb-3 leading-tight">Sharp & Whale Intelligence</h4>
                        <p className="text-sm text-slate-500 mb-6 font-medium">Tracking pro money movements and large volume signals.</p>
                        <ul className="space-y-2">
                            <li className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-accent-purple rounded-full"></span> Money Flow Heatmaps
                            </li>
                            <li className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-accent-purple rounded-full"></span> Vegas Line Alerts
                            </li>
                        </ul>
                    </div>
                    <div className="terminal-panel p-8 group border-accent-blue/10 relative">
                        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                        <div className="w-12 h-12 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-6 group-hover:bg-accent-blue group-hover:text-white transition-all">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <h4 className="text-lg font-black italic uppercase text-text-main mb-3 leading-tight">Stat-Prop Engine</h4>
                        <p className="text-sm text-slate-500 mb-6 font-medium">Historical player performance mapped against defenses.</p>
                        <ul className="space-y-2">
                            <li className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-accent-blue rounded-full"></span> Micro-Trend Analysis
                            </li>
                            <li className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-accent-blue rounded-full"></span> Value-Prop Alerts
                            </li>
                        </ul>
                    </div>
                    <div className="terminal-panel p-8 group border-primary/10 relative">
                        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                            <span className="material-symbols-outlined">balance</span>
                        </div>
                        <h4 className="text-lg font-black italic uppercase text-white mb-3 leading-tight">Arbitrage & EV+ Tools</h4>
                        <p className="text-sm text-slate-500 mb-6 font-medium">Finding market inefficiencies across 20+ sportsbooks.</p>
                        <ul className="space-y-2">
                            <li className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full"></span> Real-time EV Scanning
                            </li>
                            <li className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full"></span> Multi-Book Arbs
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-32 border-b border-border-muted relative">
                <div className="absolute top-0 right-0 w-full h-full bg-primary/5 pointer-events-none blur-[120px] rounded-full scale-150 transform -translate-y-1/2 opacity-20"></div>
                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase text-text-main tracking-tight">
                        Become a <span className="text-primary">Smarter</span> Sports Bettor
                    </h2>
                    <p className="text-text-muted mt-4 max-w-2xl mx-auto text-sm md:text-base">
                        Unlock professional-grade intelligence and distinct strategic advantages across all major global sports leagues with our advanced AI tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {BETTING_STRATEGIES.map((strategy, idx) => (
                        <div key={idx} className="terminal-panel p-6 bg-neutral-900/40 hover:bg-neutral-800 transition-colors border-border-muted hover:border-primary/30 group relative">
                            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                            <div className="w-14 h-14 bg-neutral-900 rounded-lg border border-border-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {strategy.useIcon ? (
                                    <span className="material-symbols-outlined text-primary text-3xl font-light">{strategy.icon}</span>
                                ) : (
                                    <img src={strategy.logo} alt={strategy.title} className="w-10 h-10 object-contain" />
                                )}
                            </div>
                            <h4 className="text-lg font-black uppercase text-text-main mb-2 tracking-wide group-hover:text-primary transition-colors">{strategy.title}</h4>
                            <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                                {strategy.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 relative z-10 border-t border-border-muted pt-16">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-black italic uppercase text-text-main tracking-tight">
                            AI-Generated <span className="text-accent-purple">Helpers</span>
                        </h3>
                        <p className="text-text-muted mt-2 text-sm max-w-xl mx-auto">
                            Our proprietary neural networks instantly formulate predictions across four core betting markets.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {AI_HELPERS.map((helper, idx) => (
                            <div key={idx} className="terminal-panel p-6 bg-accent-purple/5 border border-accent-purple/20 hover:border-accent-purple/50 transition-colors flex flex-col items-center text-center group relative">
                                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                                <div className="w-12 h-12 rounded-full bg-accent-purple/10 flex items-center justify-center mb-4 group-hover:bg-accent-purple group-hover:text-black transition-colors">
                                    <span className="material-symbols-outlined text-accent-purple group-hover:text-black text-2xl">{helper.icon}</span>
                                </div>
                                <h4 className="text-lg font-black uppercase text-text-main mb-3 tracking-wider">{helper.title}</h4>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    {helper.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-32 border-b border-border-muted bg-background-dark relative">
                <div className="text-center mb-16 relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-accent-purple mb-4">Wall of Fame</h3>
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase text-text-main tracking-tight">
                        Community <span className="text-accent-purple">Report</span>
                    </h2>
                    <p className="text-text-muted mt-4 max-w-2xl mx-auto text-sm md:text-base">
                        Don't just take our word for it. See what 50,000+ sharp bettors, analysts, and community members are saying across the web.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {COMMUNITY_REVIEWS.map((review, idx) => (
                        <div key={idx} className="terminal-panel p-6 bg-neutral-900 border-border-muted flex flex-col h-full hover:border-accent-purple/50 transition-colors relative">
                            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <span key={i} className="material-symbols-outlined text-xs text-yellow-500 fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                ))}
                            </div>
                            <p className="text-xs text-text-muted italic mb-8 flex-grow leading-relaxed font-medium">
                                {review.text}
                            </p>
                            <div className="flex items-center justify-between border-t border-border-muted/50 pt-4 mt-auto">
                                <span className="text-[10px] font-bold text-text-main uppercase tracking-wider">{review.name}</span>
                                <div className="flex items-center gap-2">
                                    <img src={review.logo} alt={review.platform} className="w-4 h-4 rounded grayscale opacity-50" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── DEVELOPER API ── */}
            <section className="w-full px-4 sm:px-6 py-24 bg-neutral-950 border-y border-border-muted">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left — simulated API terminal */}
                    <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#0d0d0d] shadow-2xl">
                        {/* Window chrome */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-900/80">
                            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                            <span className="w-3 h-3 rounded-full bg-primary/80"></span>
                            <span className="ml-4 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Live Play-by-Play Feed</span>
                        </div>
                        {/* Simulated response */}
                        <div className="p-6 font-mono text-[11px] leading-relaxed space-y-1 min-h-[320px] overflow-hidden">
                            <p className="text-slate-600">GET /v2/live/nba/game/1584692</p>
                            <p className="text-slate-600 mb-4">200 OK</p>
                            <p className="text-slate-500"><span className="text-yellow-400">"gameId"</span>: <span className="text-primary">"1584692"</span>,</p>
                            <p className="text-slate-500"><span className="text-yellow-400">"teams"</span>: {'{'} <span className="text-yellow-400">"away"</span>: <span className="text-primary">"LAL"</span>, <span className="text-yellow-400">"home"</span>: <span className="text-primary">"GSW"</span> {'}'}</p>
                            <p className="text-slate-500"><span className="text-yellow-400">"score"</span>: {'{'} <span className="text-yellow-400">"away"</span>: <span className="text-cyan-400">112</span>, <span className="text-yellow-400">"home"</span>: <span className="text-cyan-400">109</span> {'}'}</p>
                            <p className="text-slate-500"><span className="text-yellow-400">"clock"</span>: <span className="text-primary">"02:14"</span>, <span className="text-yellow-400">"quarter"</span>: <span className="text-cyan-400">4</span>,</p>
                            <p className="text-slate-500 mt-3"><span className="text-yellow-400">"lastPlay"</span>: {'{'}</p>
                            <p className="text-slate-500 pl-4"><span className="text-yellow-400">"type"</span>: <span className="text-primary">"EVENT"</span>,</p>
                            <p className="text-slate-500 pl-4"><span className="text-yellow-400">"desc"</span>: <span className="text-primary">"L. James makes 28-foot three point jumper"</span></p>
                            <p className="text-slate-500">{'}'}</p>
                            <p className="text-slate-500 mt-3"><span className="text-yellow-400">"oddsShift"</span>: {'{'}</p>
                            <p className="text-slate-500 pl-4"><span className="text-yellow-400">"type"</span>: <span className="text-orange-400">"ALERT"</span>,</p>
                            <p className="text-slate-500 pl-4"><span className="text-yellow-400">"desc"</span>: <span className="text-primary">"LAL Moneyline shifts from -110 to -145 across 4 books."</span></p>
                            <p className="text-slate-500">{'}'}</p>
                            <p className="text-slate-500 mt-3"><span className="text-yellow-400">"injury"</span>: {'{'}</p>
                            <p className="text-slate-500 pl-4"><span className="text-yellow-400">"type"</span>: <span className="text-red-400">"INJURY"</span>,</p>
                            <p className="text-slate-500 pl-4"><span className="text-yellow-400">"desc"</span>: <span className="text-primary">"S. Curry (GSW) heading to locker room (Ankle)."</span></p>
                            <p className="text-slate-500">{'}'}</p>
                            {/* blinking cursor */}
                            <span className="inline-block w-2 h-4 bg-primary animate-pulse mt-2 align-middle"></span>
                        </div>
                        {/* Gradient fade at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none"></div>
                    </div>

                    {/* Right — copy */}
                    <div className="flex flex-col gap-6">
                        <span className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full border border-border-muted bg-neutral-900 text-[10px] font-black uppercase tracking-widest text-slate-300">
                            <span className="material-symbols-outlined text-sm text-primary">code</span>
                            Developer API
                        </span>

                        <h2 className="text-4xl md:text-5xl font-black italic uppercase text-text-main tracking-tight leading-none">
                            Build With The <span className="text-primary">Ultimate API.</span>
                        </h2>

                        <p className="text-text-muted text-sm leading-relaxed max-w-md">
                            Power your own applications, sportsbooks, or analytical tools with our enterprise-grade REST and WebSocket APIs. Access raw data for every major sport from a single endpoint.
                        </p>

                        <ul className="space-y-3 mt-2">
                            {[
                                'NFL, NBA, MLB, NHL, NCAA, Soccer & Tennis',
                                'Real-time Live Scores & Clock Status',
                                'Deep Player Rosters & Active Injuries',
                                'Odds Aggregation Across 20+ Sportsbooks',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider text-text-muted">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button className="mt-4 self-start px-10 py-4 border-2 border-border-muted bg-neutral-900 text-text-main rounded-xl text-xs font-black uppercase tracking-[0.2em] italic hover:border-primary/60 hover:text-primary transition-all">
                            View Documentation
                        </button>
                    </div>
                </div>
            </section>

            {/* ── CONSUMER DATA FEED ── */}
            <section className="w-full px-4 sm:px-6 py-24 bg-background-dark border-b border-border-muted">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left — copy */}
                    <div className="flex flex-col gap-6">
                        <span className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-[10px] font-black uppercase tracking-widest text-primary">
                            <span className="material-symbols-outlined text-sm">bolt</span>
                            Consumer Data Feed
                        </span>

                        <h2 className="text-4xl md:text-5xl font-black italic uppercase text-text-main tracking-tight leading-none">
                            The Fastest <span className="text-primary">Data<br />Engine</span> In Sports.
                        </h2>

                        <p className="text-text-muted text-sm leading-relaxed max-w-md">
                            PickLabs isn't just analytics; it's a fully integrated data pipeline. Get real-time game logs, precise player proposition tracking, and instant injury updates seconds before the sportsbooks react.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                            {[
                                { icon: 'sports_score', title: 'Live Match Coverage', desc: 'Sub-second updates on 8+ global leagues.' },
                                { icon: 'personal_injury', title: 'Injury Intelligence', desc: 'Instant depth chart and roster adjustments.' },
                                { icon: 'query_stats', title: 'Advanced Player Logs', desc: 'Deep L5/L10/L20 vs Opponent historicals.' },
                                { icon: 'newspaper', title: 'Breaking News Filters', desc: 'Curated sharp news directly affecting lines.' },
                            ].map((feat, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-primary text-base">{feat.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-text-main">{feat.title}</h4>
                                        <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — live play-by-play terminal */}
                    <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#0d0d0d] shadow-2xl">
                        {/* Window chrome */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-900/80">
                            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                            <span className="w-3 h-3 rounded-full bg-primary/80"></span>
                            <span className="ml-4 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Live Play-by-Play Feed</span>
                        </div>
                        {/* Feed rows */}
                        <div className="p-5 font-mono text-[11px] space-y-0 divide-y divide-neutral-800/60">
                            {[
                                { q: 'Q4', t: '02:14', type: 'EVENT', typeColor: 'text-primary', desc: 'L. James makes 28-foot three point jumper (A. Davis assists)' },
                                { q: 'Q4', t: '02:40', type: 'ALERT', typeColor: 'text-orange-400', desc: 'LAL Moneyline shifts from -110 to -145 across 4 books.' },
                                { q: 'Q4', t: '03:01', type: 'INJURY', typeColor: 'text-red-400', desc: 'S. Curry (GSW) heading to locker room (Ankle).' },
                                { q: 'Q4', t: '03:15', type: 'EVENT', typeColor: 'text-primary', desc: 'Golden State full timeout.' },
                                { q: 'Q4', t: '03:44', type: 'ALERT', typeColor: 'text-orange-400', desc: 'GSW spread moves from +3 to +5.5 at 3 books.' },
                                { q: 'Q4', t: '04:10', type: 'EVENT', typeColor: 'text-primary', desc: 'A. Davis with the block — turnover GSW.' },
                            ].map((row, i) => (
                                <div key={i} className="flex items-start gap-3 py-3">
                                    <div className="flex flex-col items-end w-12 flex-shrink-0">
                                        <span className="text-slate-600 text-[10px]">{row.q}</span>
                                        <span className="text-slate-500 text-[10px]">{row.t}</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase w-12 flex-shrink-0 pt-0.5 ${row.typeColor}`}>{row.type}</span>
                                    <span className="text-slate-300 leading-relaxed text-[10px]">{row.desc}</span>
                                </div>
                            ))}
                            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-16 mt-1 align-middle"></span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="pricing" className="w-full px-4 sm:px-6 py-32">


                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h3 className="text-3xl md:text-5xl font-black italic uppercase text-text-main tracking-tight">Choose Your Edge</h3>
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${!isAnnual ? 'text-primary' : 'text-slate-500'}`}>Monthly</span>
                            <div className={`toggle-knob ${isAnnual ? 'active' : ''}`} onClick={() => setIsAnnual(!isAnnual)}>
                                <div className="toggle-circle"></div>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isAnnual ? 'text-primary' : 'text-slate-500'}`}>Yearly <span className="text-accent-purple">(Save 20%)</span></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch max-w-[1400px] mx-auto">

                        {/* ── FREE MODE ── */}
                        <div className="pricing-card border-border-muted/50 bg-neutral-900/40 relative">
                            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                            <div className="mb-6">
                                <h4 className="text-2xl font-black italic uppercase text-text-main mb-2">Free</h4>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No credit card required</p>
                            </div>
                            <div className="mb-6 flex flex-col items-start gap-1">
                                <span className="text-5xl font-black text-text-main italic tracking-tighter">$0</span>
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Forever free</span>
                            </div>
                            <button
                                onClick={() => onNavigate('login-page')}
                                className="w-full py-4 border-2 border-border-muted bg-neutral-900/60 text-text-muted rounded-xl text-xs font-black uppercase tracking-[0.2em] italic hover:border-primary/40 hover:text-text-main transition-all mb-8"
                            >
                                Get Started Free
                            </button>
                            <ul className="space-y-4 mb-4 flex-grow text-left">
                                {ALL_FEATURES.map((feature, i) => {
                                    const isIncluded = ['Trending Insights', 'Thousands of Props & Games', 'Advanced Visuals', 'Injury Reports'].includes(feature);
                                    return (
                                        <li key={i} className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide ${isIncluded ? 'text-text-muted' : 'text-slate-700'}`}>
                                            <span className={`material-symbols-outlined text-base ${isIncluded ? 'text-slate-400' : 'text-slate-800'}`}>
                                                {isIncluded ? 'check_circle' : 'remove'}
                                            </span>
                                            {feature}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* ── PREMIUM ── */}
                        <div className="pricing-card relative">
                            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                            <div className="mb-6">
                                <h4 className="text-2xl font-black italic uppercase text-text-main mb-2">Premium</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core analytics suite</p>
                            </div>
                            <div className="mb-6 flex flex-col items-start gap-1">
                                <span className="text-5xl font-black text-text-main italic tracking-tighter">${isAnnual ? '199.99' : '19.99'}</span>
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">{isAnnual ? 'Yearly billing' : 'Monthly billing'}</span>
                            </div>
                            <button className="w-full py-4 border-2 border-border-muted bg-neutral-900 text-text-main rounded-xl text-xs font-black uppercase tracking-[0.2em] italic hover:border-primary transition-all mb-8 shadow-sm">
                                Get Premium
                            </button>
                            <ul className="space-y-4 mb-4 flex-grow text-left">
                                {ALL_FEATURES.map((feature, i) => {
                                    const isIncluded = PREMIUM_FEATURES.includes(feature);
                                    return (
                                        <li key={i} className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide ${isIncluded ? 'text-text-muted' : 'text-slate-600'}`}>
                                            <span className={`material-symbols-outlined text-base ${isIncluded ? 'text-primary' : 'text-slate-800'}`}>
                                                {isIncluded ? 'check_circle' : 'remove'}
                                            </span>
                                            {feature}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* ── PREMIUM + ── */}
                        <div className="pricing-card featured relative xl:-mt-4 xl:mb-4 border-accent-purple/50 bg-neutral-900 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                            <div className="absolute top-0 right-0 bg-accent-purple text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-widest italic rounded-bl-xl shadow-md">
                                Best Value
                            </div>
                            <div className="mb-6">
                                <h4 className="text-2xl font-black italic uppercase text-text-main mb-2">Premium +</h4>
                                <p className="text-[10px] font-black text-accent-purple uppercase tracking-widest">Early bird discount: Get Plus for 50% off</p>
                            </div>
                            <div className="mb-6 flex flex-col items-start gap-1">
                                <div className="flex items-end gap-3">
                                    <span className="text-5xl font-black text-text-main italic tracking-tighter">${isAnnual ? '299.99' : '29.99'}</span>
                                    <span className="text-xl font-bold text-slate-500 line-through mb-1.5">${isAnnual ? '599.99' : '59.99'}</span>
                                </div>
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">{isAnnual ? 'Yearly billing' : 'Monthly billing'}</span>
                            </div>
                            <button className="w-full py-4 bg-accent-purple text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] italic hover:bg-purple-500 transition-colors mb-8 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02]">
                                Get Premium +
                            </button>
                            <ul className="space-y-4 mb-4 flex-grow text-left">
                                {ALL_FEATURES.map((feature, i) => {
                                    const isIncluded = PREMIUM_PLUS_FEATURES.includes(feature);
                                    return (
                                        <li key={i} className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide ${isIncluded ? 'text-text-main' : 'text-slate-400'}`}>
                                            <span className={`material-symbols-outlined text-base ${isIncluded ? 'text-accent-purple' : 'text-slate-800'}`}>
                                                {isIncluded ? 'check_circle' : 'remove'}
                                            </span>
                                            {feature}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* ── PRO ── */}
                        <div className="pricing-card border-primary/30 relative bg-neutral-900">
                            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} variant="green" />
                            <div className="mb-6">
                                <h4 className="text-2xl font-black italic uppercase text-text-main mb-2">Pro</h4>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Get Pro for 38% off</p>
                            </div>
                            <div className="mb-6 flex flex-col items-start gap-1">
                                <div className="flex items-end gap-3">
                                    <span className="text-5xl font-black text-primary italic tracking-tighter">${isAnnual ? '359.99' : '79.99'}</span>
                                    <span className="text-xl font-bold text-slate-500 line-through mb-1.5">${isAnnual ? '579.99' : '129.99'}</span>
                                </div>
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">{isAnnual ? 'Yearly billing' : 'Monthly billing'}</span>
                            </div>
                            <button className="w-full py-4 bg-primary text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] italic hover:scale-[1.02] transition-transform mb-8 shadow-[0_0_20px_rgba(13,242,13,0.3)] hover:shadow-[0_0_25px_rgba(13,242,13,0.5)]">
                                Get Pro
                            </button>
                            <ul className="space-y-4 mb-4 flex-grow text-left">
                                {ALL_FEATURES.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-text-muted uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>{/* /max-w-7xl */}
            </section>

            <Footer />
        </div >
    );
};
