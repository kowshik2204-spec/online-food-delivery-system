import { useState } from 'react';
import Header from '../Header.jsx';
import { getMenu, getOrders, saveOrders } from '../store.js';

export default function User({ user, onLogout }) {
  const menu = getMenu();
  const [cart, setCart] = useState({});
  const [addr, setAddr] = useState('');
  const [cat, setCat] = useState('All');
  const [tab, setTab] = useState('menu');
  const [orders, setOrders] = useState(getOrders);
  const [msg, setMsg] = useState('');

  const cats = ['All', ...new Set(menu.map(m => m.category))];
  const items = menu.filter(m => cart[m.id]).map(m => ({ ...m, qty: cart[m.id] }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const mine = orders.filter(o => o.userId === user.id).reverse();
  const go = t => { setTab(t); setMsg(''); };
  const add = (id, d) => setCart(c => {
    const n = { ...c }, q = (c[id] || 0) + d;
    if (q > 0) n[id] = q; else delete n[id];
    return n;
  });

  const place = () => {
    if (!items.length) return setMsg('Your cart is empty');
    if (!addr.trim()) return setMsg('Please enter a delivery address');
    const all = [...getOrders(), {
      id: Date.now(), userId: user.id, userName: user.name,
      items: items.map(({ name, price, qty }) => ({ name, price, qty })),
      total, address: addr, status: 'Pending', date: new Date().toLocaleString(),
    }];
    saveOrders(all); setOrders(all); setCart({}); setAddr('');
    setTab('orders'); setMsg('Order placed successfully ✅');
  };

  return (
    <>
      <Header user={user} onLogout={onLogout}>
        <button className={tab === 'menu' ? 'on' : ''} onClick={() => go('menu')}>Menu</button>
        <button className={tab === 'orders' ? 'on' : ''} onClick={() => go('orders')}>My Orders ({mine.length})</button>
      </Header>
      <main className="wrap">
        {msg && <p className="note">{msg}</p>}
        {tab === 'menu' ? (
          <div className="split">
            <section>
              <div className="chips">
                {cats.map(c => <button key={c} className={c === cat ? 'chip on' : 'chip'} onClick={() => setCat(c)}>{c}</button>)}
              </div>
              <div className="grid">
                {menu.filter(m => cat === 'All' || m.category === cat).map(m => (
                  <div className="card item" key={m.id}>
                    <div className="emoji">{m.emoji}</div>
                    <h3>{m.name}</h3>
                    <p>{m.category}</p>
                    <b>₹{m.price}</b>
                    <div className="qty">
                      {cart[m.id]
                        ? <><button onClick={() => add(m.id, -1)}>−</button><span>{cart[m.id]}</span><button onClick={() => add(m.id, 1)}>+</button></>
                        : <button className="btn sm" onClick={() => add(m.id, 1)}>Add</button>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <aside className="card cart">
              <h2>🛒 Your Cart</h2>
              {items.length === 0 ? <p>Cart is empty</p> : items.map(i => (
                <div className="row" key={i.id}><span>{i.name} × {i.qty}</span><span>₹{i.price * i.qty}</span></div>
              ))}
              <div className="row total"><span>Total</span><span>₹{total}</span></div>
              <textarea placeholder="Delivery address" value={addr} onChange={e => setAddr(e.target.value)} />
              <button className="btn" onClick={place}>Place Order</button>
            </aside>
          </div>
        ) : (
          <section>
            <h2>My Orders</h2>
            {mine.length === 0 && <p>No orders yet.</p>}
            {mine.map(o => (
              <div className="card order" key={o.id}>
                <div className="row"><b>Order #{String(o.id).slice(-6)}</b><span className={'tag ' + o.status.replace(/ /g, '')}>{o.status}</span></div>
                <p>{o.items.map(i => `${i.name} × ${i.qty}`).join(', ')}</p>
                <div className="row"><small>{o.date} · {o.address}</small><b>₹{o.total}</b></div>
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
