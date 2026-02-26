import { useEffect, useState, useCallback } from 'react';
import { fetchESPNRosterBySport, ESPNRosterAthlete } from './espnService';

export const useESPNRoster = (teamName: string, sport: string) => {
    const [players, setPlayers] = useState<ESPNRosterAthlete[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchESPNRosterBySport(teamName, sport);
            if (data.length === 0) {
                setError('No roster data available');
            } else {
                setPlayers(data);
            }
        } catch {
            setError('Failed to load roster from ESPN');
        } finally {
            setLoading(false);
        }
    }, [teamName, sport]);

    useEffect(() => {
        load();
    }, [load]);

    return { players, loading, error, refetch: load };
};
