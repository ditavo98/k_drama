import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchKoreanMovies } from '../services/api';
import { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import './Search.css';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    searchKoreanMovies(query)
      .then((data) => {
        setMovies(data.results);
        setTotalResults(data.total_results);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="search-page">
        <div className="search-page__hero">
          <h1 className="search-page__title">
            <span>🔍</span> 영화 검색
          </h1>
          <p className="search-page__subtitle">찾고 싶은 한국 영화를 검색해보세요</p>
        </div>
        <div className="search-page__empty">
          <div className="search-page__empty-icon">🎬</div>
          <p className="search-page__empty-text">위 검색창에 영화 제목을 입력해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-page__hero">
        <h1 className="search-page__title">
          <span>🔍</span> "{query}" 검색 결과
        </h1>
        <p className="search-page__subtitle">
          {totalResults > 0 ? `${totalResults}개의 영화를 찾았습니다` : ''}
        </p>
      </div>

      <div className="search-page__grid-wrap">
        {loading ? (
          <div className="search-page__grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-poster" />
                <div className="skeleton-text" />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="search-page__empty">
            <div className="search-page__empty-icon">😢</div>
            <p className="search-page__empty-text">검색 결과가 없습니다</p>
            <p className="search-page__empty-hint">다른 검색어로 시도해보세요</p>
          </div>
        ) : (
          <div className="search-page__grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
