import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import './Users.css';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [sortedCustomers, setSortedCustomers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/dashboard/all-users');
        if (response.data.success) {
          setCustomers(response.data.users);
          setSortedCustomers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setSortedCustomers(customers.filter(customer =>
      customer.name.toLowerCase().includes(value) ||
      customer.email.toLowerCase().includes(value) ||
      customer.phone.includes(value)
    ));
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/dashboard/${id}`);
      setSortedCustomers(sortedCustomers.filter(customer => customer._id !== id));
      setCustomers(customers.filter(customer => customer._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/api/dashboard/${currentCustomer._id}`, currentCustomer);
      if (response.data.success) {
        const updatedCustomers = sortedCustomers.map(customer =>
          customer._id === currentCustomer._id ? response.data.user : customer
        );
        setSortedCustomers(updatedCustomers);
        setCustomers(updatedCustomers);
        setIsEditing(false);
        setCurrentCustomer(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer({
      ...currentCustomer,
      [name]: value
    });
  };

  const handleSort = () => {
    const sorted = [...sortedCustomers].sort((a, b) => a.name.localeCompare(b.name));
    setSortedCustomers(sorted);
  };

  return (
    <div className="all-customers">
      <h2>All Customers</h2>
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <button onClick={handleSort}>Sort by Name</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCustomers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <FaEdit className="action-icon" onClick={() => handleEdit(customer)} />
                <FaTrashAlt className="action-icon" onClick={() => handleDelete(customer._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Customer</h2>
            <label>
              Name:
              <input type="text" name="name" value={currentCustomer.name} onChange={handleChange} />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={currentCustomer.email} onChange={handleChange} />
            </label>
            <label>
              Phone:
              <input type="text" name="phone" value={currentCustomer.phone} onChange={handleChange} />
            </label>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => { setIsEditing(false); setCurrentCustomer(null); }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
