from urllib.parse import urlparse, parse_qs
import json
import random
import re
import tempfile
import http.cookiejar
from pathlib import Path
import html
import xml.etree.ElementTree as ET
from transformers import pipeline

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    CouldNotRetrieveTranscript,
    TranscriptsDisabled,
    VideoUnavailable,
)
import fitz
import requests

import os

# Some Windows setups leave broken proxy environment variables behind.
# Clear obviously invalid localhost proxy settings so outbound requests
# for Hugging Face, YouTube transcripts, and yt-dlp use the normal network.
for proxy_key in ("HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "http_proxy", "https_proxy", "all_proxy"):
    proxy_value = os.environ.get(proxy_key, "")
    if proxy_value.startswith("http://127.0.0.1:9") or proxy_value.startswith("https://127.0.0.1:9"):
        os.environ.pop(proxy_key, None)

summarizer = None
transcriber = None
question_generator = None


BASE_DIR = Path(__file__).resolve().parent

# In development: Vite dev server runs on :8080 and proxies API to Flask :5000
# In production: `npm run build` outputs to frontend-react/dist, served by Flask
FRONTEND_REACT_DIST = BASE_DIR.parent / 'frontend-react' / 'dist'
FRONTEND_HTML = BASE_DIR.parent / 'frontend'  # legacy plain HTML fallback

if FRONTEND_REACT_DIST.exists():
    SERVE_DIR = FRONTEND_REACT_DIST
else:
    SERVE_DIR = FRONTEND_HTML

app = Flask(__name__, template_folder=str(SERVE_DIR), static_folder=str(SERVE_DIR), static_url_path='/')


def get_summarizer():
    global summarizer
    if summarizer is None:
        summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
    return summarizer


def get_transcriber():
    global transcriber
    if transcriber is None:
        from faster_whisper import WhisperModel
        transcriber = WhisperModel("base", device="cpu", compute_type="int8")
    return transcriber

def get_question_generator():
    global question_generator
    if question_generator is None:
        question_generator = pipeline("text2text-generation", model="google/flan-t5-base")
    return question_generator

def chunk_text(text, max_words=350):
    words = text.split()
    for i in range(0, len(words), max_words):
        yield " ".join(words[i:i+max_words])

def normalize_text(text):
    return re.sub(r"\s+", " ", (text or "")).strip()


def short_summary(text, max_sentences=2, max_words=70):
    cleaned = normalize_text(text)
    if not cleaned:
        return ""

    sentences = split_into_sentences(cleaned)
    if sentences:
        candidate = " ".join(sentences[:max_sentences]).strip()
    else:
        candidate = cleaned

    words = candidate.split()
    if len(words) > max_words:
        return " ".join(words[:max_words]).rstrip(".,;:") + "..."
    return candidate


def summarize_chunk(chunk, default_max_length=160):
    cleaned = normalize_text(chunk)
    if not cleaned:
        return ""

    word_count = len(cleaned.split())
    if word_count <= 90:
        return short_summary(cleaned)

    model = get_summarizer()
    approx_tokens = max(32, min(420, int(word_count * 1.3)))
    max_length = max(40, min(default_max_length, approx_tokens // 2))
    min_length = max(18, min(max_length - 8, max_length // 2))

    summary = model(
        cleaned,
        max_length=max_length,
        min_length=min_length,
        do_sample=False,
        truncation=True
    )
    return normalize_text(summary[0]["summary_text"])


def get_summary(text):
    cleaned = normalize_text(text)
    if not cleaned:
        return ""

    summaries = [summarize_chunk(chunk) for chunk in chunk_text(cleaned)]
    summaries = [summary for summary in summaries if summary]
    if not summaries:
        return ""

    if len(summaries) == 1:
        return summaries[0]

    combined = normalize_text(" ".join(summaries))
    return short_summary(combined, max_sentences=4, max_words=140)


def split_into_sentences(text):
    return [
        sentence.strip()
        for sentence in re.split(r'(?<=[.!?])\s+', text.strip())
        if sentence.strip()
    ]


def generate_quiz_questions(summary, question_count=10):
    sentences = split_into_sentences(summary)
    if not sentences:
        return []

    generator = get_question_generator()
    questions = []

    # Pass 1: Generate one question per sentence (deterministic)
    for sentence in sentences:
        if len(sentence.split()) < 5:
            continue
            
        prompt = f"Generate a quiz question based on this text:\n{sentence}\nQuestion:"
        try:
            output = generator(prompt, max_length=64, do_sample=False)
            question_text = output[0]['generated_text'].strip()
            
            if len(question_text) > 10 and "?" in question_text:
                if question_text not in questions:
                    questions.append(question_text)
        except Exception:
            continue

        if len(questions) >= question_count:
            break

    # Pass 2: If we still need more, loop over sentences again but use AI sampling to generate different questions
    if len(questions) < question_count and sentences:
        attempts = 0
        max_attempts = len(sentences) * 3
        while len(questions) < question_count and attempts < max_attempts:
            sentence = sentences[attempts % len(sentences)]
            attempts += 1
            
            if len(sentence.split()) < 5:
                continue
                
            prompt = f"Ask a unique and detailed question about this text:\n{sentence}\nQuestion:"
            try:
                output = generator(prompt, max_length=64, do_sample=True, temperature=0.9, top_p=0.9)
                question_text = output[0]['generated_text'].strip()
                
                if len(question_text) > 10 and "?" in question_text:
                    if question_text not in questions:
                        questions.append(question_text)
            except Exception:
                continue

    # Fallback: If the text is extremely short and AI fails to reach 10, add generic analytical questions
    if len(questions) < question_count:
        generic_questions = [
            "What is the primary theme or main idea of this summary?",
            "How does the author support their main point?",
            "What is the most surprising or important fact mentioned?",
            "Who do you think is the intended audience for this text?",
            "What lesson or insight can be taken from this text?",
            "What is the overall tone of the summary?",
            "How does the summary conclude or wrap up?",
            "What evidence or details are provided to support the claims?",
            "What might be the logical next step based on this text?",
            "How would you summarize the core message in one sentence?"
        ]
        for gq in generic_questions:
            if gq not in questions:
                questions.append(gq)
            if len(questions) >= question_count:
                break

    return questions[:question_count]


def extract_text_from_vtt(vtt_text):
    cleaned_lines = []
    for line in vtt_text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped == "WEBVTT":
            continue
        if "-->" in stripped:
            continue
        if stripped.isdigit():
            continue
        cleaned_lines.append(stripped)
    return " ".join(cleaned_lines)


def get_cookie_file():
    candidates = [
        BASE_DIR / "cookies.txt",
        BASE_DIR.parent / "cookies.txt",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def create_youtube_session():
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/134.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
        }
    )

    cookie_file = get_cookie_file()
    if cookie_file is not None:
        jar = http.cookiejar.MozillaCookieJar(str(cookie_file))
        jar.load(ignore_discard=True, ignore_expires=True)
        session.cookies.update(jar)

    return session


def extract_json_object(source_text, marker):
    marker_index = source_text.find(marker)
    if marker_index == -1:
        return None

    start_index = source_text.find("{", marker_index)
    if start_index == -1:
        return None

    depth = 0
    in_string = False
    escape = False

    for index in range(start_index, len(source_text)):
        char = source_text[index]

        if in_string:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return source_text[start_index:index + 1]

    return None


def choose_caption_track(caption_tracks):
    if not caption_tracks:
        return None

    def track_score(track):
        language = (track.get("languageCode") or "").lower()
        kind = (track.get("kind") or "").lower()
        score = 0
        if language.startswith("en"):
            score += 30
        if kind != "asr":
            score += 10
        if track.get("isTranslatable"):
            score += 2
        return score

    return sorted(caption_tracks, key=track_score, reverse=True)[0]


def transcript_text_from_json3(payload):
    lines = []
    for event in payload.get("events", []):
        segments = event.get("segs") or []
        text = "".join(segment.get("utf8", "") for segment in segments)
        cleaned = html.unescape(text.replace("\n", " ")).strip()
        if cleaned:
            lines.append(cleaned)
    return " ".join(lines)


def transcript_text_from_xml(payload):
    root = ET.fromstring(payload)
    lines = []
    for node in root.findall(".//text"):
        cleaned = html.unescape("".join(node.itertext()).replace("\n", " ")).strip()
        if cleaned:
            lines.append(cleaned)
    return " ".join(lines)


def fetch_transcript_from_watch_page(url):
    try:
        session = create_youtube_session()
        response = session.get(url, timeout=30)
        response.raise_for_status()

        page_text = response.text
        lowered = page_text.lower()
        if "confirm you're not a bot" in lowered or "confirm you’re not a bot" in lowered:
            return None

        player_payload = extract_json_object(page_text, "ytInitialPlayerResponse")
        if not player_payload:
            return None

        player_response = json.loads(player_payload)
        caption_tracks = (
            player_response.get("captions", {})
            .get("playerCaptionsTracklistRenderer", {})
            .get("captionTracks", [])
        )

        caption_track = choose_caption_track(caption_tracks)
        if not caption_track:
            return None

        transcript_url = caption_track.get("baseUrl")
        if not transcript_url:
            return None

        if "fmt=" not in transcript_url:
            transcript_url = f"{transcript_url}&fmt=json3"

        transcript_response = session.get(transcript_url, timeout=30)
        transcript_response.raise_for_status()

        content_type = transcript_response.headers.get("content-type", "")
        if "json" in content_type or transcript_response.text.lstrip().startswith("{"):
            return transcript_text_from_json3(transcript_response.json())

        return transcript_text_from_xml(transcript_response.text)
    except Exception:
        return None


def extract_pdf_text(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    page_text = [page.get_text("text") for page in doc]
    return normalize_text(" ".join(page_text))


class SilentYTDLPLogger:
    def debug(self, msg):
        pass
    def warning(self, msg):
        pass
    def error(self, msg):
        pass


def fetch_transcript_with_ytdlp(url):
    try:
        import yt_dlp
    except ImportError:
        return None

    cookie_file = get_cookie_file()
    if cookie_file is not None:
        browser_sources = [None]
    else:
        browser_sources = [None, ("chrome",), ("edge",), ("firefox",), ("brave",)]

    for browser_source in browser_sources:
        with tempfile.TemporaryDirectory() as temp_dir:
            output_template = str(Path(temp_dir) / "video.%(ext)s")
            options = {
                "skip_download": True,
                "writesubtitles": True,
                "writeautomaticsub": True,
                "subtitleslangs": ["all"],
                "subtitlesformat": "vtt",
                "outtmpl": output_template,
                "quiet": True,
                "no_warnings": True,
                "logger": SilentYTDLPLogger(),
            }

            if cookie_file is not None:
                options["cookiefile"] = str(cookie_file)

            if browser_source is not None:
                options["cookiesfrombrowser"] = browser_source

            try:
                with yt_dlp.YoutubeDL(options) as ydl:
                    ydl.download([url])
            except Exception:
                continue

            for subtitle_file in Path(temp_dir).glob("*.vtt"):
                transcript_text = extract_text_from_vtt(subtitle_file.read_text(encoding="utf-8", errors="ignore"))
                if transcript_text.strip():
                    return transcript_text

    return None


def download_audio_with_ytdlp(url, temp_dir):
    try:
        import yt_dlp
    except ImportError:
        return None

    cookie_file = get_cookie_file()
    if cookie_file is not None:
        browser_sources = [None]
    else:
        browser_sources = [None, ("chrome",), ("edge",), ("firefox",), ("brave",)]

    for browser_source in browser_sources:
        options = {
            "format": "bestaudio",
            "outtmpl": str(Path(temp_dir) / "audio.%(ext)s"),
            "quiet": True,
            "no_warnings": True,
            "logger": SilentYTDLPLogger(),
        }

        if cookie_file is not None:
            options["cookiefile"] = str(cookie_file)

        if browser_source is not None:
            options["cookiesfrombrowser"] = browser_source

        try:
            with yt_dlp.YoutubeDL(options) as ydl:
                info = ydl.extract_info(url, download=True)
                candidate_paths = []

                prepared_name = ydl.prepare_filename(info)
                if prepared_name:
                    candidate_paths.append(Path(prepared_name))

                for item in info.get("requested_downloads") or []:
                    filepath = item.get("filepath")
                    if filepath:
                        candidate_paths.append(Path(filepath))

                for path in candidate_paths:
                    if path.exists():
                        return path
        except Exception:
            continue

    return None


def transcribe_youtube_audio(url):
    with tempfile.TemporaryDirectory() as temp_dir:
        audio_path = download_audio_with_ytdlp(url, temp_dir)
        if not audio_path:
            return None

        model = get_transcriber()
        segments, _ = model.transcribe(str(audio_path), beam_size=1)
        transcript_text = " ".join(segment.text.strip() for segment in segments if segment.text.strip())
        return transcript_text or None


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """Serve the React app for all non-API routes (SPA fallback)."""
    # Let Flask serve static assets from the dist folder automatically.
    # For all other paths, return index.html so React Router handles routing.
    from flask import send_from_directory
    import os
    static_file = os.path.join(app.static_folder, path)
    if path and os.path.exists(static_file):
        return send_from_directory(app.static_folder, path)
    return render_template('index.html')


@app.route("/summarize/text", methods=["POST"])
def summarize_text():
    data = request.get_json()
    text = data["text"]

    summary = get_summary(text)

    return jsonify({"summary": summary})



@app.route("/summarize/pdf", methods=["POST"])
def summarize_pdf():
    file = request.files.get("file")
    if not file or not file.filename:
        return jsonify({"error": "Please upload a PDF file."}), 400

    try:
        file_bytes = file.read()
        if not file_bytes:
            return jsonify({"error": "The uploaded PDF is empty."}), 400

        text = extract_pdf_text(file_bytes)
    except Exception:
        return jsonify({"error": "Unable to read this PDF file."}), 400

    if not text:
        return jsonify({
            "error": "No readable text was found in this PDF. Try a text-based PDF instead of a scanned image."
        }), 400

    summary = get_summary(text)
    if not summary:
        return jsonify({"error": "Unable to generate a summary from this PDF."}), 400

    return jsonify({"summary": summary})


@app.route("/summarize/youtube", methods=["POST"])
def summarize_youtube():
    try:
        data = request.get_json() or {}
        url = (data.get("url") or "").strip()
        if not url:
            return jsonify({
                "error": "Please enter a YouTube URL."
            }), 400

        # Extract video ID
        parsed_url = urlparse(url)
        if "youtube.com" in parsed_url.netloc:
            video_id = parse_qs(parsed_url.query).get("v", [None])[0]
        elif "youtu.be" in parsed_url.netloc:
            video_id = parsed_url.path.lstrip("/")
        else:
            return jsonify({"error": "Invalid YouTube URL"}), 400

        if not video_id:
            return jsonify({"error": "Could not detect the YouTube video ID from the URL"}), 400

        try:
            session = create_youtube_session()
            transcript = YouTubeTranscriptApi(http_client=session).fetch(video_id)
            text = " ".join([t.text for t in transcript])
        except (CouldNotRetrieveTranscript, TranscriptsDisabled, VideoUnavailable) as exc:
            direct_page_text = fetch_transcript_from_watch_page(url)
            if direct_page_text:
                text = direct_page_text
            else:
                ytdlp_text = fetch_transcript_with_ytdlp(url)
                if ytdlp_text:
                    text = ytdlp_text
                else:
                    audio_transcript = transcribe_youtube_audio(url)
                    if audio_transcript:
                        text = audio_transcript
                    else:
                        return jsonify({
                            "error": (
                                "Automatic transcript fetch failed. YouTube blocked captions and the "
                                "audio transcription fallback could not complete for this video."
                            ),
                            "details": str(exc)
                        }), 502

        # Chunk text safely for long videos
        def chunk_text(text, max_words=200):
            words = text.split()
            for i in range(0, len(words), max_words):
                yield " ".join(words[i:i+max_words])

        # Summarize each chunk
        summaries = []
        for chunk in chunk_text(text):
            summary = summarize_chunk(chunk, default_max_length=120)
            if summary:
                summaries.append(summary)

        # Combine all summaries into one
        final_summary = normalize_text(" ".join(summaries))

        return jsonify({"summary": final_summary})

    except Exception as e:
        error_msg = str(e)
        if "NameResolutionError" in error_msg or "Failed to resolve" in error_msg:
            return jsonify({
                "error": "Hugging Face Spaces restricts connections to YouTube. Please run the app locally or use a premium hosting plan to use this feature."
            }), 502
        return jsonify({"error": error_msg}), 500


@app.route('/summarize/video', methods=['POST'])
def summarize_video():
    video_file = request.files.get('file')
    if not video_file:
        return jsonify({"error": "No video uploaded"})

    # Demo summary – replace with your AI/video processing later
    summary = "This is a demo summary of your video."

    return jsonify({"summary": summary})


@app.route("/quiz/generate", methods=["POST"])
def generate_quiz():
    data = request.get_json() or {}
    summary = (data.get("summary") or "").strip()

    if not summary:
        return jsonify({"error": "Summary text is required"}), 400

    questions = generate_quiz_questions(summary, question_count=10)

    if not questions:
        return jsonify({"error": "Unable to generate quiz questions"}), 400

    return jsonify({"questions": questions})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
