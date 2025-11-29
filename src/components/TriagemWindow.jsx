import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Stethoscope } from 'lucide-react';
import { sendMessageToTriagem } from '../services/api';
import { supabase } from '../supabaseClient';

const TriagemWindow = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Olá! Sou o Triagem-IA. Por favor, me diga seu nome completo e idade para começarmos.", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('chat_phone_number') || '');
    const [isPhoneSubmitted, setIsPhoneSubmitted] = useState(!!localStorage.getItem('chat_phone_number'));
    const [triageId, setTriageId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize or fetch triage session when phone is submitted
    useEffect(() => {
        if (isPhoneSubmitted && phoneNumber) {
            initializeTriageSession();
        }
    }, [isPhoneSubmitted, phoneNumber]);

    const initializeTriageSession = async () => {
        try {
            // Check for existing active triage
            const { data: existingTriages, error: fetchError } = await supabase
                .from('triages')
                .select('id, status')
                .eq('patient_phone', phoneNumber)
                .in('status', ['pending', 'in_progress'])
                .order('created_at', { ascending: false })
                .limit(1);

            if (fetchError) throw fetchError;

            if (existingTriages && existingTriages.length > 0) {
                setTriageId(existingTriages[0].id);
                // Optionally fetch previous messages here if we want to restore history
                // fetchMessages(existingTriages[0].id);
            } else {
                // Create new triage
                const { data: newTriage, error: createError } = await supabase
                    .from('triages')
                    .insert([{
                        patient_phone: phoneNumber,
                        status: 'pending',
                        patient_name: 'Visitante' // Default until we extract name
                    }])
                    .select()
                    .single();

                if (createError) throw createError;
                setTriageId(newTriage.id);

                // Save initial greeting
                await saveMessage(newTriage.id, 'bot', messages[0].text);
            }
        } catch (error) {
            console.error('Error initializing triage session:', error);
        }
    };

    const saveMessage = async (tId, sender, content) => {
        if (!tId) return;
        try {
            await supabase
                .from('triage_messages')
                .insert([{
                    triage_id: tId,
                    sender,
                    content
                }]);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    const saveTriageReport = async (data) => {
        try {
            const { error } = await supabase
                .from('triage_reports')
                .insert([{
                    patient_name: data.paciente,
                    classification_color: data.classificacao,
                    patient_phone: phoneNumber,
                    created_at: new Date(),
                    status: 'completed',
                    // Default values for fields not provided by webhook yet
                    complaint: 'Triagem realizada via chat',
                    patient_age: 0, // Placeholder
                    hanseniase_active: false
                }]);

            if (error) throw error;
            console.log('Triage report saved successfully');
        } catch (error) {
            console.error('Error saving triage report:', error);
        }
    };

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        if (phoneNumber.trim().length < 8) return;
        localStorage.setItem('chat_phone_number', phoneNumber);
        setIsPhoneSubmitted(true);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessageText = inputValue;
        const newMessage = {
            id: Date.now(),
            text: newMessageText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsLoading(true);

        // Save user message
        if (triageId) {
            saveMessage(triageId, 'user', newMessageText);
        }

        try {
            const response = await sendMessageToTriagem(newMessageText, phoneNumber);

            // Handle multi-message response (new format)
            if (response && response.messages && Array.isArray(response.messages)) {
                const newBotMessages = response.messages.map((msgText, index) => ({
                    id: Date.now() + 1 + index,
                    text: msgText,
                    sender: 'bot',
                    timestamp: new Date()
                }));

                setMessages(prev => [...prev, ...newBotMessages]);

                // Save all bot messages
                if (triageId) {
                    for (const msg of newBotMessages) {
                        await saveMessage(triageId, 'bot', msg.text);
                    }
                }
            }
            // Handle single message response (legacy format)
            else if (response && response.text) {
                const botMessage = {
                    id: Date.now() + 1,
                    text: response.text,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);

                // Save bot response
                if (triageId) {
                    saveMessage(triageId, 'bot', response.text);
                }
            }

            // Check for triage completion data
            if (response && response.dados_confirmados) {
                await saveTriageReport(response.dados_confirmados);
            }
        } catch (error) {
            console.error("Failed to send message", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Desculpe, não consegui enviar sua mensagem. Verifique sua conexão.",
                sender: 'bot',
                isError: true,
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isPhoneSubmitted) {
        return (
            <div className="flex flex-col h-[600px] w-full max-w-md bg-emerald-900/20 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden items-center justify-center p-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg mb-6">
                    <Stethoscope size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Triagem Virtual</h2>
                <p className="text-slate-300 text-center mb-8">Por favor, insira seu número de telefone para iniciar a triagem.</p>

                <form onSubmit={handlePhoneSubmit} className="w-full space-y-4">
                    <div>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Telefone (ex: 5511999999999)"
                            className="w-full bg-slate-800/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!phoneNumber.trim()}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 font-medium"
                    >
                        Iniciar Triagem
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-emerald-500/30 bg-emerald-900/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Stethoscope size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="font-semibold text-lg text-white">Triagem-IA</h1>
                    <p className="text-xs text-emerald-200/70 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Online • {phoneNumber}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-700' : 'bg-emerald-900/50'
                            }`}>
                            {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} className="text-emerald-400" />}
                        </div>

                        <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700'
                            } ${msg.isError ? 'bg-red-500/20 border-red-500/50 text-red-200' : ''}`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <span className="text-[10px] opacity-50 mt-1 block text-right">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                            <Bot size={16} className="text-emerald-400" />
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-emerald-500/30 bg-slate-900/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Digite sua resposta..."
                        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TriagemWindow;
