import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3 } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;


const VoteCounter = () => {
  const [voteData, setVoteData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/candidate/vote/count`);
        setVoteData(response.data);
      } catch (err) {
        console.error('Error fetching vote counts:', err);
        setError('Failed to fetch vote counts');
      }
    };
    fetchVotes();
  }, []);

  return (
    <div className="mt-14 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-gray-800/70 shadow-2xl rounded-2xl p-8 backdrop-blur-xl border border-gray-700 transition-transform hover:scale-105 duration-300">
          <h1 className="text-4xl font-extrabold text-center mb-6 flex items-center justify-center gap-3 text-gray-100">
            <BarChart3 size={36} /> Live Vote Count
          </h1>

          {error && (
            <div className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg mb-4 text-center animate-pulse">
              {error}
            </div>
          )}

          {voteData.length > 0 ? (
            <div className="space-y-4">
              {voteData.map((vote, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-700/80 p-6 rounded-xl shadow-lg border border-gray-600 hover:bg-gray-600/90 transition-all duration-300"
                >
                  <span className="text-lg font-medium text-gray-300">{vote.party}</span>
                  <span className="text-3xl font-bold text-yellow-400 drop-shadow-md animate-bounce">{vote.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-lg animate-pulse">
              No vote data available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoteCounter;