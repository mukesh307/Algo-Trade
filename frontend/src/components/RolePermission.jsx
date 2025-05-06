import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePermissionModal from './CreatePermissionModal';
import EditPermissionModal from './EditPermissionModal'; // ⬅️ import edit modal
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

function RolePermission() {
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPermissions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/permissions');
      setPermissions(res.data);
      setFilteredPermissions(res.data);
    } catch (error) {
      console.error('Failed to fetch permissions', error);
    }
  };

  const refreshPermissions = () => {
    fetchPermissions();
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = permissions.filter(
      (perm) =>
        perm.name.toLowerCase().includes(value) ||
        perm.description.toLowerCase().includes(value)
    );
    setFilteredPermissions(filtered);
  };

  const handleEdit = (permission) => {
    setSelectedPermission(permission);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await axios.delete(`http://localhost:5000/api/permissions/${id}`);
        refreshPermissions();
      } catch (error) {
        console.error('Failed to delete permission', error);
      }
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 py-12 px-6">
      <h2 className="text-4xl font-semibold mt-8 text-gray-800 mb-8 text-center">Manage Permissions</h2>

      {/* Create Button & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 gap-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition duration-200"
        >
          Create New Permission
        </button>

        <input
          type="text"
          placeholder="Search permission..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Permissions Table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-lg border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-indigo-500 to-blue-600 text-black">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-medium">Sr. No.</th>
              <th className="py-4 px-6 text-left text-sm font-medium">Permission Name</th>
              <th className="py-4 px-6 text-left text-sm font-medium">Description</th>
              <th className="py-4 px-6 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermissions.length > 0 ? (
              filteredPermissions.map((perm, index) => (
                <tr key={perm._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-sm text-gray-700">{index + 1}</td>
                  <td className="py-4 px-6 text-sm text-gray-800">{perm.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{perm.description}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(perm)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(perm._id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-6 text-center text-sm text-gray-600">
                  No permissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <CreatePermissionModal
        isOpen={showCreateModal}
        closeModal={() => setShowCreateModal(false)}
        refreshPermissions={refreshPermissions}
      />

      {/* Edit Modal */}
      {selectedPermission && (
        <EditPermissionModal
          isOpen={showEditModal}
          closeModal={() => setShowEditModal(false)}
          permission={selectedPermission}
          refreshPermissions={refreshPermissions}
        />
      )}
    </div>
  );
}

export default RolePermission;
