import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './Categories.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/category');
                if (response.data && response.data.success) {
                    setCategories(response.data.data);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error('There was an error fetching the categories!', error);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/category/${id}`);
            setCategories(categories.filter(category => category._id !== id));
            setMessage('Category deleted successfully!');
        } catch (error) {
            console.error('There was an error deleting the category!', error);
            setMessage('Error deleting category!');
        }
    };

    const handleEdit = (category) => {
        setCurrentCategory(category);
        setIsEditing(true);
    };

    const handleViewProducts = async (category) => {
        setSelectedCategory(category);
        try {
            const response = await axios.get(`http://localhost:4000/api/category/${category._id}/products`);
            if (response.data && response.data.success) {
                setProducts(response.data.data.products);
            }
        } catch (error) {
            console.error('There was an error fetching the products!', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentCategory({ ...currentCategory, [name]: value });
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/api/category/${currentCategory._id}`, currentCategory);
            setCategories(categories.map(category => (category._id === currentCategory._id ? response.data.data : category)));
            setIsEditing(false);
            setCurrentCategory({});
            setMessage('Category updated successfully!');
        } catch (error) {
            console.error('There was an error updating the category!', error);
            setMessage('Error updating category!');
        }
    };

    return (
        <div className="categories">
            {categories.map((category, index) => (
                <div className="category-card" style={{ backgroundColor: category.color }} key={index}>
                    {category.images && category.images.length > 0 && (
                        <img src={category.images[0]} alt={category.name} className="category-image" />
                    )}
                    <h3 className="category-name">{category.name}</h3>
                    <div className="actions">
                        <FaEdit className="action-icon" onClick={() => handleEdit(category)} />
                        <FaTrashAlt className="action-icon" onClick={() => handleDelete(category._id)} />
                        <button className="view-link" onClick={() => handleViewProducts(category)}>View Products</button>
                    </div>
                </div>
            ))}
            {isEditing && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Category</h2>
                        <label>
                            Name:
                            <input type="text" name="name" value={currentCategory.name} onChange={handleChange} />
                        </label>
                        <label>
                            Color:
                            <input type="text" name="color" value={currentCategory.color} onChange={handleChange} />
                        </label>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {selectedCategory && (
                <div className="products-list">
                    <h2>{selectedCategory.name} Products</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Brand</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.brand}</td>
                                    <td>${product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        {product.images && product.images.length > 0 && (
                                            <img src={product.images[0]} alt={product.name} className="product-image" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default CategoryList;
