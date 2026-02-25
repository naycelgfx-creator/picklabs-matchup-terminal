export interface OddsOutcome {
    name: string;
    price: number;
    description?: string;
}

export interface OddsMarket {
    key: string;
    last_update: string;
    outcomes: OddsOutcome[];
}

export interface SportsbookData {
    key: string;               // e.g. "draftkings", "fanduel"
    title: string;             // e.g. "DraftKings", "FanDuel"
    last_update: string;
    markets: OddsMarket[];
}

export interface OddsEvent {
    id: string;                // The specific internal generic event ID for the sport
    sport_key: string;
    sport_title: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: SportsbookData[];
}

// SIMULATION TOGGLE
// If true, the service will return mock realistic data (for before the user pastes their real key)
// If false, it will attempt to hit https://api.the-odds-api.com using VITE_ODDS_API_KEY
const SIMULATION_MODE = false;

const API_KEY = import.meta.env.VITE_ODDS_API_KEY || '';
const BASE_URL = 'https://api.the-odds-api.com/v4/sports';

/**
 * Fetches Live Odds for a given sport.
 * 
 * In Production: Hits The Odds API to get real, actionable Selection IDs for Deep Linking.
 * In Simulation: Generates structural dummies.
 */
export async function fetchLiveOdds(sportKey: string = 'upcoming', markets: string = 'h2h'): Promise<OddsEvent[]> {
    if (SIMULATION_MODE || !API_KEY) {
        console.log(`[OddsService] Running in SIMULATION MODE. Fetching mock odds for sport: ${sportKey}, markets: ${markets}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(generateMockOddsResponse(sportKey));
            }, 800);
        });
    }

    try {
        const response = await fetch(`${BASE_URL}/${sportKey}/odds/?apiKey=${API_KEY}&regions=us&markets=${markets}&oddsFormat=american`);

        if (!response.ok) {
            console.error('[OddsService] Failed to fetch odds from Real API:', response.statusText);
            throw new Error(`API returned ${response.status}`);
        }

        const data: OddsEvent[] = await response.json();
        return data;
    } catch (error) {
        console.error('[OddsService] Error communicating with The Odds API:', error);
        return [];
    }
}

/**
 * A helper function that builds the deep link required to open a sportsbook app/website
 * and directly place a specific selection into the user's bet slip.
 * 
 * Note: Each sportsbook uses wildly different deep linking formats.
 */
export function buildSportsbookDeepLink(sportsbookKey: string, selectionId: string): string {
    switch (sportsbookKey.toLowerCase()) {
        case 'draftkings':
            // DraftKings uses the 'dksl' parameter on their gateway
            return `https://sportsbook.draftkings.com/gateway?dksl=${selectionId}`;

        case 'fanduel':
            // FanDuel accepts 'selectionId'
            return `https://sportsbook.fanduel.com/betslip?selectionId=${selectionId}`;

        case 'betmgm':
            return `https://sports.betmgm.com/en/sports?selectionId=${selectionId}`;

        case 'caesars':
            // Caesars can be state specific, defaulting to a generic route
            return `https://sportsbook.caesars.com/us/il/bet/betslip?selectionId=${selectionId}`;

        case 'hard_rock':
            return `https://hardrock.bet/?selectionId=${selectionId}`;

        case 'thescore':
            return `https://thescore.bet/?selectionId=${selectionId}`;

        default:
            console.warn(`[OddsService] Auto-Link logic not defined for ${sportsbookKey}. Defaulting to homepage.`);
            return `https://www.google.com/search?q=${sportsbookKey}+sportsbook`;
    }
}

/**
 * Generates a mock structural response mimicking exactly what The Odds API returns.
 * This ensures the frontend UI component logic works perfectly without burning real API credits during development.
 */
function generateMockOddsResponse(sportKey: string): OddsEvent[] {
    const fakeBookmakers: SportsbookData[] = [
        {
            key: 'draftkings',
            title: 'DraftKings',
            last_update: new Date().toISOString(),
            markets: [{
                key: 'h2h',
                last_update: new Date().toISOString(),
                outcomes: [
                    { name: "Los Angeles Lakers", price: -150, description: "ML" },
                    { name: "Boston Celtics", price: 130, description: "ML" }
                ]
            }]
        },
        {
            key: 'fanduel',
            title: 'FanDuel',
            last_update: new Date().toISOString(),
            markets: [{
                key: 'h2h',
                last_update: new Date().toISOString(),
                outcomes: [
                    { name: "Los Angeles Lakers", price: -155, description: "ML" },
                    { name: "Boston Celtics", price: 135, description: "ML" }
                ]
            }]
        }
    ];

    return [
        {
            id: `mock-event-${Math.floor(Math.random() * 1000)}`,
            sport_key: sportKey,
            sport_title: sportKey.toUpperCase(),
            commence_time: new Date(Date.now() + 86400000).toISOString(),
            home_team: "Los Angeles Lakers",
            away_team: "Boston Celtics",
            bookmakers: fakeBookmakers
        }
    ];
}
