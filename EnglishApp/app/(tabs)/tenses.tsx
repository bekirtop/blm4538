import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  LayoutAnimation, Platform, UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TenseGroup = 'All' | 'Present' | 'Past' | 'Future';

interface TenseData {
  id: string;
  group: TenseGroup;
  name: string;
  trName: string;
  usage: string;
  formula: string;
  negative: string;
  question: string;
  examples: { en: string; tr: string }[];
  signalWords: string[];
  color: string;
  icon: string;
  quiz: { question: string; options: string[]; correctIndex: number };
}

const tensesData: TenseData[] = [
  {
    id: '1',
    group: 'Present',
    name: 'Simple Present',
    trName: 'Geniş Zaman',
    usage: 'Genel geçer doğruları, alışkanlıkları, rutinleri ve kalıcı durumları ifade eder. Bilimsel gerçekler için de kullanılır.',
    formula: 'S + V1(s/es) + Object',
    negative: 'S + do/does not + V1 + Object',
    question: 'Do/Does + S + V1 + Object?',
    examples: [
      { en: 'I wake up at 7 AM every day.', tr: 'Her gün sabah 7\'de uyanırım.' },
      { en: 'She speaks three languages fluently.', tr: 'O üç dili akıcı şekilde konuşur.' },
      { en: 'Water boils at 100 degrees Celsius.', tr: 'Su 100 derecede kaynar.' },
    ],
    signalWords: ['always', 'usually', 'often', 'sometimes', 'never', 'every day', 'on Mondays', 'generally'],
    color: '#3B82F6',
    icon: 'sunny',
    quiz: {
      question: 'Hangi cümle doğru Simple Present\'tır?',
      options: [
        'She go to school every day.',
        'She goes to school every day.',
        'She is going to school every day.',
        'She went to school every day.',
      ],
      correctIndex: 1,
    },
  },
  {
    id: '2',
    group: 'Present',
    name: 'Present Continuous',
    trName: 'Şimdiki Zaman',
    usage: 'Şu anda devam eden eylemler, geçici durumlar ve planlanmış yakın gelecek için kullanılır.',
    formula: 'S + am/is/are + V-ing + Object',
    negative: 'S + am/is/are + not + V-ing + Object',
    question: 'Am/Is/Are + S + V-ing + Object?',
    examples: [
      { en: 'I am reading a book right now.', tr: 'Şu an bir kitap okuyorum.' },
      { en: 'They are playing football at the park.', tr: 'Parkta futbol oynuyorlar.' },
      { en: 'She is meeting her boss tomorrow morning.', tr: 'Yarın sabah patronuyla görüşüyor.' },
    ],
    signalWords: ['now', 'right now', 'at the moment', 'currently', 'today', 'this week', 'look!', 'listen!'],
    color: '#10B981',
    icon: 'time',
    quiz: {
      question: '"He ___ a movie right now." Boşluğu doldurun.',
      options: ['watches', 'watch', 'is watching', 'watched'],
      correctIndex: 2,
    },
  },
  {
    id: '3',
    group: 'Present',
    name: 'Present Perfect',
    trName: 'Yakın Geçmiş Zaman',
    usage: 'Geçmişte olmuş ama etkisi şu an devam eden olaylar, hayat deneyimleri ve yakın zamanda tamamlanan eylemler.',
    formula: 'S + have/has + V3 (past participle) + Object',
    negative: 'S + have/has + not + V3 + Object',
    question: 'Have/Has + S + V3 + Object?',
    examples: [
      { en: 'I have just finished my homework.', tr: 'Az önce ödevimi bitirdim.' },
      { en: 'She has never been to Paris.', tr: 'O hiç Paris\'e gitmemiş.' },
      { en: 'Have you ever tried sushi?', tr: 'Hiç sushi denedin mi?' },
    ],
    signalWords: ['just', 'already', 'yet', 'ever', 'never', 'recently', 'since', 'for', 'so far', 'lately'],
    color: '#EC4899',
    icon: 'checkmark-done',
    quiz: {
      question: '"She ___ just ___ the report." (finish)',
      options: ['has / finished', 'have / finished', 'had / finished', 'is / finishing'],
      correctIndex: 0,
    },
  },
  {
    id: '4',
    group: 'Present',
    name: 'Present Perfect Continuous',
    trName: 'Yakın Geçmişte Sürmekte Olan',
    usage: 'Geçmişte başlayan ve hala devam eden süregelen eylemleri anlatır. Yorgunluk veya görünür bir sonucu vurgular.',
    formula: 'S + have/has + been + V-ing + Object',
    negative: 'S + have/has + not + been + V-ing + Object',
    question: 'Have/Has + S + been + V-ing + Object?',
    examples: [
      { en: 'I have been studying English for 3 years.', tr: '3 yıldır İngilizce çalışıyorum.' },
      { en: 'She has been waiting since this morning.', tr: 'Bu sabahtan beri bekliyor.' },
      { en: 'How long have you been learning to drive?', tr: 'Ne zamandır araba kullanmayı öğreniyorsun?' },
    ],
    signalWords: ['for', 'since', 'how long', 'all day', 'all morning', 'lately', 'recently'],
    color: '#0EA5E9',
    icon: 'hourglass',
    quiz: {
      question: '"They ___ been practicing for 2 hours."',
      options: ['has', 'have', 'had', 'are'],
      correctIndex: 1,
    },
  },
  {
    id: '5',
    group: 'Past',
    name: 'Simple Past',
    trName: 'Geçmiş Zaman',
    usage: 'Geçmişte belirli bir zamanda başlamış ve tamamen bitmiş eylemleri ifade eder.',
    formula: 'S + V2 (past form) + Object',
    negative: 'S + did not (didn\'t) + V1 + Object',
    question: 'Did + S + V1 + Object?',
    examples: [
      { en: 'She visited her grandmother yesterday.', tr: 'Dün büyükannesini ziyaret etti.' },
      { en: 'We went to Rome last summer.', tr: 'Geçen yaz Roma\'ya gittik.' },
      { en: 'I didn\'t watch TV last night.', tr: 'Dün gece TV izlemedim.' },
    ],
    signalWords: ['yesterday', 'last week/year', '... ago', 'in 2020', 'when I was young', 'in those days'],
    color: '#F59E0B',
    icon: 'play-back',
    quiz: {
      question: '"I ___ pizza for dinner yesterday."',
      options: ['eat', 'eating', 'ate', 'have eaten'],
      correctIndex: 2,
    },
  },
  {
    id: '6',
    group: 'Past',
    name: 'Past Continuous',
    trName: 'Geçmişte Süren Zaman',
    usage: 'Geçmişte belirli bir anda devam etmekte olan eylemleri anlatır. Genelde Simple Past ile "while/when" bağlacıyla kullanılır.',
    formula: 'S + was/were + V-ing + Object',
    negative: 'S + was/were + not + V-ing + Object',
    question: 'Was/Were + S + V-ing + Object?',
    examples: [
      { en: 'I was watching TV when he called.', tr: 'O aradığında TV izliyordum.' },
      { en: 'They were sleeping when the storm started.', tr: 'Fırtına başladığında uyuyorlardı.' },
      { en: 'What were you doing at 8 PM last night?', tr: 'Dün gece saat 20\'de ne yapıyordun?' },
    ],
    signalWords: ['while', 'when', 'at that moment', 'at 5 PM yesterday', 'all morning', 'all evening'],
    color: '#14B8A6',
    icon: 'film',
    quiz: {
      question: '"I ___ studying when she arrived."',
      options: ['am', 'was', 'were', 'had'],
      correctIndex: 1,
    },
  },
  {
    id: '7',
    group: 'Past',
    name: 'Past Perfect',
    trName: 'Geçmişte Önce Olan',
    usage: 'Geçmişteki iki olaydan birinin diğerinden önce gerçekleştiğini gösterir. "Geçmişin geçmişi" olarak düşünülebilir.',
    formula: 'S + had + V3 (past participle) + Object',
    negative: 'S + had not (hadn\'t) + V3 + Object',
    question: 'Had + S + V3 + Object?',
    examples: [
      { en: 'She had left before I arrived.', tr: 'Ben varmadan önce o gitmişti.' },
      { en: 'When he called, I had already eaten.', tr: 'O aradığında ben çoktan yemiştim.' },
      { en: 'Had you ever seen snow before moving to Canada?', tr: 'Kanada\'ya taşınmadan önce hiç kar görmüş müydün?' },
    ],
    signalWords: ['before', 'after', 'already', 'by the time', 'when', 'just', 'never...before'],
    color: '#7C3AED',
    icon: 'arrow-undo',
    quiz: {
      question: '"When I arrived, she ___ already ___." (leave)',
      options: ['has / left', 'have / left', 'had / left', 'was / leaving'],
      correctIndex: 2,
    },
  },
  {
    id: '8',
    group: 'Future',
    name: 'Future Simple (Will)',
    trName: 'Gelecek Zaman',
    usage: 'Tahminler, anlık kararlar, sözler, teklifler ve gelecekle ilgili genel ifadeler için kullanılır.',
    formula: 'S + will + V1 + Object',
    negative: 'S + will not (won\'t) + V1 + Object',
    question: 'Will + S + V1 + Object?',
    examples: [
      { en: 'I will call you tomorrow morning.', tr: 'Seni yarın sabah arayacağım.' },
      { en: 'It will probably rain tonight.', tr: 'Bu gece muhtemelen yağmur yağacak.' },
      { en: 'Will you help me move this weekend?', tr: 'Bu hafta sonu taşınmamda yardım eder misin?' },
    ],
    signalWords: ['tomorrow', 'next week/year', 'soon', 'in the future', 'probably', 'I think', 'I\'m sure', 'I believe'],
    color: '#8B5CF6',
    icon: 'rocket',
    quiz: {
      question: '"She ___ go to the gym tomorrow."',
      options: ['wills', 'willing', 'will', 'would'],
      correctIndex: 2,
    },
  },
  {
    id: '9',
    group: 'Future',
    name: 'Future Continuous',
    trName: 'Gelecekte Süren Zaman',
    usage: 'Gelecekte belirli bir anda devam ediyor olacak eylemleri ifade eder.',
    formula: 'S + will be + V-ing + Object',
    negative: 'S + will not be + V-ing + Object',
    question: 'Will + S + be + V-ing + Object?',
    examples: [
      { en: 'At 8 PM tonight, I will be watching the match.', tr: 'Bu gece saat 20\'de maçı izliyor olacağım.' },
      { en: 'This time tomorrow, she will be flying to London.', tr: 'Yarın bu saatte Londra\'ya uçuyor olacak.' },
      { en: 'Will you be working on Saturday evening?', tr: 'Cumartesi akşamı çalışıyor olacak mısın?' },
    ],
    signalWords: ['at this time tomorrow', 'this time next week', 'at ... o\'clock tomorrow', 'when you arrive'],
    color: '#F97316',
    icon: 'refresh',
    quiz: {
      question: '"She ___ ___ at this time tomorrow." (work)',
      options: ['will works', 'will be working', 'will worked', 'is working'],
      correctIndex: 1,
    },
  },
];

