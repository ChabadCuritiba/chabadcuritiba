import React, { useState } from 'react';
import { ShieldCheck, Scroll, Home, CheckCircle2 } from 'lucide-react';
import { submitToChabadEmail, CHABAD_OFFICIAL_EMAIL } from '../utils/formSubmit';

export const MezuzotTefilin: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [requestData, setRequestData] = useState({
    name: '',
    phone: '',
    serviceType: 'verificacao-mezuzot',
    quantity: '1',
    address: '',
    deliveryMethod: 'levar-ao-chabad',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitToChabadEmail({
      subject: `[Mezuzot & Tefilin] Pedido de ${requestData.serviceType} - ${requestData.name}`,
      fields: {
        'Nome Completo': requestData.name,
        'WhatsApp / Telefone': requestData.phone,
        'Tipo de Serviço': requestData.serviceType,
        'Quantidade': requestData.quantity,
        'Bairro / Endereço': requestData.address,
      }
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-chabad-dark text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-blue-300 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Proteção Sagrada & Verificação
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Mezuzot & Tefilin
          </h1>
          <p className="mt-4 text-base sm:text-lg text-blue-100 leading-relaxed font-light">
            Serviço profissional de verificação e aquisição de pergaminhos sagrados por Sofer (escriba) qualificado.
          </p>
        </div>
      </section>

      {/* Main Content & Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              O Escudo Espiritual da Casa e da Pessoa
            </h2>

            <p>
              A <strong>Mezuzá</strong> no batente da porta e o <strong>Tefilin</strong> colocado sobre a cabeça e o braço não são meros amuletos, mas mandamentos sagrados da Torá que conectam o homem diretamente com a Providência Divina e atraem proteção, saúde e harmonia.
            </p>

            <p>
              Com o passar do tempo, as oscilações de clima e umidade em Curitiba podem danificar a tinta natural e o pergaminho (Klaf). Por isso, a lei judaica prescreve a revisão minuciosa (<em>Verificação</em>) pelo menos duas vezes a cada sete anos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 flex items-center">
                  <Home className="w-4 h-4 text-chabad mr-2" />
                  Mezuzot para sua Residência
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  Oferecemos pergaminhos 100% Casher escritos à mão, caixas elegantes de diversos materiais e auxílio para fixação correta nos batentes.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 flex items-center">
                  <Scroll className="w-4 h-4 text-blue-700 mr-2" />
                  Verificação de Tefilin
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  Inspeção das tiras de couro (Retzuot), das caixas (Batim) e dos pergaminhos internos por Sofer Stam credenciado.
                </div>
              </div>
            </div>
          </div>

          {/* Verification Request Form */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-luxury">
              <div className="flex items-center space-x-2 text-xs font-bold text-chabad uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Solicitar Serviço</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Verificação & Aquisição
              </h3>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={requestData.name}
                      onChange={e => setRequestData({ ...requestData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(41) 99999-9999"
                        value={requestData.phone}
                        onChange={e => setRequestData({ ...requestData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Quantidade de Itens</label>
                      <input
                        type="number"
                        min="1"
                        value={requestData.quantity}
                        onChange={e => setRequestData({ ...requestData, quantity: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Serviço</label>
                    <select
                      value={requestData.serviceType}
                      onChange={e => setRequestData({ ...requestData, serviceType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    >
                      <option value="verificacao-mezuzot">Verificação de Mezuzot existentes</option>
                      <option value="verificacao-tefilin">Verificação de Tefilin existente</option>
                      <option value="comprar-mezuzot">Adquirir novas Mezuzot</option>
                      <option value="comprar-tefilin">Adquirir novo jogo de Tefilin (Bar Mitzvah/Adulto)</option>
                      <option value="visita-instalacao">Visita para instalação de Mezuzot em casa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro / Endereço em Curitiba</label>
                    <input
                      type="text"
                      placeholder="Ex: Batel, Bigorrilho, Cabral, etc."
                      value={requestData.address}
                      onChange={e => setRequestData({ ...requestData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-chabad hover:bg-chabad-pine text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all"
                  >
                    Enviar Pedido de Verificação
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">Solicitação Registrada!</h4>
                  <p className="text-xs text-slate-600">
                    Entraremos em contato com as instruções para entrega e exame dos seus itens sagrados pelo Sofer.
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
