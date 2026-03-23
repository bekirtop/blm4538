import os
import json
import datetime
import google.generativeai as genai

# --- CONFIGURATION ---
# 1. 'pip install google-generativeai' komutu ile kütüphaneyi yükleyin.
# 2. API anahtarınızı aşağıdaki değişkene veya ortam değişkenine (GEMINI_API_KEY) ekleyin.

API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY_HERE")
genai.configure(api_key=API_KEY)

# --- GEMINI CLIENT ---

def get_gemini_json_response(prompt, system_instruction):
    """
    Gemini API'sini kullanarak JSON formatında yanıt alır.
    """
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=system_instruction
    )
    
    # JSON modunu zorlamak için response_mime_type kullanıyoruz (destekleyen modellerde)
    generation_config = {
        "response_mime_type": "application/json",
    }
    
    response = model.generate_content(prompt, generation_config=generation_config)
    
    try:
        return json.loads(response.text)
    except Exception as e:
        print(f"JSON Ayrıştırma Hatası: {e}")
        print(f"Ham Yanıt: {response.text}")
        return None

# --- GENERATION FUNCTIONS ---

def generate_words(topic, count=10):
    print(f"'{topic}' konusu için {count} kelime üretiliyor...")
    
    system_instruction = (
        "Sen bir İngilizce öğretmeni yardımcısısın. Çıktıyı SADECE JSON formatında ver. "
        "JSON yapısı şu şekilde olmalı: "
        "{ 'words': [ { 'word': '...', 'turkish': '...', 'difficulty': 1-10, 'example': '...' } ] }"
    )
    
    prompt = f"Lütfen '{topic}' ile ilgili en yaygın {count} İngilizce kelimeyi üret. Her kelime için Türkçe karşılığını, zorluk derecesini ve örnek bir cümle ekle."
    
    data = get_gemini_json_response(prompt, system_instruction)
    
    if data:
        # Mevcut 'merged.json' yapısına giydirme
        result = {
            "total_words": len(data.get("words", [])),
            "sources": ["Gemini-Generated"],
            "stats": {
                "unique_word_count": len(data.get("words", [])),
                "difficulty_scale": "1-10"
            },
            "words": data.get("words", [])
        }
        return result
    return None

def generate_grammar(topic):
    print(f"'{topic}' gramer konusu için anlatım üretiliyor...")
    
    system_instruction = (
        "Sen bir İngilizce gramer uzmanısın. Çıktıyı SADECE JSON formatında ver. "
        "JSON yapısı şu şekilde olmalı: "
        "{ 'topics': [ { 'id': '...', 'title': '...', 'level': '...', 'explanation': '...', 'rules': [], 'examples': [{ 'en': '...', 'tr': '...' }] } ] }"
    )
    
    prompt = f"Lütfen '{topic}' gramer konusunu detaylıca anlat. Türkçe açıklamalar, kurallar ve en az 5 örnek cümle içersin."
    
    data = get_gemini_json_response(prompt, system_instruction)
    
    if data:
        result = {
            "total_topics": len(data.get("topics", [])),
            "last_updated": str(datetime.date.today()),
            "topics": data.get("topics", [])
        }
        return result
    return None

# --- MAIN ---

if __name__ == "__main__":
    if API_KEY == "YOUR_API_KEY_HERE":
        print("HATA: Lütfen 'generate_with_gemini.py' içindeki API_KEY değişkenini güncelleyin veya GEMINI_API_KEY ortam değişkenini ayarlayın.")
    else:
        # Kelime Üretimi
        words_data = generate_words("Science and Technology", count=5)
        if words_data:
            with open("gemini_words.json", "w", encoding="utf-8") as f:
                json.dump(words_data, f, ensure_ascii=False, indent=2)
            print("✓ gemini_words.json oluşturuldu.")

        # Gramer Üretimi
        grammar_data = generate_grammar("Causative Verbs")
        if grammar_data:
            with open("gemini_grammar.json", "w", encoding="utf-8") as f:
                json.dump(grammar_data, f, ensure_ascii=False, indent=2)
            print("✓ gemini_grammar.json oluşturuldu.")
