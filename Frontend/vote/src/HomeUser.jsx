import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const HomeUser = () => {
  const [candidates, setCandidates] = useState([]);
  const [votedCandidateId, setVotedCandidateId] = useState(null);
  const[loding,setLoding]=useState(false)
 
  useEffect(() => {
    const storedVote = localStorage.getItem("votedCandidateId");
    if (storedVote) {
      setVotedCandidateId(storedVote);
    }
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoding(true)
      const res = await axios.get(`${BASE_URL}/candidate/`);
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates", err);
    }finally{
      setLoding(false)
    }
  };

  const handleVote = async (candidateId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/candidate/vote/${candidateId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVotedCandidateId(candidateId);
      localStorage.setItem("votedCandidateId", candidateId); 
      fetchCandidates();
      alert(res.data.message);
    } catch (err) {
      console.error("Error voting", err);
      alert(err.response?.data?.message || "Voting failed");
    }
  };

  if (loding) {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 mt-20 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white transition-all duration-500">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl shadow-lg border p-6 flex bg-gray-700 gap-6 min-h-[180px] items-center justify-between animate-pulse border-gray-600"
        >
          <div className="flex flex-col flex-1 gap-4">
            <div className="w-3/4 h-6 bg-gray-600 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-600 rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 bg-gray-600 rounded-full"></div>
            <div className="w-24 h-10 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

  return (
    <div className="grid grid-cols-1 gap-6 p-6 mt-20 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white transition-all duration-500">
      {candidates.map((candidate) => (
        <div
          key={candidate._id}
          className={`rounded-2xl shadow-lg border p-6 flex bg-gray-700 gap-6 min-h-[180px] items-center justify-between transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-gray-600 ${
            votedCandidateId === candidate._id ? "border-green-500" : ""
          }`}
        >
          <div className="flex flex-col flex-1 justify-center">
            <h3 className="text-2xl font-semibold text-gray-200 mb-2">{candidate.name}</h3>
            <p className="text-md text-gray-400 font-bold">{candidate.party}</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-500 shadow-lg hover:shadow-2xl transition-all duration-300"
            />
            <button
              onClick={() => handleVote(candidate._id)}
              disabled={votedCandidateId !== null}
              className={`px-6 py-2 font-semibold rounded-full transition-all duration-300 flex items-center gap-2 ${
                votedCandidateId === candidate._id
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              } disabled:opacity-50`}
            >
              {votedCandidateId === candidate._id ? (
                <span className="flex items-center gap-2 animate-pulse">
                  <CheckCircle size={18} /> Voted
                </span>
              ) : (
                "Vote"
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeUser;
