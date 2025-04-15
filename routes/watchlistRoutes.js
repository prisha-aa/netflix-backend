import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlistController.js';

const router = express.Router();

router.get('/', authenticate, getWatchlist);
router.post('/add', authenticate, addToWatchlist);
router.post('/remove', authenticate, removeFromWatchlist);

export default router;
