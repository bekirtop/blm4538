import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { useProgress } from '@/context/ProgressContext';

type QuizPhase = 'topics' | 'playing';

interface Question {
  id: number;
  topic: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

const topicCategories = [
  { key: 'all', title: 'Tüm Konular', subtitle: 'Tüm gramer soruları', icon: 'apps', color: '#2EBC9D', bgColor: '#ECFDF5' },
  { key: 'tenses', title: 'Tenses', subtitle: 'Zaman kiplerine dair sorular', icon: 'time', color: '#0284C7', bgColor: '#E0F2FE' },
  { key: 'articles', title: 'Articles', subtitle: 'A, An, The kullanımı', icon: 'text', color: '#7C3AED', bgColor: '#EDE9FE' },
  { key: 'prepositions', title: 'Prepositions', subtitle: 'In, On, At edatları', icon: 'locate', color: '#DB2777', bgColor: '#FCE7F3' },
  { key: 'modals', title: 'Modals', subtitle: 'Can, Could, Should, Must', icon: 'key', color: '#EA580C', bgColor: '#FFEDD5' },
  { key: 'conditionals', title: 'Conditionals', subtitle: 'If clauses', icon: 'git-branch', color: '#059669', bgColor: '#D1FAE5' },
  { key: 'passive', title: 'Passive Voice', subtitle: 'Edilgen çatı', icon: 'swap-horizontal', color: '#DC2626', bgColor: '#FEE2E2' },
  { key: 'relative', title: 'Relative Clauses', subtitle: 'Who, Which, That', icon: 'link', color: '#4F46E5', bgColor: '#E0E7FF' },
];

const allQuestions: Question[] = [
  // Tenses
  { id: 1, topic: 'tenses', question: "She ___ to school every day.", options: [{ id: 'A', text: 'go' }, { id: 'B', text: 'goes' }, { id: 'C', text: 'going' }, { id: 'D', text: 'gone' }], correctAnswer: 'B' },
  { id: 2, topic: 'tenses', question: "What ___ you doing right now?", options: [{ id: 'A', text: 'were' }, { id: 'B', text: 'have' }, { id: 'C', text: 'are' }, { id: 'D', text: 'do' }], correctAnswer: 'C' },
  { id: 3, topic: 'tenses', question: "They ___ playing football when it started to rain.", options: [{ id: 'A', text: 'was' }, { id: 'B', text: 'were' }, { id: 'C', text: 'are' }, { id: 'D', text: 'have' }], correctAnswer: 'B' },
  { id: 4, topic: 'tenses', question: "I ___ already eaten breakfast.", options: [{ id: 'A', text: 'has' }, { id: 'B', text: 'had' }, { id: 'C', text: 'have' }, { id: 'D', text: 'having' }], correctAnswer: 'C' },
  { id: 5, topic: 'tenses', question: "She ___ to Paris last summer.", options: [{ id: 'A', text: 'goes' }, { id: 'B', text: 'gone' }, { id: 'C', text: 'go' }, { id: 'D', text: 'went' }], correctAnswer: 'D' },

  // Articles
  { id: 6, topic: 'articles', question: "I saw ___ elephant at the zoo.", options: [{ id: 'A', text: 'a' }, { id: 'B', text: 'an' }, { id: 'C', text: 'the' }, { id: 'D', text: '—' }], correctAnswer: 'B' },
  { id: 7, topic: 'articles', question: "___ sun rises in the east.", options: [{ id: 'A', text: 'A' }, { id: 'B', text: 'An' }, { id: 'C', text: 'The' }, { id: 'D', text: '—' }], correctAnswer: 'C' },
  { id: 8, topic: 'articles', question: "She is ___ honest person.", options: [{ id: 'A', text: 'a' }, { id: 'B', text: 'an' }, { id: 'C', text: 'the' }, { id: 'D', text: '—' }], correctAnswer: 'B' },
  { id: 9, topic: 'articles', question: "I need ___ book from the library.", options: [{ id: 'A', text: 'a' }, { id: 'B', text: 'an' }, { id: 'C', text: '—' }, { id: 'D', text: 'some' }], correctAnswer: 'A' },
  { id: 10, topic: 'articles', question: "___ water is essential for life.", options: [{ id: 'A', text: 'A' }, { id: 'B', text: 'An' }, { id: 'C', text: 'The' }, { id: 'D', text: '—' }], correctAnswer: 'D' },

  // Prepositions
  { id: 11, topic: 'prepositions', question: "She was born ___ 1995.", options: [{ id: 'A', text: 'on' }, { id: 'B', text: 'at' }, { id: 'C', text: 'in' }, { id: 'D', text: 'by' }], correctAnswer: 'C' },
  { id: 12, topic: 'prepositions', question: "The meeting is ___ Monday.", options: [{ id: 'A', text: 'in' }, { id: 'B', text: 'on' }, { id: 'C', text: 'at' }, { id: 'D', text: 'by' }], correctAnswer: 'B' },
  { id: 13, topic: 'prepositions', question: "I'll meet you ___ 5 o'clock.", options: [{ id: 'A', text: 'in' }, { id: 'B', text: 'on' }, { id: 'C', text: 'at' }, { id: 'D', text: 'by' }], correctAnswer: 'C' },
  { id: 14, topic: 'prepositions', question: "The cat is ___ the table.", options: [{ id: 'A', text: 'under' }, { id: 'B', text: 'in' }, { id: 'C', text: 'at' }, { id: 'D', text: 'by' }], correctAnswer: 'A' },
  { id: 15, topic: 'prepositions', question: "He came ___ bus.", options: [{ id: 'A', text: 'in' }, { id: 'B', text: 'on' }, { id: 'C', text: 'at' }, { id: 'D', text: 'by' }], correctAnswer: 'D' },

  // Modals
  { id: 16, topic: 'modals', question: "You ___ wear a seatbelt while driving.", options: [{ id: 'A', text: 'can' }, { id: 'B', text: 'might' }, { id: 'C', text: 'must' }, { id: 'D', text: 'could' }], correctAnswer: 'C' },
  { id: 17, topic: 'modals', question: "___ I borrow your pen?", options: [{ id: 'A', text: 'Must' }, { id: 'B', text: 'Should' }, { id: 'C', text: 'May' }, { id: 'D', text: 'Will' }], correctAnswer: 'C' },
  { id: 18, topic: 'modals', question: "You ___ study harder if you want to pass.", options: [{ id: 'A', text: 'might' }, { id: 'B', text: 'should' }, { id: 'C', text: 'can' }, { id: 'D', text: 'may' }], correctAnswer: 'B' },
  { id: 19, topic: 'modals', question: "She ___ speak three languages.", options: [{ id: 'A', text: 'must' }, { id: 'B', text: 'should' }, { id: 'C', text: 'can' }, { id: 'D', text: 'may' }], correctAnswer: 'C' },

  // Conditionals
  { id: 20, topic: 'conditionals', question: "If it ___, we will stay indoors.", options: [{ id: 'A', text: 'rained' }, { id: 'B', text: 'rains' }, { id: 'C', text: 'rain' }, { id: 'D', text: 'raining' }], correctAnswer: 'B' },
  { id: 21, topic: 'conditionals', question: "If I ___ rich, I would travel the world.", options: [{ id: 'A', text: 'am' }, { id: 'B', text: 'was' }, { id: 'C', text: 'were' }, { id: 'D', text: 'be' }], correctAnswer: 'C' },
  { id: 22, topic: 'conditionals', question: "If she had studied, she ___ passed the exam.", options: [{ id: 'A', text: 'will have' }, { id: 'B', text: 'would' }, { id: 'C', text: 'would have' }, { id: 'D', text: 'had' }], correctAnswer: 'C' },
  { id: 23, topic: 'conditionals', question: "If you heat water to 100°C, it ___.", options: [{ id: 'A', text: 'will boil' }, { id: 'B', text: 'boils' }, { id: 'C', text: 'would boil' }, { id: 'D', text: 'boiled' }], correctAnswer: 'B' },

  // Passive Voice
  { id: 24, topic: 'passive', question: "The cake ___ by my mother.", options: [{ id: 'A', text: 'baked' }, { id: 'B', text: 'was baked' }, { id: 'C', text: 'is baking' }, { id: 'D', text: 'bakes' }], correctAnswer: 'B' },
  { id: 25, topic: 'passive', question: "The letter ___ yesterday.", options: [{ id: 'A', text: 'has sent' }, { id: 'B', text: 'is sent' }, { id: 'C', text: 'was sent' }, { id: 'D', text: 'sends' }], correctAnswer: 'C' },
  { id: 26, topic: 'passive', question: "A new hospital ___ in our city now.", options: [{ id: 'A', text: 'is built' }, { id: 'B', text: 'is being built' }, { id: 'C', text: 'has built' }, { id: 'D', text: 'was built' }], correctAnswer: 'B' },
  { id: 27, topic: 'passive', question: "English ___ all over the world.", options: [{ id: 'A', text: 'speaks' }, { id: 'B', text: 'is speaking' }, { id: 'C', text: 'is spoken' }, { id: 'D', text: 'spoke' }], correctAnswer: 'C' },

  // Relative Clauses
  { id: 28, topic: 'relative', question: "The man ___ called you is my uncle.", options: [{ id: 'A', text: 'which' }, { id: 'B', text: 'who' }, { id: 'C', text: 'where' }, { id: 'D', text: 'when' }], correctAnswer: 'B' },
  { id: 29, topic: 'relative', question: "This is the house ___ I grew up.", options: [{ id: 'A', text: 'who' }, { id: 'B', text: 'which' }, { id: 'C', text: 'where' }, { id: 'D', text: 'that' }], correctAnswer: 'C' },
  { id: 30, topic: 'relative', question: "The book ___ I bought is very interesting.", options: [{ id: 'A', text: 'who' }, { id: 'B', text: 'where' }, { id: 'C', text: 'when' }, { id: 'D', text: 'which' }], correctAnswer: 'D' },
  { id: 31, topic: 'relative', question: "I remember the day ___ we first met.", options: [{ id: 'A', text: 'who' }, { id: 'B', text: 'which' }, { id: 'C', text: 'when' }, { id: 'D', text: 'where' }], correctAnswer: 'C' },
];

export default function QuizScreen() {
  const [phase, setPhase] = useState<QuizPhase>('topics');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { addProgress } = useProgress();

  const questions = useMemo(() => {
    if (selectedTopic === 'all') return allQuestions;
    return allQuestions.filter(q => q.topic === selectedTopic);
  }, [selectedTopic]);

  const startQuiz = (topicKey: string) => {
    setSelectedTopic(topicKey);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setHasChecked(false);
    setScore(0);
    setShowResult(false);
    setPhase('playing');
  };

  const handleCheck = () => {
    if (!hasChecked) {
      setHasChecked(true);
      if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
        setScore(s => s + 1);
      }
    } else {
      if (currentQuestionIndex === questions.length - 1) {
        const pct = Math.round((score / questions.length) * 100);
        if (pct >= 50) addProgress(5);
        else if (pct > 0) addProgress(2);
        
        setShowResult(true);
      } else {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedOption(null);
        setHasChecked(false);
      }
    }
  };

