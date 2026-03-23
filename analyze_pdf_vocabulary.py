import os
import re
import json
import collections
import PyPDF2
import google.generativeai as genai


API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY_HERE")
genai.configure(api_key=API_KEY)

# --- PDF TEXT EXTRACTION ---

def extract_text_from_pdf(pdf_path):
    """
    PDF dosyasından metin çıkarır.
    """
    text = ""
    try:
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print(f"PDF Okuma Hatası: {e}")
    return text

# --- VOCABULARY ANALYSIS ---

def analyze_vocabulary(text, top_n=20):
    """
    Metindeki kelimeleri analiz eder, en sık geçen İngilizce kelimeleri bulur.
    Basit bir filtreleme (alfabetik olmayanları ve çok kısa olanları çıkarır) uygular.
    """
    # Sadece harf içeren kelimeleri bul (küçük harfe çevir)
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    
    # Yaygın İngilizce durdurma kelimeleri (stop words) - Basit bir liste
    stop_words = {
        "the", "and", "for", "that", "with", "this", "from", "they", "will", "have",
        "was", "are", "not", "but", "what", "all", "there", "their", "when", "can",
        "which", "also", "about", "your", "has", "had", "been", "were", "into"
    }
    
    filtered_words = [w for w in words if w not in stop_words]
    
    # En sık geçen kelimeleri say
    word_counts = collections.Counter(filtered_words)
    return [word for word, count in word_counts.most_common(top_n)]

# --- GEMINI INTEGRATION ---

def generate_vocabulary_json(word_list):
    """
    Analiz edilen kelimeleri Gemini'ye gönderir ve yapılandırılmış JSON alır.
    """
    if not word_list:
        return None
    
    print(f"Gemini ile {len(word_list)} kelime için veri üretiliyor...")
    
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash", # En son ve hızlı model
        system_instruction=(
            "Sen bir İngilizce dil uzmanısın. Sana verilen kelime listesi için "
            "SADECE JSON formatında bir kelime bankası oluştur. "
            "Her kelime için: Türkçe karşılığı, zorluk derecesi (1-10) ve örnek bir İngilizce cümle ekle. "
            "JSON yapısı: { 'words': [ { 'word': '...', 'turkish': '...', 'difficulty': 1, 'example': '...' } ] }"
        )
    )
    
    prompt = f"Şu kelimeler için veritabanı oluştur: {', '.join(word_list)}"
    
    try:
        response = model.generate_content(
            prompt, 
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        
        # Proje formatına uygun hale getirme
        return {
            "total_words": len(data.get("words", [])),
            "source": "PDF Analysis",
            "words": data.get("words", [])
        }
    except Exception as e:
        print(f"Gemini Hatası: {e}")
        return None

# --- MAIN ---

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Kullanım: python3 analyze_pdf_vocabulary.py <pdf_dosya_yolu>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(f"Hata: {pdf_path} dosyası bulunamadı.")
        sys.exit(1)
    
    print(f"PDF işleniyor: {pdf_path}...")
    pdf_text = extract_text_from_pdf(pdf_path)
    
    if pdf_text:
        print("Kelimeler analiz ediliyor...")
        vocabulary = analyze_vocabulary(pdf_text, top_n=15)
        print(f"Analiz edilen kelimeler: {', '.join(vocabulary)}")
        
        if API_KEY == "YOUR_API_KEY_HERE":
            print("\nUYARI: API_KEY ayarlanmamış. Gemini'ye istek gönderilmedi.")
        else:
            final_data = generate_vocabulary_json(vocabulary)
            
            if final_data:
                output_file = "pdf_vocabulary.json"
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(final_data, f, ensure_ascii=False, indent=2)
                print(f"\n✓ Başarıyla oluşturuldu: {output_file}")
    else:
        print("Hata: PDF'den metin ayıklanamadı.")

