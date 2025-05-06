import { useState } from 'react';
import axios from 'axios';

function CreatePermissionModal({ isOpen, closeModal, refreshPermissions }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createPermission = async () => {
    if (!name) {
      setMessage('❌ Permission name is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/permissions', { name, description });
      setMessage('✅ Permission created successfully!');
      refreshPermissions(); // Refresh the permissions list in the parent component
     
    } catch (err) {
      setMessage('❌ Failed to create permission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
        <div className="bg-white p-8 rounded-xl w-full sm:w-96 shadow-xl transform transition-transform duration-300 ease-in-out">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Create New Permission</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter permission name"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('❌') ? 'text-red-600' : 'text-green-600'} mt-3`}>
              {message}
            </p>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={closeModal}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={createPermission}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="4" strokeLinecap="round" />
                    <path
                      d="M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0"
                      fill="none"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Create Permission'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default CreatePermissionModal;
