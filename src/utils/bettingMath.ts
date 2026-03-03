import { BetPick } from '../App';

export const parseAmericanOdds = (oddsStr: string | number): number => {
    if (typeof oddsStr === 'number') return oddsStr;
    const clean = oddsStr.replace(/[^0-9-]/g, '');
    const num = parseInt(clean, 10);
    return isNaN(num) ? -110 : num; // Default -110 if unparseable
};

export const americanToDecimal = (odds: number): number => {
    if (odds > 0) {
        return (odds / 100) + 1;
    } else if (odds < 0) {
        return (100 / Math.abs(odds)) + 1;
    }
    return 1;
};

export const decimalToAmerican = (decimal: number): number => {
    if (decimal >= 2.0) {
        return Math.round((decimal - 1) * 100);
    } else {
        return Math.round(-100 / (decimal - 1));
    }
};

export const calculateParlayOdds = (picks: Pick<BetPick, 'odds'>[]): string => {
    if (picks.length === 0) return '+100';

    let totalDecimal = 1.0;
    for (const p of picks) {
        const num = parseAmericanOdds(p.odds);
        totalDecimal *= americanToDecimal(num);
    }

    const american = decimalToAmerican(totalDecimal);
    return american > 0 ? `+${american}` : `${american}`;
};

export const toWin = (stake: number, americanOddsStr: string): number => {
    const odds = parseAmericanOdds(americanOddsStr);
    if (odds > 0) {
        return (stake * odds) / 100;
    } else if (odds < 0) {
        return (stake * 100) / Math.abs(odds);
    }
    return stake;
};

export interface LegCalculationData {
    odds: string | number;
    status: string;
}

export interface RecalculatedTicketResult {
    newAmericanOdds: string;
    newPayout: string; // To Win string rounded to 2 decimals
    activeLegs: number;
    status: 'active' | 'refunded';
}

/**
 * Recalculates parlay odds and payout, ignoring voided legs.
 * @param legs - Array of bet objects { odds: string | number, status: string }
 * @param riskAmount - The amount the user wagered (e.g., 100)
 */
export const recalculateTicket = (legs: LegCalculationData[], riskAmount: number): RecalculatedTicketResult => {
    let totalDecimalOdds = 1.0;
    let activeLegsCount = 0;

    for (const leg of legs) {
        if (leg.status === 'VOID') {
            continue;
        }

        activeLegsCount++;
        const numOdds = parseAmericanOdds(leg.odds);
        totalDecimalOdds *= americanToDecimal(numOdds);
    }

    if (activeLegsCount === 0) {
        return {
            newAmericanOdds: "VOID",
            newPayout: riskAmount.toFixed(2), // Original money back
            activeLegs: 0,
            status: "refunded"
        };
    }

    const newAmericanOddsNum = decimalToAmerican(totalDecimalOdds);
    const formattedAmericanOdds = newAmericanOddsNum > 0 ? `+${newAmericanOddsNum}` : `${newAmericanOddsNum}`;

    // Total payout from 100 risk amount = 100 * totalDecimalOdds
    // Our 'payout' usually means the pure profit (toWin) sometimes or 'to return'
    // His script says newPayout = riskAmount * totalDecimalOdds (meaning risk + profit returned)
    const newReturn = riskAmount * totalDecimalOdds;
    const profit = newReturn - riskAmount; // to match our app's "To Win" expectation usually

    return {
        newAmericanOdds: formattedAmericanOdds,
        newPayout: profit.toFixed(2),
        activeLegs: activeLegsCount,
        status: "active"
    };
};
