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

            // 1. Fetch Order ID from Spring Boot
            const orderRes = await api.post('/payment/create-order', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const orderData = typeof orderRes.data === 'string' ? JSON.parse(orderRes.data) : orderRes.data;

            // 2. Load Razorpay Script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: "rzp_test_Tb5xrrggVjh5Tb",
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "PS Fitness",
                    description: "Monthly Membership Renewal",
                    order_id: orderData.id,
                    handler: async function (response) {
                        // 3. On successful payment, trigger backend renewal
                        await api.put(`/members/${member.id}/renew`, {}, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                        window.location.reload();
                    },
                    prefill: {
                        name: member.name,
                        email: member.email,
                        contact: member.phone
                    },
                    theme: { color: "#ef4444" }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            };
        } catch (error) {
            console.error("Payment initialization failed", error);
            alert('Could not start payment gateway.');
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

    const handleDownloadReceipt = async () => {
        if (!member) return;
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/members/${member.id}/receipt`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob' // Critical for handling binary files
            });

            // Create a temporary URL to trigger the browser download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `PS_Fitness_Receipt.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Failed to download receipt", error);
            alert('Could not download receipt.');
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
        <div className="min-h-screen bg-[#F4F1EA] text-stone-800 flex items-center justify-center p-6 font-['Lato',sans-serif]">
            <div className="w-full max-w-lg bg-white border border-stone-200 rounded-sm shadow-xl p-10 space-y-8">

                {/* Header */}
                <div className="flex justify-between items-start border-b border-stone-200 pb-6">
                    <div>
                        <span className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">Membership Pass</span>
                        <h2 className="text-3xl font-bold text-stone-900 mt-2 font-['Playfair_Display',serif] italic">
                            Welcome, <span className="text-amber-700">{member.name}</span>
                        </h2>
                    </div>
                    <span className="px-3 py-1 bg-[#F4F1EA] text-xs font-bold tracking-widest text-stone-600 border border-stone-200 rounded-sm">
                        {member.role || 'USER'}
                    </span>
                </div>

                {/* Member Details */}
                <div className="space-y-4 bg-[#FAFAF8] p-6 rounded-sm border border-stone-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-500 tracking-wide">Email Address</span>
                        <span className="font-medium text-stone-800">{member.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-500 tracking-wide">Phone Number</span>
                        <span className="font-medium text-stone-800">{member.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-500 tracking-wide">Enrolled Since</span>
                        <span className="font-medium text-stone-800">{member.joiningDate}</span>
                    </div>
                </div>

                {/* Due Date Alert Card */}
                <div className="bg-[#FAF6EE] border border-[#E8DCC4] p-5 rounded-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-amber-800/70 font-bold">Next Payment Due</p>
                            {!isEditingDate ? (
                                <p className="text-2xl font-bold text-amber-900 mt-1 font-['Playfair_Display',serif]">{member.nextPaymentDate}</p>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-3">
                            {!isEditingDate ? (
                                <button
                                    onClick={() => setIsEditingDate(true)}
                                    className="text-xs tracking-wider bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 px-3 py-1.5 rounded-sm transition-colors cursor-pointer"
                                >
                                    Edit
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {isEditingDate && (
                        <form onSubmit={handleDateUpdate} className="pt-3 border-t border-[#E8DCC4] flex gap-2">
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="bg-white border border-stone-300 rounded-sm px-3 py-1.5 text-stone-800 text-sm focus:outline-none focus:border-amber-700 flex-1"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-stone-800 hover:bg-stone-900 text-white tracking-wide text-xs px-4 py-1.5 rounded-sm transition-colors cursor-pointer"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingDate(false)}
                                className="bg-stone-200 hover:bg-stone-300 text-stone-700 tracking-wide text-xs px-3 py-1.5 rounded-sm transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 flex-wrap">
                    <button
                        onClick={handleRenew}
                        className="flex-1 bg-stone-900 hover:bg-black text-white tracking-widest uppercase text-xs font-bold py-3.5 px-4 rounded-sm transition-all duration-150 active:scale-[0.99] cursor-pointer min-w-[180px]"
                    >
                        Renew Membership
                    </button>
                    <button
                        onClick={handleDownloadReceipt}
                        className="bg-white hover:bg-stone-50 text-stone-800 tracking-widest uppercase text-xs font-bold py-3.5 px-5 rounded-sm border border-stone-300 transition-all duration-150 active:scale-[0.99] cursor-pointer"
                    >
                        Receipt
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-600 tracking-widest uppercase text-xs font-bold py-3.5 px-5 rounded-sm border border-stone-200 transition-all duration-150 active:scale-[0.99] cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;