import { useState, useEffect } from 'react';
import axios from 'axios';

function EditPermissionModal({ isOpen, closeModal, refreshPermissions, permission }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (permission) {
      setName(permission.name);
      setDescription(permission.description);
    }
  }, [permission]);

  const updatePermission = async () => {
    if (!name) {
      setMessage('❌ Permission name is required.');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/permissions/${permission._id}`, {
        name,
        description,
      });
      setMessage('✅ Permission updated!');
      refreshPermissions();
      closeModal();
    } catch (err) {
      setMessage('❌ Failed to update permission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Permission</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter permission name"
            className="w-full p-3 border rounded-md mb-4"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full p-3 border rounded-md mb-4"
          />

          {message && <p className="text-sm text-red-500">{message}</p>}

          <div className="flex justify-between">
            <button onClick={closeModal} className="bg-gray-400 text-white px-5 py-2 rounded-md">
              Cancel
            </button>
            <button onClick={updatePermission} className="bg-blue-600 text-white px-5 py-2 rounded-md">
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default EditPermissionModal;
