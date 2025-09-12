import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty } = useContext(CartContext);
  const navigate = useNavigate();

  const checkout = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return navigate('/login');
    navigate('/checkout');
  };

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (cartItems.length === 0) return (
    <p>Cart empty. <Link to="/">Go shopping</Link></p>
  );

  return (
    <div>
      <h2>Shopping Cart</h2>
      <div className="row">
        <div className="col-md-8">
          {cartItems.map(i => (
            <div className="card mb-2" key={i._id}>
              <div className="card-body d-flex align-items-center">
                <img src={i.image || 'https://via.placeholder.com/100'} style={{width:100}} alt={i.name}/>
                <div className="ms-3 flex-grow-1">
                  <h5>{i.name}</h5>
                  <p>Rs. {i.price}</p>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={i.qty}
                    onChange={e => updateQty(i._id, e.target.value)}
                    className="form-control mb-2"
                  />
                  <button className="btn btn-danger" onClick={() => removeFromCart(i._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <h4>Summary</h4>
            <p>Subtotal: Rs. {subtotal}</p>
            <button className="btn btn-primary w-100" onClick={checkout}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
