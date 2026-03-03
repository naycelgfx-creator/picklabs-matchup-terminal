const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const PicklabsEspnEngine = require('./picklabsEspnService');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Cache (standard TTL of 60 seconds to prevent over-fetching from ESPN)
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Initialize ESPN Engine
const espnEngine = new PicklabsEspnEngine();

/**
 * Helper middleware to check cache before calling the Engine.
 */
const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.log(`[CACHE HIT] ${key}`);
        return res.json(cachedResponse);
    }

    console.log(`[CACHE MISS] ${key}`);
    // Attach a utility to the response to easily cache the data on its way out
    res.sendResponse = res.json;
    res.json = (body) => {
        cache.set(key, body);
        res.sendResponse(body);
    };
    next();
};

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// 1. LIVE SCORES & ODDS
app.get('/api/data/:sport/:league/scoreboard', cacheMiddleware, async (req, res) => {
    const { sport, league } = req.params;
    const { dates } = req.query;
    const data = await espnEngine.getScoreboard(sport, league, dates);
    if (!data) return res.status(502).json({ error: 'Failed to fetch scoreboard' });
    res.json(data);
});

// 2. PLAY-BY-PLAY & SUMMARY
app.get('/api/data/:sport/:league/summary/:eventId', cacheMiddleware, async (req, res) => {
    const { sport, league, eventId } = req.params;
    const data = await espnEngine.getGameSummary(sport, league, eventId);
    if (!data) return res.status(502).json({ error: 'Failed to fetch game summary' });
    res.json(data);
});

// 3. STANDINGS
app.get('/api/data/:sport/:league/standings', cacheMiddleware, async (req, res) => {
    const { sport, league } = req.params;
    const data = await espnEngine.getStandings(sport, league);
    if (!data) return res.status(502).json({ error: 'Failed to fetch standings' });
    res.json(data);
});

// 4. LEADERS
app.get('/api/data/:sport/:league/leaders', cacheMiddleware, async (req, res) => {
    const { sport, league } = req.params;
    const data = await espnEngine.getLeaders(sport, league);
    if (!data) return res.status(502).json({ error: 'Failed to fetch leaders' });
    res.json(data);
});

// 5. BREAKING NEWS
app.get('/api/data/:sport/:league/news', cacheMiddleware, async (req, res) => {
    const { sport, league } = req.params;
    const data = await espnEngine.getNews(sport, league);
    if (!data) return res.status(502).json({ error: 'Failed to fetch news' });
    res.json(data);
});

// 6. TEAMS (Logos & Colors)
app.get('/api/data/:sport/:league/teams', cacheMiddleware, async (req, res) => {
    const { sport, league } = req.params;
    const data = await espnEngine.getTeams(sport, league);
    if (!data) return res.status(502).json({ error: 'Failed to fetch teams' });
    res.json(data);
});

// 6b. TEAM ROSTER
app.get('/api/data/:sport/:league/teams/:teamId/roster', cacheMiddleware, async (req, res) => {
    const { sport, league, teamId } = req.params;
    const data = await espnEngine.getRoster(sport, league, teamId);
    if (!data) return res.status(502).json({ error: 'Failed to fetch team roster' });
    res.json(data);
});

// 7. ATHLETE DEEP DIVE
app.get('/api/data/:sport/:league/athletes/:athleteId', cacheMiddleware, async (req, res) => {
    const { sport, league, athleteId } = req.params;
    const data = await espnEngine.getAthlete(sport, league, athleteId);
    if (!data) return res.status(502).json({ error: 'Failed to fetch athlete profile' });
    res.json(data);
});

// 8. ATHLETE STATISTICS LOG
app.get('/api/data/:sport/:league/athletes/:athleteId/statisticslog', cacheMiddleware, async (req, res) => {
    const { sport, league, athleteId } = req.params;
    const data = await espnEngine.getAthleteStatisticsLog(sport, league, athleteId);
    if (!data) return res.status(502).json({ error: 'Failed to fetch athlete statistics log' });
    res.json(data);
});

// 9. SCHEDULE (For racing logic)
app.get('/api/data/:sport/:league/schedule', cacheMiddleware, async (req, res) => {
    const { sport, league } = req.params;
    const data = await espnEngine.getSchedule(sport, league);
    if (!data) return res.status(502).json({ error: 'Failed to fetch schedule' });
    res.json(data);
});

// Start the server
app.listen(port, () => {
    console.log(`=========================================`);
    console.log(`🚀 Picklabs Master Engine running on port ${port}`);
    console.log(`=========================================`);
});
