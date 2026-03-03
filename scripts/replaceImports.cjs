const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function (filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // Replace imports
        content = content.replace(/from\s+['"]([^'"]*)data\/espnScoreboard['"]/g, "from '$1data/apiClient'");
        content = content.replace(/from\s+['"]([^'"]*)data\/apiSportsService['"]/g, "from '$1data/apiClient'");
        content = content.replace(/from\s+['"]([^'"]*)data\/espnService['"]/g, "from '$1data/apiClient'");

        // Replace function calls
        content = content.replace(/fetchESPNScoreboardByDate/g, 'fetchScoreboard');
        content = content.replace(/fetchMultiSportScoreboard/g, 'fetchScoreboard'); // Popular bets view

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated:', filePath);
        }
    }
});
