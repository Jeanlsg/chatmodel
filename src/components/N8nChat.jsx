import React, { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import './N8nChat.css';

const N8nChat = ({ setCurrentView, patientName }) => {
    const chatContainerRef = useRef(null);
    const chatInstanceRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current && !chatInstanceRef.current) {
            // Initialize n8n chat
            chatInstanceRef.current = createChat({
                webhookUrl: 'https://n8n.jeanlsg.site/webhook/c0ae9eed-2c4a-4628-8da1-8c96ce89af36/chat',
                mode: 'fullscreen',
                chatInputKey: 'chatInput',
                chatSessionKey: 'sessionId',
                metadata: {
                    patientName: patientName || 'Paciente'
                },
                i18n: {
                    en: {
                        title: 'Triagem Natural',
                        subtitle: 'Descreva seus sintomas com suas próprias palavras',
                        footer: '',
                        getStarted: 'Iniciar Conversa',
                        inputPlaceholder: 'Digite sua mensagem...',
                    }
                }
            });

            chatInstanceRef.current.mount(chatContainerRef.current);
        }

        return () => {
            if (chatInstanceRef.current) {
                chatInstanceRef.current.unmount();
                chatInstanceRef.current = null;
            }
        };
    }, [patientName]);

    return (
        <div className="min-h-screen pt-20 bg-slate-950 flex flex-col">
            {/* Header with back button */}
            <div className="bg-slate-900 border-b border-slate-800 p-4">
                <div className="max-w-6xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => setCurrentView('selection')}
                        className="text-slate-400 hover:text-white mr-2 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h3 className="font-bold text-white">Conversa Natural</h3>
                        <p className="text-xs text-emerald-400">Descreva seus sintomas livremente</p>
                    </div>
                </div>
            </div>

            {/* N8n Chat Container - Fills remaining space */}
            <div className="flex-1 max-w-6xl w-full mx-auto p-4" style={{ minHeight: '600px' }}>
                <div
                    ref={chatContainerRef}
                    className="n8n-chat-container h-full w-full rounded-xl shadow-2xl border border-slate-800 overflow-hidden"
                    style={{ minHeight: '600px' }}
                />
            </div>
        </div>
    );
};

export default N8nChat;
