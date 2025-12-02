import express from 'express';
import {
  getChannels,
  createChannel,
  joinChannel,
  leaveChannel,
  getAllChannels
} from '../controllers/channelController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getChannels);
router.get('/all', getAllChannels);
router.post('/', createChannel);
router.post('/:id/join', joinChannel);
router.post('/:id/leave', leaveChannel);

export default router;