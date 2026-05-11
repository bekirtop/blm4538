import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import Data from '../../constants/merged.json';
import { useMistakes } from '@/context/MistakesContext';
import { useProgress } from '@/context/ProgressContext';

type GameMode = 'en-tr' | 'tr-en' | 'scramble' | 'flashcard';
type Difficulty = 'easy' | 'medium' | 'hard';
type GamePhase = 'setup' | 'playing' | 'result';

interface QuizQuestion {
  word: string;
  correctAnswer: string;
  options: string[];
  example?: string;
  originalWord: string;
  originalTurkish: string;
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
    let correctAnswer = '';
    let questionWord = '';

    if (mode === 'en-tr' || mode === 'flashcard') {
      correctAnswer = item.turkish;
      questionWord = item.word;
    } else if (mode === 'tr-en') {
      correctAnswer = item.word;
      questionWord = item.turkish;
    } else if (mode === 'scramble') {
      correctAnswer = item.word; // User needs to type English
      questionWord = item.turkish; // Show Turkish
    }

    // Pick 3 distractors from the same pool for quiz modes
    const distractors: string[] = [];
    if (mode === 'en-tr' || mode === 'tr-en') {
      const otherWords = shuffleArray(pool.filter(w => w.word !== item.word));
      for (const w of otherWords) {
        const val = mode === 'en-tr' ? w.turkish : w.word;
        if (val !== correctAnswer && !distractors.includes(val)) {
          distractors.push(val);
        }
        if (distractors.length === 3) break;
      }
    }

    const options = shuffleArray([correctAnswer, ...distractors]);

    return { 
      word: questionWord, 
      correctAnswer, 
      options,
      example: item.example,
      originalWord: item.word,
      originalTurkish: item.turkish
    };
  });
}

