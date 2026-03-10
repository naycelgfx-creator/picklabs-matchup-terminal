import { ESPNGame } from '../data/apiClient';
import { Game } from '../data/mockGames';
import { generateAIPrediction } from './aiPredictions';

export const espnGameToGame = (eg: ESPNGame, homeForm: ('W' | 'L' | 'D')[] = [], awayForm: ('W' | 'L' | 'D')[] = []): Game => {
    // Extract primary competition details
    const competition = eg.competitions?.[0];
    const isLive = eg.status?.type?.state === 'in';
    const isFinal = eg.status?.type?.state === 'post';

    // Find Home and Away teams
    const homeCompetitor = competition?.competitors?.find(c => c.homeAway === 'home');
    const awayCompetitor = competition?.competitors?.find(c => c.homeAway === 'away');

    const homeTeam = homeCompetitor?.team;
    const awayTeam = awayCompetitor?.team;

    // Default sports if not explicitly known
    const gameSport = eg.sport || eg.season?.slug || "Sport";

    // Build records strings
    const extractRecord = (comp: { records?: { summary?: string }[] } | undefined) => comp?.records?.[0]?.summary || "0-0";
    const homeRecord = extractRecord(homeCompetitor as { records?: { summary?: string }[] } | undefined);
    const awayRecord = extractRecord(awayCompetitor as { records?: { summary?: string }[] } | undefined);

    // AI prediction
    const prediction = generateAIPrediction(
        homeRecord,
        awayRecord,
        gameSport,
        homeForm,
        awayForm,
    );

    const gameDate = eg.date ? eg.date.split('T')[0] : new Date().toISOString().split('T')[0];
    const statusLabel = isLive
        ? eg.status?.type?.shortDetail || 'LIVE'
        : isFinal
            ? `Final • ${awayCompetitor?.score || 0}–${homeCompetitor?.score || 0}`
            : eg.status?.type?.shortDetail || 'Upcoming';

    // Fallback form from record pct
    const recordForm = (record: string): ('W' | 'L')[] => {
        const [w, l] = record.split('-').map(Number);
        const pct = (w || 0) / Math.max((w || 0) + (l || 0), 1);
        return Array.from({ length: 5 }, (_, i) => {
            return ((w || 0) + i) % Math.round(1 / Math.max(1 - pct, 0.01)) === 0 ? 'L' : 'W';
        });
    };

    // Safe extract odds
    const gameOdds = competition?.odds?.[0];
    let moneylineHome = prediction.moneylineHome;
    let spread = prediction.spread;
    let overUnderVal = prediction.total;

    if (gameOdds) {
        if (gameOdds.homeTeamOdds?.moneyLine) {
            moneylineHome = (gameOdds.homeTeamOdds.moneyLine > 0 ? '+' : '') + gameOdds.homeTeamOdds.moneyLine;
        }
        if (gameOdds.details) {
            spread = gameOdds.details;
        }
        if (gameOdds.overUnder) {
            overUnderVal = gameOdds.overUnder;
        }
    }

    return {
        id: `espn-${eg.id}`,
        sport: gameSport,
        sportLogo: `https://a.espncdn.com/i/teamlogos/leagues/500/${gameSport.toLowerCase()}.png`,
        status: isLive ? 'LIVE' : 'UPCOMING',
        timeLabel: statusLabel,
        matchupId: `#PL-${eg.id}`,
        date: gameDate,
        league: gameSport,
        broadcast: competition?.broadcasts?.[0]?.market || 'Watch ESPN',
        venue: {
            name: competition?.venue?.fullName || 'TBD',
            location: competition?.venue?.address?.city || 'TBD',
        },
        awayTeam: {
            id: awayTeam?.id || 'away',
            name: awayTeam?.displayName || 'TBD',
            logo: awayTeam?.logos?.[0]?.href || '',
            record: awayRecord,
            color: `#${awayTeam?.color || 'cccccc'}`,
            winProb: prediction.awayWinProb,
            recentForm: (awayForm.length >= 3 ? awayForm : recordForm(awayRecord)).map(f => f === 'D' ? 'L' : f) as ('W' | 'L')[],
            score: isLive || isFinal ? parseInt(awayCompetitor?.score || '0') || undefined : undefined,
        },
        homeTeam: {
            id: homeTeam?.id || 'home',
            name: homeTeam?.displayName || 'TBD',
            logo: homeTeam?.logos?.[0]?.href || '',
            record: homeRecord,
            color: `#${homeTeam?.color || 'cccccc'}`,
            winProb: prediction.homeWinProb,
            recentForm: (homeForm.length >= 3 ? homeForm : recordForm(homeRecord)).map(f => f === 'D' ? 'L' : f) as ('W' | 'L')[],
            score: isLive || isFinal ? parseInt(homeCompetitor?.score || '0') || undefined : undefined,
        },
        odds: {
            moneyline: moneylineHome,
            spread: spread,
            overUnder: { value: String(overUnderVal), pick: prediction.overUnderPick === 'OVER' ? 'Over' : 'Under' },
        },
        streakLabel: `PickLabs AI · ${prediction.confidence}% confidence · ${prediction.insight}`,
    };
};
