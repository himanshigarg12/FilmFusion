# recommend.py - Movie Recommendation Route
# When React sends mood → this recommends movies → sends result back

from flask import Blueprint, request, jsonify
import pickle
import os

# Create blueprint
recommend_bp = Blueprint('recommend', __name__)

# Load trained model
model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'recommender.pkl')

model_loaded = False
model = None

if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    model_loaded = True
    print("✅ Recommender model loaded!")
else:
    print("⚠️ Recommender model not found — using static recommendations")

# Static movie data for recommendations
# Will be replaced with TMDB API data later
MOOD_MOVIES = {
    'Funny': [
        {'id': 1, 'title': 'Stree 3', 'genre': 'Horror Comedy', 'rating': '8.2', 'emoji': '👻', 'badge': 'Hit', 'platform': 'Theatre'},
        {'id': 2, 'title': 'Fukrey 4', 'genre': 'Comedy', 'rating': '7.8', 'emoji': '😂', 'badge': 'Hit', 'platform': 'Theatre'},
        {'id': 3, 'title': 'Golmaal 6', 'genre': 'Comedy', 'rating': '7.5', 'emoji': '🤣', 'badge': 'Upcoming', 'platform': 'Theatre'},
        {'id': 4, 'title': 'Housefull 6', 'genre': 'Comedy', 'rating': '7.0', 'emoji': '🏠', 'badge': 'Upcoming', 'platform': 'Theatre'},
    ],
    'Action': [
        {'id': 1, 'title': 'Pushpa 3', 'genre': 'Action', 'rating': '8.9', 'emoji': '🔥', 'badge': 'Hit', 'platform': 'Theatre'},
        {'id': 2, 'title': 'King', 'genre': 'Action', 'rating': '9.1', 'emoji': '👑', 'badge': 'Upcoming', 'platform': 'Theatre'},
        {'id': 3, 'title': 'War 3', 'genre': 'Action', 'rating': '8.0', 'emoji': '💥', 'badge': 'Upcoming', 'platform': 'Theatre'},
        {'id': 4, 'title': 'Tiger 4', 'genre': 'Action', 'rating': '7.8', 'emoji': '🐯', 'badge': 'Upcoming', 'platform': 'Theatre'},
    ],
    'Romance': [
        {'id': 1, 'title': 'Rocky Aur Rani 2', 'genre': 'Romance', 'rating': '7.9', 'emoji': '💕', 'badge': 'Upcoming', 'platform': 'Theatre'},
        {'id': 2, 'title': 'Yeh Jawaani 3', 'genre': 'Romance', 'rating': '7.5', 'emoji': '❤️', 'badge': 'Hit', 'platform': 'Netflix'},
        {'id': 3, 'title': 'Ae Dil Hai Mushkil 2', 'genre': 'Romance', 'rating': '7.8', 'emoji': '💔', 'badge': 'Upcoming', 'platform': 'Theatre'},
    ],
    'Thriller': [
        {'id': 1, 'title': 'Mirzapur 4', 'genre': 'Crime Thriller', 'rating': '8.8', 'emoji': '🔫', 'badge': 'OTT', 'platform': 'Amazon Prime'},
        {'id': 2, 'title': 'Sacred Games 3', 'genre': 'Thriller', 'rating': '8.5', 'emoji': '🕵️', 'badge': 'OTT', 'platform': 'Netflix'},
        {'id': 3, 'title': 'Scam 3', 'genre': 'Drama Thriller', 'rating': '8.7', 'emoji': '📊', 'badge': 'OTT', 'platform': 'Netflix'},
    ],
    'Horror': [
        {'id': 1, 'title': 'Bhool Bhulaiyaa 4', 'genre': 'Horror', 'rating': '7.8', 'emoji': '👁️', 'badge': 'Upcoming', 'platform': 'Theatre'},
        {'id': 2, 'title': 'Stree 3', 'genre': 'Horror Comedy', 'rating': '8.2', 'emoji': '👻', 'badge': 'Hit', 'platform': 'Theatre'},
        {'id': 3, 'title': 'Munjya 2', 'genre': 'Horror Comedy', 'rating': '7.5', 'emoji': '🧟', 'badge': 'Upcoming', 'platform': 'Theatre'},
    ],
    'Emotional': [
        {'id': 1, 'title': 'Panchayat 4', 'genre': 'Drama', 'rating': '9.0', 'emoji': '🏘️', 'badge': 'OTT', 'platform': 'Amazon Prime'},
        {'id': 2, 'title': 'Taare Zameen Par 2', 'genre': 'Drama', 'rating': '8.5', 'emoji': '⭐', 'badge': 'Upcoming', 'platform': 'Theatre'},
        {'id': 3, 'title': 'Ae Watan Mere Watan 2', 'genre': 'Drama', 'rating': '8.1', 'emoji': '🇮🇳', 'badge': 'OTT', 'platform': 'Amazon Prime'},
    ],
    'Comedy': [
        {'id': 1, 'title': 'Fukrey 4', 'genre': 'Comedy', 'rating': '7.8', 'emoji': '😂', 'badge': 'Hit', 'platform': 'Theatre'},
        {'id': 2, 'title': 'Golmaal 6', 'genre': 'Comedy', 'rating': '7.5', 'emoji': '🤣', 'badge': 'Upcoming', 'platform': 'Theatre'},
        {'id': 3, 'title': 'Panchayat 4', 'genre': 'Comedy Drama', 'rating': '9.0', 'emoji': '🏘️', 'badge': 'OTT', 'platform': 'Amazon Prime'},
    ],
    'Drama': [
        {'id': 1, 'title': 'Panchayat 4', 'genre': 'Drama', 'rating': '9.0', 'emoji': '🏘️', 'badge': 'OTT', 'platform': 'Amazon Prime'},
        {'id': 2, 'title': 'Scam 3', 'genre': 'Drama', 'rating': '8.7', 'emoji': '📊', 'badge': 'OTT', 'platform': 'Netflix'},
        {'id': 3, 'title': 'Delhi Crime 3', 'genre': 'Crime Drama', 'rating': '8.4', 'emoji': '🚔', 'badge': 'OTT', 'platform': 'Netflix'},
    ]
}

@recommend_bp.route('/recommend', methods=['POST'])
def get_recommendations():
    try:
        # Get mood from React
        data = request.get_json()
        mood = data.get('mood', '')

        if not mood:
            return jsonify({'error': 'No mood provided'}), 400

        # Get movies for this mood
        movies = MOOD_MOVIES.get(mood, MOOD_MOVIES['Action'])

        return jsonify({
            'success': True,
            'mood': mood,
            'movies': movies,
            'total': len(movies),
            'model_used': 'Static recommendations (ML model coming soon)'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500