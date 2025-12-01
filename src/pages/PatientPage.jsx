import React from 'react';
import { ArrowLeft, User, FileText, CreditCard, Phone } from 'lucide-react';

const PatientPage = ({
    setCurrentView,
    patientName,
    setPatientName,
    patientCpf,
    setPatientCpf,
    patientPhone,
    setPatientPhone,
    handleStartTriage
}) => (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative bg-slate-950">
        <button
            onClick={() => setCurrentView('landing')}
            className="absolute top-24 left-4 md:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
            <ArrowLeft size={20} /> Voltar
        </button>

        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>

            <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700">
                    <User className="w-8 h-8 text-emerald-400" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Identificação do Paciente</h2>
                <p className="text-slate-400 mb-8">Preencha seus dados para iniciar a triagem inteligente.</p>

                <form className="space-y-4" onSubmit={handleStartTriage}>

                    {/* Nome Completo */}
                    <div className="text-left">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FileText className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                                placeholder="Ex: Maria da Silva"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* CPF */}
                    <div className="text-left">
                        <label className="block text-sm font-medium text-slate-300 mb-2">CPF</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCard className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                                placeholder="000.000.000-00"
                                value={patientCpf}
                                onChange={(e) => setPatientCpf(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Telefone */}
                    <div className="text-left">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Celular</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="tel"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                                placeholder="(00) 00000-0000"
                                value={patientPhone}
                                onChange={(e) => setPatientPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-all">
                        Continuar para Triagem
                    </button>
                </form>

                <p className="mt-6 text-xs text-slate-500">
                    Seus dados estão protegidos pela LGPD.
                </p>
            </div>
        </div>
    </div>
);

export default PatientPage;
