const axios = require('axios');

/**
 * The Master Engine for Picklabs.
 * This dynamically fetches anything from ESPN's servers.
 */
class PicklabsEspnEngine {
    constructor() {
        this.baseUrlSite = 'https://site.api.espn.com/apis/site/v2/sports';
        this.baseUrlCore = 'https://sports.core.api.espn.com/v2/sports';
    }

    /**
     * Universal fetcher with error handling to prevent app crashes
     */
    async fetchData(url) {
        try {
            const response = await axios.get(url, { timeout: 10000 });
            return response.data;
        } catch (error) {
            console.error(`Picklabs Lab Error: Failed to fetch data from ${url}. ${error.message}`);
            return null;
        }
    }

    // --- 1. GET LIVE SCORES & ODDS ---
    async getScoreboard(sport, league, dates) {
        let url = `${this.baseUrlSite}/${sport}/${league}/scoreboard`;
        if (dates) {
            // ESPN requires dates as YYYYMMDD with no hyphens
            const cleanDate = dates.replace(/-/g, '');
            url += `?dates=${cleanDate}`;
        }
        console.log(`[ESPN API] Fetching Live Scores for ${league.toUpperCase()} on ${dates || 'today'}...`);
        return await this.fetchData(url);
    }

    // --- 2. GET PLAY-BY-PLAY & BOX SCORE ---
    async getGameSummary(sport, league, eventId) {
        const url = `${this.baseUrlSite}/${sport}/${league}/summary?event=${eventId}`;
        console.log(`[ESPN API] Fetching Game Summary for Event ${eventId}...`);
        return await this.fetchData(url);
    }

    // --- 3. GET LEAGUE STANDINGS ---
    async getStandings(sport, league) {
        // Note: Standings url is slightly different (apis/v2 instead of apis/site/v2)
        const url = `https://site.api.espn.com/apis/v2/sports/${sport}/${league}/standings`;
        console.log(`[ESPN API] Fetching Standings for ${league.toUpperCase()}...`);
        return await this.fetchData(url);
    }

    // --- 4. GET LEAGUE LEADERS ---
    async getLeaders(sport, league) {
        const url = `https://site.api.espn.com/apis/site/v3/sports/${sport}/${league}/leaders`;
        console.log(`[ESPN API] Fetching Leaders for ${league.toUpperCase()}...`);
        return await this.fetchData(url);
    }

    // --- 5. GET BREAKING NEWS ---
    async getNews(sport, league) {
        const url = `${this.baseUrlSite}/${sport}/${league}/news`;
        console.log(`[ESPN API] Fetching News for ${league.toUpperCase()}...`);
        return await this.fetchData(url);
    }

    // --- 6. GET TEAMS (Colors & Logos) ---
    async getTeams(sport, league) {
        const url = `${this.baseUrlSite}/${sport}/${league}/teams`;
        console.log(`[ESPN API] Fetching Teams for ${league.toUpperCase()}...`);
        return await this.fetchData(url);
    }

    // --- 7. GET ATHLETE DEEP DIVE ---
    async getAthlete(sport, league, athleteId) {
        const url = `https://site.api.espn.com/apis/common/v3/sports/${sport}/${league}/athletes/${athleteId}`;
        console.log(`[ESPN API] Fetching Athlete Profile (ID: ${athleteId})...`);
        return await this.fetchData(url);
    }

    // --- 8. GET TEAM ROSTER ---
    async getRoster(sport, league, teamId) {
        const url = `${this.baseUrlSite}/${sport}/${league}/teams/${teamId}/roster`;
        console.log(`[ESPN API] Fetching Roster for Team ${teamId}...`);
        return await this.fetchData(url);
    }

    // --- 9. GET ATHLETE STATISTICS LOG ---
    async getAthleteStatisticsLog(sport, league, athleteId) {
        const url = `${this.baseUrlCore}/${sport}/leagues/${league}/athletes/${athleteId}/statisticslog`;
        console.log(`[ESPN API] Fetching Statistics Log for Athlete ${athleteId}...`);
        return await this.fetchData(url);
    }

    // --- 10. GET LEAGUE SCHEDULE ---
    async getSchedule(sport, league) {
        // Schedule is traditionally fetched from the Site API
        const url = `${this.baseUrlSite}/${sport}/${league}/schedule`;
        console.log(`[ESPN API] Fetching Schedule for ${league.toUpperCase()}...`);
        return await this.fetchData(url);
    }
}

module.exports = PicklabsEspnEngine;
