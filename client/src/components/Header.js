import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const logout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
    window.location.reload();
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">LaptopBazaar</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart ({cartCount})</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item"><span className="nav-link">Hi, {user.name}</span></li>
                {user.isAdmin && <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>}
                <li className="nav-item"><button className="btn btn-link nav-link" onClick={logout}>Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
