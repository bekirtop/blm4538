import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <SafeAreaView>
          <Text style={styles.greeting}>Hello, Learner! 👋</Text>
          <Text style={styles.subtitle}>Let's continue your learning journey</Text>
          
          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Overall Progress</Text>
              <Text style={styles.progressValue}>45%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '45%' }]} />
            </View>
          </View>
        </SafeAreaView>
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
          <View style={{ width: '48%' }} />
        </View>
      </View>

      {/* Quick Quiz Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.quizButton} onPress={() => router.push('/quiz')}>
          <Ionicons name="flash" size={20} color="#fff" />
          <Text style={styles.quizButtonText}>Quick Quiz</Text>
        </TouchableOpacity>
      </View>
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
  gridContainer: { paddingHorizontal: 20, paddingTop: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, width: '48%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  iconContainer: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#94A3B8' },
  bottomContainer: { paddingHorizontal: 20, marginTop: 10, marginBottom: 30 },
  quizButton: { backgroundColor: '#2EBC9D', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  quizButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});
