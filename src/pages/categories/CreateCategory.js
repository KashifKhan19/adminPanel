import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Categories.css'; // Import the consolidated CSS file

const CreateCategory = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState({
        name: '',
        color: '',
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('images', file);
            });

            for (let key in category) {
                formData.append(key, category[key]);
            }

            const response = await axios.post(`http://localhost:4000/api/category/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message || 'Category created successfully!');
            navigate('/category-list');
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Error creating category!');
        }
    };

    return (
        <div className="create-category">
            <h2>Create Category</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={category.name} onChange={handleChange} required />
                </label>
                <label>
                    Color:
                    <input type="color" name="color" value={category.color} onChange={handleChange} required />
                </label>
                <label>
                    Add Images:
                    <input type="file" multiple onChange={handleFileChange} />
                </label>
                <button type="submit">Create Category</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateCategory;
