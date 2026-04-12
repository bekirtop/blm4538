import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import Data from '../../constants/merged.json';
import { useMistakes } from '@/context/MistakesContext';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Beginner', value: 1 },
  { label: 'Intermediate', value: 2 },
  { label: 'Advanced', value: 3 },
  { label: 'Mistakes', value: 'mistakes' },
];

export default function VocabularyScreen() {
  const [activeFilter, setActiveFilter] = useState<string | number>('all');
  const { mistakes } = useMistakes();

  const filteredWords = useMemo(() => {
    if (activeFilter === 'mistakes') return mistakes;
    if (activeFilter === 'all') return Data.words.slice(0, 200); 
    return Data.words.filter(w => {
      if (activeFilter === 1) return w.difficulty === 1;
      if (activeFilter === 2) return w.difficulty === 2;
      return w.difficulty && w.difficulty >= 3;
    }).slice(0, 200); // 200 keeps performance smooth
  }, [activeFilter, mistakes]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.wordCard}>
      <View style={styles.wordInfo}>
        <Text style={styles.wordText}>{item.word}</Text>
        {item.example ? <Text style={styles.exampleText}>&quot;{item.example}&quot;</Text> : null}
        <Text style={styles.meaningText}>{item.turkish}</Text>
      </View>
      <TouchableOpacity style={styles.speakerButton}>
        <Ionicons name="volume-high-outline" size={24} color="#2EBC9D" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Vocabulary</Text>

        {/* Categories */}
        <View style={styles.filterContainer}>
          <View style={styles.filterScroll}>
            {filters.map((filter) => (
              <TouchableOpacity 
                key={filter.label} 
                style={[styles.filterPill, activeFilter === filter.value && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter.value)}
              >
                <Text style={[styles.filterText, activeFilter === filter.value && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Words List */}
        <FlatList
          data={filteredWords}
          keyExtractor={(item, index) => `${item.word}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No words found.</Text>}
        />

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="layers" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', paddingHorizontal: 20, marginTop: 20, marginBottom: 20 },
  filterContainer: { marginBottom: 20 },
  filterScroll: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  filterPillActive: { backgroundColor: '#2EBC9D' },
  filterText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  wordCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  wordInfo: { flex: 1, paddingRight: 12 },
  wordText: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  exampleText: { fontSize: 14, color: '#94A3B8', fontStyle: 'italic', marginBottom: 4 },
  meaningText: { fontSize: 15, color: '#64748B' },
  speakerButton: { padding: 8 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#94A3B8' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2EBC9D', alignItems: 'center', justifyContent: 'center', shadowColor: '#2EBC9D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
});
