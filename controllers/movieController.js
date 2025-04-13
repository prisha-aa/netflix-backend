import axios from 'axios';

export const getMovies = async (req, res) => {
  const { query, genre, year } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  try {
    let url = '';
    const params = {
      api_key: apiKey,
      language: 'en-US',
      page: 1,
    };

    if (query) {
      url = 'https://api.themoviedb.org/3/search/movie';
      params.query = query;
    } 
    else {
      url = 'https://api.themoviedb.org/3/discover/movie';
      if (genre) params.with_genres = genre;
      if (year) params.primary_release_year = year;
    }

    const response = await axios.get(url, { params });
    res.json(response.data.results);
  } 
  catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies', message: err.message });
  }
};
