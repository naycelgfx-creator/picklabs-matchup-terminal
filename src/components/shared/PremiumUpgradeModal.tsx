import React from 'react';
import { ViewType } from './PremiumLockView';

interface PremiumUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (v: ViewType) => void;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({ isOpen, onClose, onNavigate }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-sm bg-neutral-900 border border-amber-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-slide-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <span className="material-symbols-outlined text-3xl text-amber-500">lock</span>
                    </div>

                    <h2 className="text-2xl font-black italic uppercase text-text-main mb-2 tracking-tight">
                        Premium Feature
                    </h2>

                    <p className="text-xs text-text-muted mb-6 leading-relaxed">
                        You have exhausted your <span className="text-amber-500 font-bold">20 AI Action Squares</span> for this week.
                        Upgrade to <span className="text-white font-bold">Premium</span> to continue using AI predictions, Matchup Terminal, and unlock unlimited analytics.
                    </p>

                    <button
                        onClick={() => {
                            onClose();
                            onNavigate('landing-page'); // Or 'subscription-page' if it exists
                        }}
                        className="w-full py-3 bg-amber-500 text-neutral-900 font-black uppercase tracking-[0.2em] italic rounded-xl hover:bg-amber-400 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">workspace_premium</span>
                        Upgrade Now
                    </button>

                    <button
                        onClick={onClose}
                        className="mt-3 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};
