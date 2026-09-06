import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                setProfile(response.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="flex justify-between items-center bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Member Dashboard</h1>
                        <p className="text-gray-400 text-sm mt-1">Welcome back to your fitness portal.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-5 rounded-xl border border-gray-700 transition-all duration-150 active:scale-[0.98]"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Your Subscription details</h2>
                    {profile ? (
                        <div className="space-y-4">
                            <div className="flex border-b border-gray-800 pb-4">
                                <span className="w-1/3 text-gray-400 font-medium">Name</span>
                                <span className="text-gray-200">{profile.name || "N/A"}</span>
                            </div>
                            <div className="flex border-b border-gray-800 pb-4">
                                <span className="w-1/3 text-gray-400 font-medium">Email</span>
                                <span className="text-gray-200">{profile.email || "N/A"}</span>
                            </div>
                            <div className="flex pb-2">
                                <span className="w-1/3 text-gray-400 font-medium">Membership Status</span>
                                <span className="px-3 py-1 bg-green-950/40 text-green-400 border border-green-900/60 rounded-full text-sm font-medium">
                  Active
                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;