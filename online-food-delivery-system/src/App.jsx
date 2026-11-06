import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth.jsx';
import User from './pages/User.jsx';
import Admin from './pages/Admin.jsx';
import { currentUser, logout } from './store.js';

export default function App() {
  const [user, setUser] = useState(currentUser);
  const out = () => { logout(); setUser(null); };
  const home = user ? (user.role === 'admin' ? '/admin' : '/user') : '/login';
  const guard = (role, el) => (!user ? <Navigate to="/login" replace /> : user.role !== role ? <Navigate to={home} replace /> : el);
  const open = el => (user ? <Navigate to={home} replace /> : el);

  return (
    <Routes>
      <Route path="/login" element={open(<Auth mode="login" onAuth={setUser} />)} />
      <Route path="/signup" element={open(<Auth mode="signup" onAuth={setUser} />)} />
      <Route path="/user" element={guard('user', <User user={user} onLogout={out} />)} />
      <Route path="/admin" element={guard('admin', <Admin user={user} onLogout={out} />)} />
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}
