import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles, Volume2, VolumeX, BookOpen, ChevronRight, Check } from 'lucide-react';
import { getCuritibaShabbatTimes, fetchLiveCuritibaShabbatTimes } from '../utils/shabbatTimes';

interface ShabbatWidgetProps {
  onLearnMore?: () => void;
}

export const ShabbatWidget: React.FC<ShabbatWidgetProps> = ({ onLearnMore }) => {
  const [times, setTimes] = useState(getCuritibaShabbatTimes());
  const [showBlessing, setShowBlessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLiveCuritibaShabbatTimes().then(liveTimes => {
      setTimes(liveTimes);
    });

    const timer = setInterval(() => {
      setTimes(getCuritibaShabbatTimes());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyTimes = () => {
    const text = `🕯️ Horários de Shabat em Curitiba (Beit Chabad do Paraná):\n• Parashat: ${times.parashaName}\n• Acendimento das Velas: ${times.candleLighting}\n• Havdalá: ${times.havdalah}\n• Data: ${times.nextShabbatDate}\n\nShabat Shalom! ✨`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-chabad-pine via-chabad to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-luxury relative overflow-hidden border border-chabad-gold/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-chabad-gold/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-chabad-gold/20 border border-chabad-gold/40 flex items-center justify-center text-chabad-gold">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                <span>Shabat em Curitiba</span>
                <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-chabad-gold/20 text-chabad-gold border border-chabad-gold/30">
                  Ao Vivo
                </span>
              </h3>
              <p className="text-xs text-emerald-200/90">{times.hebrewDate}</p>
            </div>
          </div>

          <button
            onClick={handleCopyTimes}
            className="text-xs bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-white/15 transition-all flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Sparkles className="w-3.5 h-3.5 text-chabad-gold" />}
            <span>{copied ? 'Copiado!' : 'Compartilhar Horários'}</span>
          </button>
        </div>

        {/* Parasha & Times Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Candle Lighting */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 hover:border-chabad-gold/40 transition-all">
            <div className="flex items-center justify-between text-xs text-chabad-goldLight mb-1.5">
              <span className="font-medium uppercase tracking-wider">Acendimento das Velas</span>
              <Flame className="w-4 h-4 text-chabad-gold" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">
              {times.candleLighting}
            </div>
            <div className="text-xs text-slate-300">
              Sexta-feira (20 min antes do pôr do sol • Chabad)
            </div>
          </div>

          {/* Havdalah */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 hover:border-chabad-gold/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-chabad-goldLight mb-1.5">
                <span className="font-medium uppercase tracking-wider">Havdalá (Término)</span>
                <Sparkles className="w-4 h-4 text-chabad-gold" />
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">
                {times.havdalah}
              </div>
              <div className="text-xs text-slate-300">
                Sábado à noite (saída das estrelas / 45m)
              </div>
            </div>
            <div className="text-[11px] text-amber-200/90 mt-2 pt-2 border-t border-white/10 leading-snug">
              * Se coincidir com Yom Tov, a Havdalá é feita somente após o término do Yom Tov.
            </div>
          </div>

          {/* Parashat Hashavua */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 hover:border-chabad-gold/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-chabad-goldLight mb-1.5">
                <span className="font-medium uppercase tracking-wider">Parashat HaShavua</span>
                <BookOpen className="w-4 h-4 text-chabad-gold" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-chabad-gold mb-1">
                {times.parashaName}
              </div>
            </div>
            <div className="text-xs text-emerald-200 flex items-center justify-between pt-2">
              <span>{times.nextShabbatDate}</span>
              <a
                href="https://www.chabad.org/calendar/zmanim_cdo/locationid/34568/locationtype/1/city/Curitiba/country/Brazil/jewish/Zmanim.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-chabad-gold font-medium flex items-center text-xs underline"
              >
                Chabad.org <ChevronRight className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Countdown Box */}
        <div className="bg-black/25 rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <Clock className="w-5 h-5 text-chabad-gold hidden sm:block shrink-0" />
            <div>
              <div className="text-xs text-slate-300">Contagem regressiva para o acendimento:</div>
              <div className="font-mono text-lg sm:text-xl font-bold text-chabad-goldLight">
                {times.candlesCountdown.days > 0 && `${times.candlesCountdown.days}d `}
                {times.candlesCountdown.hours}h {times.candlesCountdown.minutes}m {times.candlesCountdown.seconds}s
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowBlessing(!showBlessing)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-chabad-gold hover:bg-yellow-500 text-chabad-dark transition-all shadow-md flex items-center space-x-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{showBlessing ? 'Ocultar Bênção' : 'Ver Bênção das Velas'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Blessing Section */}
        {showBlessing && (
          <div className="mt-5 p-5 bg-chabad-dark/80 rounded-2xl border border-chabad-gold/40 animate-in fade-in slide-in-from-top-3 duration-200 text-center">
            <div className="text-chabad-gold font-bold text-xs uppercase tracking-widest mb-2">
              Bênção para o Acendimento das Velas de Shabat
            </div>
            
            {/* Hebrew */}
            <div className="font-serif text-xl sm:text-2xl text-amber-200 my-3 leading-relaxed" dir="rtl">
              בָּרוּךְ אַתָּה ה' אֱ-לֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהַדְלִיק נֵר שֶׁל שַׁבָּת קֹדֶשׁ.
            </div>

            {/* Transliteration */}
            <div className="text-sm font-medium text-slate-200 italic mb-2">
              "Baruch Atá Ado-nai Elo-hênu Melech Haolam, Asher Kideshánu Bemitsvotav Vetsivánu Lehadlik Ner Shel Shabat Kodesh."
            </div>

            {/* Portuguese */}
            <div className="text-xs text-slate-300 max-w-xl mx-auto">
              "Bendito és Tu, Senhor nosso D-us, Rei do Universo, que nos santificou com Seus mandamentos e nos ordenou acender a vela do sagrado Shabat."
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
