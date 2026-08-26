import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const [member, setMember] = useState(null);
    const navigate = useNavigate();

    // This runs automatically when the page loads
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/members/me');
                setMember(response.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                // If the token is expired or missing, kick them back to login
                navigate('/login');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleRenew = async () => {
        try {
            // Call the PUT endpoint using the member's ID
            const response = await api.put(`/members/${member.id}/renew`);

            // Update the local state with the new data from the backend
            setMember(response.data);
            alert('Membership renewed successfully! Your next payment date has been updated.');
        } catch (error) {
            console.error("Failed to renew", error);
            alert('Failed to renew membership.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Shred the VIP pass
        navigate('/login'); // Send them to the login screen
    };

    // Show a loading state until the data arrives
    if (!member) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h2>;

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Welcome back, {member.name}!</h2>

            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                <p><strong>Email:</strong> {member.email}</p>
                <p><strong>Phone:</strong> {member.phone}</p>
                <p><strong>Joining Date:</strong> {member.joiningDate}</p>

                <hr style={{ margin: '15px 0' }} />

                <h3 style={{ color: '#d9534f' }}>
                    Next Payment Due: {member.nextPaymentDate}
                </h3>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleRenew}
                    style={{ flex: 1, padding: '10px', backgroundColor: '#5cb85c', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                >
                    Renew Membership
                </button>
                <button
                    onClick={handleLogout}
                    style={{ padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;