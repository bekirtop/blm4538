import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const tensesData = [
  { 
    id: '1', 
    name: 'Simple Present Tense', 
    trName: 'Geniş Zaman', 
    usage: 'Genel geçer doğruları, alışkanlıkları ve rutinleri ifade etmek için kullanılır.', 
    example: 'I wake up at 7 AM every day.', 
    trExample: 'Her gün sabah 7\'de uyanırım.', 
    formula: 'S + V1(s/es) + Object',
    color: '#3B82F6', 
    icon: 'sunny' 
  },
  { 
    id: '2', 
    name: 'Present Continuous', 
    trName: 'Şimdiki Zaman', 
    usage: 'Şu anda, konuşma anında yapılmakta olan eylemleri anlatır.', 
    example: 'I am reading a book right now.', 
    trExample: 'Şu an bir kitap okuyorum.', 
    formula: 'S + am/is/are + V-ing + Object',
    color: '#10B981', 
    icon: 'time' 
  },
  { 
    id: '3', 
    name: 'Simple Past Tense', 
    trName: 'Geçmiş Zaman', 
    usage: 'Geçmişte belirli bir zamanda başlamış ve bitmiş eylemleri ifade eder.', 
    example: 'She visited her grandmother yesterday.', 
    trExample: 'Dün büyükannesini ziyaret etti.', 
    formula: 'S + V2 + Object',
    color: '#F59E0B', 
    icon: 'play-back' 
  },
  { 
    id: '4', 
    name: 'Future Tense (Will)', 
    trName: 'Gelecek Zaman', 
    usage: 'Gelecekle ilgili tahminler, anlık kararlar veya sözler için kullanılır.', 
    example: 'I will call you tomorrow.', 
    trExample: 'Seni yarın arayacağım.', 
    formula: 'S + will + V1 + Object',
    color: '#8B5CF6', 
    icon: 'rocket' 
  },
  { 
    id: '5', 
    name: 'Present Perfect', 
    trName: 'Yakın Geçmiş Zaman', 
    usage: 'Geçmişte olmuş ama etkisi veya sonucu şu an devam eden olaylar.', 
    example: 'I have finished my homework.', 
    trExample: 'Ödevimi bitirdim.', 
    formula: 'S + have/has + V3 + Object',
    color: '#EC4899', 
    icon: 'checkmark-done' 
  },
  { 
    id: '6', 
    name: 'Past Continuous', 
    trName: 'Geçmişte Süren Zaman', 
    usage: 'Geçmişte belirli bir anda devam etmekte olan eylemleri anlatır.', 
    example: 'I was watching TV when he called.', 
    trExample: 'O aradığında ben TV izliyordum.', 
    formula: 'S + was/were + V-ing + Object',
    color: '#14B8A6', 
    icon: 'film' 
  },
];

export default function TensesScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }: { item: typeof tensesData[0] }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity 
        style={[styles.card, isExpanded && styles.cardExpanded]} 
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon as any} size={24} color={item.color} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.trName}</Text>
          </View>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color="#94A3B8" 
          />
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kullanım (Usage):</Text>
              <Text style={styles.sectionText}>{item.usage}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Formül:</Text>
              <View style={styles.formulaBox}>
                <Text style={styles.formulaText}>{item.formula}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Örnek (Example):</Text>
              <View style={styles.exampleBox}>
                <Text style={styles.exampleEn}>{item.example}</Text>
                <Text style={styles.exampleTr}>{item.trExample}</Text>
              </View>
            </View>
            
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>İngilizce Zamanlar ⏱️</Text>
          <Text style={styles.headerDesc}>
            Temel Tenses konu anlatımları ve kuralları
          </Text>
        </View>

        <FlatList
          data={tensesData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  headerDesc: {
    fontSize: 15,
    color: '#64748B',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  cardExpanded: {
    borderColor: '#E2E8F0',
    shadowOpacity: 0.1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  expandedContent: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sectionText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  formulaBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
  },
  formulaText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  exampleBox: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderColor: '#2EBC9D',
    borderRadius: 8,
    padding: 12,
  },
  exampleEn: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 6,
  },
  exampleTr: {
    fontSize: 15,
    color: '#15803D',
    fontStyle: 'italic'
  }
});
