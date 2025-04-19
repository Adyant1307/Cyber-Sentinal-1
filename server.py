from flask import Flask, render_template, jsonify
from datetime import datetime
import random
import nltk
import requests
from sklearn.ensemble import IsolationForest

nltk.download('punkt')

app = Flask(__name__)

def preprocess(posts):
    from nltk.tokenize import word_tokenize
    return [" ".join(word_tokenize(post.lower())) for post in posts if isinstance(post, str)]

def get_live_cyber_posts():
    from bs4 import BeautifulSoup

    sources = []

    # The Hacker News
    try:
        thn = requests.get("https://thehackernews.com/", timeout=10)
        soup = BeautifulSoup(thn.text, "html.parser")
        posts = soup.find_all("div", class_="body-post")[:3]
        for p in posts:
            title = p.find("h2", class_="home-title")
            if title:
                sources.append("[THN] " + title.text.strip())
    except Exception as e:
        sources.append("The Hacker News failed.")

    # BleepingComputer
    try:
        bc = requests.get("https://www.bleepingcomputer.com/news/security/", timeout=10)
        soup = BeautifulSoup(bc.text, "html.parser")
        titles = soup.select("div.bc_latest_news div.news_title a")[:3]
        for a in titles:
            sources.append("[BC] " + a.text.strip())
    except Exception as e:
        sources.append("BleepingComputer failed.")

    # SecurityWeek
    try:
        sw = requests.get("https://www.securityweek.com/", timeout=10)
        soup = BeautifulSoup(sw.text, "html.parser")
        articles = soup.select("article h2 a")[:3]
        for a in articles:
            sources.append("[SW] " + a.text.strip())
    except Exception as e:
        sources.append("SecurityWeek failed.")

    # Fallback post
    sources.append("Massive ransomware attack leaks bank data in the US")

    return sources


def get_darkweb_posts():
    from bs4 import BeautifulSoup

    posts = []

    try:
        # Source: Simulated threat-like text from Reddit cybersecurity (safe & public)
        reddit = requests.get("https://www.reddit.com/r/cybersecurity/", headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        soup = BeautifulSoup(reddit.text, "html.parser")
        titles = soup.find_all("h3")[:5]
        for t in titles:
            text = t.text.strip()
            if len(text) > 20:
                posts.append("[Reddit] " + text)
    except Exception as e:
        posts.append("Reddit source failed.")

    try:
        # Source: SecurityWeek headlines (can simulate leaked mentions)
        sw = requests.get("https://www.securityweek.com/", timeout=10)
        soup = BeautifulSoup(sw.text, "html.parser")
        articles = soup.select("article h2 a")[:3]
        for a in articles:
            posts.append("[SW Leak] " + a.text.strip())
    except Exception as e:
        posts.append("SecurityWeek fallback triggered.")

    # Fallbacks to ensure data exists
    posts.append("Selling credentials from breached enterprise in Asia")
    posts.append("Database dump listed on hidden forum: includes PII")

    return posts


def extract_features(data):
    features, levels = [], []
    high = ["zero-day", "exploit", "ransomware", "botnet", "critical"]
    medium = ["hack", "phishing", "stealer", "malware"]
    low = ["leak", "database", "credit card"]
    for text in data:
        if "no threat" in text:
            features.append([len(text), 0])
            levels.append("Low")
            continue
        count, level = 0, "Low"
        if any(w in text for w in high):
            level, count = "High", 5
        elif any(w in text for w in medium):
            level, count = "Medium", 3
        elif any(w in text for w in low):
            count = 1
        features.append([len(text), count])
        levels.append(level)
    return features, levels

def build_model(X):
    model = IsolationForest(contamination=0.2, random_state=42)
    model.fit(X)
    return model

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/api/live")
def api_live():
    try:
        posts = get_live_cyber_posts()
        # Ensure posts is a list using Python syntax
        if not isinstance(posts, list):
            posts = []
        
        keywords = ["attack", "ransomware", "exploit", "hack", "leak", "breach", "malware", "phishing"]
        formatted_posts = []
        
        for post in posts:
            if isinstance(post, str):  # Ensure post is a string
                formatted_posts.append({
                    "post": post,
                    "status": "Threat" if any(k in post.lower() for k in keywords) else "Safe"
                })
        
        return jsonify(formatted_posts)
    except Exception as e:
        print(f"Error in api_live: {str(e)}")
        return jsonify([])  # Return empty array on error

@app.route("/api/darkweb/raw")
def api_raw():
    return jsonify(get_darkweb_posts())

@app.route("/api/darkweb")
def api_darkweb():
    try:
        posts = get_darkweb_posts()
        if not isinstance(posts, list):
            posts = []
            
        processed = preprocess(posts)
        features, levels = extract_features(processed)
        model = build_model(features)
        preds = model.predict(features)
        
        formatted_posts = []
        for post, pred, level in zip(posts, preds, levels):
            if isinstance(post, str):  # Ensure post is a string
                formatted_posts.append({
                    "post": post,
                    "status": "Threat" if pred == -1 else "Safe",
                    "threat_level": level if pred == -1 else "-",
                    "time": datetime.now().strftime("%H:%M:%S")
                })
        
        return jsonify(formatted_posts)
    except Exception as e:
        print(f"Error in api_darkweb: {str(e)}")
        return jsonify([])

@app.route('/api/hibp-check')
def hibp_check_via_rapidapi():
    from flask import request

    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Missing query"}), 400

    url = f"https://breachdirectory.p.rapidapi.com/?func=auto&term={query}"
    headers = {
        "x-rapidapi-key": "2dbbbb4cfemsh2ce6bdb71c65ab9p1e4712jsn73104b9c20ed",
        "x-rapidapi-host": "breachdirectory.p.rapidapi.com"
    }

    try:
        res = requests.get(url, headers=headers, timeout=10)
        print("Raw API response:", res.text)

        if res.status_code != 200:
            return jsonify({"error": f"API error {res.status_code}"}), res.status_code

        try:
            data = res.json()
        except Exception as e:
            return jsonify({"error": f"Could not parse JSON response: {str(e)}"}), 500

        results = []

        # If 'result' field exists (official response structure)
        if isinstance(data, dict) and "result" in data:
            for item in data["result"]:
                if ":" in item:
                    parts = item.split(":", 1)
                    results.append({
                        "leak": parts[0],
                        "password": parts[1]
                    })
        # If it's already a list of strings
        elif isinstance(data, list):
            for item in data:
                if ":" in item:
                    parts = item.split(":", 1)
                    results.append({
                        "leak": parts[0],
                        "password": parts[1]
                    })
        else:
            return jsonify({"error": "Unexpected response structure"}), 500

        if not results:
            return jsonify([])

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
