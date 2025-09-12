import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';
import api from '../api';

export default function CheckoutPage() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (cartItems.length === 0) return (
    <p>Your cart is empty. <a href="/">Go shopping</a></p>
  );

  const subtotal = cartItems.reduce((sum, i) => sum + i.qty * i.price, 0);
  const shippingPrice = subtotal > 1000 ? 0 : 50;
  const taxPrice = Math.round(subtotal * 0.13);
  const totalPrice = subtotal + shippingPrice + taxPrice;

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) return navigate('/login');

    try {
      const orderData = {
        orderItems: cartItems.map(i => ({
          product: i._id,
          name: i.name,
          qty: i.qty,
          price: i.price,
          image: i.image
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        taxPrice,
        totalPrice
      };

      const { data } = await api.post('/orders', orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      alert('Order placed successfully! Order ID: ' + data._id);
      setCartItems([]); // clear cart context
      localStorage.removeItem('cartItems'); // clear localStorage
      navigate('/'); // or navigate to /order-confirmation/:id
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error placing order');
    }
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h3>Shipping Address</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <input
          type="text"
          placeholder="Address"
          className="form-control mb-2"
          value={shippingAddress.address}
          onChange={e => setShippingAddress({...shippingAddress, address: e.target.value})}
        />
        <input
          type="text"
          placeholder="City"
          className="form-control mb-2"
          value={shippingAddress.city}
          onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})}
        />
        <input
          type="text"
          placeholder="Postal Code"
          className="form-control mb-2"
          value={shippingAddress.postalCode}
          onChange={e => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
        />
        <input
          type="text"
          placeholder="Country"
          className="form-control mb-2"
          value={shippingAddress.country}
          onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})}
        />

        <h3>Payment Method</h3>
        <select
          className="form-select mb-3"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="MockPay">Mock Payment (Demo)</option>
        </select>

        <button className="btn btn-success w-100" type="button" onClick={handlePlaceOrder}>
          Place Order (Rs. {totalPrice})
        </button>
      </div>

      <div className="col-md-6">
        <h4>Order Summary</h4>
        <ul className="list-group mb-2">
          {cartItems.map(item => (
            <li key={item._id} className="list-group-item d-flex justify-content-between">
              {item.name} x {item.qty}
              <span>Rs. {item.qty * item.price}</span>
            </li>
          ))}
        </ul>
        <p>Items: Rs. {subtotal}</p>
        <p>Shipping: Rs. {shippingPrice}</p>
        <p>Tax: Rs. {taxPrice}</p>
        <h5>Total: Rs. {totalPrice}</h5>
      </div>
    </div>
  );
}
