import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error("Registration failed", error);
            alert('Registration failed.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400 mb-8">Join the fitness program today.</p>

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            required
                            autoComplete="off"
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                        />
                    </div>
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
                        <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
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

                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-red-900/30 mt-4">
                        Register
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already a member? <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;