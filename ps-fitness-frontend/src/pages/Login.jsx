import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // This hits http://localhost:8081/api/auth/login
            const response = await api.post('/auth/login', credentials);

            // The backend returns the JWT string directly
            const token = response.data;

            // Save the VIP pass to the browser's local storage!
            localStorage.setItem('token', token);

            alert('Login successful!');

            // Redirect to the protected dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid email or password. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>Member Login</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
};

export default Login;