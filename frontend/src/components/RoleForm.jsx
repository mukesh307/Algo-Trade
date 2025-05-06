import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RoleForm() {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation

  const handleCreate = async () => {
    if (!roleName || !description) {
      setError('Please fill all fields.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await axios.post('http://localhost:5000/api/roles', { roleName, description });
      setRoleName('');
      setDescription('');
      setSuccess('Role created successfully!');
    } catch (err) {
      setError('Failed to create role.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/roleslist'); // Go back to Role List page
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Role</h2>

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        {success && <p className="mb-4 text-green-500 text-center">{success}</p>}

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-medium">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Role Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter role description"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            {loading ? 'Creating...' : 'Create Role'}
          </button>
          <button
            onClick={handleCancel}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleForm;
