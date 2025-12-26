import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../api';
import Header from '../components/Header';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('enter username & password');
      return;
    }
    const res = await apiPost('/register', { username, password });
    setOutput(JSON.stringify(res, null, 2));
    if (res.status === 'success') {
      alert('Account created — please login');
      navigate('/login');
    }
  };

  return (
    <>
      <Header showNav={false} />
      <div className="container">
        <div className="card" style={{ maxWidth: '520px', margin: '36px auto' }}>
          <h2>Create an account</h2>
          <p className="small">Register to try the LiteCore demo shop.</p>

          <input
            type="text"
            className="input"
            placeholder="Choose username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="Choose password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={handleRegister}>
              Create account
            </button>
          </div>

          <pre style={{ marginTop: '12px' }}>{output}</pre>

          <div className="small" style={{ marginTop: '12px' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
