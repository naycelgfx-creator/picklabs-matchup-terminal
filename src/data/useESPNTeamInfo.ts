import { useState } from 'react';

export function useESPNTeamInfo(teamName: string, sport: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [info, setInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    return { info, loading, error: null };
}
