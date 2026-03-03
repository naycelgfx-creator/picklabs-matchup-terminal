/**
 * Picklabs AI Engine: Calculates the probability of a team winning or covering.
 * In a real app, 'teamData' would contain their actual stats fetched from your DB.
 */
function generateLabResult(homeTeamData, awayTeamData, spread) {
    // 1. Define the Weights (The secret formula)
    const weights = {
        recentForm: 0.40, // 40% importance
        homeCourt: 0.20,  // 20% importance
        headToHead: 0.15, // 15% importance
        health: 0.25      // 25% importance
    };

    // 2. Simulate raw scores (0 to 100) based on your database stats
    // Example: Home team has won 4 of last 5 (80/100 form)
    const homeScore =
        (homeTeamData.formScore * weights.recentForm) +
        (100 * weights.homeCourt) + // They get max points for being home
        (homeTeamData.h2hScore * weights.headToHead) +
        (homeTeamData.healthScore * weights.health);

    const awayScore =
        (awayTeamData.formScore * weights.recentForm) +
        (0 * weights.homeCourt) + // 0 points for home court
        (awayTeamData.h2hScore * weights.headToHead) +
        (awayTeamData.healthScore * weights.health);

    // 3. Calculate Confidence Percentage
    const totalScore = homeScore + awayScore;
    const homeConfidence = Math.round((homeScore / totalScore) * 100);
    const awayConfidence = Math.round((awayScore / totalScore) * 100);

    // 4. Formulate the "Lab Recommendation"
    let recommendation = "";
    let pick = "";

    if (homeConfidence >= 65) {
        pick = `${homeTeamData.name} ML`;
        recommendation = `High confidence! The ${homeTeamData.name} have a massive matchup advantage and are fully healthy.`;
    } else if (awayConfidence >= 65) {
        pick = `${awayTeamData.name} ML`;
        recommendation = `Strong value. Despite being away, their recent form outshines the home team.`;
    } else {
        pick = `Avoid Moneyline`;
        recommendation = `Too close to call (${homeConfidence}% to ${awayConfidence}%). Look at the Over/Under instead.`;
    }

    // 5. Return the payload to the frontend
    return {
        matchup: `${awayTeamData.name} @ ${homeTeamData.name}`,
        homeWinProbability: `${homeConfidence}%`,
        awayWinProbability: `${awayConfidence}%`,
        aiPick: pick,
        analysis: recommendation
    };
}

// === Test the Formula ===
// const bucksData = { name: "Milwaukee Bucks", formScore: 80, h2hScore: 60, healthScore: 90 };
// const celticsData = { name: "Boston Celtics", formScore: 85, h2hScore: 40, healthScore: 95 }; // Celtics are home
// 
// const result = generateLabResult(celticsData, bucksData, -4.5);
// console.log(result);

module.exports = { generateLabResult };
