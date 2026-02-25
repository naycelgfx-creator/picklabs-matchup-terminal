import { useState, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { GlobalNewsTicker } from './components/layout/GlobalNewsTicker';
import { Footer } from './components/layout/Footer';
import { SimulationOverlay } from './components/ui/SimulationOverlay';
import { LiveBoard } from './components/live-board/LiveBoard';
import { Game } from './data/mockGames';
import { SharpToolsView } from './components/sharp-tools/SharpToolsView';
import { BankrollView } from './components/bankroll/BankrollView';
import { MatchupTerminalView } from './components/dashboard/MatchupTerminalView';
import { TeamsDirectory } from './components/directory/TeamsDirectory';
import { PopularBetsView } from './components/popular/PopularBetsView';
import { SavedPicksView } from './components/saved/SavedPicksView';
import { ValueFinderView } from './components/value-finder/ValueFinderView';
import { LandingPageView } from './components/landing/LandingPageView';
import { LoginPageView } from './components/auth/LoginPageView';
import { RookieModeProvider } from './contexts/RookieModeContext';
import { APP_SPORT_TO_ESPN, fetchESPNScoreboardByDate, ESPNGame, SportKey } from './data/espnScoreboard';
import { generateAIPrediction } from './data/espnTeams';

export interface BetPick {
  id: string;
  gameId: string;
  type: 'ML' | 'Spread' | 'Over' | 'Under' | 'Prop';
  team: string; // "Lakers" or "Lakers -8.5" or "LeBron Over 25.5 Pts"
  odds: string; // "+180" or "-110"
  matchupStr: string; // "Lakers vs Celtics"
  stake: number;
}

type ViewType = 'live-board' | 'matchup-terminal' | 'sharp-tools' | 'bankroll' | 'teams-directory' | 'popular-bets' | 'saved-picks' | 'value-finder' | 'landing-page' | 'login-page';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing-page');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [betSlip, setBetSlip] = useState<BetPick[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [isAIPickLoading, setIsAIPickLoading] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
  };

  const handleSimulationComplete = () => {
    setIsSimulating(false);
    setHasSimulated(true);
    setTimeout(() => {
      document.getElementById('ai-top-bets-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSimulationCancel = () => {
    setIsSimulating(false);
  };

  const handeAddBet = (bet: Omit<BetPick, 'id'>) => {
    const newBet = { ...bet, id: crypto.randomUUID() };
    setBetSlip(prev => [...prev, newBet]);
  };

  // ─── AI Pick My Bets — uses real ESPN games + AI engine ──────────────────────
  const handleAIPicks = useCallback(async () => {
    if (isAIPickLoading) return;
    setIsAIPickLoading(true);
    const today = new Date().toISOString().split('T')[0];

    // All sports we can fetch from ESPN today
    const sportKeys = Object.entries(APP_SPORT_TO_ESPN).filter(([, v]) => v != null) as [string, SportKey][];

    // Candidate picks with scored confidence
    type Candidate = BetPick & { score: number };
    const candidates: Candidate[] = [];

    await Promise.allSettled(
      sportKeys.map(async ([sportLabel, espnKey]) => {
        try {
          const games: ESPNGame[] = await fetchESPNScoreboardByDate(espnKey, today);
          for (const game of games) {
            const pred = generateAIPrediction(
              game.homeTeam.record,
              game.awayTeam.record,
              sportLabel,
              [], // last-5 form (fast mode, no extra fetch)
              [],
            );

            const matchupStr = `${game.awayTeam.displayName} vs ${game.homeTeam.displayName}`;
            const gameId = `espn-${game.id}`;
            const edge = Math.abs(pred.homeWinProb - 50); // 0–25, higher = bigger edge

            // ── Pick 1: Moneyline on the stronger side ──
            const mlFavors = pred.homeWinProb > pred.awayWinProb ? 'home' : 'away';
            // Only recommend ML if edge > 10% (meaningful advantage)
            if (edge > 10) {
              const mlTeam = mlFavors === 'home' ? game.homeTeam.displayName : game.awayTeam.displayName;
              const mlOdds = mlFavors === 'home' ? pred.moneylineHome : pred.moneylineAway;
              candidates.push({
                id: `ai-ml-${game.id}`,
                gameId,
                type: 'ML',
                team: `${mlTeam} ML`,
                odds: mlOdds,
                matchupStr,
                stake: 50,
                score: pred.confidence + edge * 1.2,
              });
            }

            // ── Pick 2: Spread on favourite if edge is significant ──
            if (edge > 7) {
              const spreadSide = pred.homeWinProb > 50 ? 'home' : 'away';
              const spreadTeam = spreadSide === 'home' ? game.homeTeam.displayName : game.awayTeam.displayName;
              // Negate spread for away favourite (they cover the spread against home)
              const rawSpread = parseFloat(pred.spread);
              const spreadDisplay = spreadSide === 'home'
                ? `${rawSpread >= 0 ? '+' : ''}${rawSpread}`
                : `${(-rawSpread) >= 0 ? '+' : ''}${(-rawSpread).toFixed(1)}`;
              candidates.push({
                id: `ai-spread-${game.id}`,
                gameId,
                type: 'Spread',
                team: `${spreadTeam} ${spreadDisplay}`,
                odds: '-110',
                matchupStr,
                stake: 50,
                score: pred.confidence + edge * 0.8,
              });
            }

            // ── Pick 3: Over/Under — pick the line the AI prefers ──
            // Push Over when both teams are in form (high homeForm + awayForm implied by high total)
            const ouScore = pred.confidence * 0.7;
            candidates.push({
              id: `ai-ou-${game.id}`,
              gameId,
              type: pred.overUnderPick === 'Over' ? 'Over' : 'Under',
              team: `${pred.overUnderPick} ${pred.total}`,
              odds: '-110',
              matchupStr,
              stake: 50,
              score: ouScore,
            });
          }
        } catch { /* skip sport on API error */ }
      })
    );

    // Sort by score desc, pick top 5, deduplicate per game (max 1 pick per game)
    const seenGames = new Set<string>();
    const top = candidates
      .sort((a, b) => b.score - a.score)
      .filter(c => {
        if (seenGames.has(c.gameId)) return false;
        seenGames.add(c.gameId);
        return true;
      })
      .slice(0, 5)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ score, ...pick }) => ({ ...pick, id: crypto.randomUUID() }));

    if (top.length === 0) {
      // No ESPN games today — show an alert
      alert('No games found today for AI picks. Try selecting a different date or sport.');
    } else {
      setBetSlip(prev => [...prev.filter(p => !p.id.startsWith('ai-')), ...top]);
    }

    setIsAIPickLoading(false);
  }, [isAIPickLoading]);

  const isMarketingView = currentView === 'landing-page' || currentView === 'login-page';

  return (
    <RookieModeProvider>
      <div className="flex flex-col min-h-screen">
        {!isMarketingView && (
          <Header
            currentView={currentView}
            setCurrentView={setCurrentView}
            onAIPick={handleAIPicks}
            isAIPickLoading={isAIPickLoading}
          />
        )}

        <main className={`flex-1 ${!isMarketingView ? 'pt-[80px]' : ''}`}>
          {currentView === 'landing-page' && (
            <LandingPageView onNavigate={(view) => setCurrentView(view as ViewType)} />
          )}

          {currentView === 'login-page' && (
            <LoginPageView onNavigate={(view) => setCurrentView(view as ViewType)} />
          )}

          {currentView === 'live-board' && (
            <LiveBoard
              setCurrentView={setCurrentView}
              onSelectGame={setSelectedGame}
              betSlip={betSlip}
              setBetSlip={setBetSlip}
              onAddBet={handeAddBet}
            />
          )}

          {currentView === 'matchup-terminal' && selectedGame && (
            <MatchupTerminalView
              game={selectedGame}
              onAddBet={handeAddBet}
              hasSimulated={hasSimulated}
              onRunSimulation={handleRunSimulation}
              betSlip={betSlip}
              setBetSlip={setBetSlip}
            />
          )}

          {currentView === 'teams-directory' && (
            <TeamsDirectory />
          )}

          {currentView === 'sharp-tools' && (
            <SharpToolsView selectedGame={selectedGame} />
          )}

          {currentView === 'bankroll' && (
            <BankrollView />
          )}

          {currentView === 'popular-bets' && (
            <PopularBetsView />
          )}

          {currentView === 'saved-picks' && (
            <SavedPicksView />
          )}

          {currentView === 'value-finder' && (
            <ValueFinderView />
          )}
        </main>

        {!isMarketingView && (
          <>
            <GlobalNewsTicker />
            <Footer />
          </>
        )}

        <SimulationOverlay
          isOpen={isSimulating}
          onCancel={handleSimulationCancel}
          onComplete={handleSimulationComplete}
        />
      </div>
    </RookieModeProvider>
  );
}

export default App;
