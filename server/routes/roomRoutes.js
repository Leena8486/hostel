const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  createRoom,
  deleteRoom,
  updateRoom
} = require('../controllers/roomController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllRooms);
router.post('/', createRoom);
router.delete('/:id', deleteRoom);
router.put('/:id', updateRoom);

module.exports = router;
