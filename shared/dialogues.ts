export type Personality = 'polite' | 'rude' | 'recep' | 'thug';
export type DialogTrigger = 'entry' | 'waiting' | 'eating' | 'leaving_happy' | 'leaving_angry' | 'revenge';

export const DIALOGUES: Record<Personality, Record<DialogTrigger, string[]>> = {
    polite: {
        entry: [
            "Merhaba, kolay gelsin.", "Boş masa var mıdır?", "İyi günler şefim.", "Çok methettiler burayı.",
            "Selamlar, umarım yoğunsunuzdur.", "Kolaylıklar dilerim.", "Pardon, yer var mı?", "İyi çalışmalar, acıktım da.",
            "Güler yüzlü bir mekan, harika.", "Umarım güzel kokular mutfaktan geliyordur.", "Havanız çok hoşmuş, bayıldım.",
            "Açlıktan kendime gelemedim, ne şanslıyım ki buradayım.", "Hayırlı işler ustam.", "Kapıdan girer girmez iştahım açıldı.",
            "Selam, umarım menünüz zengindir.", "Arkadaşım tavsiye etti, deneyelim bakalım.", "İyi akşamlar, yeriniz var mı?",
            "Şahane bir mekan, tebrikler.", "Merhabalar, açlıktan başım döndü.", "Kolay gelsin, umarım boş yer vardır."
        ],
        waiting: [
            "Acaba siparişim yolda mı?", "Sabırsızlanıyorum doğrusu.", "Ortam çok nezihmiş.", "Müthiş kokular geliyor.",
            "Umarım çok beklemem.", "Garson bey/hanım, kolay gelsin.", "Biraz acıktım sanırım.", "Menüde hep güzel şeyler var.",
            "Dekorasyon cidden harika.", "Aşçı çok yoğun galiba.", "Burada müzik çok dinlendirici.", "Zaman geçmek bilmiyor, midem gurulduyor.",
            "Ustamın ellerine sağlık şimdiden.", "Diğer masalardaki yemekler çok iyi görünüyor.", "İçeceğimi yudumlarken sabırsızlıkla bekliyorum.",
            "Mutfaktaki telaş hoşuma gidiyor.", "Umarım siparişim sıradadır.", "Sabırla bekliyorum şefim.", "Kokular başımı döndürüyor.",
            "Biraz uzun sürdü sanırım, sorun değil."
        ],
        eating: [
            "Mmm, enfes olmuş.", "Tam istediğim gibi.", "Ellerinize sağlık, çok lezzetli.", "Tuzu tam kararında.",
            "Beklediğime değdi.", "Burası favori mekanım olacak.", "Aşçı işini gerçekten biliyor.", "Harika bir lezzet şöleni.",
            "Sıcacık servis edilmiş, teşekkürler.", "Çok güzelmiş, afiyetle yiyorum.", "Damağımda bıraktığı tat efsane.",
            "Porsiyonlar da oldukça doyurucuymuş.", "Malzemeler çok taze, belli oluyor.", "Gülümseten bir lezzet, bayıldım.",
            "Şefin ellerine sağlık, harika ötesi.", "Bu lezzeti herkese tavsiye edeceğim.", "Uzun zamandır böyle güzel yemek yemedim.",
            "Gerçekten övgüyü hak ediyor.", "Her lokması ayrı güzel.", "Sunum da lezzet kadar şahane."
        ],
        leaving_happy: [
            "Ellerinize sağlık, şahaneydi.", "Çok teşekkürler, yine geleceğim.", "Hayırlı işler, çok beğendim.", "Her şey mükemmeldi, sağ olun.",
            "Bol kazançlar dilerim.", "Gerçekten lezzetliydi, iyi günler.", "Üstü kalsın demeyi çok isterdim :)", "Mideniz bayram etti, tekrar görüşürüz.",
            "Çok naziksiniz, teşekkürler.", "Harika bir deneyimdi şefim.", "Görüşmek üzere, dostlarıma da tavsiye edeceğim.",
            "Bugün beni çok mutlu ettiniz, sağ olun.", "Yemeklerinize hayran kaldım, hoşça kalın.", "Müthiş bir servis, tekrar görüşmek üzere.",
            "İyi ki gelmişim, elinize sağlık.", "Çok keyifli bir akşamdı, teşekkürler.", "Hizmet kaliteniz harika.", "Yeni favori mekanım burası.",
            "Kazancınız bol olsun şefim.", "Tebrik ederim, işinizi iyi yapıyorsunuz."
        ],
        leaving_angry: [
            "Çok beklettiniz, maalesef gidiyorum.", "Hizmetiniz çok yavaş, üzgünüm.", "Vaktim yoktu, iptal edelim.",
            "Keşke biraz daha hızlı olsaydınız.", "Bu kadar da beklenmez ki canım.", "Açlıktan bayılmadığım için şanslıyım, gidiyorum.",
            "Bugün şanssız günümdeyim galiba.", "Maalesef hizmet sıfır.", "Bir daha geleceğimi sanmıyorum.", "Müşteri memnuniyeti hak getire...",
            "Bu ne sorumsuzluk, gidiyorum!", "Masada kök saldım resmen, pes!", "Böyle restoran mı olur, yazıklar olsun.",
            "Zamanım bitti, artık bekleyemeyeceğim.", "Müşteriye saygı kalmamış, elveda.", "Daha fazla bekleyemeyeceğim, kusura bakmayın.",
            "İlginiz çok zayıf, ayrılıyorum.", "Aç gelip aç gidiyorum, şaka gibi.", "Burası bana göre değilmiş.", "Hayal kırıklığına uğradım."
        ],
        revenge: [] // Polite tipler intikam almaz
    },
    rude: {
        entry: [
            "Hele şükür! Açız aç!", "Bana hemen masa verin.", "Boş yer yok mu ya bu ne kalabalık!", "Ustam karnımız zil çalıyor seri ol.",
            "Hadi bakalım, umarım zehirlenmeyiz.", "Yemekleri de inşallah tipinize benzemiyordur.", "Çabuk olun vaktim yok.",
            "Açlıktan masayı kemireceğim, yer verin.", "Kardeşim boş masa ayarlayın seri.", "Umarım o fırın sadece süs değildir.",
            "Hey! Bana bakacak kimse yok mu burada?", "Şu köşeyi bana ayarlayın hemen.", "Hızlı servis var dediler geldik, görelim bakalım.",
            "Kapıda ağaç olduk, hadi bir ilgilenin!", "Açım diyorum, şaka yapmıyorum!", "Lanet olsun çok açım, çabuk masa bulun!",
            "Burası niye bu kadar dolu ya!", "Ne dikiliyorsunuz orda, servis açın!", "Bugün sinirliyim zaten, beni bekletmeyin!",
            "Paramızla rezil olmaya gelmedik umarım."
        ],
        waiting: [
            "Nerde kaldı bu yemek kardeşim?!", "Ölelim mi açlıktan, hadi ya!", "Aşçı içeride uyudu herhalde.", "Siparişimi unuttunuz mu lan?",
            "Bizden sonrakilere gitti yemekler, ne iş!", "Ne kadar bekleyeceğiz daha?!", "Masayı yiyeceğim birazdan getirin şu yemeği.",
            "Hesabı ödeyecek adam bulamayacaksınız, açlıktan ölecem.", "Şefim fırına kedi mi kaçtı nerede yemek!", "Hızlanın biraz, kaplumbağa gibisiniz!",
            "Böyle yavaş servis hayatımda görmedim.", "Kendim pişirsem daha hızlı yemiştim.", "Uyuyor musunuz ayakta?!", "Aşçı fırını yeni yakıyor galiba.",
            "Kaç saat oldu, saymayı unuttum!", "Aga bu ne yavaşlık ya, sabrım taşıyor!", "Masaya yapışıp kaldık ulan!", "Yemeğin tarlasını mı sürüyorsunuz!",
            "Yemin ediyorum sinir krizi geçirecem şimdi!", "Getir ulan artık şu zıkkımı!"
        ],
        eating: [
            "İdare eder işte.", "Daha iyisini de yemiştim.", "Sos az olmuş ama yicez artık.", "Sıcakmış bare, neyse yiyelim.",
            "Bu ne biçim sunum kardeşim.", "Karnım doysun yeter, lezzet mühim değil.", "Aşçı bugün gününde değil herhalde.", "Yediğime değsin bare.",
            "Neyse ki açtım da göze batmıyor.", "Bir tık daha tuz koysanız iyiydi.", "Çok yağlı ama yutucaz mecbur.", "Görünüşü berbat ama tadı fena değil.",
            "Aç olmasam yemezdim bunu.", "Porsiyon da kuş yemi kadar.", "Soğumaya başlamış bile, rezalet!", "Yerken mideme oturdu valla.",
            "Plastik çiğniyorum sandım bi ara.", "Bu fiyata bu kalite... komedi.", "Çok pişmiş bu be, kömür gibi!", "Sosu iğrenç ama karnım aç."
        ],
        leaving_happy: [
            "Fena değildi, karnım doydu.", "Tuzu eksikti ama neyse artık.", "Hadi eyvallah.", "Paramın karşılığını yarım da olsa aldım.",
            "Yemek güzeldi ama servis yavaş! Gidiyorum.", "Eyvallah ustam.", "Daha iyi olabilirdi, neyse görüşürüz.", "Bu fiyata bu kadar, iyi günler.",
            "Bir dahakine daha hızlı olun.", "Hadi kolay gelsin, bahşiş beklemeyin.", "Doyduk çok şükür, gidiyorum ben.", "Bir daha yolum düşerse gelirim belki.",
            "Yemek fena değildi, hadi eyvallah.", "Gereksiz bekledik ama tadı kurtardı.", "Yedik içtik, kalkalım artık.", "Param gitti ama midem doldu.",
            "Çok övülecek bir şey yok, hadi bay.", "Şiştim lan, neyse eyvallah.", "Garson çok baktı ama doyduk sonunda.", "Sonraki sefere daha çok et isterim."
        ],
        leaving_angry: [
            "Sizin yapacağınız işe tüküreyim, gidiyorum ben!", "Bu ne rezalet, aç kaldık!", "Bir daha buraya adım atarsam iki olsun!",
            "Gidin başka iş yapın kardeşim siz!", "Müşteriyle nasıl ilgilenileceğini bilmiyorsunuz!", "Rezalet mekan! Kimseye tavsiye etmem!",
            "Hem yavaşsınız hem beceriksiz, yuh!", "Lanet olsun ya, restorana bak!", "Mekanı kapatın bence siz!", "Açlıktan bayılıcam, terbiyesizlik bu!",
            "Ben böyle saygısızlık görmedim!", "Bir tabak yemeği getiremediniz be!", "Zamanım sizin yüzünüzden çöpe gitti!",
            "Aptal gibi bekledik burada, lanet olsun!", "Şikayet edicem burayı, reziller!", "Burayı yakasım var şu an!", "Böyle işletmenin canı cehenneme!",
            "Aptal herifler, yürü git işine!", "Verdiğim saniye haram olsun!", "Polis çağırıcam lan rezalet bu!"
        ],
        revenge: [] // Rude'un revenge repliği yok, the Thug söyleyecek bunları
    },
    recep: {
        entry: [
            "Böhhhhhöööyyyt! Anam babam, erzağı yığın buraya!", "Agam menüyü komple bana getir!", "Lan bura ne biçim ahır, yemi suyu verin hemen!",
            "Hooooop! Şefim, acımdan duvarı tırmalayacam!", "Aslanım, İvedik geldi masayı donat!", "Bana ordan yağlı mağlı bir şeyler ateşle!",
            "Gonuşma lan! Direk yemeği getir!", "Midesi guruldayan bir canavar geldi açılın lan!", "Kim bakıyor ulan bu dükkana, açlıktan geberiyoz!",
            "Cüzdanı bıraktım eve ama midem dolu gidecem, hadi koçum!", "Hööööyt! Salih abiniz geldi mekana!", "Şşşt, alo! Midem isyanda, tez yemek getirin!",
            "Ulan dükkanın tapusunu üstüme mi yapsam napsam!", "Böhöhöyt, kokulara bak kafa yapıyor yeminle!", "Masanın en kralını bana ayırın lan dümbelekler!",
            "Pala remziye benzeyecem açlıktan, seri olun!", "Dana gibi yerim bugün valla, yığın masaya!", "Gürrül gürrül geldim, doymadan gitmem!",
            "Hadi oğlum şef! Şovunu yap görelim!", "Böhöhöyt! Ulan mekana bak civciv yuvası gibi!"
        ],
        waiting: [
            "Lan yavrum, pişmedi mi şu zıkkım!", "Anam babam beni mi sınıyonuz, çabuk olun!", "Agam bu fırının ateşi yetmiyor mu odun atayım mı?",
            "Ulan midem sırtıma yapıştı, hadi be!", "Bana bak aşçı parçası, gelmiyim oraya ha!", "Lan garson, nassı gidiyor? Yemeği yaktınız mı yoksa dümbelekler!",
            "Sabrım taşıyor, böhhhöyyyt fırlatıcam masayı şimdi!", "Lan oğlum öööyle bakma, yemeği getir yemeği!", "Agam ölecez açlıktan, gözüm dönüyor bak!",
            "Cık cık cık... Bu ne yavaşlık amk, kaplumbağa mısınız!", "Ulan yemeği tarladan mı biçip getiriyorsunuz?", "Lan açlıktan kendi kolumu kemiricem şimdi!",
            "Hadi lan, fırının içine girip ben pişirecem yemeği!", "Oğlum bak asabım bozuluyor, çabuk olun!", "Masa örtüsünü yicem az kaldı, getirin lan!",
            "Böhöhöyt! Ulan bittiniz siz, masa uçuyor bak!", "Ahıra çevircem burayı yemek gelmezse!", "Gözüm kararıyor lan, şekerim düştü amk!",
            "Ulan koca herif eridi aktı masada be!", "Garsooon! Alooooo! Duyan yok mu lan!"
        ],
        eating: [
            "Ammaaaan, loküm gibi loküm!", "Ulan yemin ediyorum sanat eseri be, hüpletirim bunu!", "Şlop şlop şlop... (hayvan gibi yeme sesleri)",
            "Lan bu nasıl sos, anaaam bayılacam lezzetten!", "Agam elinize sağlık, mideme cila çektim!", "Oha, yeminle 10 numara, ağzıma layık!",
            "Lan oğlum çok iyi bu, ver bir porsiyon daha!", "Ağağağağa çok sıcak be! Ama yiycem!", "İşte bu be, damak çatlatan dedikleri bu olsa gerek!",
            "(Öğğğk) Pardon geğirdim, çok efsane olmuş ustam!", "Hamm humm mmm... (Ağzı doluyken konuşma)", "Şap şup şap şup... Hayatımda yediğim en iyi zıkkım!",
            "Lan sosu burnuma kaçtı ama olsun, süper!", "Böhöhöyt! Porsiyon da bana göre maşallah!", "Dişim kırılsa da yicem bunu, o derece süper!",
            "Milyar versen bunu bırakmam arkadaş!", "Hadi lan! Yedikçe yiyesi geliyor adamın!", "Yaladım yuttum lan, tabak pırıl pırıl!",
            "Yeminle ağlıycam mutluluktan, bu ne olm!", "Ulan anam babam görse bu iştahla gurur duyar!"
        ],
        leaving_happy: [
            "Agam adamsınız be, tokadı basıp helalleşesim geldi!", "Lan oğlum çok doyurdu bu beni, eyvallah kocaman!", "Helal olsun ustam, paranın hakkını verdiniz de para yok!",
            "Yine gelecem oğlum, mönüyü bana ayırın!", "Anam babam ellerinize sağlık, şahanesiniz böhöhöyt!", "Aşçı bey, gel seni bi öpeyim anlından şapadanak!",
            "Burası benim mekan, adamın hasısınız lan!", "Hadi Allah'a emanet, karnımı davul gibi yaptınız sağolun!", "Siz bu işi biliyonuz, cillop gibi restoran valla!",
            "Böhöhöyt, eyvallah koçum bereket versin!", "Lan garson, bahşiş bekliyorsan avucunu yalarsın, hadi eyvallah!", "Ulan yemekler iyiydi de hesabı yandakine kilitledim ha!",
            "Canavara dönmüştüm, beni insanlığa geri döndürdünüz be!", "Hadi gari ben kaçar, dükkana mukayyet olun!", "Kürdanımı da aldım, sekiyorum buradan!",
            "Adamı vezir edersiniz vallahi, helal!", "Efsane ortam efsane tıkınmaca, böhöhöyt!", "Tüm sülaleyi toplayıp gelecem lan buraya!",
            "Kralını yesinler, en iyi mekanı bulmuşum amk!", "Ulan o kadar mutluyum ki havalara uçasım var!"
        ],
        leaving_angry: [
            "Ulan amk böyle işin, aç kaldık lan!", "Kapatın ulan bu dükkanı, rezalet yemin ediyorum!", "Lan oğlum dümbelek misiniz siz, yemek veremediniz be!",
            "Sizin yapacağınız mekana tüküreyim, gidiyom ben amk!", "Aç aç yolluyorsunuz adamı, Allah cezanızı verecek!", "Lan gelip fırını kafanıza geçirmeden gidiyorum, dua edin!",
            "O kadar bekledik bir cacık gelmedi, tövbe estağfurullah!", "Agam siz dükkancılık falan oynamayın bırakın bu işleri!", "Deli edersiniz lan adamı, gidip dürüm yiycem sokakta amk!",
            "Bu ne biçim çalışma tarzı lan, gidin çay satın siz ahrazlar!", "Ulan masayı kafanıza geçirmeden gidiyom, şanslısınız!", "Burayı esnaflar odasına şikayet etmezsem adam değilim!",
            "Açlıktan midem delindi ulan, böyle iş mi olur!", "Tepemi attırdınız lan, restorana bak kerhane gibi!", "Hadi lan oradan, sizin yapacağınız yemeğin içine edeyim!",
            "Masayı kırsam yeridir lan dümbelek takımı!", "Sabrımın sonuna geldik, siktirip gidiyom!", "Size verdiğim krediye yazıklar olsun amk!",
            "Dükkanınızı da yemeğinizi de başınıza çalın!", "Lan oğlum asabımı bozdunuz sizin ben yüzünüzü şey edeyim!"
        ],
        revenge: [] // Recep'in intikamcıları Thug tipi olacak
    },
    thug: { // YENİ: Vurulan müşterinin arkadaşları
        entry: [],
        waiting: [],
        eating: [],
        leaving_happy: [],
        leaving_angry: [],
        revenge: [
            "Nerde lan benim adamıma vuran o şerefsiz!",
            "Kim ulan benim kardeşime el kaldıran!",
            "Mekanı başınıza yıkmaya geldim ulan!",
            "Kardeşime vuran ellerinizi kırarım sizin!",
            "Adamsanız çıkın lan karşıma, teke tek!",
            "Arkadaşımın hesabı sorulacak lan burada!",
            "Topunuza dalarım ulan, bana kimi vurduğunu söyleyin!",
            "Dükkanı yakıcam lan, nerde o kabadayı!",
            "Şimdi bittiniz olm, aşçıyı fırına atıcam!",
            "Benim dostuma nasıl vurursunuz lan siz kahpeler!",
            "Ödettirmeye geldim, mekanın tapusunu alıcam!",
            "Yazıklar olsun ulan, müşteriye vurmak neymiş gösterecem!",
            "Karşim sen rahat ol, şimdi bunların kafasını ezicem!",
            "Lan o lavuk buraya gelecek yoksa dükkanı yıkarım!",
            "Gelin lan teker teker, hepinizi ipe dizicem!",
            "Kim ulan o efe! Çıksın karşıma çabuk!"
        ]
    }
};