  const goBack = () => {
    setPhase('topics');
    setShowResult(false);
  };

  const getOptionStyle = (id: string) => {
    if (!hasChecked) return selectedOption === id ? styles.optionButtonSelected : {};
    if (id === questions[currentQuestionIndex].correctAnswer) return styles.optionButtonCorrect;
    if (selectedOption === id && id !== questions[currentQuestionIndex].correctAnswer) return styles.optionButtonIncorrect;
    return {};
  };

  const getLetterStyle = (id: string) => {
    if (!hasChecked) return selectedOption === id ? styles.optionLetterContainerSelected : {};
    if (id === questions[currentQuestionIndex].correctAnswer) return styles.optionLetterContainerCorrect;
    if (selectedOption === id && id !== questions[currentQuestionIndex].correctAnswer) return styles.optionLetterContainerIncorrect;
    return {};
  };

  const getLetterTextStyle = (id: string) => {
    if (!hasChecked) return selectedOption === id ? styles.optionLetterSelected : {};
    if (id === questions[currentQuestionIndex].correctAnswer || selectedOption === id) return styles.optionLetterSelected;
    return {};
  };

  // ── TOPIC SELECTION ──
  if (phase === 'topics') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
          <Text style={styles.headerTitle}>Quiz 📝</Text>
          <Text style={styles.headerSubtitle}>Bir konu seçerek teste başla</Text>

