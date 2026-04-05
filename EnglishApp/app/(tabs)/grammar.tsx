import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const filters = ['All', 'Beginner', 'Intermediate', 'Advanced'];

interface GrammarTopic {
  id: string;
  title: string;
  level: string;
  levelColor: string;
  subtitle: string;
  description: string;
  rules: string[];
  examples: string[];
  suffixes?: { suffix: string; usage: string; example: string }[];
}

const topics: GrammarTopic[] = [
  {
    id: '1',
    title: 'Articles',
    level: 'Beginner',
    levelColor: '#10B981',
    subtitle: 'Learn about A, An, and The',
    description: 'Articles are words that define a noun as specific or unspecific. In English there are three articles: a, an, and the.',
    rules: [
      '"A" is used before consonant sounds: a book, a car, a university',
      '"An" is used before vowel sounds: an apple, an hour, an umbrella',
      '"The" is used when referring to something specific or already mentioned',
      'No article is used for general plural nouns or uncountable nouns: Dogs are friendly. Water is essential.',
    ],
    examples: [
      'I saw a cat in the garden. The cat was black.',
      'She is an engineer at a big company.',
      'The sun rises in the east.',
      'Can you pass me the salt?',
    ],
    suffixes: [
      { suffix: '-tion', usage: 'Noun suffix (requires an article)', example: 'the education, a situation' },
      { suffix: '-ness', usage: 'Noun suffix (requires an article)', example: 'the happiness, a kindness' },
      { suffix: '-ment', usage: 'Noun suffix (requires an article)', example: 'an agreement, the development' },
    ],
  },
  {
    id: '2',
    title: 'Prepositions',
    level: 'Beginner',
    levelColor: '#10B981',
    subtitle: 'In, On, At, By, and more',
    description: 'Prepositions are words that show the relationship between a noun/pronoun and other words in a sentence (place, time, direction).',
    rules: [
      '"In" → months, years, seasons, long periods: in January, in 2024, in summer',
      '"On" → days, dates, specific days: on Monday, on June 5th, on my birthday',
      '"At" → precise times, places: at 5 o\'clock, at home, at the station',
      '"By" → deadline, agent, method: by Monday, by train, written by Shakespeare',
      '"Between" → two things: between Monday and Friday',
      '"Among" → more than two things: among the students',
    ],
    examples: [
      'I live in Istanbul.',
      'The meeting is on Friday at 3 PM.',
      'She goes to school by bus.',
      'The book is on the table.',
    ],
    suffixes: [
      { suffix: '-ly', usage: 'Adverb (often follows prepositions)', example: 'in a friendly manner, by quickly' },
      { suffix: '-ward(s)', usage: 'Direction suffix', example: 'towards, backwards, forwards' },
    ],
  },
  {
    id: '3',
    title: 'Modals',
    level: 'Intermediate',
    levelColor: '#F59E0B',
    subtitle: 'Can, Could, Should, Must, May',
    description: 'Modal verbs are auxiliary (helping) verbs that express ability, possibility, permission, or obligation.',
    rules: [
      '"Can" → ability, permission: I can swim. Can I go?',
      '"Could" → past ability, polite request: I could run fast. Could you help me?',
      '"Should" → advice, recommendation: You should study more.',
      '"Must" → obligation, strong necessity: You must wear a seatbelt.',
      '"May" → permission, possibility: May I come in? It may rain.',
      '"Might" → weak possibility: She might come to the party.',
      'Modals are always followed by the base form of the verb (no -s, -ing, -ed)',
    ],
    examples: [
      'You must finish your homework before dinner.',
      'She can speak four languages fluently.',
      'Could you please open the window?',
      'It might snow tomorrow.',
    ],
    suffixes: [
      { suffix: '-able / -ible', usage: 'Adjective suffix (often used with modals)', example: 'readable, possible, visible' },
      { suffix: '-ful', usage: 'Adjective (should be careful)', example: 'You should be careful / helpful' },
    ],
  },
  {
    id: '4',
    title: 'Conditionals',
    level: 'Intermediate',
    levelColor: '#F59E0B',
    subtitle: 'If clauses and condition types',
    description: 'Conditional sentences express situations that depend on conditions. There are four main types in English.',
    rules: [
      'Zero Conditional → general truths: If + present, present. "If you heat water, it boils."',
      'First Conditional → real/possible future: If + present, will + base. "If it rains, I will stay home."',
      'Second Conditional → unreal present: If + past, would + base. "If I had money, I would travel."',
      'Third Conditional → unreal past: If + past perfect, would have + past participle. "If I had studied, I would have passed."',
    ],
    examples: [
      'If you mix red and blue, you get purple. (Type 0)',
      'If she studies hard, she will pass the exam. (Type 1)',
      'If I were you, I would accept the offer. (Type 2)',
      'If they had arrived earlier, they would have seen the show. (Type 3)',
    ],
    suffixes: [
      { suffix: '-ed', usage: 'Past tense suffix (used in Type 2 & 3)', example: 'If I worked... / If I had worked...' },
      { suffix: '-en', usage: 'Past participle suffix (Type 3)', example: 'If I had taken... / spoken / written' },
    ],
  },
  {
    id: '5',
    title: 'Passive Voice',
    level: 'Advanced',
    levelColor: '#EF4444',
    subtitle: 'Active to passive transformation',
    description: 'In passive voice, the subject receives the action instead of performing it. Formed with: be + past participle.',
    rules: [
      'Active: Subject + Verb + Object → Passive: Object + be + Past Participle + (by Subject)',
      'Present Simple: "The letter is written (by John)."',
      'Past Simple: "The cake was baked (by Mary)."',
      'Present Perfect: "The work has been completed."',
      'Future: "The report will be submitted tomorrow."',
      'Modal: "The door must be locked at night."',
    ],
    examples: [
      'Active: "Shakespeare wrote Hamlet." → Passive: "Hamlet was written by Shakespeare."',
      'Active: "They are building a new bridge." → Passive: "A new bridge is being built."',
      'Active: "Someone has stolen my wallet." → Passive: "My wallet has been stolen."',
    ],
    suffixes: [
      { suffix: '-ed', usage: 'Regular past participle', example: 'cleaned, painted, finished' },
      { suffix: '-en', usage: 'Irregular past participle', example: 'written, spoken, broken, taken' },
      { suffix: '-t', usage: 'Irregular past participle', example: 'built, sent, spent, kept' },
    ],
  },
  {
    id: '6',
    title: 'Relative Clauses',
    level: 'Advanced',
    levelColor: '#EF4444',
    subtitle: 'Who, Which, That, Where, When',
    description: 'Relative clauses are used to give extra information about a noun. They begin with relative pronouns.',
    rules: [
      '"Who" → for people: The man who called you is here.',
      '"Which" → for things/animals: The book which I bought is great.',
      '"That" → for people or things (informal): The car that I drive is old.',
      '"Where" → for places: The city where I was born is beautiful.',
      '"When" → for times: I remember the day when we met.',
      '"Whose" → for possession: The girl whose bag was stolen called the police.',
      'Defining clauses (essential info) → no commas. Non-defining (extra info) → with commas.',
    ],
    examples: [
      'The woman who lives next door is a doctor. (defining)',
      'My car, which is red, needs a new engine. (non-defining)',
      'This is the restaurant where we had dinner last week.',
      'I met a man whose sister works at Google.',
    ],
    suffixes: [
      { suffix: '-er', usage: 'Agent noun (the person who does)', example: 'teacher, worker, speaker' },
      { suffix: '-ist', usage: 'Agent noun (specialist who does)', example: 'artist, scientist, pianist' },
      { suffix: '-ee', usage: 'Person who receives action', example: 'employee, trainee, interviewee' },
    ],
  },
];

