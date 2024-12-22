import React, { useState } from 'react';
import axios from 'axios';
import './AddUser.css';

const AddUser = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    isAdmin: false,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('http://localhost:4000/api/dashboard/add', user, config);

      if (response.data.success) {
        setMessage('User added successfully');
        // Reset form
        setUser({ name: '', email: '', phone: '', password: '', isAdmin: false });
      } else {
        setMessage('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setMessage('Error adding user');
    }
  };

  return (
    <div className="add-user">
      <h2>Add New User</h2>
      {message && <p className="message">{message}</p>}
      <label>
        Name:
        <input type="text" name="name" value={user.name} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={user.email} onChange={handleChange} />
      </label>
      <label>
        Phone:
        <input type="text" name="phone" value={user.phone} onChange={handleChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={user.password} onChange={handleChange} />
      </label>
      <label>
        Admin:
        <input type="checkbox" name="isAdmin" checked={user.isAdmin} onChange={handleChange} />
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default AddUser;
