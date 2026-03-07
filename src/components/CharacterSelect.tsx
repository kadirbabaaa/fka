import React, { useState } from 'react';
import { CHARACTER_TYPES, COLORS } from '../types/game';
import { MARKET_NAME } from '../constants';

interface CharacterSelectProps {
    isConnected: boolean;
    playerName: string;
    setPlayerName: (v: string) => void;
    playerColor: string;
    setPlayerColor: (v: string) => void;
    playerHat: string;
    setPlayerHat: (v: string) => void;
    charType: number;
    setCharType: (v: number) => void;
    marketName: string;
    setMarketName: (v: string) => void;
    onJoin: (e: React.FormEvent) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
    isConnected,
    playerName, setPlayerName,
    playerColor, setPlayerColor,
    playerHat, setPlayerHat,
    charType, setCharType,
    marketName, setMarketName,
    onJoin,
}) => {
    const selectedChar = CHARACTER_TYPES[charType] ?? CHARACTER_TYPES[0];

    return (
        <div className="w-full min-h-dvh bg-stone-900 flex items-center justify-center p-4 overflow-y-auto safe-top safe-bottom">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
                <h1 className="text-3xl font-black text-center mb-1 text-stone-800">{MARKET_NAME} 🏪</h1>
                <p className="text-center text-stone-500 mb-6 font-medium text-sm">Karakterini seç ve dükkana gir!</p>

                <form onSubmit={onJoin} className="space-y-5">
                    {/* Bağlantı durumu */}
                    <div className="flex items-center justify-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-xs font-bold text-stone-500">
                            {isConnected ? 'Sunucuya Bağlı' : 'Sunucuya Bağlanıyor...'}
                        </span>
                    </div>

                    {/* İsim */}
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">👤 Adın</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={e => setPlayerName(e.target.value)}
                            maxLength={10}
                            placeholder="Örn: Aşkım"
                            className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-blue-500 outline-none transition-colors text-base font-medium"
                            required
                        />
                    </div>

                    {/* Karakter Tipi — Kart seçimi */}
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">🧑‍🍳 Karakterin</label>
                        <div className="grid grid-cols-3 gap-2">
                            {CHARACTER_TYPES.map((c, i) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => {
                                        setCharType(i);
                                        setPlayerHat(c.hat);
                                        setPlayerColor(c.bodyColor);
                                    }}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${charType === i
                                            ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                                        }`}
                                    style={{
                                        borderColor: charType === i ? c.accent : undefined,
                                        backgroundColor: charType === i ? `${c.accent}18` : undefined,
                                    }}
                                >
                                    <span className="text-3xl">{c.hat}</span>
                                    <span className="text-xs font-black text-stone-700">{c.name}</span>
                                    <span className="text-[10px] text-stone-400">{c.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Renk özelleştirme (opsiyonel) */}
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wide">🎨 Kıyafet Rengi</label>
                        <div className="flex gap-2 justify-between">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setPlayerColor(c)}
                                    className={`w-9 h-9 rounded-full transition-transform ${playerColor === c ? 'scale-125 ring-4 ring-offset-2 ring-stone-800' : 'hover:scale-110'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Market İsmi */}
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">🏪 Market İsmi</label>
                        <input
                            type="text"
                            value={marketName}
                            onChange={e => setMarketName(e.target.value)}
                            maxLength={20}
                            placeholder="Örn: Bizim Market"
                            className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-blue-500 outline-none transition-colors text-base font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 font-black text-lg transition-all active:scale-95 shadow-lg text-white rounded-xl"
                        style={{ backgroundColor: selectedChar.accent }}
                    >
                        DÜKKANA GİR 🚀
                    </button>
                </form>
            </div>
        </div>
    );
};
