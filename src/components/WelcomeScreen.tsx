import React from 'react';
import { MARKET_NAME } from '../constants';

interface WelcomeScreenProps {
    onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => (
    <div className="w-full h-full bg-gradient-to-b from-sky-400 via-sky-300 to-green-200 flex items-center justify-center p-4 overflow-hidden relative safe-top safe-bottom">
        {/* Bulutlar */}
        <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>☁️</div>
        <div className="absolute top-20 right-20 text-8xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>☁️</div>
        <div className="absolute top-40 left-1/3 text-7xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>☁️</div>
        <div className="absolute top-10 right-10 text-4xl animate-spin" style={{ animationDuration: '20s' }}>☀️</div>
        <div className="absolute bottom-10 left-10 text-5xl">🌳</div>
        <div className="absolute bottom-10 right-10 text-5xl">🌳</div>

        <div className="relative z-10 flex flex-col items-center">
            {/* Tabela */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-12 py-6 rounded-3xl shadow-2xl border-8 border-yellow-400 mb-8 animate-pulse">
                <h1 className="text-6xl md:text-8xl font-black text-white text-center tracking-tight" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>
                    {MARKET_NAME} 🏪
                </h1>
            </div>

            {/* Bina */}
            <div className="bg-gradient-to-b from-orange-100 to-orange-200 rounded-3xl p-8 shadow-2xl border-8 border-orange-800 relative">
                {/* Pencereler */}
                <div className="flex gap-6 mb-6">
                    {['🍕', '🍔', '🥗'].map(icon => (
                        <div key={icon} className="w-32 h-32 bg-sky-200 rounded-2xl border-4 border-orange-900 flex items-center justify-center text-6xl">
                            {icon}
                        </div>
                    ))}
                </div>

                {/* Kapı */}
                <div className="bg-gradient-to-b from-amber-700 to-amber-900 w-48 h-64 mx-auto rounded-t-3xl border-4 border-amber-950 flex flex-col items-center justify-center relative">
                    <div className="absolute top-4 text-4xl">🚪</div>
                    <button
                        onClick={onEnter}
                        className="mt-16 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-black text-2xl shadow-xl border-4 border-green-600 transition-all transform hover:scale-110 active:scale-95"
                    >
                        GİR 🚀
                    </button>
                </div>
            </div>

            <div className="w-full h-8 bg-green-600 rounded-full mt-4 shadow-lg" />
        </div>
    </div>
);
