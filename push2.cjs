const { execSync } = require('child_process');
const fs = require('fs');

const git = '"C:\\Program Files\\Git\\cmd\\git.exe"';

try {
    const token = fs.readFileSync('github_token.txt', 'utf8').trim();
    execSync(git + ' remote set-url origin https://oauth2:' + token + '@github.com/naycelgfx-creator/picklabs-matchup-terminal.git');
    execSync(git + ' push -u origin main');

    console.log('Successfully pushed to GitHub!');
    fs.unlinkSync('github_token.txt');
    fs.unlinkSync('push.cjs');
    fs.unlinkSync('push2.cjs');
} catch (e) {
    console.error('Error during git execution:');
    if (e.stdout) console.error('STDOUT:', e.stdout.toString());
    if (e.stderr) console.error('STDERR:', e.stderr.toString());
    console.error(e.message);
}
