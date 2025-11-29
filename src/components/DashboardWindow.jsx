import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Activity, AlertTriangle, CheckCircle, Clock, Search, User } from 'lucide-react';

const DashboardWindow = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReports();

        // Real-time subscription
        const subscription = supabase
            .channel('triage_reports')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'triage_reports' }, payload => {
                setReports(prev => [payload.new, ...prev]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchReports = async () => {
        try {
            const { data, error } = await supabase
                .from('triage_reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReports(data || []);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (color) => {
        const colors = {
            'Vermelho': 'bg-red-500/20 text-red-400 border-red-500/50',
            'Laranja': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
            'Amarelo': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            'Verde': 'bg-green-500/20 text-green-400 border-green-500/50',
            'Azul': 'bg-blue-500/20 text-blue-400 border-blue-500/50'
        };
        return colors[color] || 'bg-slate-700 text-slate-300';
    };

    const filteredReports = reports.filter(report =>
        report.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.classification_color?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-6xl h-[80vh] bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-indigo-500/20">
                        <Activity className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Painel de Triagem</h1>
                        <p className="text-slate-400 text-sm">Monitoramento em tempo real</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 w-64"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredReports.map((report) => (
                            <div key={report.id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-indigo-500/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-slate-400" />
                                        <span className="font-medium text-white">{report.patient_name}</span>
                                        <span className="text-xs text-slate-500">({report.patient_age} anos)</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getSeverityColor(report.classification_color)}`}>
                                        {report.classification_color}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Queixa Principal</p>
                                        <p className="text-sm text-slate-300 line-clamp-2">{report.complaint}</p>
                                    </div>

                                    {report.hanseniase_active && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertTriangle size={14} className="text-red-400" />
                                                <span className="text-xs font-bold text-red-400">Alerta Hanseníase</span>
                                            </div>
                                            <p className="text-xs text-red-300">
                                                Suspeita: {report.hanseniase_type}
                                                {report.neurite_acute && " • Neurite Aguda"}
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>{new Date(report.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle size={12} className="text-emerald-500" />
                                            <span>Finalizado</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardWindow;
