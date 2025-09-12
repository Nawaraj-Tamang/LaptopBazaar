import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setAuthToken } from './api';
import { CartProvider } from './CartContext';

const user = JSON.parse(localStorage.getItem('userInfo'));
if (user && user.token) setAuthToken(user.token);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <App />
  </CartProvider>
);
