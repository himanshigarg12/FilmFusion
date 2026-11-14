# movies.py - Movies Route

from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

movies_bp = Blueprint('movies', __name__)

# =========================================================
# TMDB CONFIGURATION
# =========================================================

TMDB_API_KEY = os.getenv('TMDB_API_KEY')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500'
TMDB_IMAGE_URL_SMALL = 'https://image.tmdb.org/t/p/w200'


# =========================================================
# HELPER - CHECK TMDB API KEY
# =========================================================

def check_api_key():
    if not TMDB_API_KEY:
        return False

    if TMDB_API_KEY == 'paste_your_key_here':
        return False

    return True


# =========================================================
# HELPER - TMDB ERROR
# =========================================================

def tmdb_error(response):
    try:
        error_data = response.json()

        return error_data.get(
            'status_message',
            f'TMDB API error: HTTP {response.status_code}'
        )

    except Exception:
        return f'TMDB API error: HTTP {response.status_code}'


# =========================================================
# GET TRENDING MOVIES
# =========================================================

@movies_bp.route('/movies/trending', methods=['GET'])
def get_trending():

    try:

        if not check_api_key():
            return jsonify({
                'success': False,
                'error': 'TMDB_API_KEY is missing or invalid.'
            }), 500

        response = requests.get(
            f'{TMDB_BASE_URL}/trending/movie/week',
            params={
                'api_key': TMDB_API_KEY,
                'language': 'en-US'
            },
            timeout=10
        )

        print('TMDB Trending Status:', response.status_code)

        if response.status_code != 200:
            print('TMDB Trending Error:', response.text)

            return jsonify({
                'success': False,
                'error': tmdb_error(response)
            }), response.status_code

        data = response.json()

        movies = []

        for movie in data.get('results', [])[:20]:

            poster = None

            if movie.get('poster_path'):
                poster = (
                    TMDB_IMAGE_URL
                    + movie['poster_path']
                )

            movies.append({
                'id': movie.get('id'),
                'title': movie.get('title', 'Unknown'),
                'overview': movie.get('overview', ''),
                'rating': round(
                    float(movie.get('vote_average', 0)),
                    1
                ),
                'poster': poster,
                'release_date': movie.get(
                    'release_date',
                    ''
                ),
                'genre_ids': movie.get(
                    'genre_ids',
                    []
                ),
                'badge': 'Trending'
            })

        return jsonify({
            'success': True,
            'movies': movies,
            'total': len(movies),
            'source': 'TMDB API'
        })

    except requests.exceptions.RequestException as e:

        print('TMDB Trending Request Error:', e)

        return jsonify({
            'success': False,
            'error': 'Could not connect to TMDB.'
        }), 500

    except Exception as e:

        print('Trending Error:', e)

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# =========================================================
# SEARCH MOVIES
# =========================================================

@movies_bp.route('/movies/search', methods=['GET'])
def search_movies():

    try:

        query = request.args.get(
            'query',
            ''
        ).strip()

        if not query:
            return jsonify({
                'success': False,
                'error': 'No search query provided.'
            }), 400

        if not check_api_key():
            return jsonify({
                'success': False,
                'error': 'TMDB_API_KEY is missing or invalid.'
            }), 500

        response = requests.get(
            f'{TMDB_BASE_URL}/search/movie',
            params={
                'api_key': TMDB_API_KEY,
                'query': query,
                'language': 'en-US',
                'include_adult': False
            },
            timeout=10
        )

        print(
            'TMDB Search Status:',
            response.status_code
        )

        if response.status_code != 200:

            print(
                'TMDB Search Error:',
                response.text
            )

            return jsonify({
                'success': False,
                'error': tmdb_error(response)
            }), response.status_code

        data = response.json()

        movies = []

        for movie in data.get('results', [])[:20]:

            poster = None

            if movie.get('poster_path'):
                poster = (
                    TMDB_IMAGE_URL
                    + movie['poster_path']
                )

            movies.append({
                'id': movie.get('id'),
                'title': movie.get(
                    'title',
                    'Unknown'
                ),
                'overview': movie.get(
                    'overview',
                    ''
                ),
                'rating': round(
                    float(
                        movie.get(
                            'vote_average',
                            0
                        )
                    ),
                    1
                ),
                'poster': poster,
                'release_date': movie.get(
                    'release_date',
                    ''
                ),
                'badge': 'Search Result'
            })

        return jsonify({
            'success': True,
            'movies': movies,
            'total': len(movies),
            'source': 'TMDB API'
        })

    except requests.exceptions.RequestException as e:

        print('TMDB Search Request Error:', e)

        return jsonify({
            'success': False,
            'error': 'Could not connect to TMDB.'
        }), 500

    except Exception as e:

        print('Search Error:', e)

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# =========================================================
# GET BOLLYWOOD MOVIES
# =========================================================

