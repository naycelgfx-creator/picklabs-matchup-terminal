import React from 'react';
import { Game } from '../../data/mockGames';

interface WeatherImpactProps {
    game: Game;
}

export const WeatherImpact: React.FC<WeatherImpactProps> = ({ game }) => {
    // Only show weather for outdoor sports
    if (!['NFL', 'MLB', 'Soccer'].includes(game.sport)) {
        return null;
    }

    // Mock weather logic based on sport/teams
    const getMockWeather = () => {
        const temps = [32, 45, 65, 75, 85, 95];
        const conditions = ['Sunny', 'Cloudy', 'Rain', 'Snow', 'Clear Night'];
        const winds = [5, 12, 18, 25];

        const temp = temps[Math.floor(Math.random() * temps.length)];
        const condition = temp < 40 ? (Math.random() > 0.5 ? 'Snow' : 'Clear Night')
            : temp > 80 ? 'Sunny'
                : conditions[Math.floor(Math.random() * 3)];
        const windSpeed = winds[Math.floor(Math.random() * winds.length)];
        const windDirection = ['NW', 'NE', 'SW', 'SE', 'In from Center', 'Out to Left'][Math.floor(Math.random() * 6)];

        let impactText = "Minimal weather impact expected.";
        let impactLevel: 'low' | 'medium' | 'high' = 'low';

        if (windSpeed > 15 && game.sport === 'NFL') {
            impactText = "High winds heavily favor the Under and rushing props.";
            impactLevel = 'high';
        } else if (condition === 'Rain' || condition === 'Snow') {
            impactText = `Precipitation (${condition}) increases fumble risk and lowers expected scoring.`;
            impactLevel = 'high';
        } else if (windSpeed > 15 && game.sport === 'MLB' && windDirection.includes('Out')) {
            impactText = `Wind blowing ${windDirection} strongly favors home runs and the Over.`;
            impactLevel = 'high';
        } else if (temp > 85 && game.sport === 'MLB') {
            impactText = "High temps reduce air density; ball travels further. Slight bump to Over.";
            impactLevel = 'medium';
        }

        return { temp, condition, windSpeed, windDirection, impactText, impactLevel };
    };

    const weather = getMockWeather();

    return (
        <div className="terminal-panel mt-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none"></div>

            <div className="p-4 border-b border-border-muted flex justify-between items-center bg-white/5 relative z-10">
                <h3 className="text-xs font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400 text-sm">routine</span>
                    Weather Impact Analysis
                </h3>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${weather.impactLevel === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                        weather.impactLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                            'bg-green-500/20 text-green-400 border-green-500/50'
                    }`}>
                    {weather.impactLevel} Impact
                </span>
            </div>

            <div className="p-6 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Visual Condition */}
                <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-neutral-900/40 rounded-xl border border-border-muted/50">
                    <span className="material-symbols-outlined text-5xl mb-2 text-blue-300">
                        {weather.condition === 'Sunny' ? 'sunny' :
                            weather.condition === 'Rain' ? 'rainy' :
                                weather.condition === 'Snow' ? 'weather_snowy' :
                                    weather.condition === 'Clear Night' ? 'clear_night' : 'cloudy'}
                    </span>
                    <span className="text-2xl font-black text-text-main">{weather.temp}°F</span>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{weather.condition}</span>
                </div>

                {/* Wind Data */}
                <div className="flex flex-col flex-1 p-4 bg-white dark:bg-neutral-900/40 rounded-xl border border-border-muted/50 h-full justify-center">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-text-muted text-sm">air</span>
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Wind Factor</h4>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-xl font-black text-text-main">{weather.windSpeed} <span className="text-sm text-slate-500">mph</span></span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-text-muted font-bold uppercase block mb-1">Direction</span>
                            <span className="text-sm font-bold text-blue-300">{weather.windDirection}</span>
                        </div>
                    </div>
                </div>

                {/* Betting Actionable Insight */}
                <div className="flex flex-col flex-1 p-4 bg-blue-900/10 rounded-xl border border-blue-500/30 h-full justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-blue-400 text-sm">analytics</span>
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Betting Edge Data</h4>
                    </div>
                    <p className="text-sm text-text-muted font-medium leading-relaxed">
                        {weather.impactText}
                    </p>
                </div>
            </div>
        </div>
    );
};
