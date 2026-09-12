import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 1. Get the token
            const response = await api.post('/auth/login', { email, password });
            const token = response.data;
            localStorage.setItem('token', token);

            // 2. Fetch the user's profile to check their role
            const profileRes = await api.get('/members/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 3. Route based on the role
            if (profileRes.data.role === 'ADMIN') {
                navigate('/admin'); // Make sure this matches your App.jsx route
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F1EA] text-stone-800 flex items-center justify-center p-6 font-['Lato',sans-serif]">
            <div className="w-full max-w-md bg-white border border-stone-200 rounded-sm shadow-xl p-10 space-y-8">

                <div className="text-center space-y-2 border-b border-stone-200 pb-6">
                    <span className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">PS Fitness</span>
                    <h2 className="text-3xl font-bold text-stone-900 font-['Playfair_Display',serif] italic">
                        Member Portal
                    </h2>
                </div>

                {error && (
                    <div className="bg-[#FAF6EE] border border-[#E8DCC4] text-amber-900 text-sm p-3 rounded-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-stone-500 uppercase font-bold">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#FAFAF8] border border-stone-200 rounded-sm px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-stone-500 uppercase font-bold">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#FAFAF8] border border-stone-200 rounded-sm px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-stone-900 hover:bg-black text-white tracking-widest uppercase text-xs font-bold py-3.5 rounded-sm transition-all duration-150 active:scale-[0.99] cursor-pointer mt-4"
                    >
                        Sign In
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-sm text-stone-500">
                        Not a member yet?{' '}
                        <Link to="/register" className="text-amber-700 font-bold hover:text-amber-800 underline decoration-amber-700/30 underline-offset-4">
                            Apply here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;