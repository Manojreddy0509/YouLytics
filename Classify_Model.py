import torch
from transformers import BertTokenizer, BertForSequenceClassification
from transformers import RobertaTokenizer, RobertaForSequenceClassification
from torch.nn.functional import softmax
import re

# Load BERT model
bert_tokenizer = BertTokenizer.from_pretrained("nlptown/bert-base-multilingual-uncased-sentiment")
bert_model = BertForSequenceClassification.from_pretrained("nlptown/bert-base-multilingual-uncased-sentiment")
bert_model.eval()

# Load RoBERTa model
roberta_tokenizer = RobertaTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment")
roberta_model = RobertaForSequenceClassification.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment")
roberta_model.eval()

# Preprocess a single comment
def preprocess(text):
    return text.strip().replace("\n", " ")

# Clean all comments (remove empty and duplicates)
def clean_comments(comments):
    seen = set()
    cleaned = []
    for comment in comments:
        if not comment:
            continue
        text = preprocess(comment)
        if text and text not in seen:
            cleaned.append(text)
            seen.add(text)
    return cleaned

# Ensemble sentiment analyzer
def analyze_sentiment(text):
    # BERT prediction (5-star model)
    inputs_bert = bert_tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs_bert = bert_model(**inputs_bert)
        probs_bert = softmax(outputs_bert.logits, dim=-1)[0]

    # Convert 5-star to 3-class
    star_index = torch.argmax(probs_bert).item()
    if star_index <= 1:
        bert_label = [1, 0, 0]  # Negative
    elif star_index == 2:
        bert_label = [0, 1, 0]  # Neutral
    else:
        bert_label = [0, 0, 1]  # Positive

    # RoBERTa prediction (3-class)
    inputs_roberta = roberta_tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs_roberta = roberta_model(**inputs_roberta)
        probs_roberta = softmax(outputs_roberta.logits, dim=-1)[0]
    roberta_label = probs_roberta.tolist()

    # Average both models
    final_probs = [(b + r) / 2 for b, r in zip(bert_label, roberta_label)]
    sentiment_classes = ["Negative", "Neutral", "Positive"]
    max_idx = final_probs.index(max(final_probs))
    return sentiment_classes[max_idx], round(final_probs[max_idx] * 100, 2)

# Classify all comments
def classify_sentiment(comments):
    results = []
    cleaned = clean_comments(comments)
    
    for comment in cleaned:
        sentiment, confidence = analyze_sentiment(comment)
        results.append({
            "comment": comment,
            "sentiment": sentiment,
            "confidence": confidence
        })
    
    return results

# Optional: group comments by sentiment
def analyze_all_comments(comments):
    sentiment_summary = {"Positive": [], "Neutral": [], "Negative": []}
    results = classify_sentiment(comments)
    
    for item in results:
        sentiment_summary[item["sentiment"]].append({
            "comment": item["comment"],
            "confidence": item["confidence"]
        })
    
    return sentiment_summary



