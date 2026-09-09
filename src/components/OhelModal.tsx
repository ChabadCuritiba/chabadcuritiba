import React, { useState } from 'react';
import { X, Send, Heart, ShieldCheck, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';

import { submitToChabadEmail, CHABAD_OFFICIAL_EMAIL } from '../utils/formSubmit';

interface OhelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OhelModal: React.FC<OhelModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [letterData, setLetterData] = useState({
    hebrewName: '',
    motherHebrewName: '',
    email: '',
    phone: '',
    letterText: '',
    purpose: 'Bênção Geral (Bracha)',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    await submitToChabadEmail({
      toEmail: 'ohel@ohelchabad.org',
      ccEmail: CHABAD_OFFICIAL_EMAIL,
      subject: `[Pan / Pidyon Nefesh ao Ohel do Rebe] ${letterData.hebrewName || 'Curitiba'}`,
      fields: {
        'Nome Hebraico': letterData.hebrewName,
        'Nome Hebraico da Mãe': letterData.motherHebrewName,
        'E-mail de Contato': letterData.email,
        'WhatsApp / Telefone': letterData.phone,
        'Motivo / Finalidade': letterData.purpose,
        'Texto da Carta / Pedido de Bênção': letterData.letterText,
        'Origem': 'Beit Chabad do Paraná (Curitiba)'
      }
    });

    setIsSending(false);
    setSubmitted(true);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 relative my-6 cursor-default"
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-chabad-navy to-slate-900 text-white p-6 sm:p-8 relative">
          <button 
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-5 right-5 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 transition-all hover:scale-110 shadow-md cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-chabad-gold/20 text-chabad-gold border border-chabad-gold/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Envio Direto ao Ohel em Nova York
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Envie sua Carta ao Ohel do Rebe
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Destino direto: <strong>ohel@ohelchabad.org</strong> (Ohel Chabad-Lubavitch, Queens, NY).
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Costume Tradicional:</strong> Ao pedir uma bênção, mencione seu nome em hebraico e o nome em hebraico de sua mãe (Exemplo: <em>Menachem ben Sara</em>).
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome em Hebraico *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Menachem Mendel"
                    value={letterData.hebrewName}
                    onChange={e => setLetterData({ ...letterData, hebrewName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome da Mãe em Hebraico *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Chana"
                    value={letterData.motherHebrewName}
                    onChange={e => setLetterData({ ...letterData, motherHebrewName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seu E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={letterData.email}
                    onChange={e => setLetterData({ ...letterData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Motivo Principal
                  </label>
                  <select
                    value={letterData.purpose}
                    onChange={e => setLetterData({ ...letterData, purpose: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Bênção Geral (Bracha)">Bênção Geral (Brachá & Hatzlachá)</option>
                    <option value="Refuá Shelemá (Saúde)">Refuá Shelemá (Saúde & Cura)</option>
                    <option value="Shiduch (Casamento)">Shiduch (Encontrar Par Perfeito)</option>
                    <option value="Parnassá (Sustento & Negócios)">Parnassá (Sustento & Negócios)</option>
                    <option value="Filhos (Zera Chaya Vekayama)">Filhos & Família</option>
                    <option value="Aniversário de Nascimento">Aniversário de Nascimento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Texto da Carta ou Pedido de Bênção *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Escreva seus sentimentos, preces, decisões de boas ações (Mitsvot) e pedidos de bênção..."
                  value={letterData.letterText}
                  onChange={e => setLetterData({ ...letterData, letterText: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad resize-none"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Enviado diretamente ao Ohel Chabad Lubavitch (ohel@ohelchabad.org).</span>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-chabad-navy hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-chabad-gold" />
                <span>{isSending ? 'Enviando ao Ohel...' : 'Enviar Diretamente para ohel@ohelchabad.org'}</span>
              </button>

            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Carta Direcionada ao Ohel!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Sua mensagem foi formatada e enviada diretamente para <strong>ohel@ohelchabad.org</strong> para ser impressa e depositada no Ohel sagrado do Rebe em Nova York.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
                <a
                  href={`https://wa.me/554198977249?text=${encodeURIComponent(`*Carta ao Ohel do Rebe*\n\n*Nome Hebraico:* ${letterData.hebrewName}\n*Nome da Mãe:* ${letterData.motherHebrewName}\n*Motivo:* ${letterData.purpose}\n*Carta:* ${letterData.letterText}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                >
                  <span>Enviar Cópia no WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs"
                >
                  Concluir
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
