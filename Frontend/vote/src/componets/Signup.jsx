import React, { useState } from 'react';
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

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Aadhar formatting in 4-4 group
    if (name === 'aatharCardNumber') {
      const raw = value.replace(/\D/g, '').slice(0, 12);
      const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }

    // Admin role check
    else if (name === 'roal') {
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
    }


    else {
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

      usenavigate('/');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'Signup failed');
      } else {
        alert('Something went wrong');
        console.error(error);
      }
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
    <div className="min-h-screen pt-28 pb-24 px-4 flex justify-center items-start bg-gradient-to-br from-gray-400 to-purple-100">
      <div className="w-full max-w-md p-8 bg-gray-400 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'name', type: 'text', placeholder: 'Full Name' },
            { name: 'age', type: 'number', placeholder: 'Age' },
            { name: 'mobile', type: 'text', placeholder: 'Mobile' },
            { name: 'email', type: 'email', placeholder: 'Email' },
            { name: 'address', type: 'text', placeholder: 'Address' },
            {
              name: 'aatharCardNumber',
              type: 'text',
              placeholder: 'Aadhar Card Number',
              maxLength: 14,
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
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
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
            className="w-full bg-green-900 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
