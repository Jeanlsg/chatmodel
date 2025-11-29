import React from 'react';
import { Link } from 'react-router-dom';
import { User, Stethoscope, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo</h1>
                <p className="text-slate-400">Selecione como deseja acessar o sistema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                {/* Patient Card */}
                <Link to="/chat" className="group relative overflow-hidden bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-2xl p-8 transition-all duration-300 flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/30 flex items-center justify-center transition-colors">
                        <User size={40} className="text-indigo-400 group-hover:text-indigo-300" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Sou Paciente</h2>
                        <p className="text-slate-400 text-sm">Acesse o chat de atendimento ou realize uma triagem rápida.</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Link>

                {/* Professional Card */}
                <Link to="/login" className="group relative overflow-hidden bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 rounded-2xl p-8 transition-all duration-300 flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 flex items-center justify-center transition-colors">
                        <ShieldCheck size={40} className="text-emerald-400 group-hover:text-emerald-300" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Sou Profissional</h2>
                        <p className="text-slate-400 text-sm">Acesso administrativo para médicos e enfermeiros.</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Link>
            </div>

            <div className="mt-8 flex gap-4 text-sm text-slate-500">
                <Link to="/triagem" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <Stethoscope size={16} />
                    Ir direto para Triagem
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
