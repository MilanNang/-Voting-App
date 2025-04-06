import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [aatharCardNumber, setAadhar] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    const prefillData = JSON.parse(localStorage.getItem("signupData"));
    if (prefillData) {
      setAadhar(prefillData.aatharCardNumber || '');
      setPassword(prefillData.password || '');
      localStorage.removeItem("signupData");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/user/login`, {
        aatharCardNumber: aatharCardNumber.replace(/\s/g, ''),
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);
      window.dispatchEvent(new Event("authChanged"));

      if (user.role === 'admin') {
        navigate("/");
      } else {
        navigate("/homeuser");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-gray-100 via-gray-200 to-gray-300">
        <div className="text-3xl font-semibold text-gray-800 animate-pulse">
          Logging In...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 flex justify-center items-start bg-gradient-to-bl from-gray-100 via-gray-200 to-gray-300">
      <div className="w-full max-w-md p-8 bg-gray-300 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="aatharCardNumber"
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
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-green-900 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
