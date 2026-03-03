// espnDataFetcher.js

/**
 * Fetches team details, colors, and their high-res logo.
 */
async function getTeamInfoAndLogo(sport, league, teamId) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/teams/${teamId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const teamData = data.team;

        const teamName = teamData.displayName;
        const color = teamData.color || '000000';
        const logoUrl = teamData.logos?.[0]?.href || 'No logo found';

        console.log(`--- ${teamName.toUpperCase()} ---`);
        console.log(`Primary Color: #${color}`);
        console.log(`Logo URL: ${logoUrl}\n`);

        return teamData;
    } catch (error) {
        console.error(`Error fetching team data: ${error.message}`);
        return null;
    }
}

/**
 * Fetches the active roster for a team and their transparent PNG headshots.
 */
async function getTeamRosterAndHeadshots(sport, league, teamId) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/teams/${teamId}/roster`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const athletes = data.athletes || [];

        console.log(`--- ROSTER DATA FOUND ---`);

        athletes.forEach(playerGroup => {
            const items = playerGroup.items || [];
            items.forEach(item => {
                const fullName = item.fullName;
                const position = item.position?.abbreviation || 'N/A';
                const headshotUrl = item.headshot?.href || 'No headshot available';

                console.log(`${fullName} (${position})`);
                console.log(`Image: ${headshotUrl}`);
                console.log('--------------------');
            });
        });

        return athletes;
    } catch (error) {
        console.error(`Error fetching roster data: ${error.message}`);
        return null;
    }
}

// ==========================================
// Run the Code (Example: NFL - Kansas City Chiefs)
// ==========================================
const SPORT = 'football';
const LEAGUE = 'nfl';
const TEAM_ID = '15'; // Chiefs ID

// Execute the functions
getTeamInfoAndLogo(SPORT, LEAGUE, TEAM_ID);
getTeamRosterAndHeadshots(SPORT, LEAGUE, TEAM_ID);
