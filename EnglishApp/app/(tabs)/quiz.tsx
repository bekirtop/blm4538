import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const questions = [
  {
    id: 1,
    question: "She ___ to school every day.",
    options: [
      { id: 'A', text: 'go' },
      { id: 'B', text: 'goes' },
      { id: 'C', text: 'going' },
      { id: 'D', text: 'gone' },
    ],
    correctAnswer: 'B'
  },
  {
    id: 2,
    question: "What ___ you doing right now?",
    options: [
      { id: 'A', text: 'were' },
      { id: 'B', text: 'have' },
      { id: 'C', text: 'are' },
      { id: 'D', text: 'do' },
    ],
    correctAnswer: 'C'
  },
  {
    id: 3,
    question: "They ___ playing football when it started to rain.",
    options: [
      { id: 'A', text: 'was' },
      { id: 'B', text: 'were' },
      { id: 'C', text: 'are' },
      { id: 'D', text: 'have' },
    ],
    correctAnswer: 'B'
  }
];

export default function QuizScreen() {
  const router = useRouter();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleCheck = () => {
    if (!hasChecked) {
      setHasChecked(true);
      if (selectedOption === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
    } else {
      if (isLastQuestion) {
        // Reset quiz
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedOption(null);
        setHasChecked(false);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setHasChecked(false);
      }
    }
  };

  const getOptionStyle = (id: string) => {
    if (!hasChecked) {
      return selectedOption === id ? styles.optionButtonSelected : {};
    }
    if (id === currentQuestion.correctAnswer) return styles.optionButtonCorrect;
    if (selectedOption === id && id !== currentQuestion.correctAnswer) return styles.optionButtonIncorrect;
    return {};
  };

  const getLetterStyle = (id: string) => {
    if (!hasChecked) {
      return selectedOption === id ? styles.optionLetterContainerSelected : {};
    }
    if (id === currentQuestion.correctAnswer) return styles.optionLetterContainerCorrect;
    if (selectedOption === id && id !== currentQuestion.correctAnswer) return styles.optionLetterContainerIncorrect;
    return {};
  };

  const getLetterTextStyle = (id: string) => {
    if (!hasChecked) {
      return selectedOption === id ? styles.optionLetterSelected : {};
    }
    if (id === currentQuestion.correctAnswer || selectedOption === id) return styles.optionLetterSelected;
    return {};
  };

  const progressPercentage = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* Title & Score */}
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>Quiz</Text>
          <View style={styles.scoreBadge}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Question {currentQuestionIndex + 1}/{questions.length}</Text>
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

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Check Answer Button */}
        <TouchableOpacity 
          style={[
            styles.checkButton,
            selectedOption ? styles.checkButtonActive : styles.checkButtonInactive
          ]}
          disabled={!selectedOption}
          onPress={handleCheck}
        >
          <Text style={[
            styles.checkButtonText,
            selectedOption ? styles.checkButtonTextActive : styles.checkButtonTextInactive
          ]}>
            {hasChecked ? (isLastQuestion ? 'Finish Quiz' : 'Next Question') : 'Check Answer'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  header: { marginTop: 10, marginBottom: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center', marginLeft: -8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1E293B' },
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
  checkButtonTextActive: { color: '#FFFFFF' }
});
