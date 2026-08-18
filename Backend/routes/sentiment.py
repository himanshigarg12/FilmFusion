# sentiment.py - Sentiment Analysis Route
# When React sends a review → this analyses it → sends result back

from flask import Blueprint, request, jsonify
import pickle
import os

# Create blueprint
sentiment_bp = Blueprint('sentiment', __name__)

# Load trained model (we'll train it in Jupyter later)
# For now we use a simple rule-based approach
model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'sentiment_model.pkl')
vectorizer_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'vectorizer.pkl')

# Check if model exists
model_loaded = False
model = None
vectorizer = None

if os.path.exists(model_path) and os.path.exists(vectorizer_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    with open(vectorizer_path, 'rb') as f:
        vectorizer = pickle.load(f)
    model_loaded = True
    print("✅ Sentiment model loaded!")
else:
    print("⚠️ Sentiment model not found — using simple analysis")

def simple_sentiment(text):
    # Simple rule based sentiment
    # Used before ML model is trained
    positive_words = ['amazing', 'excellent', 'great', 'good', 'fantastic',
                     'wonderful', 'brilliant', 'superb', 'outstanding', 'love',
                     'best', 'awesome', 'perfect', 'beautiful', 'enjoyed',
                     'incredible', 'masterpiece', 'recommend', 'loved', 'fun',
                     'entertaining', 'hilarious', 'touching', 'emotional']

    negative_words = ['terrible', 'awful', 'bad', 'worst', 'horrible',
                     'disappointing', 'waste', 'boring', 'dull', 'poor',
                     'pathetic', 'useless', 'hate', 'disgusting', 'stupid',
                     'ridiculous', 'disaster', 'rubbish', 'trash', 'flop']

    text_lower = text.lower()
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)

    total = pos_count + neg_count
    if total == 0:
        return {
            'sentiment': 'Neutral',
            'emoji': '😐',
            'positive': 50,
            'negative': 10,
            'neutral': 40,
            'confidence': 'Low'
        }

    pos_percent = int((pos_count / total) * 100)
    neg_percent = int((neg_count / total) * 100)
    neutral_percent = 100 - pos_percent - neg_percent

    if pos_percent > 60:
        sentiment = 'Positive'
        emoji = '😍'
        confidence = 'High' if pos_percent > 80 else 'Medium'
    elif neg_percent > 60:
        sentiment = 'Negative'
        emoji = '😤'
        confidence = 'High' if neg_percent > 80 else 'Medium'
    else:
        sentiment = 'Neutral'
        emoji = '😐'
        confidence = 'Medium'

    return {
        'sentiment': sentiment,
        'emoji': emoji,
        'positive': pos_percent,
        'negative': neg_percent,
        'neutral': neutral_percent,
        'confidence': confidence
    }

@sentiment_bp.route('/sentiment', methods=['POST'])
def analyse_sentiment():
    try:
        # Get review text from React
        data = request.get_json()
        review = data.get('review', '')

        if not review:
            return jsonify({'error': 'No review provided'}), 400

        # Use ML model if available, else use simple analysis
        if model_loaded:
            # Transform text using vectorizer
            text_vectorized = vectorizer.transform([review])
            # Predict sentiment
            prediction = model.predict(text_vectorized)[0]
            probability = model.predict_proba(text_vectorized)[0]

            pos_percent = int(probability[1] * 100)
            neg_percent = int(probability[0] * 100)
            neutral_percent = max(0, 100 - pos_percent - neg_percent)

            sentiment = 'Positive' if prediction == 1 else 'Negative'
            emoji = '😍' if sentiment == 'Positive' else '😤'
            confidence = 'High' if max(probability) > 0.8 else 'Medium'

            result = {
                'sentiment': sentiment,
                'emoji': emoji,
                'positive': pos_percent,
                'negative': neg_percent,
                'neutral': neutral_percent,
                'confidence': confidence,
                'model_used': 'ML Model (Naive Bayes)'
            }
        else:
            # Use simple rule based
            result = simple_sentiment(review)
            result['model_used'] = 'Rule-based (ML model not trained yet)'

        return jsonify({
            'success': True,
            'result': result
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500