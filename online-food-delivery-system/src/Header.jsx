export default function Header({ user, onLogout, children }) {
  return (
    <header className="top">
      <b>🍔 FoodExpress</b>
      <nav>{children}</nav>
      <span>{user.name} <em>({user.role})</em></span>
      <button className="btn sm" onClick={onLogout}>Logout</button>
    </header>
  );
}