export default function WordGameScreen() {
  const { addMistake } = useMistakes();
  const { addProgress } = useProgress();
  
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

  // Scramble State
  const [scrambleLetters, setScrambleLetters] = useState<{id: string, char: string, used: boolean}[]>([]);
  const [scrambleSelected, setScrambleSelected] = useState<{id: string, char: string}[]>([]);

  // Flashcard State
  const [flashcardRevealed, setFlashcardRevealed] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [phase]);

  const initScramble = (word: string) => {
    const chars = word.replace(/\s+/g, '').split(''); // Remove spaces for scramble
    const shuffled = shuffleArray(chars.map((char, i) => ({ id: `${i}-${char}`, char, used: false })));
    setScrambleLetters(shuffled);
    setScrambleSelected([]);
  };

  const startGame = () => {
    const q = generateQuestions(mode, difficulty, questionCount);
    if (q.length === 0) return;
    setQuestions(q);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setHasChecked(false);
    setFlashcardRevealed(false);
    
    if (mode === 'scramble') {
      initScramble(q[0].correctAnswer);
    }
    
    fadeAnim.setValue(0);
    setPhase('playing');
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      const pct = Math.round((score / questions.length) * 100);
      if (pct >= 50) addProgress(5);
      else if (pct > 0) addProgress(2);
      
      fadeAnim.setValue(0);
      setPhase('result');
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setHasChecked(false);
      setFlashcardRevealed(false);
      if (mode === 'scramble') {
        initScramble(questions[nextIndex].correctAnswer);
      }
    }
  };

  const handleQuizCheck = () => {
    if (!hasChecked) {
      setHasChecked(true);
      if (selectedOption === questions[currentIndex].correctAnswer) {
        setScore(s => s + 1);
      } else {
        // Record mistake
        addMistake({
          word: questions[currentIndex].originalWord,
          turkish: questions[currentIndex].originalTurkish,
          example: questions[currentIndex].example
        });
      }
    } else {
      handleNext();
    }
  };

  // ── Scramble Logic ──
  const toggleScrambleLetter = (letter: {id: string, char: string, used: boolean}) => {
    if (letter.used || hasChecked) return;
    setScrambleLetters(prev => prev.map(l => l.id === letter.id ? { ...l, used: true } : l));
    setScrambleSelected(prev => [...prev, { id: letter.id, char: letter.char }]);
  };

  const removeScrambleLetter = (letterId: string) => {
    if (hasChecked) return;
    setScrambleSelected(prev => prev.filter(l => l.id !== letterId));
    setScrambleLetters(prev => prev.map(l => l.id === letterId ? { ...l, used: false } : l));
  };

  const checkScramble = () => {
    const currentQ = questions[currentIndex];
    const attempt = scrambleSelected.map(s => s.char).join('').toLowerCase();
    const target = currentQ.correctAnswer.replace(/\s+/g, '').toLowerCase();

    setHasChecked(true);
    if (attempt === target) {
      setScore(s => s + 1);
    } else {
      addMistake({
        word: currentQ.originalWord,
        turkish: currentQ.originalTurkish,
        example: currentQ.example
      });
    }
  };

  // ── Flashcard Logic ──
  const handleFlashcardAnswer = (knewIt: boolean) => {
    if (!knewIt) {
      addMistake({
        word: questions[currentIndex].originalWord,
        turkish: questions[currentIndex].originalTurkish,
        example: questions[currentIndex].example
      });
    } else {
      setScore(s => s + 1);
    }
    setFlashcardRevealed(true);
  };

  // ── Helpers ──
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

          <Text style={styles.sectionTitle}>Mod Seçimi</Text>
          <View style={styles.modeGrid}>
            <TouchableOpacity style={[styles.modeCard, mode === 'en-tr' && styles.modeCardActive]} onPress={() => setMode('en-tr')}>
              <Ionicons name="language" size={24} color={mode === 'en-tr' ? '#fff' : '#2EBC9D'} />
              <Text style={[styles.modeLabel, mode === 'en-tr' && styles.modeLabelActive]}>EN → TR</Text>
              <Text style={[styles.modeDesc, mode === 'en-tr' && styles.modeDescActive]}>İngilizce → Türkçe</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.modeCard, mode === 'tr-en' && styles.modeCardActive]} onPress={() => setMode('tr-en')}>
              <Ionicons name="swap-horizontal" size={24} color={mode === 'tr-en' ? '#fff' : '#2EBC9D'} />
              <Text style={[styles.modeLabel, mode === 'tr-en' && styles.modeLabelActive]}>TR → EN</Text>
              <Text style={[styles.modeDesc, mode === 'tr-en' && styles.modeDescActive]}>Türkçe → İngilizce</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.modeGrid, { marginTop: 12 }]}>
            <TouchableOpacity style={[styles.modeCard, mode === 'scramble' && styles.modeCardActive]} onPress={() => setMode('scramble')}>
              <Ionicons name="extension-puzzle" size={24} color={mode === 'scramble' ? '#fff' : '#F59E0B'} />
              <Text style={[styles.modeLabel, mode === 'scramble' && styles.modeLabelActive]}>Karışık Harf</Text>
              <Text style={[styles.modeDesc, mode === 'scramble' && styles.modeDescActive]}>Harfleri Diz</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modeCard, mode === 'flashcard' && styles.modeCardActive]} onPress={() => setMode('flashcard')}>
              <Ionicons name="albums" size={24} color={mode === 'flashcard' ? '#fff' : '#8B5CF6'} />
              <Text style={[styles.modeLabel, mode === 'flashcard' && styles.modeLabelActive]}>Kart Modu</Text>
              <Text style={[styles.modeDesc, mode === 'flashcard' && styles.modeDescActive]}>Öğren & Ezberle</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Zorluk Seviyesi</Text>
          <View style={styles.diffRow}>
            {(Object.keys(difficultyRanges) as Difficulty[]).map(d => {
              const info = difficultyRanges[d];
              const active = difficulty === d;
              return (
                <TouchableOpacity key={d} style={[styles.diffCard, active && { backgroundColor: info.color, borderColor: info.color }]} onPress={() => setDifficulty(d)}>
                  <Ionicons name={info.icon as any} size={22} color={active ? '#fff' : info.color} />
                  <Text style={[styles.diffLabel, active && { color: '#fff' }]}>{info.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Soru Sayısı</Text>
          <View style={styles.countRow}>
            {questionCounts.map(c => (
              <TouchableOpacity key={c} style={[styles.countPill, questionCount === c && styles.countPillActive]} onPress={() => setQuestionCount(c)}>
                <Text style={[styles.countText, questionCount === c && styles.countTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

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
          <Text style={styles.resultTitle}>Oyun Bitti!</Text>
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

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{mode === 'flashcard' ? 'Kart' : 'Soru'} {currentIndex + 1}/{questions.length}</Text>
            <Text style={styles.progressPct}>%{progress}</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>
            {mode === 'en-tr' ? '🇬🇧 → 🇹🇷 Test' : mode === 'tr-en' ? '🇹🇷 → 🇬🇧 Test' : mode === 'scramble' ? '🔤 Karışık Harf' : '📇 Kart Modu'}
          </Text>
        </View>

        {/* ── Scramble View ── */}
        {mode === 'scramble' && (
          <View style={{ flex: 1 }}>
            <View style={styles.questionCard}>
              <Text style={styles.questionLabel}>Bu kelimenin İngilizcesi nedir?</Text>
              <Text style={styles.questionWord}>{current.word}</Text>
            </View>

            <View style={styles.scrambleSlotsRow}>
              {current.correctAnswer.replace(/\s+/g, '').split('').map((char, i) => {
                const filled = scrambleSelected[i];
                let isIncorrect = false;
                if (hasChecked) {
                  const targetArr = current.correctAnswer.replace(/\s+/g, '').toLowerCase().split('');
                  isIncorrect = scrambleSelected.map(s => s.char.toLowerCase()).join('') !== targetArr.join('');
                }

                return (
                  <TouchableOpacity 
                    key={`slot-${i}`} 
                    style={[
                      styles.scrambleSlot, 
                      filled ? styles.scrambleSlotFilled : null,
                      hasChecked && !isIncorrect ? styles.scrambleSlotCorrect : null,
                      hasChecked && isIncorrect ? styles.scrambleSlotIncorrect : null
                    ]}
                    onPress={() => filled ? removeScrambleLetter(filled.id) : null}
                    disabled={hasChecked}
                  >
                    <Text style={[styles.scrambleSlotText, hasChecked && { color: '#fff' }]}>{filled ? filled.char : ''}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {!hasChecked && (
              <View style={styles.scrambleLettersRow}>
                {scrambleLetters.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={[styles.scrambleLetter, item.used && { opacity: 0.3 }]}
                    onPress={() => toggleScrambleLetter(item)}
                    disabled={item.used}
                  >
                    <Text style={styles.scrambleLetterText}>{item.char}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={[styles.checkBtn, scrambleSelected.length === current.correctAnswer.replace(/\s+/g, '').length || hasChecked ? styles.checkBtnActive : styles.checkBtnInactive]}
              disabled={scrambleSelected.length !== current.correctAnswer.replace(/\s+/g, '').length && !hasChecked}
              onPress={() => hasChecked ? handleNext() : checkScramble()}
            >
              <Text style={[styles.checkBtnText, { color: scrambleSelected.length === current.correctAnswer.replace(/\s+/g, '').length || hasChecked ? '#fff' : '#94A3B8' }]}>
                {hasChecked ? (currentIndex === questions.length - 1 ? 'Sonuçları Gör' : 'Sonraki Kelime') : 'Kontrol Et'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Quiz View (en-tr / tr-en) ── */}
        {(mode === 'en-tr' || mode === 'tr-en') && (
          <View style={{ flex: 1 }}>
            <View style={styles.questionCard}>
              <Text style={styles.questionLabel}>{mode === 'en-tr' ? 'Bu kelimenin Türkçesi nedir?' : 'Bu kelimenin İngilizcesi nedir?'}</Text>
              <Text style={styles.questionWord}>{current.word}</Text>
            </View>

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
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={[styles.checkBtn, selectedOption || hasChecked ? styles.checkBtnActive : styles.checkBtnInactive]}
              disabled={!selectedOption && !hasChecked}
              onPress={handleQuizCheck}
            >
              <Text style={[styles.checkBtnText, selectedOption || hasChecked ? { color: '#fff' } : { color: '#94A3B8' }]}>
                {hasChecked ? (currentIndex === questions.length - 1 ? 'Sonuçları Gör' : 'Sonraki Soru') : 'Kontrol Et'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Flashcard View ── */}
        {mode === 'flashcard' && (
          <View style={{ flex: 1 }}>
            <View style={[styles.flashcard, flashcardRevealed && styles.flashcardRevealed]}>
              <Text style={styles.flashcardWord}>{current.word}</Text>
              
              {flashcardRevealed && (
                <Animated.View style={styles.flashcardDetails}>
                  <View style={styles.divider} />
                  <Text style={styles.flashcardTranslation}>{current.originalTurkish}</Text>
                  {current.example && (
                    <Text style={styles.flashcardExample}>&quot;{current.example}&quot;</Text>
                  )}
                </Animated.View>
              )}
            </View>

            <View style={{ flex: 1 }} />

            {!flashcardRevealed ? (
              <View style={styles.flashBtnsRow}>
                <TouchableOpacity style={styles.flashBtnFail} onPress={() => handleFlashcardAnswer(false)}>
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                  <Text style={styles.flashBtnFailText}>Bilemedim</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.flashBtnSuccess} onPress={() => handleFlashcardAnswer(true)}>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  <Text style={styles.flashBtnSuccessText}>Bildim</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.checkBtn, styles.checkBtnActive]}
                onPress={handleNext}
              >
                <Text style={[styles.checkBtnText, { color: '#fff' }]}>
                  {currentIndex === questions.length - 1 ? 'Sonuçları Gör' : 'Sonraki Kelime'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

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

  // Mode List
  modeGrid: { flexDirection: 'row', gap: 12 },
  modeCard: { flex: 1, backgroundColor: '#F8FAFC', borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, alignItems: 'center', gap: 6 },
  modeCardActive: { backgroundColor: '#2EBC9D', borderColor: '#2EBC9D' },
  modeLabel: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  modeLabelActive: { color: '#fff' },
  modeDesc: { fontSize: 11, color: '#64748B' },
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
  modeBadgeText: { fontSize: 14, fontWeight: '600', color: '#0284C7' },

  questionCard: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 20 },
  questionLabel: { fontSize: 13, color: '#94A3B8', marginBottom: 8 },
  questionWord: { fontSize: 26, fontWeight: 'bold', color: '#1E293B', textAlign: 'center' },

  // Quiz Options
  optionsContainer: { gap: 10 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, backgroundColor: '#fff' },
  optSelected: { borderColor: '#2EBC9D', backgroundColor: '#2EBC9D' },
  optCorrect: { borderColor: '#10B981', backgroundColor: '#10B981' },
  optIncorrect: { borderColor: '#EF4444', backgroundColor: '#EF4444' },
  optLetter: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  optLetterText: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  optText: { fontSize: 15, color: '#1E293B', fontWeight: '500', flex: 1 },

  // Scramble View
  scrambleSlotsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 30 },
  scrambleSlot: { width: 44, height: 50, borderRadius: 12, backgroundColor: '#F1F5F9', borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  scrambleSlotFilled: { borderColor: '#94A3B8' },
  scrambleSlotCorrect: { backgroundColor: '#10B981', borderColor: '#10B981' },
  scrambleSlotIncorrect: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  scrambleSlotText: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  scrambleLettersRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  scrambleLetter: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset:{width:0, height:2}, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  scrambleLetterText: { fontSize: 20, fontWeight: 'bold', color: '#4F46E5' },

  // Flashcard View
  flashcard: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, padding: 30, alignItems: 'center', justifyContent: 'center', minHeight: 250, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  flashcardRevealed: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  flashcardWord: { fontSize: 32, fontWeight: 'bold', color: '#1E293B', textAlign: 'center' },
  flashcardDetails: { marginTop: 24, alignItems: 'center', width: '100%' },
  divider: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 16 },
  flashcardTranslation: { fontSize: 22, fontWeight: '600', color: '#10B981', marginBottom: 12, textAlign: 'center' },
  flashcardExample: { fontSize: 16, color: '#64748B', fontStyle: 'italic', textAlign: 'center', paddingHorizontal: 10 },
  
  flashBtnsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  flashBtnFail: { flex: 1, flexDirection: 'row', backgroundColor: '#FEF2F2', borderWidth: 2, borderColor: '#FECACA', borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', gap: 8 },
  flashBtnFailText: { fontSize: 16, fontWeight: 'bold', color: '#EF4444' },
  flashBtnSuccess: { flex: 1, flexDirection: 'row', backgroundColor: '#F0FDF4', borderWidth: 2, borderColor: '#BBF7D0', borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', gap: 8 },
  flashBtnSuccessText: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },

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
