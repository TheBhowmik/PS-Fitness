import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllMembers = async () => {
            try {
                const response = await api.get('/members/all');
                setMembers(response.data);
            } catch (error) {
                console.error("Failed to fetch members", error);
                alert("You do not have access or your session expired.");
                navigate('/login');
            }
        };

        fetchAllMembers();
    }, [navigate]);

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>Admin Dashboard - Gym Roster</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                <tr style={{ backgroundColor: '#333', color: 'white', textAlign: 'left' }}>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>ID</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Name</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Email</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Phone</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Next Payment</th>
                </tr>
                </thead>
                <tbody>
                {members.map((member) => (
                    <tr key={member.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{member.id}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{member.name}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{member.email}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{member.phone}</td>
                        <td style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            color: '#d9534f',
                            fontWeight: 'bold'
                        }}>
                            {member.nextPaymentDate}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;