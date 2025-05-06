const Permission = require('../models/Permission');

// Create a new permission
const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newPermission = new Permission({ name, description });
    await newPermission.save();
    res.status(201).json({ message: 'Permission created successfully!', newPermission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create permission', error });
  }
};

// Get all permissions
const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch permissions', error });
  }
};

// Update a permission
const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updatedPermission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    res.status(200).json({ message: 'Permission updated successfully!', updatedPermission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update permission', error });
  }
};

// Delete a permission
const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPermission = await Permission.findByIdAndDelete(id);

    if (!deletedPermission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    res.status(200).json({ message: 'Permission deleted successfully!', deletedPermission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete permission', error });
  }
};

module.exports = {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission
};
