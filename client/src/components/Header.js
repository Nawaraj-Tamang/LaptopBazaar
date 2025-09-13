import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';

export default function Header() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const logout = () => {
    // Keep per-user saved cart in localStorage so it can be restored next login.
    localStorage.removeItem('userInfo');
    // Clear UI cart immediately so nothing is shown for logged-out user.
    setCartItems([]);
    navigate('/');
  };

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.qty || 0), 0)
    : 0;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">LaptopBazaar</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* show cart only when user is logged in */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Cart ({cartCount})</Link>
              </li>
            )}

            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Hi, {user.name}</span>
                </li>

                {user.isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                )}

                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
