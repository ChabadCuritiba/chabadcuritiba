import React, { useState } from 'react';
import { Calendar, Flame, Heart, BookOpen, CheckCircle2, Sparkles, Send, Loader2, Info } from 'lucide-react';
import { submitToChabadEmail, CHABAD_OFFICIAL_EMAIL } from '../utils/formSubmit';

interface YahrtzeitResult {
  hebrewDateOfDeath: string;
  hebrewLetters: string;
  nextHebrewYear: number;
  nextHebrewDateStr: string;
  nextHebrewLetters: string;
  eveDateFormatted: string;
  dayDateFormatted: string;
}

function translateHebrewMonthPt(hm: string): string {
  const map: Record<string, string> = {
    'Tishrei': 'Tishrei',
    'Cheshvan': 'Marcheshvan',
    'Kislev': 'Kislev',
    'Tevet': 'Tevet',
    'Shevat': 'Shevat',
    'Adar': 'Adar',
    'Adar I': 'Adar I',
    'Adar II': 'Adar II',
    'Nisan': 'Nissan',
    'Iyyar': 'Iyar',
    'Sivan': 'Sivan',
    'Tamuz': 'Tamuz',
    'Av': 'Menachem Av',
    'Elul': 'Elul'
  };
  return map[hm] || hm;
}

