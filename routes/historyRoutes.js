import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getHistory, addToHistory } from '../controllers/historyController.js';

const router = express.Router();

router.get('/', authenticate, getHistory);
router.post('/add', authenticate, addToHistory);

export default router;
