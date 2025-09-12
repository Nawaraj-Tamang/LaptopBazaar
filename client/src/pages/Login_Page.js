import React, { useState } from 'react';
import api, { setAuthToken } from '../api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setAuthToken(data.token);
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="mb-3"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="form-control" placeholder="Email"/></div>
        <div className="mb-3"><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="form-control" placeholder="Password"/></div>
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
