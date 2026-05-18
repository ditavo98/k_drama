import { useState, useEffect, useCallback } from 'react';
import { getTrendingKoreanMovies } from '../services/api';
import { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import './MovieList.css';

export default function Trending() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchMovies = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await getTrendingKoreanMovies(pageNum);
      setMovies((prev) => pageNum === 1 ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(page);
  }, [page, fetchMovies]);

  return (
    <div className="movie-list-page">
      <div className="movie-list-page__hero">
        <div className="movie-list-page__hero-content">
          <h1 className="movie-list-page__title">
            <span>🔥</span> 인기 한국 영화
          </h1>
          <p className="movie-list-page__subtitle">지금 가장 핫한 K-무비를 만나보세요</p>
        </div>
      </div>

      <div className="movie-list-page__grid-wrap">
        {loading && page === 1 ? (
          <div className="movie-list-page__grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-poster" />
                <div className="skeleton-text" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="movie-list-page__grid">
              {movies.map((movie) => (
                <MovieCard key={`${movie.id}-${page}`} movie={movie} />
              ))}
            </div>

            {page < totalPages && (
              <div className="movie-list-page__load-more">
                <button
                  className="movie-list-page__load-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                >
                  {loading ? '로딩 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
