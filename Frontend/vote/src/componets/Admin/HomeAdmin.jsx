import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { Pencil, Trash2 } from "lucide-react";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import EditCandidate from "./EditCandidate";


const Home = () => {
  const [candidates, setCandidates] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCandidates();
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/candidate/`);
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates", err);
    }
  };

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setOpen(true);
  };

  const handleDelete = async (candidateId) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await axios.delete(`${BASE_URL}/candidate/${candidateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCandidates();
    } catch (err) {
      console.error("Error deleting candidate", err);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {candidates.map((candidate) => (
          <div
            key={candidate._id}
            className="rounded-2xl shadow-lg border p-6 flex flex-col items-center bg-[#1f2937] gap-6 min-h-[220px] text-center transition-transform duration-300 hover:scale-105 border-gray-700"
          >
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300"
            />
            <div>
              <h3 className="text-2xl font-semibold text-indigo-300 drop-shadow-md mb-2">{candidate.name}</h3>
              <p className="text-md text-gray-300 font-bold">{candidate.party}</p>
            </div>
            {userRole === "admin" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(candidate)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(candidate._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">Edit Candidate</Dialog.Title>
            {selectedCandidate && (
              <EditCandidate
                candidate={selectedCandidate}
                onClose={() => setOpen(false)}
                refresh={fetchCandidates}
              />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Home;