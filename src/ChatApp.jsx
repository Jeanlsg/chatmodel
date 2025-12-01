import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import './pages/N8nChatPage.css'; // Reusing the isolated CSS

const ChatApp = () => {
    const chatContainerRef = useRef(null);
    const chatInstanceRef = useRef(null);
    const [patientName, setPatientName] = useState('');

    useEffect(() => {
        // Get patient name from URL params
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name') || 'Paciente';
        setPatientName(name);

        if (chatContainerRef.current && !chatInstanceRef.current) {
            console.log('Initializing n8n chat in standalone app...');

            chatInstanceRef.current = createChat({
                webhookUrl: 'https://n8n.jeanlsg.site/webhook/c0ae9eed-2c4a-4628-8da1-8c96ce89af36/chat',
                mode: 'fullscreen',
                chatInputKey: 'chatInput',
                chatSessionKey: 'sessionId',
                metadata: {
                    patientName: name
                },
                showWelcomeScreen: false,
                initialMessages: [
                    `Olá ${name !== 'Paciente' ? name.split(' ')[0] : ''}! Sou a assistente virtual. Descreva o que você está sentindo.`
                ],
                i18n: {
                    en: {
                        title: 'Triagem Natural',
                        subtitle: 'Descreva seus sintomas',
                        getStarted: 'Iniciar',
                        inputPlaceholder: 'Digite sua mensagem...',
                    }
                }
            });

            chatInstanceRef.current.mount(chatContainerRef.current);

            // JSON cleanup logic
            const cleanupInterval = setInterval(() => {
                const container = chatContainerRef.current;
                if (!container) return;

                const walker = document.createTreeWalker(
                    container,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );

                const nodesToProcess = [];
                let node;
                while (node = walker.nextNode()) {
                    const text = node.textContent || '';
                    if (text.includes('"messages"') && text.includes('[')) {
                        nodesToProcess.push(node);
                    }
                }

                nodesToProcess.forEach((textNode) => {
                    const textContent = textNode.textContent || '';
                    try {
                        const parsed = JSON.parse(textContent);
                        if (parsed.messages && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
                            textNode.textContent = parsed.messages.join('\n');
                        }
                    } catch (e) {
                        const match = textContent.match(/"messages":\s*\[\s*"([^"]+)"\s*\]/);
                        if (match && match[1]) {
                            textNode.textContent = match[1];
                        }
                    }
                });
            }, 100);

            return () => {
                clearInterval(cleanupInterval);
                if (chatInstanceRef.current) {
                    chatInstanceRef.current.unmount();
                    chatInstanceRef.current = null;
                }
            };
        }
    }, []);

    const goBack = () => {
        window.location.href = '/';
    };

    return (
        <div className="n8n-page-wrapper">
            <header className="n8n-page-header">
                <div className="flex items-center gap-4">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Voltar</span>
                    </button>
                    <div className="h-6 w-px bg-slate-700 mx-2"></div>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">Triagem Natural</h1>
                        <p className="text-xs text-emerald-400">Assistente Virtual Inteligente</p>
                    </div>
                </div>

                <button
                    onClick={goBack}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Voltar ao Início"
                >
                    <Home size={20} />
                </button>
            </header>

            <main className="n8n-page-content">
                <div ref={chatContainerRef} className="n8n-chat-container"></div>
            </main>
        </div>
    );
};

export default ChatApp;
