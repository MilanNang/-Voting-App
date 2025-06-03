import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      setIsLoggedIn(!!token);
      setIsAdmin(role === 'admin');
    };

    checkLogin();
    window.addEventListener('authChanged', checkLogin);

  
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('authChanged', checkLogin);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new Event("authChanged"));
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#1A1A1A] via-[#202020] to-[#2A2A2E] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="text-xl font-semibold text-white tracking-wide">
          <Link to="/" className="hover:text-gray-300 transition" onClick={() => setIsMobileMenuOpen(false)}>VoteWise</Link>
        </div>

     
        <nav className="hidden md:flex space-x-8 items-center text-sm font-medium text-gray-300">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="hover:text-white transition">Login</Link>
              <Link to="/signup" className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100 transition">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {isAdmin ? (
                <>
                  <Link to="/" className="hover:text-white transition"> Home</Link>
                  <Link to="/AddCandidate" className="hover:text-white transition">Add Candidate</Link>
                </>
              ) : (
                <Link to="/homeuser" className="hover:text-white transition"> Home</Link>
              )}
              <Link to="/profile" className="hover:text-white transition">Profile</Link>
              <Link to="/vote" className="hover:text-white transition">Vote</Link>
              <button
                onClick={handleLogout}
                className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div ref={menuRef} className="md:hidden px-4 pb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-gray-300">
          {!isLoggedIn ? (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-white">Login</Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-center mt-2 bg-white text-gray-900 rounded">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {isAdmin ? (
                <>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className=" block py-1.5 mb-2 text-black text-center w-full h-[35px] rounded hover:bg-sky-400 bg-sky-200"> Home</Link>
                  <Link to="/AddCandidate" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 mb-2 text-black text-center w-full h-[35px] rounded hover:bg-sky-400  bg-sky-200">Add Candidate</Link>
                </>
              ) : (
                <Link to="/homeuser" onClick={() => setIsMobileMenuOpen(false)} className="block mb-2 py-1.5 text-black  text-center w-full h-[35px] rounded hover:bg-sky-400 bg-sky-200"> Home</Link>
              )}
              <Link to="/profile" className="rounded my-1.5 h-[35px] py-1.5 block text-black w-full  hover:bg-sky-400 bg-sky-200 text-center ">Profile</Link>
              <Link to="/vote" onClick={() => setIsMobileMenuOpen(false)} className="rounded text-black text-center block py-1.5 transition w-full h-[35px] hover:bg-sky-400 bg-sky-200 ">Vote</Link>
              <button onClick={handleLogout} className="block py-2 text-center mt-2 w-full bg-red-400 hover:bg-red-600 text-gray-900 rounded">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
