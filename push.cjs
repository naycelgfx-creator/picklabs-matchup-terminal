const { execSync } = require('child_process');
const fs = require('fs');

const git = '"C:\\Program Files\\Git\\cmd\\git.exe"';

try {
    execSync(git + ' init');
    execSync(git + ' config user.name "NaycelGfx"');
    execSync(git + ' config user.email "naycel@example.com"');
    execSync(git + ' add .');
    execSync(git + ' commit -m "Initial commit"');

    const token = fs.readFileSync('github_token.txt', 'utf8').trim();
    execSync(git + ' remote add origin https://oauth2:' + token + '@github.com/naycelgfx-creator/picklabs-matchup-terminal.git');
    execSync(git + ' branch -M main');
    execSync(git + ' push -u origin main');

    console.log('Successfully pushed to GitHub!');
    fs.unlinkSync('github_token.txt');
} catch (e) {
    console.error('Error during git execution:');
    if (e.stdout) console.error('STDOUT:', e.stdout.toString());
    if (e.stderr) console.error('STDERR:', e.stderr.toString());
    console.error(e.message);
}
