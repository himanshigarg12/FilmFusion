# news.py - News Route
# Fetches real entertainment news from NewsAPI
# Returns latest Bollywood, Hollywood, OTT news

from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Create blueprint
news_bp = Blueprint('news', __name__)

# NewsAPI key from .env file
NEWS_API_KEY = os.getenv('NEWS_API_KEY')
NEWS_BASE_URL = 'https://newsapi.org/v2'

# ==========================================
# GET ENTERTAINMENT NEWS
# ==========================================
@news_bp.route('/news', methods=['GET'])
def get_news():
    try:
        category = request.args.get('category', 'entertainment')

        if not NEWS_API_KEY or NEWS_API_KEY == 'paste_your_key_here':
            # Return static news if no API key
            return jsonify({
                'success': True,
                'articles': get_static_news(),
                'source': 'static'
            })

        # Call NewsAPI
        response = requests.get(
            f'{NEWS_BASE_URL}/top-headlines',
            params={
                'apiKey': NEWS_API_KEY,
                'country': 'in',
                'category': 'entertainment',
                'pageSize': 20
            }
        )
        data = response.json()

        articles = []
        for article in data.get('articles', []):
            if article.get('title') and article.get('title') != '[Removed]':
                articles.append({
                    'title': article['title'],
                    'description': article.get('description', ''),
                    'url': article.get('url', ''),
                    'image': article.get('urlToImage', ''),
                    'source': article.get('source', {}).get('name', ''),
                    'publishedAt': article.get('publishedAt', ''),
                    'category': categorize_news(article['title'])
                })

        return jsonify({
            'success': True,
            'articles': articles,
            'total': len(articles),
            'source': 'NewsAPI'
        })

    except Exception as e:
        return jsonify({
            'success': True,
            'articles': get_static_news(),
            'source': 'static (API error)'
        })

# ==========================================
# GET BOLLYWOOD NEWS
# ==========================================
@news_bp.route('/news/bollywood', methods=['GET'])
def get_bollywood_news():
    try:
        if not NEWS_API_KEY or NEWS_API_KEY == 'paste_your_key_here':
            return jsonify({
                'success': True,
                'articles': get_static_news(),
                'source': 'static'
            })

        response = requests.get(
            f'{NEWS_BASE_URL}/everything',
            params={
                'apiKey': NEWS_API_KEY,
                'q': 'Bollywood OR Hindi movie OR Shah Rukh Khan OR Deepika',
                'language': 'en',
                'sortBy': 'publishedAt',
                'pageSize': 10
            }
        )
        data = response.json()

        articles = []
        for article in data.get('articles', []):
            if article.get('title') and article.get('title') != '[Removed]':
                articles.append({
                    'title': article['title'],
                    'description': article.get('description', ''),
                    'url': article.get('url', ''),
                    'image': article.get('urlToImage', ''),
                    'source': article.get('source', {}).get('name', ''),
                    'publishedAt': article.get('publishedAt', ''),
                    'category': 'Bollywood'
                })

        return jsonify({
            'success': True,
            'articles': articles,
            'source': 'NewsAPI'
        })

    except Exception as e:
        return jsonify({
            'success': True,
            'articles': get_static_news(),
            'source': 'static'
        })

# ==========================================
# CATEGORIZE NEWS AUTOMATICALLY
# ==========================================
def categorize_news(title):
    title_lower = title.lower()

    if any(word in title_lower for word in ['bollywood', 'hindi', 'srk', 'salman', 'deepika', 'alia']):
        return 'Bollywood'
    elif any(word in title_lower for word in ['hollywood', 'marvel', 'disney', 'oscar', 'netflix original']):
        return 'Hollywood'
    elif any(word in title_lower for word in ['netflix', 'amazon prime', 'hotstar', 'jiocinema', 'ott']):
        return 'OTT'
    elif any(word in title_lower for word in ['bigg boss', 'kbc', 'reality', 'lockup']):
        return 'Reality Shows'
    elif any(word in title_lower for word in ['award', 'filmfare', 'iifa', 'star screen']):
        return 'Awards'
    else:
        return 'Entertainment'

# ==========================================
# STATIC NEWS (fallback when no API key)
# ==========================================
def get_static_news():
    return [
        {
            'title': 'Shah Rukh Khan\'s King becomes most anticipated Bollywood film of 2026',
            'description': 'King starring Shah Rukh Khan and Suhana Khan is breaking pre-booking records across India.',
            'url': '#',
            'image': '',
            'source': 'FilmFusion',
            'publishedAt': '2026-08-07',
            'category': 'Bollywood'
        },
        {
            'title': 'Mirzapur Season 4 release date officially announced by Amazon Prime',
            'description': 'The most awaited web series Mirzapur 4 is finally coming to Amazon Prime Video.',
            'url': '#',
            'image': '',
            'source': 'FilmFusion',
            'publishedAt': '2026-08-07',
            'category': 'OTT'
        },
        {
            'title': 'Pushpa 3 breaks all box office records in opening weekend',
            'description': 'Allu Arjun\'s Pushpa 3 has collected over ₹500 crores in its opening weekend.',
            'url': '#',
            'image': '',
            'source': 'FilmFusion',
            'publishedAt': '2026-08-07',
            'category': 'Bollywood'
        },
        {
            'title': 'Bigg Boss 19 contestants list officially revealed by Colors TV',
            'description': 'The new season of Bigg Boss hosted by Salman Khan starts next month.',
            'url': '#',
            'image': '',
            'source': 'FilmFusion',
            'publishedAt': '2026-08-07',
            'category': 'Reality Shows'
        },
        {
            'title': 'Panchayat Season 4 wins Best Web Series at Filmfare OTT Awards',
            'description': 'Amazon Prime\'s Panchayat continues to dominate awards season.',
            'url': '#',
            'image': '',
            'source': 'FilmFusion',
            'publishedAt': '2026-08-07',
            'category': 'Awards'
        },
        {
            'title': 'Deepika Padukone signs 3 big projects for 2027',
            'description': 'Deepika Padukone is all set with a packed 2027 lineup including action and drama films.',
            'url': '#',
            'image': '',
            'source': 'FilmFusion',
            'publishedAt': '2026-08-07',
            'category': 'Bollywood'
        },
    ]