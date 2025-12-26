import React, { useState } from 'react';
import { apiPut, apiDelete, setToken } from '../api';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Account = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  const changePassword = async () => {
    const res = await apiPut('/update', {
      oldPassword,
      newPassword,
    });
    setOutput(JSON.stringify(res, null, 2));
    if (res.message) alert(res.message);
  };

  const deleteAccount = async () => {
    if (!confirm('Delete your account? This is irreversible.')) return;
    const res = await apiDelete('/delete');
    alert(
      res.status === 'success'
        ? 'Account deleted'
        : res.error || 'Failed'
    );
    if (res.status === 'success') {
      setToken(null);
      navigate('/login');
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="card" style={{ maxWidth: '520px', margin: '28px auto' }}>
          <h3>Change Password</h3>
          <input
            type="password"
            className="input"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="btn" onClick={changePassword}>
            Update password
          </button>
          <pre>{output}</pre>
        </div>

        <div className="card" style={{ maxWidth: '520px', margin: '28px auto' }}>
          <h3>Danger zone</h3>
          <p className="small">
            Delete your account (this will remove your cart too).
          </p>
          <button className="btn danger" onClick={deleteAccount}>
            Delete account
          </button>
        </div>
      </div>
    </>
  );
};

export default Account;
