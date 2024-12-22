import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import userimg from '../../assets/images/user.jpg';
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdMenuOpen, MdNotifications, MdOutlineMenu } from "react-icons/md";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await axios.get("http://localhost:4000/api/dashboard/getAdmin", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserName(data.user.name);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileRef]);

  const handleLogout = () => { 
    localStorage.removeItem('token'); 
    navigate('/AdminLogin'); 
};

  return (
    <header className="d-flex align-items-center">
      <div className="container-fluid w-100">
        <div className="row align-items-center justify-content-between">
          <div className="col d-flex align-items-center">
            <Link to="/" className="d-flex align-items-center logo">
              <img src={logo} alt="Logo" className="logo" />
              <span className="ml-2 logo-text">My Store</span>
            </Link>
          </div>

          <div className="col d-flex justify-content-end align-items-center">
            {/* <MdNotifications className="notification-icon" /> */}
            <div className="profile" ref={profileRef}>
              <Button className="profile-info" onClick={toggleProfileDropdown}>
                <img src={userimg} alt="User Profile" className="profile-image" />
              </Button>
              <div className="profile-info">
                <span className="profile-name">{userName || "User Name"}</span>
              </div>
              <div className={`profile-dropdown ${isProfileDropdownOpen ? 'show' : ''}`}>
                <ul>
                  <li><Link to="/reset-password">Reset Password</Link></li>
                  <li><Link onClick={handleLogout}>Logout</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
