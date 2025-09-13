import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
      const confirmLogin = window.confirm(
        'You need to login to add items to the cart.\n\nPress OK to login, or Cancel to continue browsing as guest.'
      );
      if (confirmLogin) {
        navigate('/login');
      }
      return; 
    }

    addToCart({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1
    });
    navigate('/cart');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Products</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="row g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <div className="col-sm-6 col-md-4 col-lg-4" key={p._id}>
              <div className="card h-100 d-flex flex-column">
                <Link to={`/product/${p._id}`}>
                  <img
                    src={p.image || 'https://via.placeholder.com/300x180'}
                    className="card-img-top"
                    alt={p.name}
                    style={{ objectFit: 'cover', height: '180px', cursor: 'pointer' }}
                  />
                </Link>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text text-truncate">{p.description}</p>
                  <p><strong>Rs. {p.price}</strong></p>
                  <div className="mt-auto">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleAddToCart(p)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </div>
    </div>
  );
}
