// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.post('/roles', roleController.createRole);
router.get('/roles', roleController.getRoles);
router.put('/roles/:roleId/permissions', roleController.updateRolePermissions);
router.delete('/roles/:roleId', roleController.deleteRole);
router.put('/roles/:roleId', roleController.updateRole);

module.exports = router;
