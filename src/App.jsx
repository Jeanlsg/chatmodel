import React from 'react';
import ChatWindow from './components/ChatWindow';

function App() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <ChatWindow />

            <div className="mt-8 text-center text-[var(--text-secondary)] text-sm">
                <p>Powered by n8n & React</p>
            </div>
        </div>
    );
}

export default App;
