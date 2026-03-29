import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const filters = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const topics = [
  { id: '1', title: 'Articles', level: 'Beginner', levelColor: '#10B981', subtitle: 'Learn about A, An, and The' },
  { id: '2', title: 'Prepositions', level: 'Beginner', levelColor: '#10B981', subtitle: 'In, On, At, By, and more' },
  { id: '3', title: 'Modals', level: 'Intermediate', levelColor: '#F59E0B', subtitle: 'Can, Could, Should, Must, May' },
  { id: '4', title: 'Conditionals', level: 'Intermediate', levelColor: '#F59E0B', subtitle: 'If clauses and condition types' },
  { id: '5', title: 'Passive Voice', level: 'Advanced', levelColor: '#EF4444', subtitle: 'Active to passive transformation' },
  { id: '6', title: 'Relative Clauses', level: 'Advanced', levelColor: '#EF4444', subtitle: 'Who, Which, That, Where, When' },
];

export default function GrammarScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || topic.level === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Grammar Rules</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search grammar topics..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {filters.map((filter) => (
              <TouchableOpacity 
                key={filter} 
                style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Topics List */}
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <TouchableOpacity key={topic.id} style={styles.topicCard}>
                <View style={styles.topicHeader}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <View style={[styles.levelDot, { backgroundColor: topic.levelColor }]} />
                  <Text style={styles.topicLevel}>{topic.level}</Text>
                </View>
                <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" style={styles.chevron} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No grammar topics found.</Text>
          )}
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', paddingHorizontal: 20, marginTop: 20, marginBottom: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 20 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#1E293B' },
  filterContainer: { marginBottom: 16 },
  filterScroll: { paddingHorizontal: 16 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginHorizontal: 4 },
  filterPillActive: { backgroundColor: '#2EBC9D' },
  filterText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  listContainer: { paddingHorizontal: 20 },
  topicCard: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', position: 'relative', justifyContent: 'center' },
  topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  topicTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginRight: 8 },
  levelDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  topicLevel: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  topicSubtitle: { fontSize: 14, color: '#64748B', paddingRight: 30 },
  chevron: { position: 'absolute', right: 0, top: '50%', transform: [{ translateY: -10 }] },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#94A3B8', fontSize: 16 }
});
