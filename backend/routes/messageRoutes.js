import express from 'express';
import { getMessages, sendMessages } from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:channelId', getMessages);
router.post('/', sendMessages);

export default router;