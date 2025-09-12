import React, { useState, useEffect } from "react";
import api from "../api";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      alert("Error fetching products");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name,
        description: desc,
        price: Number(price),
        image,
        countInStock: Number(count),
      };

      if (editId) {
        // Update product
        const { data } = await api.put(`/products/${editId}`, body);
        alert("Updated: " + data.name);
      } else {
        // Create product
        const { data } = await api.post("/products", body);
        alert("Created: " + data.name);
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleEdit = (p) => {
    setName(p.name);
    setDesc(p.description);
    setPrice(p.price);
    setImage(p.image);
    setCount(p.countInStock);
    setEditId(p._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        alert("Product deleted");
        fetchProducts();
      } catch (err) {
        alert("Error deleting product");
      }
    }
  };

  const resetForm = () => {
    setName("");
    setDesc("");
    setPrice("");
    setImage("");
    setCount(0);
    setEditId(null);
  };

  return (
    <div className="col-md-8 offset-md-2">
      <h2>Admin - {editId ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        {/* Image preview */}
        {image && (
          <img
            src={image}
            alt="Preview"
            style={{ width: "150px", marginBottom: "10px", border: "1px solid #ccc" }}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/150?text=Invalid+URL")
            }
          />
        )}

        <input
          className="form-control mb-2"
          placeholder="Count In Stock"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
        <button className="btn btn-success">
          {editId ? "Update" : "Create"}
        </button>
        {editId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      <h3 className="mt-4">All Products</h3>
      <table className="table table-bordered mt-2">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "60px", height: "40px", objectFit: "cover" }}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/60x40?text=No+Image")
                    }
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.countInStock}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
}
