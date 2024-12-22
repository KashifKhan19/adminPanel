import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaBell } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
    const [expandedSections, setExpandedSections] = useState({});
    const [hasNewMessages, setHasNewMessages] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleLogout = () => { 
        localStorage.removeItem('token'); 
        navigate('/AdminLogin'); 
    };

    return (
        <div className="sidebar">
            <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard')}`}>Dashboard</Link>
            <div className="expandable">
                <div className={`sidebar-link ${isActive('/all-customers') || isActive('/guests') ? 'active' : ''}`} onClick={() => toggleSection('customers')}>
                    Customers {expandedSections['customers'] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {expandedSections['customers'] && (
                    <div className="submenu">
                        <Link to="/all-users" className={`sidebar-link ${isActive('/all-users')}`}>Users</Link>
                        <Link to="/add-user" className={`sidebar-link ${isActive('/add-user')}`}>Add User</Link>
                    </div>
                )}
            </div>
            <div className="expandable">
                <div className={`sidebar-link ${isActive('/product-list') || isActive('/product-categories') ? 'active' : ''}`} onClick={() => toggleSection('products')}>
                    Products {expandedSections['products'] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {expandedSections['products'] && (
                    <div className="submenu">
                        <Link to="/add-product" className={`sidebar-link ${isActive('/add-product')}`}>Add Product</Link>
                        <Link to="/product-list" className={`sidebar-link ${isActive('/product-list')}`}>Product List</Link>
                    </div>
                )}
            </div>
            <div className="expandable">
                <div className={`sidebar-link ${isActive('/Categories') || isActive('/Categories') ? 'active' : ''}`} onClick={() => toggleSection('Categories')}>
                    Categories {expandedSections['Categories'] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {expandedSections['Categories'] && (
                    <div className="submenu">
                        <Link to="/category-list" className={`sidebar-link ${isActive('/category-list')}`}>Category List</Link>
                        {/* <Link to="/category-product" className={`sidebar-link ${isActive('/category-product')}`}>Category Product</Link> */}
                        <Link to="/add-category" className={`sidebar-link ${isActive('/add-category')}`}>Add Category</Link>
                    </div>
                )}
            </div>
            <Link to="/all-orders" className={`sidebar-link ${isActive('/all-orders')}`}>All Orders</Link>
            <div className="sidebar-link logout" onClick={handleLogout}>Logout</div>        </div>
    );
};

export default Sidebar;
