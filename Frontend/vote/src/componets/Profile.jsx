import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom'
const BASE_URL = import.meta.env.VITE_BACKEND_URL;



function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Unable to fetch profile. Please try again later.');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!user) {
    return <div className="p-4 text-gray-600">Loading profile...</div>;
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6 text-white">
      <div className="max-w-3xl w-full mx-auto px-6 py-10 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-600 pb-6">
          <UserCircle2 size={64} className="text-white" />
          <div>
            <h2 className="text-3xl font-bold text-gray-100">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
          <ProfileItem label="Mobile" value={user.mobile} />
          <ProfileItem label="Age" value={user.age} />
          <ProfileItem label="Address" value={user.address} />
          <ProfileItem label="Aadhar Number" value={user.aatharCardNumber} />
          <ProfileItem label="Role" value={user.roal} />
          <ProfileItem label="Voted" value={user.isVoted ? 'Yes' : 'No'} />
          
        </div>
        <div className='flex items-end justify-end'>
             <Link to='/changepassword' className=" mt-4 text-white pt-1 rounded-3xl text-center bg-red-800 h-[35px] w-full ">Change Password</Link>
        </div>
       
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <>
     
    <div className="bg-gray-700 p-4 rounded-xl shadow-md border border-gray-600">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-medium text-gray-200">{value}</p>
      
    </div>
   
   
    </>
    
  );
}

export default Profile;