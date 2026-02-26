/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RookieModeContextType {
    isRookieModeActive: boolean;
    toggleRookieMode: () => void;
    hasSeenTour: boolean;
    markTourSeen: () => void;
}

const RookieModeContext = createContext<RookieModeContextType | undefined>(undefined);

export const RookieModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isRookieModeActive, setIsRookieModeActive] = useState<boolean>(false);
    const [hasSeenTour, setHasSeenTour] = useState<boolean>(
        () => localStorage.getItem('picklabs_rookie_tour_seen') === 'true'
    );

    const toggleRookieMode = () => {
        setIsRookieModeActive(prev => !prev);
    };

    const markTourSeen = () => {
        setHasSeenTour(true);
        localStorage.setItem('picklabs_rookie_tour_seen', 'true');
    };

    return (
        <RookieModeContext.Provider value={{ isRookieModeActive, toggleRookieMode, hasSeenTour, markTourSeen }}>
            {children}
        </RookieModeContext.Provider>
    );
};

export const useRookieMode = (): RookieModeContextType => {
    const context = useContext(RookieModeContext);
    if (!context) {
        throw new Error('useRookieMode must be used within a RookieModeProvider');
    }
    return context;
};
