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
                        <span className="text-xs text-stone-400 font-bold tracking-widest uppercase mt-1 block">TerraCraft Deluxe v1.0.0</span>
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
                            <p><strong>PC Kontrolleri:</strong> <kbd className="bg-stone-700 px-1 rounded">W A S D</kbd> ile hareket, <kbd className="bg-stone-700 px-1 rounded">E</kbd> veya <kbd className="bg-stone-700 px-1 rounded">Boşluk</kbd> ile yemeği al/ver. <kbd className="bg-stone-700 px-1 rounded">F</kbd> veya <kbd className="bg-stone-700 px-1 rounded">Q</kbd> ile kavgaya gir.</p>
                            <p><strong>Mobil Kontroller:</strong> Ekrondaki Joystick ile hareket, sağ alttaki renkli butonlarla eşya taşı ve kavga et.</p>
                            <p><strong>Can Sistemi:</strong> Sabrı biten (kırmızı bar) müşteri küfür ederek çıkar, 1 Kalbin 🖤 gider ve paran düşer. 3 Kalp biterse oyun biter.</p>
                            <p><strong>Gece Pazarı:</strong> Her günün sonunda (Gece) dükkanı büyütebilir, yeni fırınlar alabilir ve kaybettiğin kalbini (<span className="text-rose-400 font-bold">$75</span>) satın alabilirsin.</p>
                        </div>
                    </section>

                    {/* Yeni Özellikler (Mevcut Güncelleme) */}
                    <section>
                        <h3 className="text-xl font-black text-sky-400 mb-3 uppercase tracking-wider border-b border-sky-900 pb-2">🚀 Son Güncellemeler (Yeni)</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-3">
                                <span className="text-2xl">👊</span>
                                <div>
                                    <strong className="text-stone-100 flex items-center gap-2">Müşteri Dövme Sistemi</strong>
                                    <p className="text-stone-400 mt-1">Kaba saba (Rude & Recep) müşterilere <kbd className="bg-stone-800 text-xs px-1 rounded">F</kbd> veya DÖV butonu ile vurabilirsiniz! Müşteri en fazla 4 yumruk yer. 4. vuruşta mekanı sinirle terk eder. Kibar insanlara vurmak <span className="text-rose-400">-$20</span> ceza yazdırır!</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-2xl">🚔</span>
                                <div>
                                    <strong className="text-stone-100 flex items-center gap-2">İntikamcı Çeteler (Thug)</strong>
                                    <p className="text-stone-400 mt-1">Belalı tipleri (Recep gibi) döverseniz veya kışkırtırsanız, ileriki saatlerde mekanı intikam için 3-4 koca yürekli "Thug" mafya üyesi basar!</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-2xl">🗣️</span>
                                <div>
                                    <strong className="text-stone-100 flex items-center gap-2">Recep İvedik & Yeni Diyaloglar</strong>
                                    <p className="text-stone-400 mt-1">Kızgın müşteriler, mekanı terk edenler ve yemek yerken konuşanlar için +300'den fazla yepyeni ve komik diyaloglar eklendi.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-2xl">⚙️</span>
                                <div>
                                    <strong className="text-stone-100 flex items-center gap-2">UI & Yaşam Kalitesi</strong>
                                    <p className="text-stone-400 mt-1">Kayıp kalpler artık siyah (🖤) görünüyor. Gece mağazasından $75'a ekstra can alabilme eklendi. Sesli sohbet düzeltildi.</p>
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
