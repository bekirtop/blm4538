import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo, useRef, useEffect } from 'react';
import Data from '../../constants/merged.json';

type GameMode = 'en-tr' | 'tr-en';
type Difficulty = 'easy' | 'medium' | 'hard';
type GamePhase = 'setup' | 'playing' | 'result';

interface QuizQuestion {
  word: string;
  correctAnswer: string;
  options: string[];
}

const difficultyRanges: Record<Difficulty, { min: number; max: number; label: string; color: string; icon: string }> = {
  easy: { min: 1, max: 3, label: 'Kolay', color: '#10B981', icon: 'leaf' },
  medium: { min: 4, max: 8, label: 'Orta', color: '#F59E0B', icon: 'flame' },
  hard: { min: 9, max: 20, label: 'Zor', color: '#EF4444', icon: 'skull' },
};

const questionCounts = [10, 20, 30];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(mode: GameMode, difficulty: Difficulty, count: number): QuizQuestion[] {
  const range = difficultyRanges[difficulty];
  const pool = Data.words.filter(
    w => w.new_difficulty >= range.min && w.new_difficulty <= range.max && w.turkish && w.word
  );

  if (pool.length < 4) return [];

  const selected = shuffleArray(pool).slice(0, count);

  return selected.map(item => {
    const correctAnswer = mode === 'en-tr' ? item.turkish : item.word;
    const questionWord = mode === 'en-tr' ? item.word : item.turkish;

    // Pick 3 distractors from the same pool
    const distractors: string[] = [];
    const otherWords = shuffleArray(pool.filter(w => w.word !== item.word));
    for (const w of otherWords) {
      const val = mode === 'en-tr' ? w.turkish : w.word;
      if (val !== correctAnswer && !distractors.includes(val)) {
        distractors.push(val);
      }
      if (distractors.length === 3) break;
    }

    const options = shuffleArray([correctAnswer, ...distractors]);

    return { word: questionWord, correctAnswer, options };
  });
}

