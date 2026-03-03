import { useState, useEffect } from 'react';
import { ESPNRosterAthlete, fetchESPNRosterBySport } from './apiClient';

export function useESPNRoster(teamName: string, sport: string) {
    const [players, setPlayers] = useState<ESPNRosterAthlete[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!teamName || !sport) return;

        let mounted = true;
        setLoading(true);
        setError(null);

        fetchESPNRosterBySport(teamName, sport)
            .then(data => {
                if (mounted) {
                    setPlayers(data);
                    setLoading(false);
                }
            })
            .catch(e => {
                if (mounted) {
                    setError(e);
                    setLoading(false);
                }
            });

        return () => { mounted = false; };
    }, [teamName, sport]);

    return { players, loading, error };
}
