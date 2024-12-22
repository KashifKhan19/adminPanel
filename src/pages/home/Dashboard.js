import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalSales: 0,
    bestSellingProducts: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/dashboard/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="widgets">
        <div className="widget widget-green">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="widget widget-purple">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="widget widget-blue">
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>
        <div className="widget widget-orange">
          <h3>Total Sales</h3>
          <p>Rs: {stats.totalSales.toLocaleString()}</p>
        </div>
      </div>

      <div className="best-selling">
        <h2>Best Selling Products</h2>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stats.bestSellingProducts.map((product) => (
              <tr key={product._id}>
                <td><img src={product.images[0]} alt={product.name} className="product-image" /></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>Rs: {product.price ? product.price.toFixed(2) : 'N/A'}</td>
                <td>{product.stock}</td>
                <td>{product.rating}</td>
                <td>
                  <FaEye className="action-icon" />
                  <FaEdit className="action-icon" />
                  <FaTrashAlt className="action-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
