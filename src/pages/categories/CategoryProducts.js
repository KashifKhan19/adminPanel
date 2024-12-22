import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Categories.css';

const CategoryProducts = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log('Category ID:', id); // Log the category ID

        const fetchCategoryProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/category/${id}/products`);
                if (response.data && response.data.success) {
                    setCategory(response.data.data.category);
                    setProducts(response.data.data.products);
                }
            } catch (error) {
                console.error('There was an error fetching the category and products!', error);
                setMessage('Error fetching category products!');
            }
        };

        fetchCategoryProducts();
    }, [id]);

    return (
        <div className="category-products">
            {category && (
                <div className="category-details">
                    <h2>{category.name}</h2>
                    <p>Color: <span style={{ backgroundColor: category.color, padding: '5px', borderRadius: '3px' }}>{category.color}</span></p>
                </div>
            )}
            <h3>Products</h3>
            <div className="products">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                        <p><strong>Brand:</strong> {product.brand}</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <div className="product-images">
                            {product.images && product.images.length > 0 && (
                                <img src={product.images[0]} alt={`${product.name} 1`} className="product-image" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CategoryProducts;