const GROUP_FILTERS: TenseGroup[] = ['All', 'Present', 'Past', 'Future'];

const GROUP_COLORS: Record<TenseGroup, string> = {
  All: '#64748B',
  Present: '#10B981',
  Past: '#F59E0B',
  Future: '#8B5CF6',
};

export default function TensesScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<TenseGroup>('All');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuiz, setShowQuiz] = useState<Record<string, boolean>>({});

  const filteredTenses = tensesData.filter(t => activeGroup === 'All' || t.group === activeGroup);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleQuizAnswer = (tenseId: string, selectedIndex: number) => {
    if (quizAnswers[tenseId] === undefined) {
      setQuizAnswers(prev => ({ ...prev, [tenseId]: selectedIndex }));
    }
  };

  const toggleQuiz = (tenseId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowQuiz(prev => ({ ...prev, [tenseId]: !prev[tenseId] }));
    setQuizAnswers(prev => { const n = { ...prev }; delete n[tenseId]; return n; });
  };

  const retryQuiz = (tenseId: string) => {
    setQuizAnswers(prev => { const n = { ...prev }; delete n[tenseId]; return n; });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>İngilizce Zamanlar</Text>
          <Text style={styles.headerDesc}>{tensesData.length} Tense · Formüller · Sinyal Kelimeler · Quiz</Text>
        </View>

        {/* Group Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterWrapper}
          contentContainerStyle={styles.filterContent}
        >
          {GROUP_FILTERS.map(group => (
            <TouchableOpacity
              key={group}
              style={[styles.filterPill, activeGroup === group && { backgroundColor: GROUP_COLORS[group] }]}
              onPress={() => setActiveGroup(group)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, activeGroup === group && styles.filterTextActive]}>
                {group}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.listContainer}>
          {filteredTenses.map(item => {
            const isExpanded = expandedId === item.id;
            const quizShown = !!showQuiz[item.id];
            const selectedAnswer = quizAnswers[item.id];
            const answered = selectedAnswer !== undefined;
            const isCorrect = answered && selectedAnswer === item.quiz.correctIndex;

            return (
              <View key={item.id}>
                <TouchableOpacity
                  style={[styles.card, isExpanded && { borderColor: item.color + '60', borderWidth: 2 }]}
                  onPress={() => toggleExpand(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                      <Ionicons name={item.icon as any} size={24} color={item.color} />
                    </View>
                    <View style={styles.titleContainer}>
                      <View style={styles.nameLine}>
                        <Text style={styles.title}>{item.name}</Text>
                        <View style={[styles.groupBadge, { backgroundColor: item.color + '20' }]}>
                          <Text style={[styles.groupBadgeText, { color: item.color }]}>{item.group}</Text>
                        </View>
                      </View>
                      <Text style={styles.subtitle}>{item.trName}</Text>
                    </View>
                    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#94A3B8" />
                  </View>

                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <View style={styles.divider} />

                      {/* Usage */}
                      <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                          <Ionicons name="information-circle-outline" size={16} color="#64748B" />
                          <Text style={styles.sectionTitle}>Kullanım</Text>
                        </View>
                        <Text style={styles.sectionText}>{item.usage}</Text>
                      </View>

                      {/* Formulas */}
                      <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                          <Ionicons name="code-slash-outline" size={16} color="#64748B" />
                          <Text style={styles.sectionTitle}>Formüller</Text>
                        </View>
                        <View style={[styles.formulaRow, { borderLeftColor: item.color }]}>
                          <View style={[styles.formulaBadge, { backgroundColor: item.color }]}>
                            <Text style={styles.formulaBadgeText}>+</Text>
                          </View>
                          <Text style={styles.formulaText}>{item.formula}</Text>
                        </View>
                        <View style={[styles.formulaRow, { borderLeftColor: '#EF4444' }]}>
                          <View style={[styles.formulaBadge, { backgroundColor: '#EF4444' }]}>
                            <Text style={styles.formulaBadgeText}>-</Text>
                          </View>
                          <Text style={styles.formulaText}>{item.negative}</Text>
                        </View>
                        <View style={[styles.formulaRow, { borderLeftColor: '#F59E0B' }]}>
                          <View style={[styles.formulaBadge, { backgroundColor: '#F59E0B' }]}>
                            <Text style={styles.formulaBadgeText}>?</Text>
                          </View>
                          <Text style={styles.formulaText}>{item.question}</Text>
                        </View>
                      </View>

                      {/* Signal Words */}
                      <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                          <Ionicons name="key-outline" size={16} color="#64748B" />
                          <Text style={styles.sectionTitle}>Sinyal Kelimeler</Text>
                        </View>
                        <View style={styles.chipsContainer}>
                          {item.signalWords.map((word, i) => (
                            <View
                              key={i}
                              style={[styles.chip, { borderColor: item.color + '70', backgroundColor: item.color + '12' }]}
                            >
                              <Text style={[styles.chipText, { color: item.color }]}>{word}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Examples */}
                      <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                          <Ionicons name="chatbubbles-outline" size={16} color="#64748B" />
                          <Text style={styles.sectionTitle}>Örnekler</Text>
                        </View>
                        {item.examples.map((ex, i) => (
                          <View key={i} style={[styles.exampleBox, { borderLeftColor: item.color }]}>
                            <Text style={styles.exampleEn}>{ex.en}</Text>
                            <Text style={styles.exampleTr}>{ex.tr}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Quiz */}
                      <View style={styles.section}>
                        <TouchableOpacity
                          style={[styles.quizToggleBtn, { backgroundColor: item.color }]}
                          onPress={() => toggleQuiz(item.id)}
                          activeOpacity={0.8}
                        >
                          <Ionicons name={quizShown ? 'close-circle-outline' : 'bulb-outline'} size={18} color="#FFFFFF" />
                          <Text style={styles.quizToggleBtnText}>
                            {quizShown ? 'Quiz\'i Kapat' : 'Quiz Sorusu'}
                          </Text>
                        </TouchableOpacity>

                        {quizShown && (
                          <View style={styles.quizContainer}>
                            <Text style={styles.quizQuestion}>{item.quiz.question}</Text>
                            {item.quiz.options.map((option, i) => {
                              const isThisCorrect = i === item.quiz.correctIndex;
                              const isThisSelected = i === selectedAnswer;
                              return (
                                <TouchableOpacity
                                  key={i}
                                  style={[
                                    styles.quizOption,
                                    answered && isThisCorrect && styles.quizOptionCorrect,
                                    answered && isThisSelected && !isThisCorrect && styles.quizOptionWrong,
                                  ]}
                                  onPress={() => handleQuizAnswer(item.id, i)}
                                  disabled={answered}
                                  activeOpacity={0.7}
                                >
                                  <View style={[
                                    styles.optionLetterBox,
                                    answered && isThisCorrect && { backgroundColor: '#10B981' },
                                    answered && isThisSelected && !isThisCorrect && { backgroundColor: '#EF4444' },
                                  ]}>
                                    <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}</Text>
                                  </View>
                                  <Text style={[
                                    styles.quizOptionText,
                                    answered && isThisCorrect && styles.quizOptionTextCorrect,
                                    answered && isThisSelected && !isThisCorrect && styles.quizOptionTextWrong,
                                  ]}>
                                    {option}
                                  </Text>
                                  {answered && isThisCorrect && (
                                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                                  )}
                                  {answered && isThisSelected && !isThisCorrect && (
                                    <Ionicons name="close-circle" size={18} color="#EF4444" />
                                  )}
                                </TouchableOpacity>
                              );
                            })}

                            {answered && (
                              <View style={[styles.feedbackBox, { backgroundColor: isCorrect ? '#DCFCE7' : '#FEE2E2' }]}>
                                <Ionicons
                                  name={isCorrect ? 'trophy' : 'refresh-circle'}
                                  size={22}
                                  color={isCorrect ? '#16A34A' : '#DC2626'}
                                />
                                <Text style={[styles.feedbackText, { color: isCorrect ? '#16A34A' : '#DC2626' }]}>
                                  {isCorrect ? 'Harika! Doğru cevap!' : 'Yanlış, tekrar dene!'}
                                </Text>
                                {!isCorrect && (
                                  <TouchableOpacity onPress={() => retryQuiz(item.id)} style={styles.retryBtn}>
                                    <Text style={styles.retryText}>Tekrar</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  headerDesc: { fontSize: 14, color: '#64748B' },

  filterWrapper: { marginBottom: 16 },
  filterContent: { paddingHorizontal: 16, flexDirection: 'row' },
  filterPill: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F1F5F9', marginRight: 8,
  },
  filterText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  filterTextActive: { color: '#FFFFFF' },

  listContainer: { paddingHorizontal: 16 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    borderWidth: 1.5, borderColor: '#F1F5F9',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  titleContainer: { flex: 1, marginLeft: 14 },
  nameLine: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  groupBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  groupBadgeText: { fontSize: 11, fontWeight: '700' },
  subtitle: { fontSize: 13, color: '#94A3B8', marginTop: 2 },

  expandedContent: { marginTop: 14 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },

  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: '#64748B',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  sectionText: { fontSize: 14, color: '#334155', lineHeight: 22 },

  formulaRow: {
    flexDirection: 'row', alignItems: 'center', borderLeftWidth: 3,
    backgroundColor: '#F8FAFC', borderRadius: 8, paddingVertical: 8,
    paddingRight: 10, paddingLeft: 10, marginBottom: 6,
  },
  formulaBadge: {
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  formulaBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },
  formulaText: {
    flex: 1, fontSize: 13, fontWeight: '600', color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 20,
  },

  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '600' },

  exampleBox: {
    borderLeftWidth: 4, borderRadius: 8, padding: 12, marginBottom: 8,
    backgroundColor: '#F0FDF4',
  },
  exampleEn: { fontSize: 15, fontWeight: '600', color: '#166534', marginBottom: 4 },
  exampleTr: { fontSize: 13, color: '#15803D', fontStyle: 'italic' },

  quizToggleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 11, borderRadius: 12,
  },
  quizToggleBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

  quizContainer: { marginTop: 12 },
  quizQuestion: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 12, lineHeight: 22 },

  quizOption: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12,
    marginBottom: 8, borderWidth: 1.5, borderColor: '#E2E8F0', gap: 10,
  },
  quizOptionCorrect: { backgroundColor: '#DCFCE7', borderColor: '#10B981' },
  quizOptionWrong: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },

  optionLetterBox: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center',
  },
  optionLetter: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },
  quizOptionText: { flex: 1, fontSize: 14, color: '#334155' },
  quizOptionTextCorrect: { color: '#166534', fontWeight: '600' },
  quizOptionTextWrong: { color: '#B91C1C' },

  feedbackBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 10, padding: 12, marginTop: 4,
  },
  feedbackText: { fontSize: 14, fontWeight: '600', flex: 1 },
  retryBtn: {
    backgroundColor: '#DC2626', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8,
  },
  retryText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
});
