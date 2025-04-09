import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ChangePassword = () => {
  const [aatharCardNumber, setAadhar] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {

      const token = localStorage.getItem('token'); 
      const res = await axios.put(
        `${BASE_URL}/user/password`,
        {
          aatharCardNumber: aatharCardNumber.replace(/\s/g, ''),
          newPassword,

        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
       
        
      );
     

      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 to-blue-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="text"
            placeholder="Aadhar Card Number"
            value={aatharCardNumber}
            maxLength={14}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
              const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
              setAadhar(formatted);
            }}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
