import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, User, AlertTriangle, Clock, ClipboardList, Search, Filter, Phone, MoreVertical } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

// Helper functions
const getRiskColor = (risk) => {
    switch (risk) {
        case 'red': return 'bg-red-600 text-white border-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)]';
        case 'orange': return 'bg-orange-500 text-white border-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.4)]';
        case 'yellow': return 'bg-yellow-400 text-black border-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.4)] font-bold';
        case 'green': return 'bg-emerald-500 text-white border-emerald-600';
        case 'blue': return 'bg-blue-500 text-white border-blue-600';
        default: return 'bg-slate-700 text-slate-300';
    }
};

const getRiskLabel = (risk) => {
    switch (risk) {
        case 'red': return 'EMERGÊNCIA';
        case 'orange': return 'MUITO URGENTE';
        case 'yellow': return 'URGENTE';
        case 'green': return 'POUCO URGENTE';
        case 'blue': return 'NÃO URGENTE';
        default: return 'N/A';
    }
};

const ProfessionalPage = ({ setCurrentView }) => {
    const [triageQueue, setTriageQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTriageRecords = async () => {
            try {
                const { data, error } = await supabase
                    .from('triage_records')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setTriageQueue(data || []);
            } catch (error) {
                console.error('Error fetching triage records:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTriageRecords();

        // Set up real-time subscription
        const subscription = supabase
            .channel('triage_records_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'triage_records' }, (payload) => {
                console.log('Real-time update:', payload);
                fetchTriageRecords();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-slate-800 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard de Triagem</h1>
                    <p className="text-slate-400 text-sm mt-1">Visão geral da fila de espera e classificações de risco.</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                    <button onClick={() => setCurrentView('landing')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors">
                        <LogOut size={16} /> Sair
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/20 transition-colors">
                        <LayoutDashboard size={16} /> Nova Admissão
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Em Espera</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{triageQueue.length}</h3>
                        </div>
                        <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                            <User size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-red-400 text-sm font-medium">Emergências</p>
                            <h3 className="text-3xl font-bold text-white mt-2">
                                {triageQueue.filter(p => p.risk_level === 'red').length}
                            </h3>
                        </div>
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Tempo Médio</p>
                            <h3 className="text-3xl font-bold text-white mt-2">12m</h3>
                        </div>
                        <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Atendidos Hoje</p>
                            <h3 className="text-3xl font-bold text-white mt-2">84</h3>
                        </div>
                        <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                            <ClipboardList size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl mb-12">
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-500" />
                        </div>
                        <input type="text" className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg text-sm bg-slate-950 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500" placeholder="Buscar paciente..." />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700">
                        <Filter size={16} /> Filtros
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-950">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Paciente</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Contato</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Classificação IA</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Sintomas (Resumo)</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Risco</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-slate-900 divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-slate-400">Carregando dados...</td>
                                </tr>
                            ) : triageQueue.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-slate-400">Nenhum paciente na fila.</td>
                                </tr>
                            ) : (
                                triageQueue.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                                                    {patient.patient_name ? patient.patient_name.charAt(0) : '?'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">{patient.patient_name}</div>
                                                    <div className="text-xs text-slate-500">CPF: {patient.cpf}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-300 flex items-center gap-1">
                                                <Phone size={14} className="text-slate-500" />
                                                {patient.phone || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-emerald-400">{patient.classificacao_ia || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-300 max-w-xs truncate" title={patient.symptoms}>{patient.symptoms}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getRiskColor(patient.risk_level)}`}>
                                                {getRiskLabel(patient.risk_level)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-slate-300">{patient.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-slate-400 hover:text-white">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Footer of table */}
                <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-500">
                    <span>Mostrando {triageQueue.length} pacientes</span>
                    <div className="flex gap-2">
                        <button className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50">Anterior</button>
                        <button className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700">Próxima</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalPage;
