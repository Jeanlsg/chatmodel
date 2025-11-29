import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChatWindow from './components/ChatWindow';
import TriagemWindow from './components/TriagemWindow';
import DashboardWindow from './components/DashboardWindow';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
                <div className="absolute top-4 right-4 flex gap-4">
                    <Link to="/" className="text-white/70 hover:text-white transition-colors">Chat</Link>
                    <Link to="/triagem" className="text-emerald-400/70 hover:text-emerald-400 transition-colors">Triagem</Link>
                    <Link to="/dashboard" className="text-indigo-400/70 hover:text-indigo-400 transition-colors">Dashboard</Link>
                </div>
                <Routes>
                    <Route path="/" element={<ChatWindow />} />
                    <Route path="/triagem" element={<TriagemWindow />} />
                    <Route path="/dashboard" element={<DashboardWindow />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
