const express = require('express');
const {
    getUserChannels,
    selectChannel,
    getPendingRequests,
    approveRequest,
    rejectChannelRequest,
    connectToChannel,
    fetchAndSaveApprovedMessages,
    disconnectChannel 
} = require('../controllers/channelController');

const router = express.Router();

router.get('/:phone/channels', getUserChannels);
router.post('/select-channel', selectChannel);
router.post('/connect-channel', connectToChannel);
router.post('/disconnect-channel', disconnectChannel);
router.get('/admin/requests', getPendingRequests);
router.put('/admin/approve/:id', approveRequest);
router.delete('/admin/reject/:id', rejectChannelRequest);
router.get('/get-approved-messages', fetchAndSaveApprovedMessages);

module.exports = router;