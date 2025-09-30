from flask import Flask, request, jsonify, render_template
import re
import os
from flask_cors import CORS
from model import analyze_all_comments
from translate.summarize import summarize_video
from translate.whisp import transcribe_video_or_url
from P1 import get_vid
from P2 import get_comments

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Your YouTube API key
API_KEY = ""  # Replace with your actual API key

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    # Add a print statement to confirm the route is being hit
    print("Analyze route accessed!")
    
    url = request.form.get('url')
    option = request.form.get('option')
    
    if not url:
        return render_template('index.html', error="Please enter a YouTube URL")
    
    video_id = get_vid(url)
    if not video_id:
        return render_template('index.html', error="Invalid YouTube URL")
    
    try:
        if option == 'comments':
            # Analyze comments
            comments = get_comments(video_id, API_KEY)
            if not comments:
                return render_template('index.html', error="No comments found for this video")
            
            sentiment_data = analyze_all_comments(comments)
            
            # Calculate summary statistics
            total_comments = sum(len(sentiment_data[sentiment]) for sentiment in sentiment_data)
            summary = {}
            for sentiment in sentiment_data:
                count = len(sentiment_data[sentiment])
                percent = round((count / total_comments) * 100) if total_comments > 0 else 0
                summary[sentiment] = {
                    "count": count,
                    "percent": percent
                }
            
            return render_template('index.html', summary=summary, comments=sentiment_data, video_id=video_id)
        
        elif option == 'summarize':
            # Download and transcribe the audio (supports YouTube or any video URL)
            transcribe_video_or_url(url)
            
            # Summarize the transcription
            summary_sections = summarize_video()
            
            return render_template('index.html', summary_sections=summary_sections, video_id=video_id)
        
        else:
            return render_template('index.html', error="Invalid option selected")
            
    except Exception as e:
        return render_template('index.html', error=f"Error: {str(e)}")

@app.route('/api/summarize-video', methods=['POST'])
def summarize_video_api():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "Please enter a YouTube URL"}), 400
    
    video_id = get_vid(url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400
    
    try:
        # Download and transcribe the audio (supports YouTube or any video URL)
        transcribe_video_or_url(url)
        
        # Summarize the transcription
        summary_sections = summarize_video()
        
        return jsonify({
            "summary_sections": summary_sections, 
            "video_id": video_id
        })
    except Exception as e:
        return jsonify({"error": f"Error summarizing video: {str(e)}"}), 500

@app.route('/api/analyze-comments', methods=['POST'])
def analyze_comments_api():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "Please enter a YouTube URL"}), 400
    
    video_id = get_vid(url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400
    
    try:
        # Get comments
        comments = get_comments(video_id, API_KEY)
        if not comments:
            return jsonify({"error": "No comments found for this video"}), 404
        
        # Analyze comments
        sentiment_data = analyze_all_comments(comments)
        
        # Calculate summary statistics
        total_comments = sum(len(sentiment_data[sentiment]) for sentiment in sentiment_data)
        summary = {}
        for sentiment in sentiment_data:
            count = len(sentiment_data[sentiment])
            percent = round((count / total_comments) * 100) if total_comments > 0 else 0
            summary[sentiment] = {
                "count": count,
                "percent": percent
            }
        
        return jsonify({
            "summary": summary,
            "comments": sentiment_data,
            "video_id": video_id
        })
    except Exception as e:
        return jsonify({"error": f"Error analyzing comments: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)  # Changed port from 5000 to 5001




