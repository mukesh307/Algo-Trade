const express = require('express');
const {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission
} = require('../controllers/permissionsController');

const router = express.Router();

// Create new permission
router.post('/', createPermission);

// Get all permissions
router.get('/', getPermissions);

// Update permission by ID
router.put('/:id', updatePermission);

// Delete permission by ID
router.delete('/:id', deletePermission);

module.exports = router;
