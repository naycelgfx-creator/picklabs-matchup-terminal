import React from 'react';
import { GlobalNewsTicker } from './GlobalNewsTicker';
import { TextHoverEffect, FooterBackgroundGradient } from '../ui/hover-footer';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-border-muted bg-background-dark mt-auto relative overflow-hidden">
            {/* News Ticker — stays in footer, scrolls at readable speed */}
            <GlobalNewsTicker />

            {/* PICKLABS hover text — green outline, green glow on hover */}
            <div className="lg:flex hidden h-48 -mb-10 relative z-10">
                <TextHoverEffect text="PICKLABS" duration={0.15} />
            </div>

            {/* Copyright info */}
            <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                <div className="flex items-center gap-4 opacity-50">
                    <img src="/xcc.svg" alt="XCC" className="h-6 w-auto opacity-80" onError={(e) => { e.currentTarget.src = '/picklabs-logo.svg'; }} />
                    <div>
                        <p className="font-black text-text-main text-sm uppercase italic">PickLabs Advanced Matchup Terminal</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">POWERED BY NAYCELGFX LLC©</p>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        © 2026 PICKLABS. ALL RIGHTS RESERVED.
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        <span className="text-red-500 font-black">21+</span> FOR ENTERTAINMENT ONLY. PLEASE GAMBLE RESPONSIBLY.
                    </p>
                </div>
            </div>

            {/* Subtle green radial background */}
            <FooterBackgroundGradient />
        </footer>
    );
};
