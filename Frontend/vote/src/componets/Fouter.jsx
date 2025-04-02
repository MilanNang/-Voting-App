import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#1A1A1A] via-[#202020] to-[#2A2A2E] text-gray-300 py-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
       
        <div className="text-white text-xl font-semibold mb-4 md:mb-0">
          VoteWise
        </div>

       
        <div className="text-center flex-1 text-sm text-gray-400">
          <p className="mb-1">Your vote is important for the country</p>
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} VoteWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
