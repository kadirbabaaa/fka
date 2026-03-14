import React from 'react';

interface Props {
    onClose: () => void;
}

export const PatchNotesModal: React.FC<Props> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl max-h-[90vh] bg-stone-900 border border-stone-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-200">
                {/* Header */}
                <div className="bg-stone-800 p-5 flex justify-between items-center border-b border-stone-700">
                    <div>
                        <h2 className="text-2xl font-black text-amber-400">Yama Notları & Rehber 📜</h2>
                        <span className="text-xs text-stone-400 font-bold tracking-widest uppercase mt-1 block">TerraCraft Deluxe v1.1.0</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-stone-700 hover:bg-stone-600 rounded-full flex items-center justify-center text-xl font-bold transition-transform active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                {/* İçerik Gövdesi */}
                <div className="p-6 overflow-y-auto space-y-8 no-scrollbar pb-10">

                    {/* Nasıl Oynanır? */}
                    <section>
                        <h3 className="text-xl font-black text-emerald-400 mb-3 uppercase tracking-wider border-b border-emerald-900 pb-2">🎮 Nasıl Oynanır?</h3>
                        <div className="space-y-2 text-sm text-stone-300">
                            <p><strong>Amaç:</strong> Gelen müşterileri bekletmeden siparişlerini servis et ve dükkanı iflastan kurtar.</p>
                            <p><strong>PC Kontrolleri:</strong> <kbd className="bg-stone-700 px-1 rounded">W A S D</kbd> veya <kbd className="bg-stone-700 px-1 rounded">Ok Tuşları</kbd> ile hareket, <kbd className="bg-stone-700 px-1 rounded">E</kbd> veya <kbd className="bg-stone-700 px-1 rounded">Boşluk</kbd> ile yemeği al/ver. <kbd className="bg-stone-700 px-1 rounded">F</kbd> veya <kbd className="bg-stone-700 px-1 rounded">Q</kbd> ile kavgaya gir.</p>
                            <p><strong>Mobil Kontroller:</strong> Ekrondaki Joystick ile hareket, sağ alttaki renkli butonlarla eşya taşı ve kavga et.</p>
                            <p><strong>Can Sistemi:</strong> Sabrı biten (kırmızı bar) müşteri küfür ederek çıkar, 1 Kalbin 🖤 gider ve paran düşer. 3 Kalp biterse oyun biter.</p>
                            <p><strong>Gece Pazarı:</strong> Her günün sonunda (Gece) dükkanı büyütebilir, yeni fırınlar alabilir ve kaybettiğin kalbini (<span className="text-rose-400 font-bold">$75</span>) satın alabilirsin.</p>
                        </div>
                    </section>

                    {/* Yeni Özellikler (Mevcut Güncelleme) */}
                    <section>
                        <h3 className="text-xl font-black text-sky-400 mb-3 uppercase tracking-wider border-b border-sky-900 pb-2">🚀 Son Güncellemeler (v1.1.0)</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-3">
                                <span className="text-2xl">🍜</span>
                                <div>
                                    <strong className="text-stone-100 flex items-center gap-2">Yeni Menü: Çorba & Dürüm</strong>
                                    <p className="text-stone-400 mt-1">Restoran menüsü genişledi! Artık müşteriler 🍜 Çorba ve 🌯 Dürüm (Kebap) sipariş edebiliyor. Mutfaktaki yeni istasyonları kullanmayı unutma!</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-2xl">🔥</span>
                                <div>
                                    <strong className="text-stone-100 flex items-center gap-2">Gelişmiş Pişirme & Efektler</strong>
                                    <p className="text-stone-400 mt-1">Fırınlar artık duman çıkarıyor! Pişme süreci dairesel % göstergesiyle takip ediliyor. Yemek piştikten sonra yanmaya başlarsa yanan bir 🔥 ikonu ve tehlike barı belirir.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-2xl">🧺</span>
                                <div>
                                    <strong className="text-stone-100 flex items-center gap-2">PlateUp Tarzı Taşıma</strong>
                                    <p className="text-stone-400 mt-1">Yemek taşıma animasyonları yenilendi! Karakter artık eşyaları iki eliyle önünde tutuyor ve yürürken yemekler dinamik olarak aşağı yukarı zıplıyor (bobbing).</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-2xl">🛒</span>
                                <div>
                                    <strong className="text-stone-100 flex items-center gap-2">Yeni Upgrade Sistemi</strong>
                                    <p className="text-stone-400 mt-1">Gece dükkanında artık ek fırınlar (toplam 4) satın alabilirsin. Upgrade maliyetleri ve müşteri sabrı daha dengeli hale getirildi.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-2xl">🔄</span>
                                <div>
                                    <strong className="text-stone-100 flex items-center gap-2">Gelişmiş Oyun Döngüsü</strong>
                                    <p className="text-stone-400 mt-1">Game Over olduğunda skordan %20 ceza ile kaldığın günden devam edebilirsin. Gün geçişleri ve müşteri oturma yönleri (ön/arka koltuk) düzeltildi.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* Gelecek Güncellemeler */}
                    <section>
                        <h3 className="text-xl font-black text-purple-400 mb-3 uppercase tracking-wider border-b border-purple-900 pb-2">🔮 Yakında Gelecekler</h3>
                        <ul className="space-y-2 text-sm text-stone-300 list-disc pl-5">
                            <li><strong>Ölçeklenen Zorluk:</strong> Sunucuya çok oyuncu girdiğinde müşteriler daha hızlı gelecek ve daha az sabırlı olacaklar! (Takım işi şart)</li>
                            <li><strong>İçecek / Konserve İstasyonu:</strong> Sadece fırında pişen tabaklar yerine, tıklar tıklamaz müşteriye verebileceğiniz soğuk içecek stantları.</li>
                            <li><strong>Zor Mod (Hardcore):</strong> Sadece tek 1 kalbiniz olduğu ve ekstra canın satılmadığı "Tek Hata = Game Over" oyun modu!</li>
                            <li><strong>Kesme Tahtası (Prep Station):</strong> Eti ve sebzeyi fırına atmadan önce 2 saniye doğramanız gereken hazırlık aşamaları (Overcooked Tarzı).</li>
                            <li><strong>Co-Op Eşya Fırlatma:</strong> Arkadaşınıza tabak takımı veya eti uzaktan fırlatabilme mekaniği.</li>
                        </ul>
                    </section>

                </div>
            </div>
        </div>
    );
};
