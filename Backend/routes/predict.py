# predict.py - Hit or Flop Prediction Route
# When React sends movie details → this predicts hit or flop → sends result back

from flask import Blueprint, request, jsonify
import pickle
import os
import random

# Create blueprint
predict_bp = Blueprint('predict', __name__)

# Load trained model
model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'hitflop_model.pkl')

model_loaded = False
model = None

if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    model_loaded = True
    print("✅ Hit/Flop model loaded!")
else:
    print("⚠️ Hit/Flop model not found — using simple prediction")

def simple_predict(data):
    # Simple rule based prediction
    # Used before ML model is trained
    score = 0

    # Budget scoring
    budget = int(data.get('budget', 0))
    if budget > 200:
        score += 25
    elif budget > 100:
        score += 20
    elif budget > 50:
        score += 15
    else:
        score += 10

    # Genre scoring
    genre = data.get('genre', '').lower()
    genre_scores = {
        'action': 25,
        'comedy': 22,
        'horror': 20,
        'romance': 18,
        'thriller': 22,
        'drama': 15,
        'sci-fi': 20
    }
    score += genre_scores.get(genre, 15)

    # Platform scoring
    platform = data.get('platform', '').lower()
    platform_scores = {
        'theatre': 25,
        'netflix': 22,
        'amazon prime': 20,
        'hotstar': 18,
        'jiocinema': 15
    }
    score += platform_scores.get(platform, 15)

    # Cast popularity scoring
    cast = int(data.get('castPopularity', 5))
    score += cast * 2

    # Language scoring
    language = data.get('language', '').lower()
    language_scores = {
        'hindi': 20,
        'telugu': 18,
        'tamil': 18,
        'malayalam': 15,
        'english': 20
    }
    score += language_scores.get(language, 15)

    # Add some randomness
    score += random.randint(-5, 5)

    # Determine prediction
    if score >= 75:
        return {
            'prediction': 'HIT 🔥',
            'emoji': '🏆',
            'color': 'hit',
            'confidence': min(score, 99),
            'box_office': f'₹{budget * random.randint(2, 4)} Crores (predicted)',
            'reasons': [
                f'Budget of ₹{budget} Cr is well allocated for {genre} genre',
                f'{platform} has strong reach for this content type',
                f'Cast popularity score of {cast}/10 is impressive',
                f'{language} films are performing well currently',
                'Strong market positioning detected'
            ]
        }
    elif score >= 50:
        return {
            'prediction': 'AVERAGE 😐',
            'emoji': '📊',
            'color': 'average',
            'confidence': score,
            'box_office': f'₹{budget * random.randint(1, 2)} Crores (predicted)',
            'reasons': [
                f'Budget allocation is moderate for {genre} genre',
                f'{platform} has average reach for this content',
                f'Cast popularity of {cast}/10 is decent',
                'Market competition is moderate',
                'Could go either way depending on reviews'
            ]
        }
    else:
        return {
            'prediction': 'FLOP 💀',
            'emoji': '📉',
            'color': 'flop',
            'confidence': max(100 - score, 60),
            'box_office': f'₹{budget // random.randint(2, 4)} Crores (predicted)',
            'reasons': [
                f'Budget of ₹{budget} Cr may be insufficient for {genre}',
                f'{platform} reach is limited for this content type',
                f'Cast popularity of {cast}/10 needs improvement',
                'Strong competition in current market',
                'Marketing strategy needs improvement'
            ]
        }

@predict_bp.route('/predict', methods=['POST'])
def predict_hitflop():
    try:
        # Get movie data from React
        data = request.get_json()

        # Validate required fields
        required = ['title', 'genre', 'budget', 'platform', 'language', 'castPopularity']
        for field in required:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Use ML model if available
        if model_loaded:
            # Prepare features for model
            features = [
                int(data.get('budget', 0)),
                int(data.get('castPopularity', 5)),
            ]
            prediction = model.predict([features])[0]
            probability = model.predict_proba([features])[0]
            confidence = int(max(probability) * 100)

            if prediction == 1:
                result = {
                    'prediction': 'HIT 🔥',
                    'emoji': '🏆',
                    'color': 'hit',
                    'confidence': confidence,
                    'model_used': 'ML Model'
                }
            else:
                result = {
                    'prediction': 'FLOP 💀',
                    'emoji': '📉',
                    'color': 'flop',
                    'confidence': confidence,
                    'model_used': 'ML Model'
                }
        else:
            # Use simple prediction
            result = simple_predict(data)
            result['model_used'] = 'Rule-based (ML model not trained yet)'

        return jsonify({
            'success': True,
            'result': result
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500