          <View style={styles.topicGrid}>
            {topicCategories.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={styles.topicCard}
                onPress={() => startQuiz(cat.key)}
                activeOpacity={0.7}
              >
                <View style={[styles.topicIconContainer, { backgroundColor: cat.bgColor }]}>
                  <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                </View>
                <View style={styles.topicInfo}>
                  <Text style={styles.topicTitle}>{cat.title}</Text>
                  <Text style={styles.topicSubtitle}>{cat.subtitle}</Text>
                </View>
                <View style={styles.topicQuestionCount}>
                  <Text style={[styles.topicCountText, { color: cat.color }]}>
                    {cat.key === 'all' ? allQuestions.length : allQuestions.filter(q => q.topic === cat.key).length}
                  </Text>
                  <Text style={styles.topicCountLabel}>soru</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── RESULT ──
  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
    const topicInfo = topicCategories.find(t => t.key === selectedTopic);
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultContainer}>
          <Text style={{ fontSize: 64, marginBottom: 8 }}>{emoji}</Text>
          <Text style={styles.resultTitle}>Tebrikler!</Text>
          {topicInfo && <Text style={styles.resultTopicLabel}>{topicInfo.title}</Text>}
          <View style={styles.resultScoreCard}>
            <Text style={styles.resultScoreLabel}>Skorun</Text>
            <Text style={styles.resultScoreValue}>{score} / {questions.length}</Text>
            <View style={styles.resultBar}>
              <View style={[styles.resultBarFill, { width: `${pct}%`, backgroundColor: pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444' }]} />
            </View>
            <Text style={styles.resultPct}>%{pct}</Text>
          </View>
          <View style={styles.resultBtnRow}>
            <TouchableOpacity style={styles.resultBtnOutline} onPress={goBack}>
              <Ionicons name="grid-outline" size={18} color="#2EBC9D" />
              <Text style={styles.resultBtnOutlineText}>Konular</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultBtnFill} onPress={() => startQuiz(selectedTopic)}>
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={styles.resultBtnFillText}>Tekrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── PLAYING ──
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const topicInfo = topicCategories.find(t => t.key === selectedTopic);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.playContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          {topicInfo && (
            <View style={[styles.topicBadge, { backgroundColor: topicInfo.bgColor }]}>
              <Text style={[styles.topicBadgeText, { color: topicInfo.color }]}>{topicInfo.title}</Text>
            </View>
          )}
        </View>

        {/* Title & Score */}
        <View style={styles.titleRow}>
          <Text style={styles.playTitle}>Quiz</Text>
          <View style={styles.scoreBadge}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Soru {currentQuestionIndex + 1}/{questions.length}</Text>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionButton, getOptionStyle(option.id)]}
              onPress={() => !hasChecked && setSelectedOption(option.id)}
              activeOpacity={hasChecked ? 1 : 0.7}
            >
              <View style={[styles.optionLetterContainer, getLetterStyle(option.id)]}>
                <Text style={[styles.optionLetter, getLetterTextStyle(option.id)]}>{option.id}</Text>
              </View>
              <Text style={[styles.optionText, hasChecked && option.id === currentQuestion.correctAnswer && { color: '#10B981', fontWeight: 'bold' }]}>
                {option.text}
              </Text>

