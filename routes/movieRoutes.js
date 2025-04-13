import express from 'express';
import { getMovieDetails, getMoviesByCategory, searchMovies } from '../controllers/movieController';


const router = express.Router();

router.get("/category/:category",getMoviesByCategory)
router.get('/:movieId', getMovieDetails);
router.get('/search',searchMovies);

export default router;