export const YahrtzeitPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [calcDate, setCalcDate] = useState('');
  const [afterSunset, setAfterSunset] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<YahrtzeitResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    deceasedHebrewName: '',
    fatherHebrewName: '',
    deceasedSecularName: '',
    secularDateOfDeath: '',
    relationship: 'Pai',
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    requestKaddish: true,
    requestAnnualReminder: true,
  });

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcDate) return;

    setIsCalculating(true);
    setCalcError(null);
    setCalcResult(null);

    try {
      const [y, m, d] = calcDate.split('-').map(Number);
      
      // 1. Get Hebrew date of passing
      const deathRes = await fetch(
        `https://www.hebcal.com/converter?cfg=json&gy=${y}&gm=${m}&gd=${d}&g2h=1${afterSunset ? '&afterSunset=1' : ''}`
      );
      if (!deathRes.ok) throw new Error('Erro ao converter data de falecimento.');
      const deathData = await deathRes.json();

      // 2. Get today's Hebrew year
      const now = new Date();
      const todayRes = await fetch(
        `https://www.hebcal.com/converter?cfg=json&gy=${now.getFullYear()}&gm=${now.getMonth() + 1}&gd=${now.getDate()}&g2h=1`
      );
      const todayData = await todayRes.json();

      let targetHy = todayData.hy || 5786;
      
      // 3. Convert that Hebrew date in the target Hebrew year to Gregorian
      let targetRes = await fetch(
        `https://www.hebcal.com/converter?cfg=json&hy=${targetHy}&hm=${encodeURIComponent(deathData.hm)}&hd=${deathData.hd}&h2g=1`
      );
      let targetData = await targetRes.json();

      let nextGregorianDate = new Date(targetData.gy, targetData.gm - 1, targetData.gd);
      
      // If the date in this Hebrew year has already passed, use next Hebrew year
      if (nextGregorianDate < now) {
        targetHy += 1;
        targetRes = await fetch(
          `https://www.hebcal.com/converter?cfg=json&hy=${targetHy}&hm=${encodeURIComponent(deathData.hm)}&hd=${deathData.hd}&h2g=1`
        );
        targetData = await targetRes.json();
        nextGregorianDate = new Date(targetData.gy, targetData.gm - 1, targetData.gd);
      }

      // Previous evening (Yahrtzeit starts at sunset of previous day)
      const eveDate = new Date(nextGregorianDate);
      eveDate.setDate(eveDate.getDate() - 1);

      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };

      const monthNamePt = translateHebrewMonthPt(deathData.hm);
      const hebrewDateStr = `${deathData.hd} de ${monthNamePt} de ${deathData.hy}`;
      const nextHebrewStr = `${deathData.hd} de ${monthNamePt} de ${targetHy}`;

      setCalcResult({
        hebrewDateOfDeath: hebrewDateStr,
        hebrewLetters: deathData.hebrew || '',
        nextHebrewYear: targetHy,
        nextHebrewDateStr: nextHebrewStr,
        nextHebrewLetters: targetData.hebrew || '',
        eveDateFormatted: eveDate.toLocaleDateString('pt-BR', dateOptions),
        dayDateFormatted: nextGregorianDate.toLocaleDateString('pt-BR', dateOptions)
      });
    } catch (err: any) {
      console.error(err);
      setCalcError('Não foi possível conectar ao serviço de calendário judaico. Por favor, verifique sua conexão e tente novamente.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRegisterKaddish = (e: React.FormEvent) => {
    e.preventDefault();
    submitToChabadEmail({
      subject: `[Yahrtzeit & Kadish] ${formData.deceasedHebrewName} ben/bat ${formData.fatherHebrewName} - ${formData.requesterName}`,
      fields: {
        'Nome do Falecido em Hebraico': formData.deceasedHebrewName,
        'Nome do Pai em Hebraico': formData.fatherHebrewName,
        'Nome em Português': formData.deceasedSecularName,
        'Data do Falecimento': formData.secularDateOfDeath,
        'Nome do Solicitante': formData.requesterName,
        'E-mail do Solicitante': formData.requesterEmail,
        'Recitar Kadish no Minyan': formData.requestKaddish ? 'Sim' : 'Não',
        'Lembrete Anual por E-mail': formData.requestAnnualReminder ? 'Sim' : 'Não',
      }
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-chabad-navy text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <Flame className="w-3.5 h-3.5 mr-1" />
            Memória Sagrada • Leilui Nishmat
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            O Yahrtzeit & Kadish
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Honre a memória de seus entes queridos no aniversário hebraico de falecimento. Calculadora de datas, recital de Kadish no Minyan de Curitiba e acendimento de velas memoriais.
          </p>
        </div>
      </section>

      {/* Main Grid: Calculator & Registration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Calculator & Customs */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Quick Calculator */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-luxury space-y-6">
              <div className="flex items-center space-x-2 text-xs font-bold text-chabad uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Calculadora de Yahrtzeit Hebraico</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Descubra a Data Hebraica do Aniversário
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Digite a data gregoriana de falecimento para calcular quando cai o Yahrtzeit no calendário judaico:
              </p>

              <form onSubmit={handleCalculate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data do Falecimento (Calendário Gregoriano / Civil) *
                  </label>
                  <input
                    type="date"
                    required
                    value={calcDate}
                    onChange={e => setCalcDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>

                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={afterSunset}
                    onChange={e => setAfterSunset(e.target.checked)}
                    className="rounded text-chabad focus:ring-chabad"
                  />
                  <span>O falecimento ocorreu após o pôr do sol (noite)?</span>
                </label>

                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full bg-chabad hover:bg-chabad-pine disabled:bg-slate-300 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <span>Consultando Calendário Judaico...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-chabad-gold" />
                      <span>Calcular Próximo Yahrtzeit</span>
                    </>
                  )}
                </button>
              </form>

              {calcError && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{calcError}</span>
                </div>
              )}

              {calcResult && (
                <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200/90 text-slate-900 space-y-4 animate-in fade-in duration-300 shadow-sm">
                  <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Data Hebraica de Falecimento</span>
                      <strong className="text-sm sm:text-base text-slate-950 font-serif">{calcResult.hebrewDateOfDeath}</strong>
                    </div>
                    {calcResult.hebrewLetters && (
                      <span className="text-sm sm:text-base font-serif font-bold text-chabad bg-white px-3 py-1 rounded-lg border border-amber-200" dir="rtl">
                        {calcResult.hebrewLetters}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80 space-y-1">
                      <div className="font-bold text-chabad flex items-center">
                        <Flame className="w-3.5 h-3.5 text-chabad-gold mr-1.5" />
                        Próximo Yahrtzeit (Ano Hebraico {calcResult.nextHebrewYear}):
                      </div>
                      <div className="text-slate-800">
                        • <strong>Início:</strong> {calcResult.eveDateFormatted} <em>(ao pôr do sol - acender a vela memorial)</em>
                      </div>
                      <div className="text-slate-800">
                        • <strong>Dia do Yahrtzeit:</strong> {calcResult.dayDateFormatted} <em>(até o anoitecer - recital de Kadish)</em>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                      🕯️ A vela memorial de 24 horas deve ser acesa antes do pôr do sol do primeiro dia e queimar durante todo o Yahrtzeit.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Custom & Significance */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Costumes Sagrados no Dia do Yahrtzeit:
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start">
                  <Flame className="w-3.5 h-3.5 text-chabad-gold mr-2 mt-0.5 shrink-0" />
                  <span><strong>Vela Memorial (Ner Neshama):</strong> Acender uma vela de 24 horas que queima durante todo o dia judaico (do anoitecer ao anoitecer).</span>
                </li>
                <li className="flex items-start">
                  <BookOpen className="w-3.5 h-3.5 text-chabad-gold mr-2 mt-0.5 shrink-0" />
                  <span><strong>Recitação do Kadish:</strong> Rezar o Kadish no Minyan durante as orações matinais (Shacharit), vespertinas (Minchá) e noturnas (Arvit).</span>
                </li>
                <li className="flex items-start">
                  <Heart className="w-3.5 h-3.5 text-chabad-gold mr-2 mt-0.5 shrink-0" />
                  <span><strong>Tzedaká (Caridade):</strong> Doar para causas sagradas e estudo de Torá em mérito da elevação da alma (Leilui Nishmat).</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Submission Form for Kaddish in Curitiba */}
          <div className="lg:col-span-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-luxury">
              <div className="flex items-center space-x-2 text-xs font-bold text-chabad uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4" />
                <span>Homenagem & Preces</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                Solicitar Kadish & Registro Memorial
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                Cadastre os dados de seu ente querido para que o Minyan do Beit Chabad do Paraná recite o Kadish e envie um lembrete anual para sua família.
              </p>

              {!submitted ? (
                <form onSubmit={handleRegisterKaddish} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Falecido em Hebraico *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Avraham"
                        value={formData.deceasedHebrewName}
                        onChange={e => setFormData({ ...formData, deceasedHebrewName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Pai em Hebraico *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Yitzchak"
                        value={formData.fatherHebrewName}
                        onChange={e => setFormData({ ...formData, fatherHebrewName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nome em Português</label>
                      <input
                        type="text"
                        placeholder="Ex: Alberto Cohen"
                        value={formData.deceasedSecularName}
                        onChange={e => setFormData({ ...formData, deceasedSecularName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Data de Falecimento *</label>
                      <input
                        type="date"
                        required
                        value={formData.secularDateOfDeath}
                        onChange={e => setFormData({ ...formData, secularDateOfDeath: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Seus Dados para Contato:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Seu Nome *"
                        value={formData.requesterName}
                        onChange={e => setFormData({ ...formData, requesterName: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Seu E-mail *"
                        value={formData.requesterEmail}
                        onChange={e => setFormData({ ...formData, requesterEmail: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requestKaddish}
                        onChange={e => setFormData({ ...formData, requestKaddish: e.target.checked })}
                        className="rounded text-chabad focus:ring-chabad"
                      />
                      <span>Desejo que o Beit Chabad recite o Kadish na Sinagoga na data do Yahrtzeit</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requestAnnualReminder}
                        onChange={e => setFormData({ ...formData, requestAnnualReminder: e.target.checked })}
                        className="rounded text-chabad focus:ring-chabad"
                      />
                      <span>Enviar lembrete anual por e-mail com instruções para acendimento da vela</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 mt-4"
                  >
                    <Send className="w-4 h-4 text-chabad-gold" />
                    <span>Cadastrar Homenagem Memorial</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">Registro Efetuado com Sucesso</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    O nome foi incluído em nossos registros memoriais de oração. Que a alma tenha uma elevação contínua no Gan Éden (Tehê Nishmatô Tzerurá BiTzror HaChayim).
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
