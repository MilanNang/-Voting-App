import React, { useState } from "react";
import axios from "axios";

const EditCandidate = ({ candidate, onClose, refresh }) => {
  const [name, setName] = useState(candidate.name);
  const [party, setParty] = useState(candidate.party);
  const [image, setImage] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("party", party);
      if (image) formData.append("image", image);

      await axios.put(`/candidate/${candidate._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      refresh(); // Refresh candidates list
      onClose(); // Close modal
    } catch (err) {
      console.error("Error updating candidate", err);
    }
  };

  return (
    <div className="relative bg-gray-900/90 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 text-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">Edit Candidate</h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-5">
        {/* Name Input */}
        <div>
          <label className="text-gray-300 font-semibold block mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 text-gray-100 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Party Input */}
        <div>
          <label className="text-gray-300 font-semibold block mb-1">Party:</label>
          <input
            type="text"
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="w-full bg-gray-800 text-gray-100 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-gray-300 font-semibold block mb-1">Party Logo:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full bg-gray-800 text-gray-100 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCandidate;
