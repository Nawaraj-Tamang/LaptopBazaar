import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Products</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="row g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <div className="col-sm-6 col-md-4 col-lg-4" key={p._id}>
              <div className="card h-100 d-flex flex-column">
                <img
                  src={p.image || 'https://via.placeholder.com/300x180'}
                  className="card-img-top"
                  alt={p.name}
                  style={{ objectFit: 'cover', height: '180px' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text text-truncate">{p.description}</p>
                  <p><strong>Rs. {p.price}</strong></p>
                  <div className="mt-auto">
                    <Link to={`/product/${p._id}`} className="btn btn-primary w-100">
                      View
                    </Link>
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
