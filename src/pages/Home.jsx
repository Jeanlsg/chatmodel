import React from 'react';
import { useNavigate } from 'react-router-dom';
import TriagemWindow from '../components/TriagemWindow';
import { LogIn } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative">
            {/* Login Button */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all text-sm font-medium backdrop-blur-sm"
                >
                    <LogIn className="w-4 h-4" />
                    Login
                </button>
            </div>

            {/* Main Content */}
            <TriagemWindow />
        </div>
    );
};

export default Home;
