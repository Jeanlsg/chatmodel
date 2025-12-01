import React from 'react';
import { ArrowLeft, Bot, Sparkles, ChevronRight } from 'lucide-react';

const SelectionPage = ({ setCurrentView, patientName }) => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative bg-slate-950">
            <button
                onClick={() => setCurrentView('patient')}
                className="absolute top-24 left-4 md:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Voltar
            </button>

            <div className="w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Como você prefere ser atendido?</h2>
                    <p className="text-slate-400">Escolha a forma de interação que for mais confortável para você.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Option 1: Guided Triage */}
                    <button
                        onClick={() => setCurrentView('chat')}
                        className="group relative bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-8 text-left transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col h-full"
                    >
                        <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                            <Bot className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Triagem Guiada</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                            Responda a perguntas objetivas e diretas para uma avaliação rápida e precisa dos seus sintomas.
                        </p>
                        <div className="flex items-center text-emerald-400 text-sm font-medium">
                            Selecionar <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Option 2: Natural Conversation */}
                    <button
                        onClick={() => window.location.href = `/chat.html?name=${encodeURIComponent(patientName || 'Paciente')}`}
                        className="group relative bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-8 text-left transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col h-full"
                    >
                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-400">
                            Novo
                        </div>
                        <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Conversa Natural</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                            Descreva o que está sentindo com suas próprias palavras, como se estivesse conversando com um médico.
                        </p>
                        <div className="flex items-center text-blue-400 text-sm font-medium">
                            Selecionar <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectionPage;
