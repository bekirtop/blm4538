import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import Data from '../../constants/merged.json';
import { useMistakes } from '@/context/MistakesContext';
import { useProgress } from '@/context/ProgressContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const router = useRouter();
  const { mistakes, removeMistake } = useMistakes();
  const { progress } = useProgress();
  const [isMistakesExpanded, setIsMistakesExpanded] = useState(false);

  const dailyWord = useMemo(() => {
    // Basic daily word logic based on a random pick for demonstration
    // Could be seeded by date to be truly 'daily'
    return Data.words[Math.floor(Math.random() * 50)];
  }, []);

  const toggleMistakes = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsMistakesExpanded(!isMistakesExpanded);
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <SafeAreaView>
          <Text style={styles.greeting}>Hello, Learner! 👋</Text>
          <Text style={styles.subtitle}>Let&apos;s continue your learning journey</Text>
        </SafeAreaView>
          
        {/* Progress Card */}
        <TouchableOpacity style={styles.progressCard} activeOpacity={0.9}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Overall Progress</Text>
            <Text style={styles.progressValue}>{progress}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Word of the Day Card */}
      <View style={styles.dailyWordContainer}>
        <Text style={styles.sectionTitle}>Günün Kelimesi</Text>
        <TouchableOpacity style={styles.dailyWordCard} onPress={() => router.push('/vocabulary')} activeOpacity={0.8}>
          <View style={styles.dailyWordIcon}>
            <Ionicons name="sparkles" size={24} color="#F59E0B" />
          </View>
          <View style={styles.dailyWordInfo}>
            <Text style={styles.dailyWordText}>{dailyWord?.word || 'Vocabulary'}</Text>
            <Text style={styles.dailyWordTranslation}>{dailyWord?.turkish || 'Kelime Dağarcığı'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>
      </View>

      {/* Grid Menu */}
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/grammar')}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="book" size={24} color="#0284C7" />
            </View>
            <Text style={styles.cardTitle}>Grammar Rules</Text>
            <Text style={styles.cardSubtitle}>12 Topics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/tenses')}>
            <View style={[styles.iconContainer, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="time" size={24} color="#DB2777" />
            </View>
            <Text style={styles.cardTitle}>Tenses</Text>
            <Text style={styles.cardSubtitle}>12 Tenses</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/vocabulary')}>
            <View style={[styles.iconContainer, { backgroundColor: '#CCFBF1' }]}>
              <Ionicons name="pencil" size={24} color="#0D9488" />
            </View>
            <Text style={styles.cardTitle}>Vocabulary</Text>
            <Text style={styles.cardSubtitle}>500+ Words</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/quiz')}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFEDD5' }]}>
              <Ionicons name="sync" size={24} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>General Review</Text>
            <Text style={styles.cardSubtitle}>Start Review</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/word-game')}>
            <View style={[styles.iconContainer, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="game-controller" size={24} color="#7C3AED" />
            </View>
            <Text style={styles.cardTitle}>Word Game</Text>
            <Text style={styles.cardSubtitle}>Kelime Oyunu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/vocabulary')}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="library" size={24} color="#EF4444" />
            </View>
            <Text style={styles.cardTitle}>Dictionary</Text>
            <Text style={styles.cardSubtitle}>Sözlük</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Quiz Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.quizButton} onPress={() => router.push('/quiz')}>
          <Ionicons name="flash" size={20} color="#fff" />
          <Text style={styles.quizButtonText}>Quick Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Yanlışlarım (Mistakes) Section */}
      {mistakes.length > 0 && (
        <View style={styles.mistakesSection}>
          <TouchableOpacity 
            style={styles.mistakesHeader} 
            onPress={toggleMistakes}
            activeOpacity={0.7}
          >
            <View style={styles.mistakesHeaderLeft}>
              <View style={styles.mistakesIconBadge}>
                <Ionicons name="warning" size={18} color="#EF4444" />
              </View>
              <Text style={styles.mistakesSectionTitle}>Yanlışlarım ({mistakes.length})</Text>
            </View>
            <Ionicons 
              name={isMistakesExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#94A3B8" 
            />
          </TouchableOpacity>
          
          {isMistakesExpanded && (
            <View style={styles.mistakesList}>
              {mistakes.map((m, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.mistakeItem}
                  onPress={() => router.push('/vocabulary')}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mistakeWord}>{m.word}</Text>
                    <Text style={styles.mistakeTurkish}>{m.turkish}</Text>
                    {m.example && <Text style={styles.mistakeExample}>"{m.example}"</Text>}
                  </View>
                  <TouchableOpacity onPress={() => removeMistake(m.word)} style={styles.mistakeRemoveBtn} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                style={styles.goToVocabBtn} 
                onPress={() => router.push('/vocabulary')}
                activeOpacity={0.8}
              >
                <Text style={styles.goToVocabBtnText}>Kelime Dağarcığına Git</Text>
                <Ionicons name="arrow-forward" size={16} color="#2EBC9D" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#1E293B', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, position: 'relative', marginBottom: 50 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#94A3B8', marginBottom: 50 },
  progressCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, position: 'absolute', bottom: -40, left: 20, right: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  progressValue: { fontSize: 16, fontWeight: 'bold', color: '#2EBC9D' },
  progressBarBackground: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#2EBC9D', borderRadius: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, marginLeft: 4 },
  dailyWordContainer: { paddingHorizontal: 20, paddingTop: 10 },
  dailyWordCard: { flexDirection: 'row', backgroundColor: '#FEF3C7', borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  dailyWordIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFBEB', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  dailyWordInfo: { flex: 1 },
  dailyWordText: { fontSize: 18, fontWeight: 'bold', color: '#D97706', marginBottom: 4 },
  dailyWordTranslation: { fontSize: 14, color: '#B45309' },
  gridContainer: { paddingHorizontal: 20, paddingTop: 25 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, width: '48%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  iconContainer: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#94A3B8' },
  bottomContainer: { paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
  quizButton: { backgroundColor: '#2EBC9D', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  quizButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  mistakesSection: { paddingHorizontal: 20, paddingBottom: 40, marginTop: 10 },
  mistakesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2 },
  mistakesHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  mistakesIconBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  mistakesSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  mistakesList: { marginTop: 12 },
  mistakeItem: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' },
  mistakeWord: { fontSize: 16, fontWeight: 'bold', color: '#EF4444', marginBottom: 4 },
  mistakeTurkish: { fontSize: 14, color: '#1E293B' },
  mistakeExample: { fontSize: 12, color: '#64748B', marginTop: 4, fontStyle: 'italic' },
  mistakeRemoveBtn: { padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8, marginLeft: 12 },
  goToVocabBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, marginTop: 4, backgroundColor: '#F0FDF4', borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0' },
  goToVocabBtnText: { color: '#10B981', fontSize: 15, fontWeight: 'bold', marginRight: 6 },
});
