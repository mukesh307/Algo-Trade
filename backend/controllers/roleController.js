// controllers/roleController.js
const Role = require('../models/Role');
const User = require('../models/User');

exports.createRole = async (req, res) => {
  try {
    const { roleName, description } = req.body;
    const newRole = new Role({ roleName, description });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create role' });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

exports.updateRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissions } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { permissions },
      { new: true }
    );
    res.json(updatedRole);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update permissions' });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.roleId);
    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete role' });
  }
};




exports.updateRole = async (req, res) => {
    try {
      const { roleId } = req.params;
      const { roleName, description } = req.body;
  
      const updatedRole = await Role.findByIdAndUpdate(
        roleId,
        { roleName, description },
        { new: true }
      );
  
      if (!updatedRole) {
        return res.status(404).json({ error: 'Role not found' });
      }
  
      res.json(updatedRole);
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
