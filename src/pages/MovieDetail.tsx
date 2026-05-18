import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getBackdropUrl,
  getImageUrl,
} from '../services/api';
import { MovieDetail as MovieDetailType, Cast, Video, Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import './MovieDetail.css';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [director, setDirector] = useState('');
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setShowTrailer(false);

    const movieId = Number(id);
    Promise.all([
      getMovieDetail(movieId),
      getMovieCredits(movieId),
      getMovieVideos(movieId),
      getSimilarMovies(movieId),
    ])
      .then(([detail, credits, videos, similarData]) => {
        setMovie(detail);
        setCast(credits.cast.slice(0, 20));
        const dir = credits.crew.find((c) => c.job === 'Director');
        setDirector(dir?.name || '');
        const tr = videos.results.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        setTrailer(tr || null);
        setSimilar(similarData.results.slice(0, 8));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="detail detail--loading">
        <div className="detail__spinner" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="detail detail--loading">
        <div className="detail__error">
          <p>영화 정보를 불러올 수 없습니다</p>
          <Link to="/" className="detail__back-link">홈으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  const year = movie.release_date?.split('-')[0] || '';
  const rating = movie.vote_average.toFixed(1);
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : '';

  return (
    <div className="detail">
      {/* Backdrop */}
      <div className="detail__backdrop-wrap">
        <div
          className="detail__backdrop"
          style={{
            backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`,
          }}
        />
        <div className="detail__backdrop-gradient" />
      </div>

      {/* Content */}
      <div className="detail__content">
        <Link to="/" className="detail__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          뒤로 가기
        </Link>

        <div className="detail__main">
          <div className="detail__poster-col">
            <img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="detail__poster"
            />
          </div>

          <div className="detail__info-col">
            <h1 className="detail__title">{movie.title}</h1>
            {movie.tagline && (
              <p className="detail__tagline">{movie.tagline}</p>
            )}

            <div className="detail__meta">
              <span className="detail__rating-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f5c518">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                {rating}
              </span>
              <span className="detail__meta-item">{year}</span>
              {runtime && <span className="detail__meta-item">{runtime}</span>}
            </div>

            <div className="detail__genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="detail__genre-tag">{g.name}</span>
              ))}
            </div>

            {trailer && (
              <button
                className="detail__trailer-btn"
                onClick={() => setShowTrailer(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
                예고편 보기
              </button>
            )}

            <div className="detail__overview">
              <h3>줄거리</h3>
              <p>{movie.overview || '줄거리 정보가 없습니다.'}</p>
            </div>

            {director && (
              <div className="detail__info-row">
                <span className="detail__info-label">감독</span>
                <span className="detail__info-value">{director}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="detail__section">
            <h2 className="detail__section-title">출연진</h2>
            <div className="detail__cast">
              {cast.map((person) => (
                <div key={person.id} className="detail__cast-card">
                  <div className="detail__cast-img-wrap">
                    <img
                      src={getImageUrl(person.profile_path, 'w185')}
                      alt={person.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="detail__cast-info">
                    <p className="detail__cast-name">{person.name}</p>
                    <p className="detail__cast-role">{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <section className="detail__section">
            <h2 className="detail__section-title">비슷한 영화</h2>
            <div className="detail__similar-grid">
              {similar.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="detail__modal" onClick={() => setShowTrailer(false)}>
          <div className="detail__modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="detail__modal-close" onClick={() => setShowTrailer(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={trailer.name}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="detail__trailer-iframe"
            />
          </div>
        </div>
      )}
    </div>
  );
}
