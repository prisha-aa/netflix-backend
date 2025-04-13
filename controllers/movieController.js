import axios from 'axios';


const TMDB_API_KEY = process.env.TMDB_API_KEY;

const fetchTMDBData = async (url, params = {}) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3${url}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        ...params,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching TMDB data:", error);
    throw error;
  }
};


export const getMoviesByCategory = async (req, res) => {
  const { category } = req.params;
  const { page = 1, genreId } = req.query;

  try {
    let url = '';
    let params = { page };

    if (category === 'popular') {
      url = '/movie/popular';
    } else if (category === 'top-rated') {
      url = '/movie/top_rated';
    } else if (category === 'trending') {
      url = '/trending/movie/day';
    } else if (category === 'genre' && genreId) {
      url = '/discover/movie';
      params = { ...params, with_genres: genreId };
    } else {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const data = await fetchTMDBData(url, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
};

export const getMovieDetails = async (req, res) => {
  const { movieId } = req.params;
  const url = `/movie/${movieId}`;

  try {
    const data = await fetchTMDBData(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
};

export const searchMovies = async (req, res) => {
  const { query, page = 1 } = req.query;
  const url = '/search/movie';

  try {
    const data = await fetchTMDBData(url, { query, page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search movies' });
  }
};
