"""
Quiz soru üreteci — OpenAI ChatGPT API

Kullanım:
  python generate_quiz_with_chatgpt.py

Çıktı:
  quiz_questions.json  →  id, topic, question, options, correctAnswer
"""

import os
import json
from pathlib import Path
from openai import OpenAI

# .env dosyasından API anahtarlarını oku
_env_path = Path(__file__).parent / ".env"
if _env_path.exists():
    for _line in _env_path.read_text().splitlines():
        if "=" in _line and not _line.strip().startswith("#"):
            _k, _, _v = _line.partition("=")
            os.environ.setdefault(_k.strip(), _v.strip())

# ── CONFIGURATION ────────────────────────────────────────────────────────────
API_KEY = os.environ.get("OPENAI_API_KEY", "YOUR_API_KEY_HERE")
MODEL   = "gpt-4o-mini"   # Daha ucuz; kaliteli sonuç için "gpt-4o" kullanın
QUESTIONS_PER_TOPIC = 10   # Her konu için kaç soru üretilsin

TOPICS = [
    {
        "key": "tenses",
        "title": "Tenses",
        "description": "English verb tenses: simple present, present continuous, simple past, past continuous, present perfect, past perfect, future simple, future continuous, future perfect"
    },
    {
        "key": "articles",
        "title": "Articles",
        "description": "English articles: a, an, the, and zero article (no article)"
    },
    {
        "key": "prepositions",
        "title": "Prepositions",
        "description": "English prepositions of time (in/on/at/since/for), place (in/on/at/under/over/between), and movement (to/from/into/through)"
    },
    {
        "key": "modals",
        "title": "Modals",
        "description": "English modal verbs: can, could, may, might, must, mustn't, should, shouldn't, will, would, need to, have to"
    },
    {
        "key": "conditionals",
        "title": "Conditionals",
        "description": "English conditional sentences: zero conditional, first conditional, second conditional, third conditional, mixed conditionals"
    },
    {
        "key": "passive",
        "title": "Passive Voice",
        "description": "English passive voice in different tenses: simple present passive, simple past passive, present perfect passive, future passive, continuous passive"
    },
    {
        "key": "relative",
        "title": "Relative Clauses",
        "description": "English relative clauses using: who, whom, whose, which, that, where, when, why"
    },
]
# ─────────────────────────────────────────────────────────────────────────────


def build_prompt(topic: dict, count: int) -> str:
    return f"""You are an English grammar expert creating multiple-choice quiz questions for Turkish learners of English.

Topic: {topic['title']}
Topic description: {topic['description']}

Generate exactly {count} multiple-choice questions. Each question must:
- Be a fill-in-the-blank sentence with a single blank (___)
- Have exactly 4 options labeled A, B, C, D
- Have exactly one correct answer
- Test a distinct grammar point within the topic (avoid duplicating the same grammar sub-point)
- Be at B1–B2 difficulty level
- Be clear and unambiguous

Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
[
  {{
    "question": "She ___ to school every day.",
    "options": [
      {{"id": "A", "text": "go"}},
      {{"id": "B", "text": "goes"}},
      {{"id": "C", "text": "going"}},
      {{"id": "D", "text": "gone"}}
    ],
    "correctAnswer": "B"
  }}
]"""


def generate_questions_for_topic(client: OpenAI, topic: dict, count: int) -> list:
    print(f"  Generating {count} questions for '{topic['title']}'...")
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a precise JSON-only API. Return only valid JSON, no markdown."},
            {"role": "user",   "content": build_prompt(topic, count)},
        ],
        temperature=0.7,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content.strip()

    # API bazen {"questions": [...]} ya da düz array döndürebilir
    parsed = json.loads(raw)
    if isinstance(parsed, list):
        questions = parsed
    elif isinstance(parsed, dict):
        # Herhangi bir liste değeri içeren ilk anahtarı bul
        for v in parsed.values():
            if isinstance(v, list):
                questions = v
                break
        else:
            raise ValueError(f"Unexpected JSON shape for topic '{topic['key']}': {list(parsed.keys())}")
    else:
        raise ValueError(f"Unexpected JSON type: {type(parsed)}")

    return questions


def assign_ids(all_questions: list) -> list:
    for i, q in enumerate(all_questions, start=1):
        q["id"] = i
    return all_questions


def validate_question(q: dict, topic_key: str) -> bool:
    required = {"question", "options", "correctAnswer"}
    if not required.issubset(q.keys()):
        return False
    if not isinstance(q["options"], list) or len(q["options"]) != 4:
        return False
    ids = {o.get("id") for o in q["options"]}
    if ids != {"A", "B", "C", "D"}:
        return False
    if q["correctAnswer"] not in ids:
        return False
    return True


def main():
    if API_KEY == "YOUR_API_KEY_HERE":
        print("HATA: OPENAI_API_KEY ortam değişkenini ayarlayın veya API_KEY sabitini güncelleyin.")
        return

    client = OpenAI(api_key=API_KEY)
    all_questions = []

    for topic in TOPICS:
        try:
            raw_qs = generate_questions_for_topic(client, topic, QUESTIONS_PER_TOPIC)
            valid = []
            for q in raw_qs:
                if validate_question(q, topic["key"]):
                    q["topic"] = topic["key"]
                    valid.append(q)
                else:
                    print(f"    [!] Skipped invalid question: {q.get('question', '')[:60]}")
            print(f"  -> {len(valid)} valid questions saved for '{topic['title']}'")
            all_questions.extend(valid)
        except Exception as e:
            print(f"  [ERROR] '{topic['title']}': {e}")

    all_questions = assign_ids(all_questions)

    json_path = Path(__file__).parent / "quiz_questions.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)
    print(f"\n✓ {json_path} oluşturuldu ({len(all_questions)} soru)")
    print("Tamamlandı!")


if __name__ == "__main__":
    main()
