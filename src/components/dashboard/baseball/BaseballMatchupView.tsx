import React from 'react';
import { Game } from '../../../data/mockGames';

interface BaseballMatchupViewProps {
    game: Game;
}

const MLB_PLAYER_MAP: Record<string, { id: string; name: string; position: string }> = {
    'Angels': { id: '30836', name: 'M. Trout', position: 'CF' },
    'Astros': { id: '31027', name: 'J. Altuve', position: '2B' },
    'Athletics': { id: '40944', name: 'Z. Gelof', position: '2B' },
    'Blue Jays': { id: '35002', name: 'V. Guerrero Jr.', position: '1B' },
    'Braves': { id: '35824', name: 'R. Acuña Jr.', position: 'RF' },
    'Brewers': { id: '33867', name: 'W. Adames', position: 'SS' },
    'Cardinals': { id: '31265', name: 'N. Arenado', position: '3B' },
    'Cubs': { id: '39401', name: 'J. Steele', position: 'LHP' },
    'Diamondbacks': { id: '41126', name: 'C. Carroll', position: 'OF' },
    'Dodgers': { id: '39832', name: 'S. Ohtani', position: 'DH' },
    'Giants': { id: '40842', name: 'L. Webb', position: 'RHP' },
    'Guardians': { id: '33301', name: 'J. Ramírez', position: '3B' },
    'Mariners': { id: '41112', name: 'J. Rodríguez', position: 'CF' },
    'Marlins': { id: '40058', name: 'J. Chisholm Jr.', position: 'CF' },
    'Mets': { id: '32784', name: 'P. Alonso', position: '1B' },
    'Nationals': { id: '42414', name: 'C. Abrams', position: 'SS' },
    'Orioles': { id: '40942', name: 'A. Rutschman', position: 'C' },
    'Padres': { id: '40882', name: 'F. Tatis Jr.', position: 'RF' },
    'Phillies': { id: '31459', name: 'B. Harper', position: '1B' },
    'Pirates': { id: '41065', name: 'B. Reynolds', position: 'OF' },
    'Rangers': { id: '33202', name: 'C. Seager', position: 'SS' },
    'Rays': { id: '39933', name: 'R. Arozarena', position: 'LF' },
    'Red Sox': { id: '35061', name: 'R. Devers', position: '3B' },
    'Reds': { id: '42403', name: 'E. De La Cruz', position: 'SS' },
    'Rockies': { id: '40960', name: 'E. Tovar', position: 'SS' },
    'Royals': { id: '39833', name: 'B. Witt Jr.', position: 'SS' },
    'Tigers': { id: '41178', name: 'T. Skubal', position: 'LHP' },
    'Twins': { id: '30784', name: 'C. Correa', position: 'SS' },
    'White Sox': { id: '40049', name: 'L. Robert Jr.', position: 'CF' },
    'Yankees': { id: '33039', name: 'A. Judge', position: 'CF' },
};

