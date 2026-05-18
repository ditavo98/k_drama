import { useState, useEffect } from 'react';
import { getTrendingKoreanMovies, getTopRatedKoreanMovies } from '../services/api';
import { Movie } from '../types/movie';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import './Home.css';

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTrendingKoreanMovies(),
      getTopRatedKoreanMovies(),
    ])
      .then(([trendingData, topRatedData]) => {
        setTrending(trendingData.results.slice(0, 12));
        setTopRated(topRatedData.results.slice(0, 12));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <Hero />

      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">
            <span className="home__section-icon">🔥</span>
            지금 인기 있는 한국 영화
          </h2>
        </div>
        {loading ? (
          <div className="home__grid home__grid--loading">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-poster" />
                <div className="skeleton-text" />
              </div>
            ))}
          </div>
        ) : (
          <div className="home__grid">
            {trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">
            <span className="home__section-icon">⭐</span>
            최고 평점 한국 영화
          </h2>
        </div>
        {loading ? (
          <div className="home__grid home__grid--loading">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-poster" />
                <div className="skeleton-text" />
              </div>
            ))}
          </div>
        ) : (
          <div className="home__grid">
            {topRated.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