@movies_bp.route('/movies/bollywood', methods=['GET'])
def get_bollywood():

    try:

        if not check_api_key():
            return jsonify({
                'success': False,
                'error': 'TMDB_API_KEY is missing or invalid.'
            }), 500

        response = requests.get(
            f'{TMDB_BASE_URL}/discover/movie',
            params={
                'api_key': TMDB_API_KEY,
                'with_original_language': 'hi',
                'sort_by': 'popularity.desc',
                'language': 'en-US',
                'page': 1
            },
            timeout=10
        )

        print(
            'TMDB Bollywood Status:',
            response.status_code
        )

        if response.status_code != 200:

            print(
                'TMDB Bollywood Error:',
                response.text
            )

            return jsonify({
                'success': False,
                'error': tmdb_error(response)
            }), response.status_code

        data = response.json()

        movies = []

        for movie in data.get('results', [])[:20]:

            poster = None

            if movie.get('poster_path'):
                poster = (
                    TMDB_IMAGE_URL
                    + movie['poster_path']
                )

            movies.append({
                'id': movie.get('id'),
                'title': movie.get(
                    'title',
                    'Unknown'
                ),
                'overview': movie.get(
                    'overview',
                    ''
                ),
                'rating': round(
                    float(
                        movie.get(
                            'vote_average',
                            0
                        )
                    ),
                    1
                ),
                'poster': poster,
                'release_date': movie.get(
                    'release_date',
                    ''
                ),
                'badge': 'Bollywood'
            })

        return jsonify({
            'success': True,
            'movies': movies,
            'total': len(movies),
            'source': 'TMDB API'
        })

    except requests.exceptions.RequestException as e:

        print(
            'TMDB Bollywood Request Error:',
            e
        )

        return jsonify({
            'success': False,
            'error': 'Could not connect to TMDB.'
        }), 500

    except Exception as e:

        print(
            'Bollywood Error:',
            e
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# =========================================================
# GET POPULAR CELEBRITIES FROM TMDB
# =========================================================

@movies_bp.route('/celebrities', methods=['GET'])
def get_celebrities():

    try:

        if not check_api_key():
            return jsonify({
                'success': False,
                'error': 'TMDB_API_KEY is missing or invalid.'
            }), 500

        response = requests.get(
            f'{TMDB_BASE_URL}/person/popular',
            params={
                'api_key': TMDB_API_KEY,
                'language': 'en-US',
                'page': 1
            },
            timeout=10
        )

        print(
            'TMDB Celebrities Status:',
            response.status_code
        )

        if response.status_code != 200:

            print(
                'TMDB Celebrities Error:',
                response.text
            )

            return jsonify({
                'success': False,
                'error': tmdb_error(response)
            }), response.status_code

        data = response.json()

        celebrities = []

        for person in data.get('results', [])[:20]:

            photo = None

            if person.get('profile_path'):
                photo = (
                    TMDB_IMAGE_URL_SMALL
                    + person['profile_path']
                )

            known_for_movies = []

            for movie in person.get(
                'known_for',
                []
            )[:3]:

                title = (
                    movie.get('title')
                    or movie.get('name')
                    or ''
                )

                if title:
                    known_for_movies.append(
                        title
                    )

            celebrities.append({
                'id': person.get('id'),
                'name': person.get(
                    'name',
                    'Unknown'
                ),
                'photo': photo,
                'known_for': person.get(
                    'known_for_department',
                    'Acting'
                ),
                'popularity': round(
                    float(
                        person.get(
                            'popularity',
                            0
                        )
                    ),
                    1
                ),
                'known_for_movies':
                    known_for_movies
            })

        return jsonify({
            'success': True,
            'celebrities': celebrities,
            'total': len(celebrities),
            'source': 'TMDB API'
        })

    except requests.exceptions.RequestException as e:

        print(
            'TMDB Celebrity Request Error:',
            e
        )

        return jsonify({
            'success': False,
            'error': 'Could not connect to TMDB.'
        }), 500

    except Exception as e:

        print(
            'Celebrity Error:',
            e
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# =========================================================
# GET CELEBRITY UPCOMING MOVIES
# =========================================================

@movies_bp.route(
    '/celebrities/<int:person_id>/movies',
    methods=['GET']
)
def get_celebrity_movies(person_id):

    try:

        if not check_api_key():
            return jsonify({
                'success': False,
                'error': 'TMDB_API_KEY is missing or invalid.'
            }), 500

        response = requests.get(
            f'{TMDB_BASE_URL}/person/{person_id}/movie_credits',
            params={
                'api_key': TMDB_API_KEY,
                'language': 'en-US'
            },
            timeout=10
        )

        print(
            'TMDB Celebrity Movies Status:',
            response.status_code
        )

        if response.status_code != 200:

            print(
                'TMDB Celebrity Movies Error:',
                response.text
            )

            return jsonify({
                'success': False,
                'error': tmdb_error(response)
            }), response.status_code

        data = response.json()

        today = datetime.now().strftime(
            '%Y-%m-%d'
        )

        upcoming = []

        for movie in data.get(
            'cast',
            []
        ):

            release = movie.get(
                'release_date',
                ''
            )

            if release and release > today:

                poster = None

                if movie.get('poster_path'):
                    poster = (
                        TMDB_IMAGE_URL_SMALL
                        + movie['poster_path']
                    )

                upcoming.append({
                    'id': movie.get('id'),
                    'title': movie.get(
                        'title',
                        'Unknown'
                    ),
                    'release_date': release,
                    'poster': poster
                })

        upcoming = sorted(
            upcoming,
            key=lambda x: x['release_date']
        )[:3]

        return jsonify({
            'success': True,
            'movies': upcoming,
            'total': len(upcoming),
            'source': 'TMDB API'
        })

    except requests.exceptions.RequestException as e:

        print(
            'TMDB Celebrity Movies Request Error:',
            e
        )

        return jsonify({
            'success': False,
            'error': 'Could not connect to TMDB.'
        }), 500

    except Exception as e:

        print(
            'Celebrity Movies Error:',
            e
        )

        return jsonify({
            'success': False,
            'error': str(e)
        }), 500