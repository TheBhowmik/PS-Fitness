import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const [member, setMember] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Explicitly attaching the JWT token so Spring Security accepts the request
                const response = await api.get('/members/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMember(response.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleRenew = async () => {
        if (!member) return;
        try {
            const token = localStorage.getItem('token');
            const response = await api.put(`/members/${member.id}/renew`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMember(response.data);
            alert('Membership renewed successfully!');
        } catch (error) {
            console.error("Failed to renew", error);
            alert('Failed to renew membership.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!member) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
                <p className="text-xl animate-pulse">Loading member profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-800 pb-5">
                    <div>
                        <span className="text-xs uppercase tracking-widest text-red-500 font-semibold">Member Pass</span>
                        <h2 className="text-2xl font-bold text-white mt-1">
                            Welcome back, <span className="text-red-500">{member.name}</span>
                        </h2>
                    </div>
                    <span className="px-3 py-1 bg-gray-800 text-xs font-semibold text-gray-300 rounded-full border border-gray-700">
            {member.role || 'USER'}
          </span>
                </div>

                {/* Member Details */}
                <div className="space-y-3 bg-gray-800/60 p-5 rounded-xl border border-gray-800">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Email Address</span>
                        <span className="font-medium text-white">{member.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Phone Number</span>
                        <span className="font-medium text-white">{member.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Enrolled Since</span>
                        <span className="font-medium text-white">{member.joiningDate}</span>
                    </div>
                </div>

                {/* Due Date Alert Card */}
                <div className="bg-red-950/40 border border-red-900/60 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-red-400 font-medium">Next Payment Due</p>
                        <p className="text-xl font-extrabold text-red-300 mt-0.5">{member.nextPaymentDate}</p>
                    </div>
                    <span className="h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-2">
                    <button
                        onClick={handleRenew}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-lg shadow-red-900/30"
                    >
                        Renew Membership
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-5 rounded-xl border border-gray-700 transition-all duration-150 active:scale-[0.98] cursor-pointer"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;