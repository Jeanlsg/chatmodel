import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Bot, User, MoreVertical } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const ChatPage = ({
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

export default ChatPage;
