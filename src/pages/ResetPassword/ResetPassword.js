import React, { useState } from "react";
import axios from "axios";
import "./ResetPassword.css"; // Create this CSS file for styling

const ResetPassword = () => {
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

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
    <div className="reset-password-container">
      {isCodeSent ? (
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
          <button type="submit" className="reset-button">
            Reset Password
          </button>
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
          <button type="submit" className="reset-button">
            Send Reset Code
          </button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ResetPassword;