export const BaseballMatchupView: React.FC<BaseballMatchupViewProps> = ({ game }) => {
    if (game.sport !== 'MLB') return null;

    // --- Dynamic Mock Data ---
    // Fetch mapped players for the current teams playing
    const awayPlayer = MLB_PLAYER_MAP[game.awayTeam.name] || { id: '39832', name: 'C. Schuelke', position: 'RHP' };
    const homePlayer = MLB_PLAYER_MAP[game.homeTeam.name] || { id: '33865', name: 'S. Zavala', position: 'C' };

    const pitcher = { id: awayPlayer.id, name: awayPlayer.name, role: awayPlayer.position, team: game.awayTeam.name, logo: game.awayTeam.logo, color: game.awayTeam.color, stats: '0.0IP, 0H, 0ER, 0K, 2BB' };
    const batter = { id: homePlayer.id, name: homePlayer.name, role: homePlayer.position, team: game.homeTeam.name, logo: game.homeTeam.logo, color: game.homeTeam.color, stats: '0-0' };
    const onDeck = 'J. Tibbs III';

    const pitches = [
        { id: 4, type: 'SLIDER', result: 'BALL', speed: '70 MPH', x: 25, y: 35, isStrike: false },
        { id: 3, type: 'CHANGEUP', result: 'BALL', speed: '86 MPH', x: 15, y: 45, isStrike: false },
        { id: 2, type: 'SLIDER', result: 'BALL', speed: '74 MPH', x: 20, y: 20, isStrike: false },
        { id: 1, type: 'CURVE', result: 'STRIKE LOOKING', speed: '80 MPH', x: 80, y: 55, isStrike: true },
    ];

    const count = { balls: 3, strikes: 0, outs: 2 };

    const bases = {
        first: { name: 'G. Lockwood-Powell', occupied: true },
        second: { name: 'M. Siani', occupied: true },
        third: { name: 'Z. Hope', occupied: false }
    };

    const dueUp = [
        { name: 'Jon Adams', number: '8', stats: '0-1, BB, K' },
        { name: 'G. Jones', number: '9', stats: '0-1, BB, K' },
        { name: 'S. Frelick', number: '1', stats: '2-3, R' },
    ];

    const defense = [
        { pos: 'LF', name: 'T. Soderstrom', x: 15, y: 35 },
        { pos: 'CF', name: 'D. Clarke', x: 50, y: 25 },
        { pos: 'RF', name: 'J. Perez', x: 85, y: 35 },
        { pos: 'SS', name: 'J. Wilson', x: 35, y: 55 },
        { pos: '2B', name: 'J. McNeil', x: 65, y: 55 },
        { pos: '3B', name: 'D. Hemaiz', x: 20, y: 65 },
        { pos: '1B', name: 'N. Kurtz', x: 80, y: 65 },
        { pos: 'C', name: 'S. Langeliers', x: 50, y: 92 },
    ];

    return (
        <div className="terminal-panel flex flex-col mt-6 border border-border-muted rounded-xl overflow-hidden bg-white/5 dark:bg-neutral-900/20">
            {/* Top Matchup Header */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-4 border-b border-border-muted bg-white dark:bg-[#111] relative">
                {/* Pitcher */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-0.5">
                            {pitcher.logo ? <img src={pitcher.logo} className="w-4 h-4 object-contain" alt={pitcher.team} /> : <span className="text-xs font-bold" style={{ color: pitcher.color }}>{pitcher.team}</span>}
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Pitcher</span>
                        </div>
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="text-sm font-bold text-[#1a5f99] dark:text-[#3b82f6]">{pitcher.name}</span>
                            <span className="text-xs text-slate-500 font-medium">{pitcher.role}</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-1">{pitcher.stats}</div>
                    </div>
                    <div className="relative w-12 h-12 bg-slate-200 dark:bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden border border-border-muted overflow-hidden group">
                        {pitcher.id ? (
                            <img src={`https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/${pitcher.id}.png&w=96&h=70&cb=1`} alt={pitcher.name} className="w-full h-full object-cover object-top scale-[1.3] translate-y-2 mix-blend-luminosity opacity-80" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                        ) : null}
                        <span className={`material-symbols-outlined text-4xl text-slate-400 dark:text-slate-600 translate-y-2 ${pitcher.id ? 'hidden absolute' : ''}`}>person</span>
                    </div>
                </div>

                {/* VS Badge */}
                <div className="text-xs font-black text-slate-400 dark:text-slate-500 mx-2">VS</div>

                {/* Batter */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-start flex-row-reverse md:flex-row">
                    <div className="relative w-12 h-12 bg-slate-200 dark:bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden border border-border-muted group">
                        {batter.id ? (
                            <img src={`https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/${batter.id}.png&w=96&h=70&cb=1`} alt={batter.name} className="w-full h-full object-cover object-top scale-[1.3] translate-y-2 mix-blend-luminosity opacity-80" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                        ) : null}
                        <span className={`material-symbols-outlined text-4xl text-slate-400 dark:text-slate-600 translate-y-2 ${batter.id ? 'hidden absolute' : ''}`}>person</span>
                    </div>
                    <div className="text-left">
                        <div className="flex items-center justify-start gap-2 mb-0.5">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Batter</span>
                            {batter.logo ? <img src={batter.logo} className="w-4 h-4 object-contain" alt={batter.team} /> : <span className="text-xs font-bold" style={{ color: batter.color }}>{batter.team}</span>}
                        </div>
                        <div className="flex items-baseline justify-start gap-1">
                            <span className="text-sm font-bold text-[#1a5f99] dark:text-[#3b82f6]">{batter.name}</span>
                            <span className="text-xs text-slate-500 font-medium">{batter.role}</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-1">{batter.stats}</div>
                    </div>
                </div>
            </div>

            {/* Pitch Count Bar */}
            <div className="flex items-center justify-center gap-6 py-2 border-b border-border-muted bg-slate-50 dark:bg-[#151515] text-[11px] font-bold">
                <div className="text-slate-500 dark:text-slate-400 uppercase">Pitch Count: <span className="text-black dark:text-white">--</span></div>
                <div className="w-px h-3 bg-border-muted"></div>
                <div className="text-slate-500 dark:text-slate-400 uppercase">On Deck: <span className="text-[#1a5f99] dark:text-[#3b82f6]">{onDeck}</span></div>
            </div>

            {/* Middle Section: Strike Zone & Pitch List */}
            <div className="flex flex-col lg:flex-row border-b border-border-muted bg-white dark:bg-[#111]">

                {/* Left: Strike Zone Visual */}
                <div className="flex-1 p-6 flex flex-col">
                    {/* BSO Indicators */}
                    <div className="flex justify-between items-center mb-8 px-8 flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-black uppercase text-text-main tracking-widest">Balls</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-3 h-3 rounded-full border border-border-muted ${i <= count.balls ? 'bg-[#10b981] border-[#10b981]' : 'bg-transparent'}`}></div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-black uppercase text-text-main tracking-widest">Strikes</span>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-3 h-3 rounded-full border border-border-muted ${i <= count.strikes ? 'bg-[#ef4444] border-[#ef4444]' : 'bg-transparent'}`}></div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-black uppercase text-text-main tracking-widest">Outs</span>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-3 h-3 rounded-full border border-border-muted ${i <= count.outs ? 'bg-[#ef4444] border-[#ef4444]' : 'bg-transparent'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Zone Container */}
                    <div className="relative flex-1 min-h-[300px] flex items-center justify-center">

                        <div className="absolute right-0 lg:right-[5%] bottom-[20px] w-[200px] h-[280px] select-none pointer-events-none z-20">
                            {/* Inline base64 graphic of the batter to guarantee perfectly reliable loading */}
                            <img
                                src="data:image/png;base64,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"
                                alt="Batter Silhouette"
                                className="w-full h-full object-contain object-bottom opacity-80 mix-blend-luminosity dark:mix-blend-lighten"
                                style={{
                                    // Turns black pixels directly into grey
                                    filter: 'invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                                }}
                            />
                        </div>

                        {/* Home Plate Placeholder */}
                        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[160px] h-[40px] opacity-20 dark:opacity-30">
                            <svg viewBox="0 0 100 50" className="w-full h-full fill-slate-300 stroke-slate-400" strokeWidth="2">
                                <polygon points="0,0 100,0 100,20 50,50 0,20" />
                            </svg>
                        </div>

                        {/* Batters Boxes */}
                        <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[340px] h-[60px] border-b-2 border-x-2 border-slate-200 dark:border-slate-800 opacity-50 rounded-b-lg"></div>

                        {/* Strike Zone Grid */}
                        <div className="relative w-[140px] h-[180px] bg-slate-200/50 dark:bg-slate-700/50 border-4 border-white dark:border-slate-400 grid grid-cols-3 grid-rows-3 shadow-lg z-10 backdrop-blur-sm">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="border border-white/50 dark:border-slate-400/50"></div>
                            ))}

                            {/* Pitches */}
                            {pitches.map((pitch) => (
                                <div
                                    key={pitch.id}
                                    className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md
                                        ${pitch.isStrike ? 'bg-[#ef4444]' : 'bg-[#10b981]'}`}
                                    style={{ left: `${pitch.x}%`, top: `${pitch.y}%` }}
                                >
                                    {pitch.id}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bases Indicator */}
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-border-muted/50 w-full px-4 gap-4">
                        <div className="flex items-center gap-1">
                            <div className="relative w-8 h-8 rotate-45 flex items-center justify-center">
                                {/* Third */}
                                <div className={`absolute left-0 top-0 w-3 h-3 ${bases.third.occupied ? 'bg-[#1a5f99] dark:bg-[#3b82f6]' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                {/* Second */}
                                <div className={`absolute top-0 right-0 w-3 h-3 ${bases.second.occupied ? 'bg-[#1a5f99] dark:bg-[#3b82f6]' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                {/* First */}
                                <div className={`absolute bottom-0 right-0 w-3 h-3 ${bases.first.occupied ? 'bg-[#1a5f99] dark:bg-[#3b82f6]' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-slate-500 uppercase">
                            <span>ON BASE:</span>
                            {bases.first.occupied && <span>1B: <span className="text-[#1a5f99] dark:text-[#3b82f6]">{bases.first.name}</span></span>}
                            {bases.second.occupied && <span>2B: <span className="text-[#1a5f99] dark:text-[#3b82f6]">{bases.second.name}</span></span>}
                            {bases.third.occupied && <span>3B: <span className="text-[#1a5f99] dark:text-[#3b82f6]">{bases.third.name}</span></span>}
                        </div>
                    </div>

                </div>

                {/* Right: Pitch List */}
                <div className="w-full lg:w-[320px] bg-white dark:bg-[#0a0a0a] border-l border-border-muted flex flex-col h-[400px] lg:h-auto overflow-y-auto">
                    {pitches.map((pitch) => (
                        <div key={pitch.id} className="flex items-center gap-4 p-4 border-b border-border-muted hover:bg-slate-50 dark:hover:bg-[#151515] transition-colors">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0
                                ${pitch.isStrike ? 'bg-[#ef4444]' : 'bg-[#10b981]'}`}>
                                {pitch.id}
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-black uppercase text-text-main tracking-widest">{pitch.result}</div>
                                <div className="text-[10px] font-bold uppercase text-slate-500">{pitch.type}</div>
                            </div>
                            <div className="text-xs font-medium text-slate-500">{pitch.speed}</div>
                        </div>
                    ))}
                    {/* Empty Slots */}
                    <div className="flex-1 p-4 flex items-center gap-4 opacity-30 select-none">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            <div className="h-2 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Due Up & Defense */}
            <div className="flex flex-col lg:flex-row bg-white dark:bg-[#111]">

                {/* Left: Defense Diamond */}
                <div className="flex-1 p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-border-muted relative min-h-[300px]">
                    <div className="text-center w-full mb-6 relative z-10">
                        <h4 className="flex items-center justify-center gap-2 text-sm font-black text-text-main uppercase tracking-widest">
                            <img src={game.awayTeam.logo} alt="Away" className="w-5 h-5 object-contain" />
                            {game.awayTeam.name} Defense
                        </h4>
                    </div>

                    {/* SVG Baseball Field Representation */}
                    <div className="w-[300px] aspect-[4/3] relative">
                        {/* Higher Quality SVG Field */}
                        <div className="absolute inset-0 z-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" preserveAspectRatio="none">
                                {/* Base dirt area */}
                                <polygon points="50,95 5,50 50,5 95,50" fill="#c29672" stroke="#a47551" strokeWidth="1" />
                                {/* Outfield grass arc */}
                                <path d="M5,50 C20,10 80,10 95,50 L50,95 Z" fill="#4caf50" />
                                {/* Infield dirt diamond */}
                                <polygon points="50,85 20,55 50,25 80,55" fill="#c29672" />
                                {/* Infield grass diamond */}
                                <polygon points="50,80 25,55 50,30 75,55" fill="#4caf50" />
                                {/* Foul Lines */}
                                <line x1="50" y1="95" x2="5" y2="50" stroke="white" strokeWidth="0.5" opacity="0.8" />
                                <line x1="50" y1="95" x2="95" y2="50" stroke="white" strokeWidth="0.5" opacity="0.8" />
                                {/* Bases */}
                                <polygon points="50,85 48,83 50,81 52,83" fill="white" /> {/* Home */}
                                <polygon points="78,57 76,55 78,53 80,55" fill="white" /> {/* 1st */}
                                <polygon points="50,27 48,25 50,23 52,25" fill="white" /> {/* 2nd */}
                                <polygon points="22,57 20,55 22,53 24,55" fill="white" /> {/* 3rd */}
                                {/* Pitcher's Mound */}
                                <circle cx="50" cy="55" r="4" fill="#c29672" stroke="#a47551" strokeWidth="0.5" />
                                <rect x="49" y="54" width="2" height="1" fill="white" />
                            </svg>
                        </div>

                        {/* Player Markers (Absolute pos mapped to visual layout) */}
                        {defense.map((player) => {
                            // Map existing x,y coordinates (which were based on a different aspect ratio)
                            // to match our new SVG field's layout
                            let left = player.x;
                            let top = player.y;

                            // Adjusting locations to look correct on the new SVG
                            if (player.pos === 'C') { top = 90; left = 50; }
                            if (player.pos === '1B') { top = 55; left = 75; }
                            if (player.pos === '2B') { top = 45; left = 62; }
                            if (player.pos === 'SS') { top = 45; left = 38; }
                            if (player.pos === '3B') { top = 55; left = 25; }
                            if (player.pos === 'LF') { top = 25; left = 20; }
                            if (player.pos === 'CF') { top = 15; left = 50; }
                            if (player.pos === 'RF') { top = 25; left = 80; }

                            return (
                                <div
                                    key={player.pos}
                                    className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 drop-shadow-md z-20"
                                    style={{ left: `${left}%`, top: `${top}%` }}
                                >
                                    <span className="text-[10px] font-black text-white px-1.5 py-0.5 bg-[#050a05]/60 border border-white/20 rounded truncate max-w-[80px] drop-shadow-md backdrop-blur-sm">{player.pos} {player.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Due Up List */}
                <div className="w-full lg:w-[320px] bg-slate-50 dark:bg-[#151515] p-6 flex flex-col">
                    <div className="text-center w-full mb-6">
                        <h4 className="flex items-center justify-center gap-2 text-sm font-black text-text-main uppercase tracking-widest">
                            <img src={game.homeTeam.logo} alt="Home" className="w-5 h-5 object-contain" />
                            {game.homeTeam.name} Due Up
                        </h4>
                    </div>

                    <div className="flex flex-col gap-4">
                        {dueUp.map((player, idx) => (
                            <div key={idx} className="bg-white dark:bg-neutral-900/50 border border-border-muted rounded-lg p-3 flex flex-col items-center justify-center">
                                <div className="text-sm font-bold text-[#1a5f99] dark:text-[#3b82f6]">{player.name} <span className="text-slate-500 font-medium text-xs">({player.number})</span></div>
                                <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase">{player.stats}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};
