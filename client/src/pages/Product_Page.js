import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart, cartItems, setCartItems } = useContext(CartContext);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(console.error);
  }, [id]);

  const handleAddToCart = () => {
    const exist = cartItems.find(item => item._id === product._id);
    if (exist) {
      setCartItems(
        cartItems.map(item =>
          item._id === product._id ? { ...item, qty: item.qty + parseInt(qty, 10) } : item
        )
      );
    } else {
      addToCart({
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: parseInt(qty, 10)
      });
    }
    navigate('/cart');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="row">
      <div className="col-md-6">
        <img
          src={product.image || 'https://via.placeholder.com/600x400'}
          alt={product.name}
          className="img-fluid"
        />
      </div>
      <div className="col-md-6">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <h4>Rs. {product.price}</h4>
        <p>Stock: {product.countInStock}</p>

        <div className="mb-3">
          <label>Qty</label>
          <input
            type="number"
            min="1"
            max={product.countInStock}
            value={qty}
            onChange={e => setQty(e.target.value)}
            className="form-control w-25"
          />
        </div>

        <button className="btn btn-success" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
