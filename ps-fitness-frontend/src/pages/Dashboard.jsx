import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const [member, setMember] = useState(null);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [newDate, setNewDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await api.get('/members/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMember(response.data);
                setNewDate(response.data.nextPaymentDate || '');
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
            setNewDate(response.data.nextPaymentDate);
            alert('Membership renewed successfully!');
        } catch (error) {
            console.error("Failed to renew", error);
            alert('Failed to renew membership.');
        }
    };

    const handleDateUpdate = async (e) => {
        e.preventDefault();
        if (!member) return;
        try {
            const token = localStorage.getItem('token');
            // Calls the custom backend endpoint to update the date directly
            const response = await api.put(`/members/admin/members/${member.id}/update-date`,
                { nextPaymentDate: newDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMember(response.data);
            setIsEditingDate(false);
            alert('Payment due date updated successfully!');
        } catch (error) {
            console.error("Failed to update date", error);
            alert('Failed to update payment date. Check permissions.');
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

                {/* Due Date Alert Card with Edit Option */}
                <div className="bg-red-950/40 border border-red-900/60 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-red-400 font-medium">Next Payment Due</p>
                            {!isEditingDate ? (
                                <p className="text-xl font-extrabold text-red-300 mt-0.5">{member.nextPaymentDate}</p>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                            {!isEditingDate ? (
                                <button
                                    onClick={() => setIsEditingDate(true)}
                                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                    Edit Date
                                </button>
                            ) : null}
                            <span className="h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
                        </div>
                    </div>

                    {isEditingDate && (
                        <form onSubmit={handleDateUpdate} className="pt-2 border-t border-red-900/40 flex gap-2">
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-red-500 flex-1"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingDate(false)}
                                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </form>
                    )}
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