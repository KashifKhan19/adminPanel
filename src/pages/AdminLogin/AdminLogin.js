import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css"; 

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:4000/api/dashboard/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Handle sending reset code
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/dashboard/send-reset-code", { email: resetEmail });
      alert(response.data.message);
      setIsCodeSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/api/dashboard/reset-password", { email: resetEmail, code: resetCode, newPassword });
      alert(response.data.message);
      setIsResetting(false);
      setIsCodeSent(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isResetting ? "Reset Password" : "Admin Login"}</h2>
        {error && <p className="error">{error}</p>}
        {isResetting ? (
          isCodeSent ? (
            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label htmlFor="code">Enter reset code</label>
                <input
                  type="text"
                  id="code"
                  placeholder="Enter reset code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Reset Password
              </button>
              <div className="extra-options">
                <p className="forgot-password" onClick={() => setIsResetting(false)}>
                  Back to Login
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSendResetCode}>
              <div className="form-group">
                <label htmlFor="email">Enter your email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Send Reset Code
              </button>
              <div className="extra-options">
                <p className="forgot-password" onClick={() => setIsResetting(false)}>
                  Back to Login
                </p>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            <div className="extra-options">
              <p className="forgot-password" onClick={() => setIsResetting(true)}>
                Forgot your password?
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