export default function GrammarScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || topic.level === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));
  };

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
            filteredTopics.map((topic) => {
              const isExpanded = expandedId === topic.id;
              return (
                <View key={topic.id}>
                  <TouchableOpacity
                    style={[styles.topicCard, isExpanded && styles.topicCardExpanded]}
                    onPress={() => toggleExpand(topic.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.topicHeader}>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                      <View style={[styles.levelBadge, { backgroundColor: topic.levelColor + '20' }]}>
                        <View style={[styles.levelDot, { backgroundColor: topic.levelColor }]} />
                        <Text style={[styles.topicLevel, { color: topic.levelColor }]}>{topic.level}</Text>
                      </View>
                    </View>
                    <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#CBD5E1"
                      style={styles.chevron}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.detailContainer}>
                      {/* Description */}
                      <Text style={styles.detailDescription}>{topic.description}</Text>

                      {/* Rules */}
                      <View style={styles.detailSection}>
                        <View style={styles.detailSectionHeader}>
                          <Ionicons name="list-circle" size={20} color="#2EBC9D" />
                          <Text style={styles.detailSectionTitle}>Kurallar</Text>
                        </View>
                        {topic.rules.map((rule, i) => (
                          <View key={i} style={styles.ruleRow}>
                            <Text style={styles.ruleBullet}>•</Text>
                            <Text style={styles.ruleText}>{rule}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Examples */}
                      <View style={styles.detailSection}>
                        <View style={styles.detailSectionHeader}>
                          <Ionicons name="chatbubble-ellipses" size={18} color="#0284C7" />
                          <Text style={styles.detailSectionTitle}>Örnekler</Text>
                        </View>
                        {topic.examples.map((ex, i) => (
                          <View key={i} style={styles.exampleCard}>
                            <Text style={styles.exampleText}>{ex}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Suffixes */}
                      {topic.suffixes && topic.suffixes.length > 0 && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailSectionHeader}>
                            <Ionicons name="extension-puzzle" size={18} color="#7C3AED" />
                            <Text style={styles.detailSectionTitle}>Ekler (Suffixes)</Text>
                          </View>
                          {topic.suffixes.map((s, i) => (
                            <View key={i} style={styles.suffixCard}>
                              <View style={styles.suffixHeader}>
                                <Text style={styles.suffixName}>{s.suffix}</Text>
                                <Text style={styles.suffixUsage}>{s.usage}</Text>
                              </View>
                              <Text style={styles.suffixExample}>📝 {s.example}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })
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
  topicCardExpanded: { borderBottomWidth: 0 },
  topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  topicTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginRight: 8 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  levelDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  topicLevel: { fontSize: 11, fontWeight: '600' },
  topicSubtitle: { fontSize: 14, color: '#64748B', paddingRight: 30 },
  chevron: { position: 'absolute', right: 0, top: '50%', transform: [{ translateY: -10 }] },

  // Detail
  detailContainer: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  detailDescription: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 16 },
  detailSection: { marginBottom: 16 },
  detailSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  detailSectionTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },

  ruleRow: { flexDirection: 'row', marginBottom: 6, paddingRight: 8 },
  ruleBullet: { color: '#2EBC9D', fontSize: 16, marginRight: 8, lineHeight: 22 },
  ruleText: { flex: 1, fontSize: 13, color: '#475569', lineHeight: 22 },

  exampleCard: { backgroundColor: '#EFF6FF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6 },
  exampleText: { fontSize: 13, color: '#1E40AF', fontStyle: 'italic', lineHeight: 20 },

  suffixCard: { backgroundColor: '#F5F3FF', borderRadius: 10, padding: 12, marginBottom: 6 },
  suffixHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  suffixName: { fontSize: 15, fontWeight: 'bold', color: '#7C3AED' },
  suffixUsage: { fontSize: 12, color: '#6D28D9' },
  suffixExample: { fontSize: 13, color: '#475569', lineHeight: 20 },

  emptyText: { textAlign: 'center', marginTop: 40, color: '#94A3B8', fontSize: 16 },
});
