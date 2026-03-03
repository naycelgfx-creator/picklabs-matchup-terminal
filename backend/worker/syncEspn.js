const cron = require('node-cron');
const { pool } = require('./db');

// 2. The Formulas (Leagues you want to track)
const ACTIVE_LEAGUES = [
    { sport: 'football', league: 'nfl' },
    { sport: 'football', league: 'college-football' },
    { sport: 'basketball', league: 'nba' },
    { sport: 'basketball', league: 'wnba' },
    { sport: 'basketball', league: 'mens-college-basketball' },
    { sport: 'basketball', league: 'womens-college-basketball' },
    { sport: 'baseball', league: 'mlb' },
    { sport: 'baseball', league: 'college-baseball' },
    { sport: 'baseball', league: 'college-softball' },
    { sport: 'baseball', league: 'world-baseball-classic' },
    { sport: 'baseball', league: 'llb' },
    { sport: 'baseball', league: 'dominican-winter-league' },
    { sport: 'baseball', league: 'mexican-winter-league' },
    { sport: 'hockey', league: 'nhl' },
    { sport: 'hockey', league: 'mens-college-hockey' },
    { sport: 'soccer', league: 'eng.1' },
    { sport: 'soccer', league: 'eng.2' },
    { sport: 'soccer', league: 'esp.1' },
    { sport: 'soccer', league: 'ita.1' },
    { sport: 'soccer', league: 'ger.1' },
    { sport: 'soccer', league: 'fra.1' },
    { sport: 'soccer', league: 'usa.1' },
    { sport: 'soccer', league: 'mex.1' },
    { sport: 'soccer', league: 'uefa.champions' },
    { sport: 'soccer', league: 'uefa.europa' },
    { sport: 'soccer', league: 'fifa.world' },
    { sport: 'soccer', league: 'all' },
    { sport: 'mma', league: 'ufc' },
    { sport: 'boxing', league: 'boxing' },
    { sport: 'racing', league: 'f1' },
    { sport: 'racing', league: 'nascar' },
    { sport: 'racing', league: 'indycar' },
    { sport: 'golf', league: 'pga' },
    { sport: 'golf', league: 'lpga' },
    { sport: 'golf', league: 'eur' },
    { sport: 'tennis', league: 'atp' },
    { sport: 'tennis', league: 'wta' },
    { sport: 'volleyball', league: 'mens-college-volleyball' },
    { sport: 'volleyball', league: 'womens-college-volleyball' },
    { sport: 'lacrosse', league: 'mens-college-lacrosse' },
    { sport: 'lacrosse', league: 'womens-college-lacrosse' }
];

// 3. The Fetch & Sync Function
async function syncEspnData() {
    console.log('🧪 [Picklabs Worker] Fetching live data from ESPN...');

    for (const { sport, league } of ACTIVE_LEAGUES) {
        const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const events = data.events || [];

            for (const event of events) {
                const gameId = event.id;
                const competition = event.competitions[0];
                const statusDetails = event.status;

                // Find Home and Away teams (fallback to index 0/1 for non-team sports like golf, racing, tennis)
                const homeTeam = competition.competitors.find(c => c.homeAway === 'home') || competition.competitors[0] || { team: { id: '0', displayName: 'TBD' }, score: '0' };
                const awayTeam = competition.competitors.find(c => c.homeAway === 'away') || competition.competitors[1] || { team: { id: '0', displayName: 'TBD' }, score: '0' };

                // Extract basic data
                const startTime = event.date; // UTC timestamp
                const status = statusDetails.type.name; // e.g., 'STATUS_SCHEDULED', 'STATUS_IN_PROGRESS'
                const currentPeriod = statusDetails.period;
                const clock = statusDetails.displayClock;

                // Parse odds if they exist (ESPN puts them in competition.odds)
                const oddsData = competition.odds ? competition.odds[0] : null;
                const liveOdds = {
                    spread: oddsData?.details || 'N/A',
                    overUnder: oddsData?.overUnder || 'N/A'
                };

                // Extract sport-specific data (e.g., possession in NFL)
                let sportSpecific = {};
                if (sport === 'football' && competition.situation) {
                    sportSpecific = {
                        down: competition.situation.down,
                        distance: competition.situation.distance,
                        possession: competition.situation.possession
                    };
                }

                // 4. The UPSERT Query (Insert if new game, Update if it already exists)
                const query = `
          INSERT INTO games_cache (
            game_id, sport, league, start_time, status, 
            home_team_id, home_team_name, home_score, 
            away_team_id, away_team_name, away_score, 
            current_period, clock, live_odds, sport_specific, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW()
          )
          ON CONFLICT (game_id) DO UPDATE SET
            status = EXCLUDED.status,
            home_score = EXCLUDED.home_score,
            away_score = EXCLUDED.away_score,
            current_period = EXCLUDED.current_period,
            clock = EXCLUDED.clock,
            live_odds = EXCLUDED.live_odds,
            sport_specific = EXCLUDED.sport_specific,
            updated_at = NOW();
        `;

                const values = [
                    gameId, sport, league, startTime, status,
                    homeTeam.team.id, homeTeam.team.displayName, parseInt(homeTeam.score) || 0,
                    awayTeam.team.id, awayTeam.team.displayName, parseInt(awayTeam.score) || 0,
                    currentPeriod, clock,
                    JSON.stringify(liveOdds),
                    JSON.stringify(sportSpecific)
                ];

                await pool.query(query, values);
            }
        } catch (error) {
            console.error(`❌ Error syncing ${league.toUpperCase()}:`, error.message);
        }
    }
    console.log('✅ [Picklabs Worker] Database sync complete.');
}

// 5. Schedule the Cron Job to run every 30 seconds
// The syntax '*/30 * * * * *' means "run every 30th second"
cron.schedule('*/30 * * * * *', () => {
    syncEspnData();
});

console.log('⚙️ Picklabs Background Worker started. Listening every 30 seconds...');
