import { MovieResponse, MovieDetail, Credits, VideosResponse } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({ api_key: API_KEY, language: 'ko-KR', ...params });
  const response = await fetch(`${BASE_URL}${endpoint}?${searchParams}`);

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: string = 'original'): string {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export async function getTrendingKoreanMovies(page: number = 1): Promise<MovieResponse> {
  return fetchFromTMDB<MovieResponse>('/discover/movie', {
    with_original_language: 'ko',
    sort_by: 'popularity.desc',
    page: String(page),
    'vote_count.gte': '10',
  });
}

export async function getTopRatedKoreanMovies(page: number = 1): Promise<MovieResponse> {
  return fetchFromTMDB<MovieResponse>('/discover/movie', {
    with_original_language: 'ko',
    sort_by: 'vote_average.desc',
    page: String(page),
    'vote_count.gte': '100',
  });
}

export async function getUpcomingKoreanMovies(page: number = 1): Promise<MovieResponse> {
  return fetchFromTMDB<MovieResponse>('/discover/movie', {
    with_original_language: 'ko',
    sort_by: 'release_date.desc',
    page: String(page),
    'primary_release_date.gte': new Date().toISOString().split('T')[0],
  });
}

export async function searchKoreanMovies(query: string, page: number = 1): Promise<MovieResponse> {
  return fetchFromTMDB<MovieResponse>('/search/movie', {
    query,
    page: String(page),
    region: 'KR',
  });
}

export async function getMovieDetail(movieId: number): Promise<MovieDetail> {
  return fetchFromTMDB<MovieDetail>(`/movie/${movieId}`);
}

export async function getMovieCredits(movieId: number): Promise<Credits> {
  return fetchFromTMDB<Credits>(`/movie/${movieId}/credits`);
}

export async function getMovieVideos(movieId: number): Promise<VideosResponse> {
  return fetchFromTMDB<VideosResponse>(`/movie/${movieId}/videos`);
}

export async function getSimilarMovies(movieId: number): Promise<MovieResponse> {
  return fetchFromTMDB<MovieResponse>(`/movie/${movieId}/similar`);
}
