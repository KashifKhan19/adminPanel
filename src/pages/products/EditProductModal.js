import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProductModal.css';

const EditProductModal = ({ productId, onClose, onUpdate }) => {
  const [product, setProduct] = useState(null); // Initialize as null
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${productId}`);
        setProduct(response.data.data);
        console.log(response.data.data)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      for (let key in product) {
        formData.append(key, product[key]);
      }

      const response = await axios.put(`http://localhost:4000/api/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message || 'Product updated successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Error updating product!');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-product-modal">
      <div className="modal-content">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={product.name} onChange={handleChange} required />
          </label>
          <label>
            Description:
            <textarea name="description" value={product.description} onChange={handleChange} required></textarea>
          </label>
          <label>
            Brand:
            <input type="text" name="brand" value={product.brand} onChange={handleChange} required />
          </label>
          <label>
            Category:
            <input type="text" name="category" value={product.category} onChange={handleChange} />
          </label>
          <label>
            Stock:
            <input type="number" name="stock" value={product.stock} onChange={handleChange} required />
          </label>
          <label>
            Price:
            <input type="number" name="price" value={product.price} onChange={handleChange} required />
          </label>
          <label>
            Images:
            <input type="file" multiple onChange={handleFileChange} />
          </label>
          <button type="submit">Update Product</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default EditProductModal;
