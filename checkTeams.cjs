const fs = require('fs');

async function run() {
    try {
        const fifa = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams?limit=100').then(r => r.json());
        const fifaTeams = fifa.sports[0].leagues[0].teams.map(t => t.team.name);

        const wbc = await fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/world-baseball-classic/teams?limit=100').then(r => r.json());
        const wbcTeams = wbc.sports[0] ? wbc.sports[0].leagues[0].teams.map(t => t.team.name) : [];

        const cws = await fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/caribbean-series/teams?limit=100').then(r => r.json());
        const cwsTeams = cws.sports[0] ? cws.sports[0].leagues[0].teams.map(t => t.team.name) : [];

        console.log("FIFA:", fifaTeams);
        console.log("WBC:", wbcTeams);
        console.log("CWS:", cwsTeams);
    } catch (e) {
        console.error(e);
    }
}
run();
