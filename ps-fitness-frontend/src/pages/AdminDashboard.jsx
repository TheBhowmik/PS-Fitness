import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    const fetchMembers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        try {
            const response = await api.get('/members/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(response.data);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [navigate]);

    const openMemberModal = async (member) => {
        setSelectedMember(member);
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/members/admin/members/${member.id}/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    const handleCashPayment = async () => {
        if (!window.confirm(`Record 1 month cash payment for ${selectedMember.name}?`)) return;
        try {
            const token = localStorage.getItem('token');
            await api.post(`/members/admin/members/${selectedMember.id}/cash-payment`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Cash payment recorded successfully!');
            setSelectedMember(null);
            fetchMembers(); // Refresh the main roster
        } catch (error) {
            alert('Failed to process cash payment.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F1EA] text-stone-800 p-6 md:p-12 font-['Lato',sans-serif]">
            <div className="max-w-6xl mx-auto bg-white border border-stone-200 rounded-sm shadow-xl p-8 md:p-12 relative">

                <div className="flex justify-between items-end border-b border-stone-200 pb-8 mb-8">
                    <div>
                        <span className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">Admin Console</span>
                        <h1 className="text-4xl font-bold text-stone-900 mt-2 font-['Playfair_Display',serif] italic">
                            Member Roster
                        </h1>
                    </div>
                    <button
                        onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                        className="bg-white hover:bg-stone-50 text-stone-800 tracking-widest uppercase text-xs font-bold py-2.5 px-6 rounded-sm border border-stone-300 transition-all"
                    >
                        Secure Logout
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[#FAFAF8] border-y border-stone-200">
                            <th className="py-4 px-4 text-xs tracking-wider text-stone-500 uppercase font-bold">Name</th>
                            <th className="py-4 px-4 text-xs tracking-wider text-stone-500 uppercase font-bold">Contact</th>
                            <th className="py-4 px-4 text-xs tracking-wider text-stone-500 uppercase font-bold">Next Due</th>
                            <th className="py-4 px-4 text-xs tracking-wider text-stone-500 uppercase font-bold">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                        {members.map((member) => (
                            <tr key={member.id} className="hover:bg-[#FAFAF8] transition-colors">
                                <td className="py-4 px-4">
                                    <p className="font-bold text-stone-900 font-['Playfair_Display',serif] text-lg">{member.name}</p>
                                    <p className="text-xs text-stone-400 tracking-wide">{member.role}</p>
                                </td>
                                <td className="py-4 px-4 space-y-1">
                                    <p className="text-sm font-medium text-stone-700">{member.email}</p>
                                    <p className="text-xs text-stone-500">{member.phone}</p>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="text-sm font-bold text-amber-800">{member.nextPaymentDate}</span>
                                </td>
                                <td className="py-4 px-4">
                                    <button
                                        onClick={() => openMemberModal(member)}
                                        className="text-xs tracking-widest uppercase font-bold text-amber-700 hover:text-amber-900 border-b border-amber-700/30 pb-0.5"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Member Management Modal */}
                {selectedMember && (
                    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white max-w-lg w-full p-8 rounded-sm shadow-2xl border border-stone-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-stone-900 font-['Playfair_Display',serif]">{selectedMember.name}</h3>
                                    <p className="text-sm text-stone-500">Due: {selectedMember.nextPaymentDate}</p>
                                </div>
                                <button onClick={() => setSelectedMember(null)} className="text-stone-400 hover:text-stone-800 font-bold text-xl">&times;</button>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-3 border-b border-stone-100 pb-2">Payment History</h4>
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                    {history.length === 0 ? (
                                        <p className="text-sm text-stone-500 italic">No previous payments found.</p>
                                    ) : (
                                        history.map(record => (
                                            <div key={record.id} className="flex justify-between text-sm p-2 bg-[#FAFAF8] border border-stone-100 rounded-sm">
                                                <span className="text-stone-600">{record.paymentDate}</span>
                                                <span className="font-bold text-stone-800">INR {record.amount}</span>
                                                <span className={`text-xs font-bold tracking-wider ${record.paymentMode === 'CASH' ? 'text-amber-700' : 'text-stone-500'}`}>
                                                    {record.paymentMode}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-stone-200">
                                <button
                                    onClick={handleCashPayment}
                                    className="flex-1 bg-stone-900 hover:bg-black text-white tracking-widest uppercase text-xs font-bold py-3 rounded-sm transition-all"
                                >
                                    Accept Cash (1 Mo)
                                </button>
                                <button
                                    onClick={() => setSelectedMember(null)}
                                    className="px-6 bg-stone-100 hover:bg-stone-200 text-stone-600 tracking-widest uppercase text-xs font-bold py-3 rounded-sm border border-stone-200 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;