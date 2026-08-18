# movies.py - Movies Route
# Fetches real movie data from TMDB API
# Returns trending movies, search results etc.

from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Create blueprint
movies_bp = Blueprint('movies', __name__)

# TMDB API key from .env file
TMDB_API_KEY = os.getenv('TMDB_API_KEY')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'
TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500'

def get_tmdb_headers():
    return {
        'Authorization': f'Bearer {TMDB_API_KEY}',
        'Content-Type': 'application/json'
    }

# ==========================================
# GET TRENDING MOVIES
# ==========================================
@movies_bp.route('/movies/trending', methods=['GET'])
def get_trending():
    try:
        if not TMDB_API_KEY or TMDB_API_KEY == 'paste_your_key_here':
            # Return static data if no API key
            return jsonify({
                'success': True,
                'movies': get_static_movies(),
                'source': 'static'
            })

        # Call TMDB API
        response = requests.get(
            f'{TMDB_BASE_URL}/trending/movie/week',
            params={'api_key': TMDB_API_KEY, 'language': 'en-US'}
        )
        data = response.json()

        movies = []
        for movie in data.get('results', [])[:10]:
            movies.append({
                'id': movie['id'],
                'title': movie['title'],
                'overview': movie['overview'],
                'rating': round(movie['vote_average'], 1),
                'poster': f"{TMDB_IMAGE_URL}{movie['poster_path']}" if movie.get('poster_path') else None,
                'release_date': movie.get('release_date', ''),
                'genre_ids': movie.get('genre_ids', []),
                'badge': 'Trending'
            })

        return jsonify({
            'success': True,
            'movies': movies,
            'source': 'TMDB API'
        })

    except Exception as e:
        return jsonify({
            'success': True,
            'movies': get_static_movies(),
            'source': 'static (API error)'
        })

# ==========================================
# SEARCH MOVIES
# ==========================================
@movies_bp.route('/movies/search', methods=['GET'])
def search_movies():
    try:
        query = request.args.get('query', '')

        if not query:
            return jsonify({'error': 'No search query provided'}), 400

        if not TMDB_API_KEY or TMDB_API_KEY == 'paste_your_key_here':
            return jsonify({
                'success': True,
                'movies': get_static_movies(),
                'source': 'static'
            })

        # Call TMDB search API
        response = requests.get(
            f'{TMDB_BASE_URL}/search/movie',
            params={
                'api_key': TMDB_API_KEY,
                'query': query,
                'language': 'en-US'
            }
        )
        data = response.json()

        movies = []
        for movie in data.get('results', [])[:10]:
            movies.append({
                'id': movie['id'],
                'title': movie['title'],
                'overview': movie['overview'],
                'rating': round(movie['vote_average'], 1),
                'poster': f"{TMDB_IMAGE_URL}{movie['poster_path']}" if movie.get('poster_path') else None,
                'release_date': movie.get('release_date', ''),
                'badge': 'Search Result'
            })

        return jsonify({
            'success': True,
            'movies': movies,
            'total': len(movies),
            'source': 'TMDB API'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==========================================
# GET BOLLYWOOD MOVIES
# ==========================================
@movies_bp.route('/movies/bollywood', methods=['GET'])
def get_bollywood():
    try:
        if not TMDB_API_KEY or TMDB_API_KEY == 'paste_your_key_here':
            return jsonify({
                'success': True,
                'movies': get_static_movies(),
                'source': 'static'
            })

        # Hindi movies from TMDB
        response = requests.get(
            f'{TMDB_BASE_URL}/discover/movie',
            params={
                'api_key': TMDB_API_KEY,
                'with_original_language': 'hi',
                'sort_by': 'popularity.desc',
                'language': 'en-US'
            }
        )
        data = response.json()

        movies = []
        for movie in data.get('results', [])[:10]:
            movies.append({
                'id': movie['id'],
                'title': movie['title'],
                'overview': movie['overview'],
                'rating': round(movie['vote_average'], 1),
                'poster': f"{TMDB_IMAGE_URL}{movie['poster_path']}" if movie.get('poster_path') else None,
                'release_date': movie.get('release_date', ''),
                'badge': 'Bollywood'
            })

        return jsonify({
            'success': True,
            'movies': movies,
            'source': 'TMDB API'
        })

    except Exception as e:
        return jsonify({
            'success': True,
            'movies': get_static_movies(),
            'source': 'static'
        })

# ==========================================
# STATIC MOVIES (fallback when no API key)
# ==========================================
def get_static_movies():
    return [
        {'id': 1, 'title': 'Stree 3', 'genre': 'Horror Comedy', 'rating': 8.2, 'emoji': '👻', 'badge': 'Hit', 'platform': 'Theatre'},
        {'id': 2, 'title': 'Pushpa 3', 'genre': 'Action', 'rating': 8.9, 'emoji': '🔥', 'badge': 'Hit', 'platform': 'Theatre'},
        {'id': 3, 'title': 'Lockup 2', 'genre': 'Reality', 'rating': 7.5, 'emoji': '🔒', 'badge': 'OTT', 'platform': 'Netflix'},
        {'id': 4, 'title': 'Bigg Boss 19', 'genre': 'Reality', 'rating': 6.8, 'emoji': '📺', 'badge': 'OTT', 'platform': 'Hotstar'},
        {'id': 5, 'title': 'King', 'genre': 'Action', 'rating': 9.1, 'emoji': '👑', 'badge': 'Upcoming', 'platform': 'Theatre'},
        {'id': 6, 'title': 'Mirzapur 4', 'genre': 'Crime', 'rating': 8.8, 'emoji': '🔫', 'badge': 'OTT', 'platform': 'Amazon Prime'},
        {'id': 7, 'title': 'Panchayat 4', 'genre': 'Drama', 'rating': 9.0, 'emoji': '🏘️', 'badge': 'OTT', 'platform': 'Amazon Prime'},
        {'id': 8, 'title': 'Fukrey 4', 'genre': 'Comedy', 'rating': 7.8, 'emoji': '😂', 'badge': 'Hit', 'platform': 'Theatre'},
    ]