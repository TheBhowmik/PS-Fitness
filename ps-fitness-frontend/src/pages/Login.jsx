import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', credentials);
            const token = response.data.token || response.data;
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed", error);
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 mb-8">Sign in to access your member pass.</p>

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            required
                            autoComplete="new-email"
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-red-900/30 mt-4"
                    >
                        Log In
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    New to the gym? <Link to="/register" className="text-red-400 hover:text-red-300 font-medium">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;