import React, { useState, useRef, useEffect } from 'react';
import {
  Stethoscope,
  User,
  MessageSquare,
  ClipboardList,
  LayoutDashboard,
  Menu,
  X,
  Activity,
  ShieldCheck,
  Clock,
  ChevronRight,
  Phone,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  LogOut,
  ArrowLeft,
  CreditCard,
  FileText,
  Send,
  Bot
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import SelectionView from './components/SelectionView';
import N8nChat from './components/N8nChat';

// --- HELPER FUNCTIONS & DATA ---

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

// --- SUB-COMPONENTS ---

const PatientView = ({
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

const ChatView = ({
  setCurrentView,
  patientName,
  patientCpf,
  patientPhone
}) => {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [currentStep, setCurrentStep] = useState('febre'); // febre, pele, detalhes_pele, nervos, final
  const [answers, setAnswers] = useState({
    sintoma_febre: '',
    tipo_lesao_pele: '',
    detalhes_pele: [],
    sintoma_neurite: ''
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      { id: 1, sender: 'ai', text: `Olá, ${patientName.split(' ')[0]}. Sou a assistente virtual da Triagem.AI.` },
      { id: 2, sender: 'ai', text: 'Vamos verificar seus sintomas atuais. Você está sentindo febre?' }
    ]);
  }, [patientName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionClick = (option, variable, nextStep) => {
    // Add user response to chat
    const userMsg = { id: Date.now(), sender: 'user', text: option };
    setMessages(prev => [...prev, userMsg]);

    // Update answers
    const newAnswers = { ...answers, [variable]: option };
    setAnswers(newAnswers);

    // AI thinking simulation
    setTimeout(() => {
      processStep(nextStep, newAnswers);
    }, 800);
  };

  const handleMultipleChoice = (option) => {
    const currentDetails = answers.detalhes_pele || [];
    const newDetails = currentDetails.includes(option)
      ? currentDetails.filter(item => item !== option)
      : [...currentDetails, option];

    setAnswers({ ...answers, detalhes_pele: newDetails });
  };

  const submitMultipleChoice = () => {
    const selectedOptions = answers.detalhes_pele.join(', ');
    const userMsg = { id: Date.now(), sender: 'user', text: selectedOptions || "Nenhuma das opções" };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      processStep('nervos', answers);
    }, 800);
  };

  const processStep = (step, currentAnswers) => {
    setCurrentStep(step);
    let aiText = '';

    if (step === 'pele') {
      aiText = "Você notou alterações na sua pele ou nas manchas que já tinha?";
    } else if (step === 'detalhes_pele') {
      // Conditional Logic: Only ask details if skin lesions are present
      if (currentAnswers.tipo_lesao_pele.includes('Sim')) {
        aiText = "Como estão essas manchas ou caroços? Selecione todas as opções que se aplicam:";
      } else {
        // Skip to nerves
        processStep('nervos', currentAnswers);
        return;
      }
    } else if (step === 'nervos') {
      aiText = "Sente alguma dor nos nervos (choques, pontadas no cotovelo, punho ou joelho)?";
    } else if (step === 'final') {
      finishTriage(currentAnswers);
      return;
    }

    if (aiText) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: aiText }]);
    }
  };

  const finishTriage = async (finalAnswers) => {
    // Classification Logic
    let classification = 'Indeterminado';
    let riskLevel = 'blue';
    let finalMessage = "Obrigado pelas informações. Seus dados foram registrados.";

    const { sintoma_febre, tipo_lesao_pele, detalhes_pele, sintoma_neurite } = finalAnswers;
    const detalhesStr = Array.isArray(detalhes_pele) ? detalhes_pele.join(' ') : '';

    // Scenario C: Neurite Aguda (Emergency)
    if (sintoma_neurite.includes('insuportável') || sintoma_neurite.includes('Perda de força')) {
      classification = 'Cenário C (Neurite Aguda)';
      riskLevel = 'red';
      finalMessage = "🚨 EMERGÊNCIA NEURAL. Você relatou dor intensa ou perda de força. Isso exige intervenção imediata para evitar sequelas permanentes.";
    }
    // Scenario A: Reação Tipo 2 (Eritema Nodoso)
    else if (tipo_lesao_pele.includes('caroços novos') && sintoma_febre.includes('Sim')) {
      classification = 'Cenário A (Reação Tipo 2)';
      riskLevel = 'orange';
      finalMessage = "⚠️ Possível Reação Tipo 2 (Eritema Nodoso). Seus sintomas indicam uma reação inflamatória sistêmica. Procure atendimento médico urgente.";
    }
    // Scenario B: Reação Tipo 1 (Reversa)
    else if (tipo_lesao_pele.includes('manchas antigas') && (detalhesStr.includes('inchadas') || detalhesStr.includes('vermelhas'))) {
      classification = 'Cenário B (Reação Tipo 1)';
      riskLevel = 'yellow';
      finalMessage = "⚠️ Possível Reação Tipo 1 (Reversa). A inflamação das manchas antigas indica reativação da imunidade celular. Risco de dano neural.";
    } else {
      finalMessage = "Seus sintomas foram registrados. Aguarde o chamado da equipe médica.";
      riskLevel = 'green';
    }

    setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: finalMessage }]);

    // Save to Supabase
    try {
      const { error } = await supabase.from('triage_records').insert({
        patient_name: patientName,
        cpf: patientCpf,
        phone: patientPhone,
        symptoms: `Febre: ${sintoma_febre}, Pele: ${tipo_lesao_pele}, Nervos: ${sintoma_neurite}`,
        sintoma_febre,
        tipo_lesao_pele,
        detalhes_pele: detalhesStr,
        sintoma_neurite,
        classificacao_ia: classification,
        risk_level: riskLevel,
        status: 'Aguardando',
        wait_time: '0 min'
      });

      if (error) throw error;
      console.log('Triage record saved successfully');
    } catch (error) {
      console.error('Error saving triage record:', error);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Erro ao salvar registro. Por favor, avise a recepção." }]);
    }
  };

  const renderOptions = () => {
    if (currentStep === 'febre') {
      return (
        <div className="flex flex-col gap-2 mt-4">
          <button onClick={() => handleOptionClick('Sim, febre alta (> 38°C)', 'sintoma_febre', 'pele')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-sm transition-colors border border-slate-700">Sim, febre alta ({'>'} 38°C)</button>
          <button onClick={() => handleOptionClick('Sim, febre baixa/moderada', 'sintoma_febre', 'pele')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-sm transition-colors border border-slate-700">Sim, febre baixa/moderada</button>
          <button onClick={() => handleOptionClick('Não tenho febre', 'sintoma_febre', 'pele')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-sm transition-colors border border-slate-700">Não tenho febre</button>
        </div>
      );
    }
    if (currentStep === 'pele') {
      return (
        <div className="flex flex-col gap-2 mt-4">
          <button onClick={() => handleOptionClick('Sim, manchas antigas mudaram', 'tipo_lesao_pele', 'detalhes_pele')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-sm transition-colors border border-slate-700">Sim, manchas antigas mudaram</button>
          <button onClick={() => handleOptionClick('Sim, apareceram caroços novos', 'tipo_lesao_pele', 'detalhes_pele')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-sm transition-colors border border-slate-700">Sim, apareceram caroços novos</button>
          <button onClick={() => handleOptionClick('Não, pele está normal', 'tipo_lesao_pele', 'detalhes_pele')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-sm transition-colors border border-slate-700">Não, pele está normal</button>
        </div>
      );
    }
    if (currentStep === 'detalhes_pele') {
      const options = [
        'Ficaram muito vermelhas',
        'Estão inchadas (alto relevo)',
        'Estão quentes ao tocar',
        'Doem espontaneamente',
        'Doem apenas ao tocar'
      ];
      return (
        <div className="flex flex-col gap-2 mt-4">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => handleMultipleChoice(opt)}
              className={`p-3 rounded-lg text-left text-sm transition-colors border ${answers.detalhes_pele?.includes(opt) ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 border-slate-700'}`}
            >
              {opt}
            </button>
          ))}
          <button onClick={submitMultipleChoice} className="mt-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-center text-sm font-bold text-white transition-colors">Confirmar Seleção</button>
        </div>
      );
    }
    if (currentStep === 'nervos') {
      return (
        <div className="flex flex-col gap-2 mt-4">
          <button onClick={() => handleOptionClick('Sim, dor insuportável / Perda de força', 'sintoma_neurite', 'final')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-sm transition-colors border border-slate-700">Sim, dor insuportável / Perda de força</button>
          <button onClick={() => handleOptionClick('Sim, dor moderada / Formigamento', 'sintoma_neurite', 'final')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-sm transition-colors border border-slate-700">Sim, dor moderada / Formigamento</button>
          <button onClick={() => handleOptionClick('Não', 'sintoma_neurite', 'final')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-sm transition-colors border border-slate-700">Não</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-slate-950">
      {/* Chat Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between fixed w-full top-20 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('patient')} className="text-slate-400 hover:text-white mr-2">
            <ArrowLeft size={20} />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-white">Assistente Virtual</h3>
            <p className="text-xs text-emerald-400">Online • Triagem Automática</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white p-2">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 pt-24 pb-24 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
              </div>

              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md ${msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Render Options if it's the last message and from AI */}
        {messages.length > 0 && messages[messages.length - 1].sender === 'ai' && currentStep !== 'final' && (
          <div className="ml-11 max-w-[85%] md:max-w-[70%]">
            {renderOptions()}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Disabled for this flow, or kept for manual entry if needed, but hiding it to focus on buttons is better for this specific flow) */}
      <div className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 p-4">
        <div className="max-w-7xl mx-auto text-center text-xs text-slate-500">
          Selecione as opções acima para continuar a triagem.
        </div>
      </div>
    </div>
  );
};

const ProfessionalView = ({ setCurrentView }) => {
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

// --- MAIN COMPONENT ---

export default function TriagemAI() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // States: 'landing', 'patient', 'selection', 'chat', 'natural_chat', 'professional'
  const [currentView, setCurrentView] = useState('landing');

  // Patient Data State
  const [patientName, setPatientName] = useState('');
  const [patientCpf, setPatientCpf] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleStartTriage = (e) => {
    e.preventDefault();
    if (patientName && patientCpf && patientPhone) {
      setCurrentView('selection');
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500 selection:text-white">

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${currentView !== 'landing' ? 'bg-slate-950 border-b border-slate-800' : 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800'}`}>
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
              {currentView === 'landing' ? (
                <div className="ml-10 flex items-baseline space-x-8">
                  <a href="#inicio" className="hover:text-emerald-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Início</a>
                  <a href="#como-funciona" className="hover:text-emerald-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Como Funciona</a>
                  <a href="#beneficios" className="hover:text-emerald-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Benefícios</a>
                  <a href="#contato" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">Fale Conosco</a>
                </div>
              ) : (
                <div className="ml-10 flex items-baseline space-x-4">
                  <span className="px-3 py-2 rounded-md text-sm font-medium text-slate-500">
                    {currentView === 'patient'
                      ? 'Área do Paciente'
                      : currentView === 'chat'
                        ? 'Triagem em Andamento'
                        : 'Área Restrita'}
                  </span>
                </div>
              )}
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

      {/* RENDER VIEW BASED ON STATE */}
      {currentView === 'patient' ? (
        <PatientView
          setCurrentView={setCurrentView}
          patientName={patientName}
          setPatientName={setPatientName}
          patientCpf={patientCpf}
          setPatientCpf={setPatientCpf}
          patientPhone={patientPhone}
          setPatientPhone={setPatientPhone}
          handleStartTriage={handleStartTriage}
        />
      ) : currentView === 'selection' ? (
        <SelectionView setCurrentView={setCurrentView} />
      ) : currentView === 'chat' ? (
        <ChatView
          setCurrentView={setCurrentView}
          patientName={patientName}
          patientCpf={patientCpf}
          patientPhone={patientPhone}
        />
      ) : currentView === 'natural_chat' ? (
        <N8nChat
          setCurrentView={setCurrentView}
          patientName={patientName}
        />
      ) : currentView === 'professional' ? (
        <ProfessionalView setCurrentView={setCurrentView} />
      ) : (
        /* LANDING PAGE CONTENT */
        <>
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
                      <Stethoscope className="w-8 h-8 text-blue-400" />
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
                  Nossa IA guia o paciente por um processo simples e eficiente.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 border-t border-dashed border-slate-700 z-0"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/5">
                    <User className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">1. Identificação</h3>
                  <p className="text-slate-400 text-sm px-4">
                    Informe seus dados básicos para iniciar.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/5">
                    <MessageSquare className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">2. Anamnese IA</h3>
                  <p className="text-slate-400 text-sm px-4">
                    Responda às perguntas dinâmicas do assistente virtual.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/5">
                    <ClipboardList className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">3. Classificação</h3>
                  <p className="text-slate-400 text-sm px-4">
                    Direcionamento imediato baseado no risco.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits / Features Grid */}
          <section id="beneficios" className="py-20 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    Tecnologia que Salva Vidas e <span className="text-emerald-400">Otimiza Recursos</span>
                  </h2>
                  <p className="text-slate-400 text-lg">
                    Reduza o tempo de espera nas filas e garanta prioridade para quem precisa.
                  </p>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Protocolos Seguros</h4>
                        <p className="text-slate-400 text-sm">Baseado no Protocolo de Manchester e diretrizes do Ministério da Saúde.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <LayoutDashboard className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Dashboard em Tempo Real</h4>
                        <p className="text-slate-400 text-sm">Visão instantânea da demanda da unidade.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Static Dashboard Preview for Home */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
                  <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-600"></div>
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    </div>
                    <div className="text-xs text-slate-500">Painel Médico v2.0</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-10 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                        <div>
                          <div className="text-sm font-bold text-white">Paciente #4829</div>
                          <div className="text-xs text-slate-400">Dor torácica, falta de ar</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-red-100 bg-red-600 px-2 py-1 rounded shadow-[0_0_10px_rgba(220,38,38,0.4)]">EMERGÊNCIA</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-10 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
                        <div>
                          <div className="text-sm font-bold text-white">Paciente #4830</div>
                          <div className="text-xs text-slate-400">Arritmia, dor moderada</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white bg-orange-500 px-2 py-1 rounded shadow-[0_0_10px_rgba(249,115,22,0.3)]">MUITO URGENTE</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 opacity-80">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-10 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]"></div>
                        <div>
                          <div className="text-sm font-bold text-white">Paciente #4831</div>
                          <div className="text-xs text-slate-400">Febre alta, dor abdominal</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-black bg-yellow-400 px-2 py-1 rounded shadow-[0_0_10px_rgba(250,204,21,0.3)]">URGENTE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer id="contato" className="bg-slate-950 border-t border-slate-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-6 w-6 text-emerald-500" />
                    <span className="text-xl font-bold text-white">Triagem.AI</span>
                  </div>
                  <p className="text-slate-500 text-sm">
                    Transformando a saúde digital com inteligência e humanização.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Produto</h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li><a href="#" className="hover:text-emerald-400">Funcionalidades</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Segurança</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li><a href="#" className="hover:text-emerald-400">Privacidade</a></li>
                    <li><a href="#" className="hover:text-emerald-400">LGPD</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Contato</h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li className="break-all">jean.guimaraes@discente.univasf.edu.br</li>
                    <li>(87) 8846-5406</li>
                    <li>Juazeiro, BA</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-slate-900 pt-8 text-center text-slate-600 text-sm">
                © {new Date().getFullYear()} Triagem.AI - Todos os direitos reservados.
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}