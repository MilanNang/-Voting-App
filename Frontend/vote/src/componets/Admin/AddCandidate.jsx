import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AddCandidate = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    party: '',
  });
  const [image, setImage] = useState(null);
  const  navigate=useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('age', formData.age);
    data.append('party', formData.party);
    data.append('photo', image); 
    const ageNumber = parseInt(formData.age); 

    if (ageNumber < 21) {
      setFormData({ ...formData, age: '' });
      alert('Candidate must be above 21 years old');
      return;
    }
  
    try {
      await axios.post(`${BASE_URL}/candidate/add`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
         
          
        },
       
       
      });
      navigate('/home');
    } catch (err) {
      console.error('Error adding candidate', err);
    }
   
  };
  console.log('Token:', localStorage.getItem('token'));
  

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white">
      <div className="max-w-xl mx-auto bg-[#1f2937] shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-300">Add New Candidate</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter candidate name"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter candidate age"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Party</label>
            <input
              type="text"
              name="party"
              placeholder="Enter party name"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Party Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Add 
          </button>
        </form>
      </div>
    </div>
  );

};

export default AddCandidate;
