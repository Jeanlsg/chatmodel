import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity, Clock, CheckCircle, AlertCircle, Search, Filter, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const [triages, setTriages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTriages();
    }, []);

    const fetchTriages = async () => {
        try {
            const { data, error } = await supabase
                .from('triages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTriages(data || []);
        } catch (error) {
            console.error('Error fetching triages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high':
            case 'urgent':
                return <AlertCircle className="w-4 h-4 text-red-400" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            default:
                return <Clock className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Activity className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">Triagem<span className="text-emerald-400">IA</span></span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Painel de Controle</h1>
                        <p className="text-slate-400">Gerencie e monitore as triagens em tempo real.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium transition-colors">
                            <Filter className="w-4 h-4" />
                            Filtrar
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/20 transition-colors">
                            Nova Triagem
                        </button>
                    </div>
                </div>

                {/* Stats Grid (Mock data for visual) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Triagens Hoje', value: '12', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { label: 'Em Atendimento', value: '4', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { label: 'Alta Prioridade', value: '2', color: 'text-red-400', bg: 'bg-red-500/10' },
                    ].map((stat, index) => (
                        <div key={index} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>+20%</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                        placeholder="Buscar por paciente, CPF ou protocolo..."
                    />
                </div>

                {/* Triage List */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-500" />
                            Carregando triagens...
                        </div>
                    ) : triages.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            Nenhuma triagem encontrada.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {triages.map((triage) => (
                                <div key={triage.id} className="p-4 hover:bg-slate-800/50 transition-colors group cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(triage.priority)}`}>
                                                {getPriorityIcon(triage.priority)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{triage.patient_name}</h3>
                                                <p className="text-sm text-slate-400">{triage.patient_age} anos • {triage.patient_phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="hidden md:block text-right">
                                                <p className="text-sm text-slate-300 max-w-[200px] truncate">{triage.complaint}</p>
                                                <p className="text-xs text-slate-500">Queixa principal</p>
                                            </div>

                                            <div className="text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(triage.status)}`}>
                                                    {triage.status}
                                                </span>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {new Date(triage.created_at).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Helper for loading state
const Loader2 = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

export default Dashboard;
