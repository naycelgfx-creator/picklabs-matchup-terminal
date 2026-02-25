export interface PlayerLog {
    id: string;
    date: string;
    opponent: string;
    result: 'W' | 'L';
    stat1: number;
    stat2: number;
    stat3: number;
    minutes: string;
}

export interface PlayerProp {
    id: string;
    type: string;
    line: number;
    overOdds: string;
    underOdds: string;
    impliedProb: number;
    oppRank: { rank: number; team: string; color: 'green' | 'red' | 'yellow' };
    l5: number[];
    l10: number[];
    l20: number[];
    h2h: number[];
    season2025: number[];
    dkOdds: string;
    fdOdds: string;
    mgmOdds: string;
}

export interface Player {
    id: string;
    name: string;
    teamName: string;
    photoUrl: string;
    position: string;
    age: number;
    height: string;  // e.g. '6-7'
    weight: number;  // lbs
    college: string;
    salary: string;  // e.g. '$34.2M'
    seasonAvg: {
        stat1: number;
        stat2: number;
        stat3: number;
        stat4: number;
    };
    recentLogs: PlayerLog[];
    props: PlayerProp[];
}

const FIRST_NAMES = ['James', 'Michael', 'Robert', 'David', 'William', 'John', 'Thomas', 'Kevin', 'Jason', 'Matthew', 'Alex', 'Chris'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const COLLEGES = [
    'Kentucky', 'Duke', 'Kansas', 'North Carolina', 'UCLA', 'Michigan', 'Gonzaga',
    'Indiana', 'Arizona', 'Louisville', 'Ohio State', 'Texas', 'Florida', 'Connecticut',
    'Syracuse', 'Georgetown', 'Villanova', 'Memphis', 'UNLV', 'Oklahoma'
];

const SPORT_STATS: Record<string, { pos: string[], stat1: string, stat2: string, stat3: string, stat4: string, defaultLines: number[] }> = {
    NBA: { pos: ['PG', 'SG', 'SF', 'PF', 'C'], stat1: 'PTS', stat2: 'REB', stat3: 'AST', stat4: '3PM', defaultLines: [24.5, 8.5, 6.5, 2.5] },
    NFL: { pos: ['QB', 'RB', 'WR', 'TE'], stat1: 'YDS', stat2: 'REC', stat3: 'TD', stat4: 'TGT', defaultLines: [250.5, 5.5, 0.5, 8.5] },
    MLB: { pos: ['SP', '1B', 'OF', 'SS'], stat1: 'H', stat2: 'RBI', stat3: 'HR', stat4: 'OBP', defaultLines: [1.5, 0.5, 0.5, 0.350] },
    NHL: { pos: ['C', 'LW', 'RW', 'D'], stat1: 'G', stat2: 'A', stat3: 'SOG', stat4: 'HIT', defaultLines: [0.5, 0.5, 2.5, 3.5] },
    Soccer: { pos: ['ST', 'CAM', 'LW', 'RW'], stat1: 'G', stat2: 'A', stat3: 'SHT', stat4: 'SOT', defaultLines: [0.5, 0.5, 2.5, 1.5] },
    Tennis: { pos: ['Player'], stat1: 'ACES', stat2: 'DF', stat3: 'WIN%', stat4: 'BPS', defaultLines: [8.5, 3.5, 50.5, 4.5] },
    Golf: { pos: ['Golfer'], stat1: 'BIR', stat2: 'BOG', stat3: 'EAG', stat4: 'PAR', defaultLines: [4.5, 2.5, 0.5, 12.5] },
    UFC: { pos: ['Fighter'], stat1: 'SIG.STR', stat2: 'TD', stat3: 'SUB', stat4: 'KD', defaultLines: [55.5, 1.5, 0.5, 0.5] },
    Esports: { pos: ['Entry', 'IGL', 'AWP'], stat1: 'K', stat2: 'D', stat3: 'A', stat4: 'HS%', defaultLines: [18.5, 15.5, 5.5, 45.5] }
};

export const getSportStatLabels = (sport: string) => {
    return SPORT_STATS[sport] || SPORT_STATS['NBA'];
};

export const generateMockPlayers = (teamName: string, sport: string, count: number = 3): Player[] => {
    const config = SPORT_STATS[sport] || SPORT_STATS['NBA'];

    return Array.from({ length: count }).map((_, i) => {
        const id = `${teamName.replace(/\s+/g, '-').toLowerCase()}-player-${i + 1}`;
        let actualName = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;

        const avg1 = +(Math.random() * (config.defaultLines[0] * 1.5)).toFixed(1);
        const avg2 = +(Math.random() * (config.defaultLines[1] * 1.5)).toFixed(1);
        const avg3 = +(Math.random() * (config.defaultLines[2] * 1.5)).toFixed(1);
        const avg4 = +(Math.random() * (config.defaultLines[3] * 1.5)).toFixed(1);

        const recentLogs: PlayerLog[] = Array.from({ length: 5 }).map((_, j) => {
            const date = new Date();
            date.setDate(date.getDate() - (j * 3 + 1)); // Past games Every ~3 days

            return {
                id: `${id}-log-${j}`,
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                opponent: `@ Opp ${j + 1}`,
                result: Math.random() > 0.5 ? 'W' : 'L',
                stat1: Math.max(0, Math.floor(avg1 + (Math.random() * 10 - 5))),
                stat2: Math.max(0, Math.floor(avg2 + (Math.random() * 4 - 2))),
                stat3: Math.max(0, Math.floor(avg3 + (Math.random() * 3 - 1))),
                minutes: `${Math.floor(Math.random() * 20) + 20}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
            };
        });

        const generateTrend = (length: number) => {
            return Array.from({ length }).map(() => Math.floor(Math.random() * 101));
        };

        const props: PlayerProp[] = [
            {
                id: `${id}-prop-1`,
                type: config.stat1,
                line: config.defaultLines[0],
                overOdds: `-1${Math.floor(Math.random() * 20 + 10)}`,
                underOdds: `+1${Math.floor(Math.random() * 20 + 10)}`,
                impliedProb: Math.floor(Math.random() * 40) + 40,
                oppRank: { rank: Math.floor(Math.random() * 30) + 1, team: 'CLE', color: Math.random() > 0.6 ? 'green' : Math.random() > 0.3 ? 'red' : 'yellow' },
                l5: generateTrend(5),
                l10: generateTrend(5), // Just reusing 5 elements for UI brevity, though it represents L10
                l20: generateTrend(5),
                h2h: generateTrend(5),
                season2025: generateTrend(5),
                dkOdds: `-1${Math.floor(Math.random() * 20 + 10)}`,
                fdOdds: `-1${Math.floor(Math.random() * 20 + 10)}`,
                mgmOdds: `-1${Math.floor(Math.random() * 20 + 10)}`
            },
            {
                id: `${id}-prop-2`,
                type: config.stat2,
                line: config.defaultLines[1],
                overOdds: `-110`,
                underOdds: `-110`,
                impliedProb: Math.floor(Math.random() * 40) + 40,
                oppRank: { rank: Math.floor(Math.random() * 30) + 1, team: 'OKC', color: Math.random() > 0.6 ? 'green' : Math.random() > 0.3 ? 'red' : 'yellow' },
                l5: generateTrend(5),
                l10: generateTrend(5),
                l20: generateTrend(5),
                h2h: generateTrend(5),
                season2025: generateTrend(5),
                dkOdds: `-110`,
                fdOdds: `-112`,
                mgmOdds: `-108`
            },
            {
                id: `${id}-prop-3`,
                type: config.stat3,
                line: config.defaultLines[2],
                overOdds: `+1${Math.floor(Math.random() * 50 + 10)}`,
                underOdds: `-1${Math.floor(Math.random() * 50 + 10)}`,
                impliedProb: Math.floor(Math.random() * 40) + 40,
                oppRank: { rank: Math.floor(Math.random() * 30) + 1, team: 'BOS', color: Math.random() > 0.6 ? 'green' : Math.random() > 0.3 ? 'red' : 'yellow' },
                l5: generateTrend(5),
                l10: generateTrend(5),
                l20: generateTrend(5),
                h2h: generateTrend(5),
                season2025: generateTrend(5),
                dkOdds: `+1${Math.floor(Math.random() * 50 + 10)}`,
                fdOdds: `+1${Math.floor(Math.random() * 50 + 10)}`,
                mgmOdds: `+1${Math.floor(Math.random() * 50 + 10)}`
            }
        ];

        // Mock Headshots logic
        let photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(actualName)}&background=random&color=fff&rounded=true`;

        if (sport === 'NBA') {
            // Assign some known superstar IDs specifically for this mock environment
            const REAL_NBA_PLAYERS: Record<string, { name: string, id: string }[]> = {
                'Lakers': [{ name: 'LeBron James', id: '1966' }, { name: 'Anthony Davis', id: '6583' }, { name: 'D\'Angelo Russell', id: '3136776' }, { name: 'Austin Reaves', id: '4397193' }, { name: 'Rui Hachimura', id: '4395651' }],
                'Celtics': [{ name: 'Jayson Tatum', id: '4065648' }, { name: 'Jaylen Brown', id: '3917376' }, { name: 'Jrue Holiday', id: '3995' }, { name: 'Derrick White', id: '4070232' }, { name: 'Kristaps Porzingis', id: '3102531' }],
                'Suns': [{ name: 'Devin Booker', id: '3136193' }, { name: 'Kevin Durant', id: '3202' }, { name: 'Bradley Beal', id: '6589' }, { name: 'Jusuf Nurkic', id: '3102530' }, { name: 'Grayson Allen', id: '3136198' }],
                'Nuggets': [{ name: 'Nikola Jokic', id: '3112335' }, { name: 'Jamal Murray', id: '3936299' }, { name: 'Michael Porter Jr.', id: '4239968' }, { name: 'Aaron Gordon', id: '3116743' }, { name: 'KCP', id: '2581' }],
                'Warriors': [{ name: 'Stephen Curry', id: '3975' }, { name: 'Draymond Green', id: '6589' }, { name: 'Andrew Wiggins', id: '3059319' }, { name: 'Klay Thompson', id: '6475' }, { name: 'Jonathan Kuminga', id: '4433247' }],
                'Heat': [{ name: 'Jimmy Butler', id: '6430' }, { name: 'Bam Adebayo', id: '4066261' }, { name: 'Tyler Herro', id: '4397011' }, { name: 'Terry Rozier', id: '3074752' }, { name: 'Duncan Robinson', id: '3157465' }],
                'Bulls': [{ name: 'Zach LaVine', id: '3064440' }, { name: 'DeMar DeRozan', id: '3978' }, { name: 'Nikola Vucevic', id: '6478' }, { name: 'Coby White', id: '4395651' }, { name: 'Alex Caruso', id: '3149673' }],
                'Knicks': [{ name: 'Jalen Brunson', id: '3934672' }, { name: 'Julius Randle', id: '3064514' }, { name: 'OG Anunoby', id: '3932223' }, { name: 'Josh Hart', id: '3136215' }, { name: 'Donte DiVincenzo', id: '3136195' }]
            };

            const knownTeamPlayers = REAL_NBA_PLAYERS[teamName];
            if (knownTeamPlayers && knownTeamPlayers[i]) {
                const player = knownTeamPlayers[i];
                actualName = player.name; // Override generated name with real name
                photoUrl = `https://a.espncdn.com/i/headshots/nba/players/full/${player.id}.png`;
            }
        }

        // Profile stats — deterministic-ish using index i
        const age = 20 + ((i * 3 + 2) % 17);  // 20–36
        const heightFeet = sport === 'NFL' ? (5 + ((i + 3) % 3)) : (6 + ((i + 1) % 3)); // 6-8 for NBA
        const heightInches = (i * 7 + 3) % 12;
        const weight = sport === 'NFL' ? (220 + (i * 17) % 120) : sport === 'NBA' ? (190 + (i * 11) % 90) : (175 + (i * 9) % 80);
        const college = COLLEGES[(i + teamName.length) % COLLEGES.length];
        const salaryBase = 2 + (i % 30);
        const salary = salaryBase > 20 ? `$${salaryBase}.${(i * 3) % 10}M` : `$${salaryBase}.${(i * 7) % 10}M`;

        return {
            id,
            name: actualName,
            teamName,
            photoUrl,
            position: config.pos[Math.floor(Math.random() * config.pos.length)],
            age,
            height: `${heightFeet}-${heightInches}`,
            weight,
            college,
            salary,
            seasonAvg: { stat1: avg1, stat2: avg2, stat3: avg3, stat4: avg4 },
            recentLogs,
            props
        };
    });
};
