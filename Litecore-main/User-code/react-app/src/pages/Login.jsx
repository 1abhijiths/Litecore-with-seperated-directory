import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost, setToken } from '../api';
import Header from '../components/Header';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('enter username & password');
      return;
    }
    const res = await apiPost('/login', { username, password });
    setOutput(JSON.stringify(res, null, 2));
    if (res.token) {
      setToken(res.token);
      navigate('/');
    }
  };

  return (
    <>
      <Header showNav={false} />
      <div className="container">
        <div className="card" style={{ maxWidth: '420px', margin: '36px auto' }}>
          <h2>Welcome back</h2>
          <p className="small">Sign in to access your store dashboard.</p>

          <input
            type="text"
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn" onClick={handleLogin}>
            Sign in
          </button>

          <div className="row" style={{ marginTop: '12px', justifyContent: 'space-between' }}>
            <div className="small">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
            <div className="small">
              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot?
              </a>
            </div>
          </div>

          <pre style={{ marginTop: '12px', color: '#333', whiteSpace: 'pre-wrap' }}>
            {output}
          </pre>
        </div>
      </div>
    </>
  );
};

export default Login;
