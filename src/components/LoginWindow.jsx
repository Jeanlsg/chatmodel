import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const LoginWindow = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('is_admin', 'true');
            navigate('/dashboard');
        } else {
            setError('Credenciais inválidas');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                        <Lock size={32} className="text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
                    <p className="text-slate-400">Entre com suas credenciais</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-colors font-medium shadow-lg shadow-indigo-500/20"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginWindow;
