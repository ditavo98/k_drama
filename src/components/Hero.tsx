import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getTrendingKoreanMovies, getBackdropUrl, getImageUrl } from '../services/api';
import { Movie } from '../types/movie';
import './Hero.css';

export default function Hero() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getTrendingKoreanMovies()
      .then((data) => {
        setMovies(data.results.slice(0, 6));
        setLoaded(true);
      })
      .catch(console.error);
  }, []);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % (movies.length || 1));
    }, 6000);
  }, [movies.length]);

  useEffect(() => {
    if (movies.length > 0) {
      startInterval();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [movies.length, startInterval]);

  if (!loaded || movies.length === 0) {
    return (
      <section className="hero hero--loading">
        <div className="hero__placeholder">
          <div className="hero__spinner"/>
        </div>
      </section>
    );
  }

  const activeMovie = movies[current];

  return (
    <section className="hero">
      {movies.map((movie, i) => (
        <div
          key={movie.id}
          className={`hero__slide ${i === current ? 'hero__slide--active' : ''}`}
        >
          <div
            className="hero__bg"
            style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}
          />
        </div>
      ))}
      <div className="hero__gradient" />

      <div className="hero__content">
        <div className="hero__poster-wrap">
          <img
            src={getImageUrl(activeMovie.poster_path, 'w342')}
            alt={activeMovie.title}
            className="hero__poster"
          />
        </div>
        <div className="hero__info">
          <div className="hero__badge">
            <span className="hero__badge-icon">🔥</span>
            인기 {current + 1}위
          </div>
          <h1 className="hero__title">{activeMovie.title}</h1>
          <div className="hero__meta">
            <span className="hero__rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f5c518">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              {activeMovie.vote_average.toFixed(1)}
            </span>
            <span className="hero__year">{activeMovie.release_date?.split('-')[0]}</span>
          </div>
          <p className="hero__overview">{activeMovie.overview}</p>
          <div className="hero__actions">
            <Link to={`/movie/${activeMovie.id}`} className="hero__btn hero__btn--primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <polygon points="10,8 16,12 10,16" fill="currentColor"/>
              </svg>
              상세 보기
            </Link>
          </div>
        </div>
      </div>

      <div className="hero__dots">
        {movies.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => {
              setCurrent(i);
              startInterval();
            }}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
