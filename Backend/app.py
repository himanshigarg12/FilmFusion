# app.py - Main Flask file
# This is the "main gate" of your Python ML backend
# React calls this → Flask runs ML model → sends result back

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Allow React (port 5173) to talk to Flask (port 8000)
CORS(app, origins=['http://localhost:5173'])

# ==========================================
# IMPORT ROUTES
# Each route file handles one ML feature
# ==========================================
from routes.sentiment import sentiment_bp
from routes.predict import predict_bp
from routes.recommend import recommend_bp
from routes.movies import movies_bp
from routes.news import news_bp

# Register routes with URL prefix
app.register_blueprint(sentiment_bp, url_prefix='/api')
app.register_blueprint(predict_bp, url_prefix='/api')
app.register_blueprint(recommend_bp, url_prefix='/api')
app.register_blueprint(movies_bp, url_prefix='/api')
app.register_blueprint(news_bp, url_prefix='/api')

# ==========================================
# TEST ROUTE
# Open http://localhost:8000/ to check
# ==========================================
@app.route('/')
def home():
    return {
        'message': 'FilmFusion ML Backend is running! 🤖',
        'status': 'success',
        'endpoints': {
            'sentiment': '/api/sentiment',
            'predict': '/api/predict',
            'recommend': '/api/recommend',
            'movies': '/api/movies',
            'news': '/api/news'
        }
    }

# Start Flask server
if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    )