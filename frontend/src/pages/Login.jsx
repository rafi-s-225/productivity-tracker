import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.userId, res.data.username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleRegister = async () => {
    const username = email.split('@')[0];
    try {
      const res = await API.post('/auth/register', { username, email, password });
      login(res.data.userId, res.data.username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Register failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🎯 Productivity Tracker</h1>
        <p className="subtitle">Login to view your dashboard</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister} className="secondary">Register</button>
      </div>
    </div>
  );
}