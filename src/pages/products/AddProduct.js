import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        brand: '',
        category: '',
        stock: '',
        price: '',
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [message, setMessage] = useState('');

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
            
            // Append files to the form data
            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });

            // Append product fields to the form data
            for (let key in product) {
                formData.append(key, product[key]);
            }

            const response = await axios.post('http://localhost:4000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message || 'Product added successfully!');
            // Reset the form after successful submission
            setProduct({
                name: '',
                description: '',
                brand: '',
                category: '',
                stock: '',
                price: '',
            });
            setSelectedFiles([]);
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Error uploading product!');
        }
    };

    return (
        <div className="add-product">
            <h2>Add New Product</h2>
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
                    <input type="file" multiple onChange={handleFileChange} required />
                </label>
                <button type="submit">Add Product</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddProduct;
