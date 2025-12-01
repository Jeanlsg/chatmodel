import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import './N8nChatPage.css';

const N8nChatPage = ({ setCurrentView, patientName }) => {
    const chatContainerRef = useRef(null);
    const chatInstanceRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current && !chatInstanceRef.current) {
            console.log('Initializing n8n chat...');
            // Initialize n8n chat
            chatInstanceRef.current = createChat({
                webhookUrl: 'https://n8n.jeanlsg.site/webhook/c0ae9eed-2c4a-4628-8da1-8c96ce89af36/chat',
                mode: 'fullscreen',
                chatInputKey: 'chatInput',
                chatSessionKey: 'sessionId',
                metadata: {
                    patientName: patientName || 'Paciente'
                },
                showWelcomeScreen: false,
                initialMessages: [
                    'Olá! Sou a assistente virtual. Como posso ajudar você hoje?'
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

            console.log('Mounting n8n chat to container:', chatContainerRef.current);
            setTimeout(() => {
                if (chatContainerRef.current && chatInstanceRef.current) {
                    chatInstanceRef.current.mount(chatContainerRef.current);
                    console.log('n8n chat mounted successfully');
                } else {
                    console.error('Failed to mount n8n chat: container or instance missing');
                }
            }, 100);

            // Poll for messages and clean them up (JSON fix)
            const cleanupInterval = setInterval(() => {
                const container = chatContainerRef.current;
                if (!container) return;

                // Find all text nodes that might contain JSON
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
                        // Try to parse as JSON
                        const parsed = JSON.parse(textContent);
                        if (parsed.messages && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
                            // Replace with just the message text
                            textNode.textContent = parsed.messages.join('\n');
                        }
                    } catch (e) {
                        // If full parse fails, try regex extraction
                        const match = textContent.match(/"messages":\s*\[\s*"([^"]+)"\s*\]/);
                        if (match && match[1]) {
                            textNode.textContent = match[1];
                        }
                    }
                });
            }, 100); // Check every 100ms

            // Cleanup on unmount
            return () => {
                clearInterval(cleanupInterval);
                if (chatInstanceRef.current) {
                    chatInstanceRef.current.unmount();
                    chatInstanceRef.current = null;
                }
            };
        }
    }, [patientName]);

    return (
        <div className="n8n-page-wrapper">
            {/* New Standalone Header */}
            <header className="n8n-page-header">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentView('selection')}
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
                    onClick={() => setCurrentView('landing')}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Voltar ao Início"
                >
                    <Home size={20} />
                </button>
            </header>

            {/* Full Screen Chat Container */}
            <main className="n8n-page-content">
                <div ref={chatContainerRef} className="n8n-chat-container"></div>
            </main>
        </div>
    );
};

export default N8nChatPage;
