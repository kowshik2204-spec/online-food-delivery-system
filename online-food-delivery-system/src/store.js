// All data lives in the browser's Local Storage (no backend needed).
const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const MENU = [
  { id: 1, name: 'Margherita Pizza', price: 249, category: 'Pizza', emoji: '🍕' },
  { id: 2, name: 'Farmhouse Pizza', price: 329, category: 'Pizza', emoji: '🍕' },
  { id: 3, name: 'Veg Burger', price: 129, category: 'Burgers', emoji: '🍔' },
  { id: 4, name: 'Chicken Burger', price: 169, category: 'Burgers', emoji: '🍔' },
  { id: 5, name: 'Chicken Biryani', price: 219, category: 'Rice', emoji: '🍛' },
  { id: 6, name: 'Veg Fried Rice', price: 159, category: 'Rice', emoji: '🍚' },
  { id: 7, name: 'French Fries', price: 89, category: 'Snacks', emoji: '🍟' },
  { id: 8, name: 'Cold Coffee', price: 99, category: 'Drinks', emoji: '☕' },
  { id: 9, name: 'Chocolate Brownie', price: 119, category: 'Desserts', emoji: '🍫' },
];

export function seed() {
  if (!get('users')) set('users', [{ id: 1, name: 'Admin', email: 'admin@food.com', password: 'admin123', role: 'admin' }]);
  if (!get('menu')) set('menu', MENU);
  if (!get('orders')) set('orders', []);
}

export const getUsers = () => get('users', []);
export const signup = ({ name, email, password }) => {
  const users = getUsers();
  const mail = email.trim().toLowerCase();
  if (users.some(u => u.email === mail)) throw new Error('Email already registered');
  set('users', [...users, { id: Date.now(), name: name.trim(), email: mail, password, role: 'user' }]);
};
export const login = (email, password) => {
  const u = getUsers().find(u => u.email === email.trim().toLowerCase() && u.password === password);
  if (!u) throw new Error('Invalid email or password');
  set('session', u.id);
  return u;
};
export const logout = () => localStorage.removeItem('session');
export const currentUser = () => getUsers().find(u => u.id === get('session')) || null;

export const getMenu = () => get('menu', []);
export const saveMenu = m => set('menu', m);
export const getOrders = () => get('orders', []);
export const saveOrders = o => set('orders', o);
