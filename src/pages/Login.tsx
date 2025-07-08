// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Grab the page user was trying to visit, or fallback to /dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });  // Redirect back to original page
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}
      >
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