              {hasChecked && option.id === currentQuestion.correctAnswer && (
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                </View>
              )}
              {hasChecked && selectedOption === option.id && option.id !== currentQuestion.correctAnswer && (
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        {/* Check Button */}
        <TouchableOpacity
          style={[styles.checkButton, selectedOption ? styles.checkButtonActive : styles.checkButtonInactive]}
          disabled={!selectedOption}
          onPress={handleCheck}
        >
          <Text style={[styles.checkButtonText, selectedOption ? styles.checkButtonTextActive : styles.checkButtonTextInactive]}>
            {hasChecked ? (currentQuestionIndex === questions.length - 1 ? 'Sonuçları Gör' : 'Sonraki Soru') : 'Kontrol Et'}
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
  headerSubtitle: { fontSize: 15, color: '#94A3B8', marginBottom: 24 },

  // Topic Grid
  topicGrid: { gap: 10 },
  topicCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  topicIconContainer: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  topicSubtitle: { fontSize: 12, color: '#94A3B8' },
  topicQuestionCount: { alignItems: 'center', marginRight: 8 },
  topicCountText: { fontSize: 18, fontWeight: 'bold' },
  topicCountLabel: { fontSize: 10, color: '#94A3B8' },

  // Playing
  playContainer: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  header: { marginTop: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  backButton: { width: 40, height: 40, justifyContent: 'center', marginLeft: -8 },
  topicBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginLeft: 4 },
  topicBadgeText: { fontSize: 12, fontWeight: '700' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  playTitle: { fontSize: 28, fontWeight: 'bold', color: '#1E293B' },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  scoreText: { color: '#D97706', fontWeight: 'bold', marginLeft: 6, fontSize: 14 },
  progressSection: { marginBottom: 30 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  progressPercentage: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  progressBarBackground: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#2EBC9D', borderRadius: 3 },
  questionCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  questionText: { fontSize: 18, color: '#1E293B', fontWeight: '600', textAlign: 'center' },
  optionsContainer: { gap: 12 },
  optionButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, backgroundColor: '#FFFFFF' },
  optionButtonSelected: { borderColor: '#2EBC9D', backgroundColor: '#F0FDF8' },
  optionButtonCorrect: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  optionButtonIncorrect: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  optionLetterContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  optionLetterContainerSelected: { backgroundColor: '#2EBC9D' },
  optionLetterContainerCorrect: { backgroundColor: '#10B981' },
  optionLetterContainerIncorrect: { backgroundColor: '#EF4444' },
  optionLetter: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  optionLetterSelected: { color: '#FFFFFF' },
  optionText: { fontSize: 16, color: '#1E293B', fontWeight: '500' },
  checkButton: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 20 },
  checkButtonInactive: { backgroundColor: '#E2E8F0' },
  checkButtonActive: { backgroundColor: '#2EBC9D' },
  checkButtonText: { fontSize: 16, fontWeight: 'bold' },
  checkButtonTextInactive: { color: '#94A3B8' },
  checkButtonTextActive: { color: '#FFFFFF' },

  // Results
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  resultTopicLabel: { fontSize: 15, color: '#64748B', marginBottom: 24 },
  resultScoreCard: { width: '100%', backgroundColor: '#F8FAFC', borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 28, borderWidth: 1, borderColor: '#E2E8F0' },
  resultScoreLabel: { fontSize: 14, color: '#94A3B8', marginBottom: 4 },
  resultScoreValue: { fontSize: 36, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  resultBar: { width: '100%', height: 10, backgroundColor: '#E2E8F0', borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  resultBarFill: { height: '100%', borderRadius: 5 },
  resultPct: { fontSize: 16, fontWeight: '700', color: '#64748B' },
  resultBtnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  resultBtnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderColor: '#2EBC9D', borderRadius: 14, paddingVertical: 16 },
  resultBtnOutlineText: { fontSize: 15, fontWeight: 'bold', color: '#2EBC9D' },
  resultBtnFill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#2EBC9D', borderRadius: 14, paddingVertical: 16 },
  resultBtnFillText: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
});
