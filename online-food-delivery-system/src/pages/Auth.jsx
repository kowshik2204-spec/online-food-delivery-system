import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login, signup } from '../store.js';

export default function Auth({ mode, onAuth }) {
  const isLogin = mode === 'login';
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const change = e => setF({ ...f, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    setErr('');
    try {
      if (!isLogin) {
        if (f.password.length < 6) throw new Error('Password must be at least 6 characters');
        signup(f);
      }
      onAuth(login(f.email, f.password));
    } catch (x) { setErr(x.message); }
  };

  return (
    <div className="auth">
      <form className="card" onSubmit={submit}>
        <h1>🍔 FoodExpress</h1>
        <h2>{isLogin ? 'Login' : 'Create account'}</h2>
        {!isLogin && <input name="name" placeholder="Full name" value={f.name} onChange={change} required />}
        <input name="email" type="email" placeholder="Email" value={f.email} onChange={change} required />
        <input name="password" type="password" placeholder="Password" value={f.password} onChange={change} required />
        {err && <p className="err">{err}</p>}
        <button className="btn">{isLogin ? 'Login' : 'Sign up'}</button>
        <p>{isLogin ? <>New here? <Link to="/signup">Sign up</Link></> : <>Already have an account? <Link to="/login">Login</Link></>}</p>
        {isLogin && <small className="hint">Demo admin: admin@food.com / admin123</small>}
      </form>
    </div>
  );
}
