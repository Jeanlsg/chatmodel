import React, { useState } from 'react';
import { Activity, User, LayoutDashboard, ChevronRight, Menu, X } from 'lucide-react';

const LandingPage = ({ setCurrentView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
            {/* Navigation */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <Activity className="h-8 w-8 text-emerald-400" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                                Triagem.AI
                            </span>
                        </div>

                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                <a href="#inicio" className="hover:text-emerald-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Início</a>
                                <a href="#como-funciona" className="hover:text-emerald-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Como Funciona</a>
                                <a href="#beneficios" className="hover:text-emerald-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Benefícios</a>
                                <a href="#contato" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">Fale Conosco</a>
                            </div>
                        </div>

                        <div className="-mr-2 flex md:hidden">
                            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none">
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-slate-900 border-b border-slate-800">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <button onClick={() => { setCurrentView('landing'); setIsMenuOpen(false); }} className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Início</button>
                            <a href="#contato" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Fale Conosco</a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="inicio" className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Triagem Inteligente com <br />
                        <span className="text-emerald-400">Inteligência Artificial</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-12">
                        Sistema avançado de classificação de risco e encaminhamento de pacientes utilizando protocolos médicos padronizados.
                    </p>

                    {/* Role Selection Cards */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Patient Card */}
                        <div
                            className="group relative p-8 rounded-2xl border bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer overflow-hidden"
                            onClick={() => setCurrentView('patient')}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Activity size={120} />
                            </div>
                            <div className="flex flex-col items-start relative z-10">
                                <div className="p-3 bg-emerald-500/10 rounded-xl mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                    <User className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Sou Paciente</h3>
                                <p className="text-slate-400 text-left mb-6 text-sm">
                                    Preciso de atendimento médico e quero passar pela triagem automática agora.
                                </p>
                                <button className="flex items-center gap-2 text-emerald-400 font-semibold group-hover:text-emerald-300">
                                    Iniciar Triagem <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Professional Card */}
                        <div
                            className="group relative p-8 rounded-2xl border bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer overflow-hidden"
                            onClick={() => setCurrentView('professional')}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <LayoutDashboard size={120} />
                            </div>
                            <div className="flex flex-col items-start relative z-10">
                                <div className="p-3 bg-blue-500/10 rounded-xl mb-4 group-hover:bg-blue-500/20 transition-colors">
                                    <LayoutDashboard className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Sou Profissional</h3>
                                <p className="text-slate-400 text-left mb-6 text-sm">
                                    Acesso administrativo para médicos e enfermeiros gerenciarem filas e riscos.
                                </p>
                                <button className="flex items-center gap-2 text-blue-400 font-semibold group-hover:text-blue-300">
                                    Acessar Dashboard <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works Section */}
            <section id="como-funciona" className="py-20 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Fluxo de Atendimento</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Nossa IA analisa os sintomas em tempo real e define a prioridade de atendimento com base no Protocolo de Manchester.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 text-emerald-400 font-bold text-xl">1</div>
                            <h3 className="text-xl font-bold text-white mb-2">Identificação</h3>
                            <p className="text-slate-400">O paciente informa seus dados básicos e inicia o processo de triagem digital.</p>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 text-emerald-400 font-bold text-xl">2</div>
                            <h3 className="text-xl font-bold text-white mb-2">Análise de Sintomas</h3>
                            <p className="text-slate-400">A IA faz perguntas específicas para entender a gravidade do quadro clínico.</p>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 text-emerald-400 font-bold text-xl">3</div>
                            <h3 className="text-xl font-bold text-white mb-2">Classificação de Risco</h3>
                            <p className="text-slate-400">O sistema define a cor de risco e encaminha para a fila correta automaticamente.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
