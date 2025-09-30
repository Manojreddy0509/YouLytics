# summarize.py
from transformers import pipeline
import os

TRANSCRIPTION_FILE = "transcription.txt"
SUMMARY_FILE = "summary.txt"

def chunk_text_by_words(text: str, chunk_size_words: int = 600):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size_words):
        chunks.append(" ".join(words[i:i+chunk_size_words]))
    return chunks

def get_summarizer(model_name: str = "facebook/bart-large-cnn"):
    """
    Load a more powerful summarization model for better quality and longer summaries.
    Falls back if unavailable.
    """
    try:
        return pipeline("summarization", model=model_name)
    except Exception:
        return pipeline("summarization")

def summarize_text(text: str, summarizer=None, max_length=300, min_length=110):
    """
    Summarize a single text chunk safely (aiming for at least 110 words).
    """
    if not text or not text.strip():
        return ""
    if summarizer is None:
        summarizer = get_summarizer()
    try:
        out = summarizer(
            text, 
            max_length=max_length, 
            min_length=min_length, 
            do_sample=False
        )
        return out[0].get("summary_text", "").strip()
    except Exception:
        # fallback: truncate text
        return (text[:600] + "...") if len(text) > 600 else text

def summarize_transcription_file(
    transcription_path: str = TRANSCRIPTION_FILE, 
    out_path: str = SUMMARY_FILE
):
    if not os.path.exists(transcription_path):
        raise FileNotFoundError(f"{transcription_path} not found. Run transcription first.")

    with open(transcription_path, "r", encoding="utf-8") as f:
        text = f.read().strip()

    if not text:
        raise ValueError("Transcription file is empty; nothing to summarize.")

    summarizer = get_summarizer()
    chunks = chunk_text_by_words(text, chunk_size_words=600)

    section_summaries = []
    for idx, chunk in enumerate(chunks, start=1):
        s = summarize_text(chunk, summarizer=summarizer, max_length=300, min_length=110)
        section_summaries.append(f"Section {idx} summary:\n{s}")

    combined = "\n\n".join(section_summaries)

    # Final longer summary
    final_summary = combined
    if len(combined.split()) > 400:
        final_summary = summarize_text(combined, summarizer=summarizer, max_length=400, min_length=150)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("=== SECTION SUMMARIES ===\n\n")
        for sec in section_summaries:
            f.write(sec + "\n\n")
        f.write("\n=== FINAL SUMMARY ===\n\n")
        f.write(final_summary)

    return {"sections": section_summaries, "final_summary": final_summary}




