import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RoleList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [editFormData, setEditFormData] = useState({ roleName: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingRole, setDeletingRole] = useState(null); // holds the role object to delete
  const navigate = useNavigate();

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('http://localhost:5000/api/roles');
      setRoles(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch roles.');
    } finally {
      setLoading(false);
    }
  };

  // Instead of immediate deletion, we open a confirmation modal.
  const initiateDeleteRole = (role) => {
    setDeletingRole(role);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/roles/${deletingRole._id}`);
      fetchRoles();
      setDeletingRole(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete role.');
      setDeletingRole(null);
    }
  };

  const cancelDelete = () => {
    setDeletingRole(null);
  };

  const editRole = (id) => {
    const roleToEdit = roles.find((role) => role._id === id);
    if (roleToEdit) {
      setEditingRole(id);
      setEditFormData({ roleName: roleToEdit.roleName, description: roleToEdit.description });
    }
  };

  const managePermissions = (id) => {
    navigate(`/roles/${id}/permissions`);
  };

  const handleEditSave = async () => {
    try {
      setSaving(true);
      await axios.put(`http://localhost:5000/api/roles/${editingRole}`, editFormData);
      fetchRoles();
      setEditingRole(null);
      setEditFormData({ roleName: '', description: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update role.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    document.body.style.overflow = editingRole ? 'hidden' : 'auto';
  }, [editingRole]);

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen min-w-screen flex mt-5 justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">List of User Roles</h2>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md w-full md:w-64"
            />
            <button
              onClick={fetchRoles}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate('/roles/new')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Create Role
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-600">Loading roles...</p>
        ) : filteredRoles.length === 0 ? (
          <p className="text-center text-gray-500">No roles found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Role Name</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">User Count</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role, index) => (
                  <tr key={role._id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                    <td className="px-4 py-2 border">{role.roleName}</td>
                    <td className="px-4 py-2 border">{role.description}</td>
                    <td className="px-4 py-2 border text-center">{role.userCount}</td>
                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        onClick={() => managePermissions(role._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        EditPermission
                      </button>
                      <button
                        onClick={() => editRole(role._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => initiateDeleteRole(role)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Role</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium">Role Name</label>
              <input
                type="text"
                value={editFormData.roleName}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, roleName: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <input
                type="text"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, description: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleEditSave}
                disabled={saving}
                className={`${
                  saving ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
                } text-white px-4 py-2 rounded`}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditingRole(null);
                  setEditFormData({ roleName: '', description: '' });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete role{" "}
              <span className="font-bold">{deletingRole.roleName}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleList;
