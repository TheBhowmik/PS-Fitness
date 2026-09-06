import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllMembers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Pass the JWT token in the headers for the admin route
                const response = await api.get('/members/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMembers(response.data);
            } catch (error) {
                console.error("Failed to fetch members", error);
                alert("You do not have access or your session expired.");
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchAllMembers();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-gray-400 text-sm mt-1">Gym Roster & Payment Tracking</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-5 rounded-xl border border-gray-700 transition-all duration-150 active:scale-[0.98]"
                    >
                        Logout
                    </button>
                </div>

                {/* Table Container */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-5 font-medium">ID</th>
                                <th className="p-5 font-medium">Name</th>
                                <th className="p-5 font-medium">Email</th>
                                <th className="p-5 font-medium">Phone</th>
                                <th className="p-5 font-medium">Next Payment</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="p-5 text-gray-400">#{member.id}</td>
                                    <td className="p-5 text-white font-medium">{member.name}</td>
                                    <td className="p-5 text-gray-300">{member.email}</td>
                                    <td className="p-5 text-gray-300">{member.phone}</td>
                                    <td className="p-5">
                                            <span className="px-3 py-1 bg-red-950/40 text-red-400 border border-red-900/60 rounded-full text-sm font-medium">
                                                {member.nextPaymentDate}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">No members found.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;