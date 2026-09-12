import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed. Email or Phone might already exist.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F1EA] text-stone-800 flex items-center justify-center p-6 font-['Lato',sans-serif]">
            <div className="w-full max-w-md bg-white border border-stone-200 rounded-sm shadow-xl p-10 space-y-8">

                <div className="text-center space-y-2 border-b border-stone-200 pb-6">
                    <span className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">PS Fitness</span>
                    <h2 className="text-3xl font-bold text-stone-900 font-['Playfair_Display',serif] italic">
                        Membership Application
                    </h2>
                </div>

                {error && (
                    <div className="bg-[#FAF6EE] border border-[#E8DCC4] text-amber-900 text-sm p-3 rounded-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-stone-500 uppercase font-bold">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-[#FAFAF8] border border-stone-200 rounded-sm px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-stone-500 uppercase font-bold">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-[#FAFAF8] border border-stone-200 rounded-sm px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-stone-500 uppercase font-bold">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-[#FAFAF8] border border-stone-200 rounded-sm px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-stone-500 uppercase font-bold">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-[#FAFAF8] border border-stone-200 rounded-sm px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-stone-900 hover:bg-black text-white tracking-widest uppercase text-xs font-bold py-3.5 rounded-sm transition-all duration-150 active:scale-[0.99] cursor-pointer mt-4"
                    >
                        Submit Application
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm text-stone-500">
                        Already a member?{' '}
                        <Link to="/login" className="text-amber-700 font-bold hover:text-amber-800 underline decoration-amber-700/30 underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;