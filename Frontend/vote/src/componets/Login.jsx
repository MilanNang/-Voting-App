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
    const prefillData = JSON.parse(localStorage.getItem('signupData'));
    if (prefillData) {
      setAadhar(prefillData.aatharCardNumber || '');
      setPassword(prefillData.password || '');
      localStorage.removeItem('signupData');
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
      window.dispatchEvent(new Event('authChanged'));

      if (user.role === 'admin') {
        navigate('/');
      } else {
        navigate('/homeuser');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-400 to-purple-100">
        <div className="text-3xl font-semibold text-gray-800 animate-pulse">
          Logging In...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white/40 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden w-full max-w-5xl">

       
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-10">
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-lg text-center">Log in to vote securely and make your voice count.</p>
          
        </div>

     
        <div className="p-8 md:p-12 bg-white rounded-3xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Login</h2>
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
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Sign up here
            </Link>
          </p>
         
        </div>
      </div>
    </div>
  );
};

export default Login;