export default function WordGameScreen() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [mode, setMode] = useState<GameMode>('en-tr');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [score, setScore] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [phase]);

  const startGame = () => {
    const q = generateQuestions(mode, difficulty, questionCount);
    if (q.length === 0) return;
    setQuestions(q);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setHasChecked(false);
    fadeAnim.setValue(0);
    setPhase('playing');
  };

  const handleCheck = () => {
    if (!hasChecked) {
      setHasChecked(true);
      if (selectedOption === questions[currentIndex].correctAnswer) {
        setScore(s => s + 1);
      }
    } else {
      if (currentIndex === questions.length - 1) {
        fadeAnim.setValue(0);
        setPhase('result');
      } else {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
        setHasChecked(false);
      }
    }
  };

  const getOptionStyle = (opt: string) => {
    if (!hasChecked) return selectedOption === opt ? styles.optSelected : {};
    if (opt === questions[currentIndex].correctAnswer) return styles.optCorrect;
    if (selectedOption === opt) return styles.optIncorrect;
    return {};
  };

  const getOptTextStyle = (opt: string) => {
    if (!hasChecked) return selectedOption === opt ? { color: '#fff' } : {};
    if (opt === questions[currentIndex].correctAnswer) return { color: '#fff' };
    if (selectedOption === opt) return { color: '#fff' };
    return {};
  };

  // ── SETUP SCREEN ──
  if (phase === 'setup') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.headerTitle}>Kelime Oyunu 🎯</Text>
          <Text style={styles.sectionSubtitle}>Kelime bilgini test et!</Text>

          {/* Mode Selection */}
          <Text style={styles.sectionTitle}>Mod Seçimi</Text>
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeCard, mode === 'en-tr' && styles.modeCardActive]}
              onPress={() => setMode('en-tr')}
            >
              <Ionicons name="language" size={28} color={mode === 'en-tr' ? '#fff' : '#2EBC9D'} />
              <Text style={[styles.modeLabel, mode === 'en-tr' && styles.modeLabelActive]}>EN → TR</Text>
              <Text style={[styles.modeDesc, mode === 'en-tr' && styles.modeDescActive]}>İngilizce → Türkçe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeCard, mode === 'tr-en' && styles.modeCardActive]}
              onPress={() => setMode('tr-en')}
            >
              <Ionicons name="swap-horizontal" size={28} color={mode === 'tr-en' ? '#fff' : '#2EBC9D'} />
              <Text style={[styles.modeLabel, mode === 'tr-en' && styles.modeLabelActive]}>TR → EN</Text>
              <Text style={[styles.modeDesc, mode === 'tr-en' && styles.modeDescActive]}>Türkçe → İngilizce</Text>
            </TouchableOpacity>
          </View>

          {/* Difficulty Selection */}
          <Text style={styles.sectionTitle}>Zorluk Seviyesi</Text>
          <View style={styles.diffRow}>
            {(Object.keys(difficultyRanges) as Difficulty[]).map(d => {
              const info = difficultyRanges[d];
              const active = difficulty === d;
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.diffCard, active && { backgroundColor: info.color, borderColor: info.color }]}
                  onPress={() => setDifficulty(d)}
                >
                  <Ionicons name={info.icon as any} size={22} color={active ? '#fff' : info.color} />
                  <Text style={[styles.diffLabel, active && { color: '#fff' }]}>{info.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Question Count */}
          <Text style={styles.sectionTitle}>Soru Sayısı</Text>
          <View style={styles.countRow}>
            {questionCounts.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.countPill, questionCount === c && styles.countPillActive]}
                onPress={() => setQuestionCount(c)}
              >
                <Text style={[styles.countText, questionCount === c && styles.countTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Start Button */}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Ionicons name="play" size={22} color="#fff" />
            <Text style={styles.startButtonText}>Başla</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── RESULT SCREEN ──
  if (phase === 'result') {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
    return (
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>  
          <Text style={styles.resultEmoji}>{emoji}</Text>
          <Text style={styles.resultTitle}>Quiz Bitti!</Text>
          <View style={styles.resultScoreCard}>
            <Text style={styles.resultScoreLabel}>Skorun</Text>
            <Text style={styles.resultScoreValue}>{score} / {questions.length}</Text>
            <View style={styles.resultBar}>
              <View style={[styles.resultBarFill, { width: `${pct}%`, backgroundColor: pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444' }]} />
            </View>
            <Text style={styles.resultPct}>%{pct}</Text>
          </View>
          <View style={styles.resultButtonRow}>
            <TouchableOpacity style={styles.resultBtnOutline} onPress={() => { fadeAnim.setValue(0); setPhase('setup'); }}>
              <Ionicons name="settings-outline" size={20} color="#2EBC9D" />
              <Text style={styles.resultBtnOutlineText}>Ayarlar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultBtnFill} onPress={startGame}>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.resultBtnFillText}>Tekrar Oyna</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── PLAYING SCREEN ──
  const current = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.playContainer}>
        {/* Top Bar */}
        <View style={styles.playHeader}>
          <TouchableOpacity onPress={() => setPhase('setup')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.scoreBadge}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.scoreText}>{score}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Soru {currentIndex + 1}/{questions.length}</Text>
            <Text style={styles.progressPct}>%{progress}</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Mode Badge */}
        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>{mode === 'en-tr' ? '🇬🇧 → 🇹🇷' : '🇹🇷 → 🇬🇧'}</Text>
        </View>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>{mode === 'en-tr' ? 'Bu kelimenin Türkçesi nedir?' : 'Bu kelimenin İngilizcesi nedir?'}</Text>
          <Text style={styles.questionWord}>{current.word}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {current.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.optionBtn, getOptionStyle(opt)]}
              onPress={() => !hasChecked && setSelectedOption(opt)}
              activeOpacity={hasChecked ? 1 : 0.7}
            >
              <View style={[styles.optLetter, hasChecked && opt === current.correctAnswer && { backgroundColor: '#10B981' }, hasChecked && selectedOption === opt && opt !== current.correctAnswer && { backgroundColor: '#EF4444' }, !hasChecked && selectedOption === opt && { backgroundColor: '#2EBC9D' }]}>
                <Text style={[styles.optLetterText, (selectedOption === opt || (hasChecked && opt === current.correctAnswer)) && { color: '#fff' }]}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={[styles.optText, getOptTextStyle(opt)]} numberOfLines={2}>{opt}</Text>
              {hasChecked && opt === current.correctAnswer && (
                <Ionicons name="checkmark-circle" size={24} color="#fff" style={{ marginLeft: 'auto' }} />
              )}
              {hasChecked && selectedOption === opt && opt !== current.correctAnswer && (
                <Ionicons name="close-circle" size={24} color="#fff" style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        {/* Check / Next Button */}
        <TouchableOpacity
          style={[styles.checkBtn, selectedOption ? styles.checkBtnActive : styles.checkBtnInactive]}
          disabled={!selectedOption}
          onPress={handleCheck}
        >
          <Text style={[styles.checkBtnText, selectedOption ? { color: '#fff' } : { color: '#94A3B8' }]}>
            {hasChecked ? (currentIndex === questions.length - 1 ? 'Sonuçları Gör' : 'Sonraki Soru') : 'Kontrol Et'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1E293B', marginTop: 20 },
  sectionSubtitle: { fontSize: 15, color: '#94A3B8', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12, marginTop: 8 },

  // Mode
  modeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  modeCard: { flex: 1, backgroundColor: '#F0FDF8', borderWidth: 2, borderColor: '#D1FAE5', borderRadius: 16, padding: 16, alignItems: 'center', gap: 6 },
  modeCardActive: { backgroundColor: '#2EBC9D', borderColor: '#2EBC9D' },
  modeLabel: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  modeLabelActive: { color: '#fff' },
  modeDesc: { fontSize: 12, color: '#64748B' },
  modeDescActive: { color: '#D1FAE5' },

  // Difficulty
  diffRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  diffCard: { flex: 1, borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 14, paddingVertical: 14, alignItems: 'center', gap: 4 },
  diffLabel: { fontSize: 14, fontWeight: '700', color: '#1E293B' },

  // Count
  countRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  countPill: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  countPillActive: { backgroundColor: '#2EBC9D' },
  countText: { fontSize: 18, fontWeight: 'bold', color: '#64748B' },
  countTextActive: { color: '#fff' },

  // Start
  startButton: { backgroundColor: '#1E293B', borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // ── Playing ──
  playContainer: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
  playHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 10 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  scoreText: { color: '#D97706', fontWeight: 'bold', fontSize: 14 },

  progressSection: { marginBottom: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  progressPct: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  progressBg: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#2EBC9D', borderRadius: 3 },

  modeBadge: { alignSelf: 'center', backgroundColor: '#F0F9FF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  modeBadgeText: { fontSize: 16, fontWeight: '600', color: '#0284C7' },

  questionCard: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 20 },
  questionLabel: { fontSize: 13, color: '#94A3B8', marginBottom: 8 },
  questionWord: { fontSize: 26, fontWeight: 'bold', color: '#1E293B', textAlign: 'center' },

  optionsContainer: { gap: 10 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, backgroundColor: '#fff' },
  optSelected: { borderColor: '#2EBC9D', backgroundColor: '#2EBC9D' },
  optCorrect: { borderColor: '#10B981', backgroundColor: '#10B981' },
  optIncorrect: { borderColor: '#EF4444', backgroundColor: '#EF4444' },
  optLetter: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  optLetterText: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  optText: { fontSize: 15, color: '#1E293B', fontWeight: '500', flex: 1 },

  checkBtn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 20 },
  checkBtnInactive: { backgroundColor: '#E2E8F0' },
  checkBtnActive: { backgroundColor: '#2EBC9D' },
  checkBtnText: { fontSize: 16, fontWeight: 'bold' },

  // ── Result ──
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  resultEmoji: { fontSize: 64, marginBottom: 12 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', color: '#1E293B', marginBottom: 24 },
  resultScoreCard: { width: '100%', backgroundColor: '#F8FAFC', borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 28, borderWidth: 1, borderColor: '#E2E8F0' },
  resultScoreLabel: { fontSize: 14, color: '#94A3B8', marginBottom: 4 },
  resultScoreValue: { fontSize: 36, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  resultBar: { width: '100%', height: 10, backgroundColor: '#E2E8F0', borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  resultBarFill: { height: '100%', borderRadius: 5 },
  resultPct: { fontSize: 16, fontWeight: '700', color: '#64748B' },
  resultButtonRow: { flexDirection: 'row', gap: 12, width: '100%' },
  resultBtnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderColor: '#2EBC9D', borderRadius: 14, paddingVertical: 16 },
  resultBtnOutlineText: { fontSize: 15, fontWeight: 'bold', color: '#2EBC9D' },
  resultBtnFill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#2EBC9D', borderRadius: 14, paddingVertical: 16 },
  resultBtnFillText: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
});
