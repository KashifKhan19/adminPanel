import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Categories.css'; // Import the consolidated CSS file

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({
        name: '',
        color: '',
        images: [],
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_CALL}/api/categories/${id}`);
                if (response.data && response.data.success) {
                    setCategory(response.data.data);
                }
            } catch (error) {
                console.error('There was an error fetching the category!', error);
            }
        };

        fetchCategory();
    }, [id]);

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
                if (key !== 'images') {
                    formData.append(key, category[key]);
                }
            }

            const response = await axios.put(`${process.env.REACT_APP_API_CALL}/api/categories/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message || 'Category updated successfully!');
            navigate('/category-list');
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Error updating category!');
        }
    };

    const handleRemoveImage = async (image) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_CALL}/api/categories/${id}/images`, { data: { image } });
            setCategory({
                ...category,
                images: category.images.filter(img => img !== image),
            });
            setMessage('Image removed successfully!');
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Error removing image!');
        }
    };

    return (
        <div className="edit-category">
            <h2>Edit Category</h2>
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
                <button type="submit">Update Category</button>
            </form>
            <div className="existing-images">
                <h3>Existing Images</h3>
                <div className="image-list">
                    {category.images.map((image, index) => (
                        <div key={index} className="image-item">
                            <img src={image} alt={`${category.name} ${index + 1}`} />
                            <button type="button" onClick={() => handleRemoveImage(image)}>Remove</button>
                        </div>
                    ))}
                </div>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EditCategory;
