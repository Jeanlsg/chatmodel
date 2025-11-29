import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { sendMessageToN8n } from '../services/api';

const ChatWindow = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await sendMessageToN8n(newMessage.text);

            // Assuming the n8n workflow returns { text: "response message" }
            if (response && response.text) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: response.text,
                    sender: 'bot',
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error("Failed to send message", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Sorry, I couldn't send your message. Please check your connection.",
                sender: 'bot',
                isError: true,
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)] bg-opacity-50 bg-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Bot size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="font-semibold text-lg text-white">AI Assistant</h1>
                    <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Online
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-700' : 'bg-indigo-600/20'
                            }`}>
                            {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} className="text-indigo-400" />}
                        </div>

                        <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                                ? 'bg-[var(--primary)] text-white rounded-tr-none'
                                : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700'
                            } ${msg.isError ? 'bg-red-500/20 border-red-500/50 text-red-200' : ''}`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <span className="text-[10px] opacity-50 mt-1 block text-right">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                            <Bot size={16} className="text-indigo-400" />
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-1">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-[var(--glass-border)] bg-slate-900/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
