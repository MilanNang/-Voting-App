import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    mobile: '',
    email: '',
    address: '',
    aatharCardNumber: '',
    password: '',
    roal: 'voter',
  });

  const [isAdminAllowed, setIsAdminAllowed] = useState(true);
  const [loading, setLoading] = useState(false);
  const usenavigate = useNavigate();
  const aadharRef = useRef(null);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'aatharCardNumber') {
      const input = aadharRef.current;
      const selectionStart = input.selectionStart;

      const rawDigits = value.replace(/\D/g, '').slice(0, 12);
      const formatted = rawDigits.replace(/(.{4})/g, '$1 ').trim();

      const numSpacesBefore = (formData.aatharCardNumber.slice(0, selectionStart).match(/ /g) || []).length;
      const numSpacesAfter = (formatted.slice(0, selectionStart).match(/ /g) || []).length;
      let newCursorPos = selectionStart + (numSpacesAfter - numSpacesBefore);

      setFormData((prev) => ({ ...prev, [name]: formatted }));
      setTimeout(() => input.setSelectionRange(newCursorPos, newCursorPos), 0);
    } else if (name === 'roal') {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (value === 'admin') {
        try {
          const res = await axios.get(`${BASE_URL}/user/exists`);
          if (res.data.exists) {
            alert('An admin already exists. You cannot register as admin.');
            setIsAdminAllowed(false);
          } else {
            setIsAdminAllowed(true);
          }
        } catch (error) {
          console.error('Failed to check admin existence:', error);
          alert('Failed to check admin status.');
          setIsAdminAllowed(false);
        }
      } else {
        setIsAdminAllowed(true);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const rawAadhar = formData.aatharCardNumber.replace(/\s/g, '');

    if (formData.age < 18) {
      alert('You must be 18 years old or older to signup');
      setLoading(false);
      return;
    }

    if (rawAadhar.length !== 12) {
      alert('Aadhar Card Number must be 12 digits');
      setLoading(false);
      return;
    }

    if (formData.roal === 'admin' && !isAdminAllowed) {
      alert('Admin registration is not allowed.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/user/signup`, {
        ...formData,
        aatharCardNumber: rawAadhar,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', formData.roal);
      window.dispatchEvent(new Event('authChanged'));

      localStorage.setItem(
        'signupData',
        JSON.stringify({
          aatharCardNumber: rawAadhar,
          password: formData.password,
        })
      );

      setFormData({
        name: '',
        age: '',
        mobile: '',
        email: '',
        address: '',
        aatharCardNumber: '',
        password: '',
        roal: 'voter',
      });

      usenavigate('/login');
    } catch (error) {
      alert(error?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-400 to-purple-100">
        <div className="text-3xl font-semibold text-gray-800 animate-pulse">
          Creating Account...
        </div>
      </div>
    );
  }

  return (
    <div className=" mt-[25px] min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white/40 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden w-full max-w-5xl">
        
      
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-purple-400 to-indigo-500 text-white p-10">
          <h2 className="text-4xl font-bold mb-4">Welcome to VoteX</h2>
          <p className="text-lg text-center">Register to cast your vote and make a difference.</p>
         
        </div>

        
        <div className="p-8 md:p-12 bg-white rounded-3xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name', type: 'text', placeholder: 'Full Name' },
              { name: 'age', type: 'number', placeholder: 'Age' },
              { name: 'mobile', type: 'text', placeholder: 'Mobile Number' },
              { name: 'email', type: 'email', placeholder: 'Email Address' },
              { name: 'address', type: 'text', placeholder: 'Address' },
              {
                name: 'aatharCardNumber',
                type: 'text',
                placeholder: 'Aadhar Card Number',
                maxLength: 14,
                ref: aadharRef,
              },
              { name: 'password', type: 'password', placeholder: 'Password' },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required={field.name !== 'mobile' && field.name !== 'address'}
                maxLength={field.maxLength}
                value={formData[field.name]}
                onChange={handleChange}
                ref={field.name === 'aatharCardNumber' ? aadharRef : null}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            ))}

            <select
              name="roal"
              value={formData.roal}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            >
              <option value="voter">Voter</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
