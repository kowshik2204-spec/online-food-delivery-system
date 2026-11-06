import { useState } from 'react';
import Header from '../Header.jsx';
import { getMenu, saveMenu, getOrders, saveOrders, getUsers } from '../store.js';

const STATUS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const TABS = ['dashboard', 'menu', 'orders', 'users'];
const blank = { name: '', price: '', category: '', emoji: '🍽️' };

export default function Admin({ user, onLogout }) {
  const [tab, setTab] = useState('dashboard');
  const [menu, setMenu] = useState(getMenu);
  const [orders, setOrders] = useState(getOrders);
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const users = getUsers();

  const updateMenu = m => { setMenu(m); saveMenu(m); };
  const submit = e => {
    e.preventDefault();
    const item = { ...form, price: Number(form.price) };
    updateMenu(editId ? menu.map(m => (m.id === editId ? { ...m, ...item } : m)) : [...menu, { ...item, id: Date.now() }]);
    setForm(blank); setEditId(null);
  };
  const edit = m => { setForm({ name: m.name, price: m.price, category: m.category, emoji: m.emoji }); setEditId(m.id); };
  const setStatus = (id, status) => {
    const o = orders.map(x => (x.id === id ? { ...x, status } : x));
    setOrders(o); saveOrders(o);
  };
  const field = e => setForm({ ...form, [e.target.name]: e.target.value });

  const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const stats = [
    ['Total orders', orders.length], ['Pending orders', orders.filter(o => o.status === 'Pending').length],
    ['Revenue', '₹' + revenue], ['Menu items', menu.length], ['Customers', users.filter(u => u.role === 'user').length],
  ];

  return (
    <>
      <Header user={user} onLogout={onLogout}>
        {TABS.map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}
      </Header>
      <main className="wrap">
        {tab === 'dashboard' && (
          <section>
            <h2>Admin Dashboard</h2>
            <div className="stats">{stats.map(([l, v]) => <div className="card stat" key={l}><b>{v}</b><span>{l}</span></div>)}</div>
          </section>
        )}

        {tab === 'menu' && (
          <section>
            <h2>Manage Menu</h2>
            <form className="card form" onSubmit={submit}>
              <input name="emoji" placeholder="Emoji" value={form.emoji} onChange={field} style={{ width: 70 }} />
              <input name="name" placeholder="Item name" value={form.name} onChange={field} required />
              <input name="category" placeholder="Category" value={form.category} onChange={field} required />
              <input name="price" type="number" min="1" placeholder="Price (₹)" value={form.price} onChange={field} required />
              <button className="btn">{editId ? 'Update' : 'Add item'}</button>
              {editId && <button type="button" className="btn sm gray" onClick={() => { setForm(blank); setEditId(null); }}>Cancel</button>}
            </form>
            <table>
              <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>{menu.map(m => (
                <tr key={m.id}><td>{m.emoji}</td><td>{m.name}</td><td>{m.category}</td><td>₹{m.price}</td>
                  <td><button className="btn sm" onClick={() => edit(m)}>Edit</button> <button className="btn sm red" onClick={() => updateMenu(menu.filter(x => x.id !== m.id))}>Delete</button></td></tr>
              ))}</tbody>
            </table>
          </section>
        )}

        {tab === 'orders' && (
          <section>
            <h2>All Orders</h2>
            {orders.length === 0 && <p>No orders yet.</p>}
            {[...orders].reverse().map(o => (
              <div className="card order" key={o.id}>
                <div className="row"><b>#{String(o.id).slice(-6)} · {o.userName}</b>
                  <select value={o.status} onChange={e => setStatus(o.id, e.target.value)}>{STATUS.map(s => <option key={s}>{s}</option>)}</select></div>
                <p>{o.items.map(i => `${i.name} × ${i.qty}`).join(', ')}</p>
                <div className="row"><small>{o.date} · {o.address}</small><b>₹{o.total}</b></div>
              </div>
            ))}
          </section>
        )}

        {tab === 'users' && (
          <section>
            <h2>Registered Users</h2>
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
              <tbody>{users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>)}</tbody>
            </table>
          </section>
        )}
      </main>
    </>
  );
}
