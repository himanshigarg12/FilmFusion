# recommend.py - Movie Recommendation Route
from flask import Blueprint, request, jsonify
import pickle
import os

recommend_bp = Blueprint('recommend', __name__)

# Load models
models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')

cosine_sim = None
movies_df = None

cosine_sim_path = os.path.join(models_dir, 'cosine_sim.pkl')
movies_df_path = os.path.join(models_dir, 'movies_df.pkl')

if os.path.exists(cosine_sim_path) and os.path.exists(movies_df_path):
    with open(cosine_sim_path, 'rb') as f:
        cosine_sim = pickle.load(f)
    with open(movies_df_path, 'rb') as f:
        movies_df = pickle.load(f)
    print("✅ Recommender model loaded!")
else:
    print("⚠️ Recommender model not found — using static recommendations")

# Static mood movies fallback
MOOD_MOVIES = {
    'Funny': [
        {'id': 1, 'title': 'Stree 3', 'genre': 'Horror Comedy', 'rating': 8.2, 'platform': 'Theatre', 'mood': 'Funny'},
        {'id': 2, 'title': 'Fukrey 4', 'genre': 'Comedy', 'rating': 7.8, 'platform': 'Theatre', 'mood': 'Funny'},
        {'id': 3, 'title': 'Golmaal 6', 'genre': 'Comedy', 'rating': 7.5, 'platform': 'Theatre', 'mood': 'Funny'},
    ],
    'Action': [
        {'id': 1, 'title': 'Pushpa 3', 'genre': 'Action', 'rating': 8.9, 'platform': 'Theatre', 'mood': 'Action'},
        {'id': 2, 'title': 'King', 'genre': 'Action', 'rating': 9.1, 'platform': 'Theatre', 'mood': 'Action'},
        {'id': 3, 'title': 'War 3', 'genre': 'Action', 'rating': 8.0, 'platform': 'Theatre', 'mood': 'Action'},
    ],
    'Romance': [
        {'id': 1, 'title': 'Rocky Aur Rani 2', 'genre': 'Romance', 'rating': 7.9, 'platform': 'Theatre', 'mood': 'Romance'},
        {'id': 2, 'title': 'Yeh Jawaani 3', 'genre': 'Romance', 'rating': 7.5, 'platform': 'Netflix', 'mood': 'Romance'},
        {'id': 3, 'title': 'Ae Dil Hai Mushkil 2', 'genre': 'Romance', 'rating': 7.8, 'platform': 'Theatre', 'mood': 'Romance'},
    ],
    'Thriller': [
        {'id': 1, 'title': 'Mirzapur 4', 'genre': 'Crime Thriller', 'rating': 8.8, 'platform': 'Amazon Prime', 'mood': 'Thriller'},
        {'id': 2, 'title': 'Sacred Games 3', 'genre': 'Thriller', 'rating': 8.5, 'platform': 'Netflix', 'mood': 'Thriller'},
        {'id': 3, 'title': 'Scam 3', 'genre': 'Drama Thriller', 'rating': 8.7, 'platform': 'Netflix', 'mood': 'Thriller'},
    ],
    'Horror': [
        {'id': 1, 'title': 'Bhool Bhulaiyaa 4', 'genre': 'Horror', 'rating': 7.8, 'platform': 'Theatre', 'mood': 'Horror'},
        {'id': 2, 'title': 'Stree 3', 'genre': 'Horror Comedy', 'rating': 8.2, 'platform': 'Theatre', 'mood': 'Horror'},
        {'id': 3, 'title': 'Munjya 2', 'genre': 'Horror Comedy', 'rating': 7.5, 'platform': 'Theatre', 'mood': 'Horror'},
    ],
    'Emotional': [
        {'id': 1, 'title': 'Panchayat 4', 'genre': 'Drama', 'rating': 9.0, 'platform': 'Amazon Prime', 'mood': 'Emotional'},
        {'id': 2, 'title': 'Taare Zameen Par 2', 'genre': 'Drama', 'rating': 8.5, 'platform': 'Theatre', 'mood': 'Emotional'},
        {'id': 3, 'title': 'Ae Watan Mere Watan 2', 'genre': 'Drama', 'rating': 8.1, 'platform': 'Amazon Prime', 'mood': 'Emotional'},
    ],
    'Comedy': [
        {'id': 1, 'title': 'Fukrey 4', 'genre': 'Comedy', 'rating': 7.8, 'platform': 'Theatre', 'mood': 'Comedy'},
        {'id': 2, 'title': 'Golmaal 6', 'genre': 'Comedy', 'rating': 7.5, 'platform': 'Theatre', 'mood': 'Comedy'},
        {'id': 3, 'title': 'Panchayat 4', 'genre': 'Comedy Drama', 'rating': 9.0, 'platform': 'Amazon Prime', 'mood': 'Comedy'},
    ],
    'Drama': [
        {'id': 1, 'title': 'Panchayat 4', 'genre': 'Drama', 'rating': 9.0, 'platform': 'Amazon Prime', 'mood': 'Drama'},
        {'id': 2, 'title': 'Scam 3', 'genre': 'Drama', 'rating': 8.7, 'platform': 'Netflix', 'mood': 'Drama'},
        {'id': 3, 'title': 'Delhi Crime 3', 'genre': 'Crime Drama', 'rating': 8.4, 'platform': 'Netflix', 'mood': 'Drama'},
    ]
}

@recommend_bp.route('/recommend', methods=['POST'])
def get_recommendations():
    try:
        data = request.get_json()
        mood = data.get('mood', '')

        if not mood:
            return jsonify({'error': 'No mood provided'}), 400

        # Use ML model if available
        if movies_df is not None and cosine_sim is not None:
            try:
                # Filter by mood
                mood_movies = movies_df[movies_df['mood'] == mood].copy()
                mood_movies = mood_movies.sort_values('rating', ascending=False)

                movies = []
                for _, row in mood_movies.head(6).iterrows():
                    movies.append({
                        'title': str(row['title']),
                        'genre': str(row['genre']),
                        'platform': str(row['platform']),
                        'rating': float(row['rating']),
                        'mood': str(row['mood'])
                    })

                if movies:
                    return jsonify({
                        'success': True,
                        'mood': mood,
                        'movies': movies,
                        'total': len(movies),
                        'model_used': 'ML Model (Cosine Similarity)'
                    })
            except Exception as e:
                print(f"ML model error: {e}")

        # Fallback to static
        movies = MOOD_MOVIES.get(mood, MOOD_MOVIES['Action'])

        return jsonify({
            'success': True,
            'mood': mood,
            'movies': movies,
            'total': len(movies),
            'model_used': 'Static recommendations'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500