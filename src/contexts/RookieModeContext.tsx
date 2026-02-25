/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RookieModeContextType {
    isRookieModeActive: boolean;
    toggleRookieMode: () => void;
}

const RookieModeContext = createContext<RookieModeContextType | undefined>(undefined);

export const RookieModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isRookieModeActive, setIsRookieModeActive] = useState<boolean>(false);

    const toggleRookieMode = () => {
        setIsRookieModeActive(prev => !prev);
    };

    return (
        <RookieModeContext.Provider value={{ isRookieModeActive, toggleRookieMode }}>
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
