import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';
import { getImageUrl } from '../services/api';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const rating = movie.vote_average.toFixed(1);
  const ratingClass = movie.vote_average >= 8 ? 'rating--high' : movie.vote_average >= 6 ? 'rating--mid' : 'rating--low';

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-card__poster">
        <img
          src={getImageUrl(movie.poster_path, 'w342')}
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-card__overlay">
          <div className="movie-card__play-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </div>
        </div>
        <span className={`movie-card__rating ${ratingClass}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          {rating}
        </span>
      </div>
      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <span className="movie-card__year">{year}</span>
      </div>
    </Link>
  );
}
