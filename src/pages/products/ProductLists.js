import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditProductModal from './EditProductModal'; // Import the EditProductModal
import './ProductLists.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [message, setMessage] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/products`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.data && response.data.success) {
        setProducts(response.data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('There was an error fetching the products!', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      setMessage('Product deleted successfully!');
    } catch (error) {
      console.error('There was an error deleting the product!', error);
      setMessage('Error deleting product!');
    }
  };

  const handleEdit = (productId) => {
    setSelectedProductId(productId);
  };

  const handleUpdate = () => {
    setSelectedProductId(null);
    // Optionally, refetch the products to update the list
    fetchProducts();
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredProducts = sortedProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <input
        type="text"
        placeholder="Search by name or ID"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th>Description</th>
            <th>Brand</th>
            <th>Category</th>
            <th onClick={() => handleSort('stock')}>Stock</th>
            <th onClick={() => handleSort('price')}>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>
                {product.images && product.images.length > 0 && (
                  <img src={product.images[0]} alt={`${product.name}`} className="product-image" />
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.brand}</td>
              <td>{product.category || 'N/A'}</td>
              <td>{product.stock}</td>
              <td>Rs: {product.price}</td>
              <td>
                <button onClick={() => handleEdit(product._id)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(product._id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedProductId && (
        <EditProductModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onUpdate={handleUpdate}
        />
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductList;
