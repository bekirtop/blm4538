import {
  StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity,
  LayoutAnimation, Platform, UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  tip: string;
  quiz: { question: string; options: string[]; correctIndex: number };
}

const topics: GrammarTopic[] = [
  {
    id: '1',
    title: 'Articles',
    level: 'Beginner',
    levelColor: '#10B981',
    subtitle: 'A, An ve The kullanımı',
    description: 'Articles, bir ismi belirli ya da belirsiz olarak tanımlayan kelimelerdir. İngilizce\'de üç article vardır: a, an ve the.',
    rules: [
      '"A" → ünsüz sesle başlayan kelimelerde: a book, a car, a university (u-ni-versity)',
      '"An" → ünlü sesle başlayan kelimelerde: an apple, an hour (h sessiz), an umbrella',
      '"The" → önceden bahsedilen veya herkes tarafından bilinen şeyler için',
      'Sıfat kullanımında: "the" + sıfat = o grubun tamamı (the rich, the poor)',
      'Article yok: genel çoğul ve sayılamaz isimler (Dogs are friendly. Water is essential.)',
    ],
    examples: [
      'I saw a cat in the garden. The cat was black.',
      'She is an engineer at a big company.',
      'The sun rises in the east.',
      'Can you pass me the salt?',
    ],
    suffixes: [
      { suffix: '-tion', usage: 'İsim eki (article gerektirir)', example: 'the education, a situation' },
      { suffix: '-ness', usage: 'İsim eki (article gerektirir)', example: 'the happiness, a kindness' },
      { suffix: '-ment', usage: 'İsim eki (article gerektirir)', example: 'an agreement, the development' },
    ],
    tip: 'İpucu: "a" mı "an" mı? Harfe değil SESE bak! "An hour" → h sessiz. "A university" → y sesiyle başlıyor.',
    quiz: {
      question: 'Hangi seçenek doğrudur?',
      options: ['a umbrella', 'an umbrella', 'the umbrella (belirsiz)', 'an university'],
      correctIndex: 1,
    },
  },
  {
    id: '2',
    title: 'Prepositions',
    level: 'Beginner',
    levelColor: '#10B981',
    subtitle: 'In, On, At, By ve diğerleri',
    description: 'Prepositions (edatlar), bir isim veya zamirle diğer kelimeler arasındaki zaman, yer ve yön ilişkisini gösteren kelimelerdir.',
    rules: [
      '"In" → aylar, yıllar, mevsimler, uzun dönemler: in January, in 2024, in summer',
      '"On" → günler, tarihler: on Monday, on June 5th, on my birthday',
      '"At" → kesin saatler ve yerler: at 5 o\'clock, at home, at the station',
      '"By" → son tarih, araç, ajan: by Monday, by train, written by Shakespeare',
      '"Between" → iki şey arasında: between Monday and Friday',
      '"Among" → ikiden fazla şey arasında: among the students',
    ],
    examples: [
      'I live in Istanbul. (şehir)',
      'The meeting is on Friday at 3 PM.',
      'She goes to school by bus.',
      'The book is on the table.',
    ],
    suffixes: [
      { suffix: '-ward(s)', usage: 'Yön eki', example: 'towards, backwards, forwards' },
      { suffix: '-side', usage: 'Konum eki', example: 'inside, outside, alongside' },
    ],
    tip: 'Kolay hatırlama: AT (nokta) → kesin saat/yer. ON (yüzey) → gün/tarih. IN (alan) → ay/yıl/ülke/şehir.',
    quiz: {
      question: '"The meeting is ___ Friday ___ 3 PM."',
      options: ['in / in', 'at / on', 'on / at', 'in / at'],
      correctIndex: 2,
    },
  },
  {
    id: '3',
    title: 'Modals',
    level: 'Intermediate',
    levelColor: '#F59E0B',
    subtitle: 'Can, Could, Should, Must, May',
    description: 'Modal fiiller, yetenek, olasılık, izin veya zorunluluk gibi anlamları ifade eden yardımcı fiillerdir.',
    rules: [
      '"Can" → yetenek, izin: I can swim. Can I go?',
      '"Could" → geçmiş yetenek, nazik istek: Could you help me?',
      '"Should" → tavsiye, öneri: You should study more.',
      '"Must" → güçlü zorunluluk: You must wear a seatbelt.',
      '"May/Might" → olasılık: It may rain. She might come.',
      'Modal fiillerden sonra her zaman fiilin yalın hali gelir (s, ing, ed YOK)',
    ],
    examples: [
      'You must finish your homework before dinner.',
      'She can speak four languages fluently.',
      'Could you please open the window?',
      'It might snow tomorrow.',
    ],
    suffixes: [
      { suffix: '-able / -ible', usage: 'Sıfat eki (modal ile sık kullanılır)', example: 'readable, possible, visible' },
      { suffix: '-ful', usage: 'Sıfat eki', example: 'You should be careful / helpful' },
    ],
    tip: 'ASLA "She cans swim" veya "He musts go" yazma! Modal\'lardan sonra asla -s eki gelmez.',
    quiz: {
      question: 'Hangisi doğrudur?',
      options: ['She cans swim.', 'She can swims.', 'She can swim.', 'She can to swim.'],
      correctIndex: 2,
    },
  },
  {
    id: '4',
    title: 'Conditionals',
    level: 'Intermediate',
    levelColor: '#F59E0B',
    subtitle: 'If clauses ve koşul türleri',
    description: 'Koşul cümleleri, bir şeyin gerçekleşmesinin başka bir koşula bağlı olduğunu ifade eder. İngilizce\'de 4 temel türü vardır.',
    rules: [
      'Tip 0 (genel gerçekler): If + present, present → "If you heat water, it boils."',
      'Tip 1 (gerçek/olası gelecek): If + present, will + base → "If it rains, I will stay home."',
      'Tip 2 (gerçek dışı şimdi): If + past, would + base → "If I had money, I would travel."',
      'Tip 3 (gerçek dışı geçmiş): If + past perfect, would have + V3 → "If I had studied, I would have passed."',
      '"If" cümlesi başta gelirse virgül kullanılır; sonda gelirse virgül gerekmez.',
    ],
    examples: [
      'If you mix red and blue, you get purple. (Tip 0)',
      'If she studies hard, she will pass the exam. (Tip 1)',
      'If I were you, I would accept the offer. (Tip 2)',
      'If they had arrived earlier, they would have seen the show. (Tip 3)',
    ],
    suffixes: [
      { suffix: '-ed', usage: 'Geçmiş zaman eki (Tip 2 & 3)', example: 'If I worked... / If I had worked...' },
      { suffix: '-en', usage: 'Geçmiş ortaç eki (Tip 3)', example: 'If I had taken... / spoken / written' },
    ],
    tip: 'Tip 2\'de "I were" kullanımı dilbilgisel açıdan doğrudur: "If I were you..." → "I was" değil!',
    quiz: {
      question: 'Hangi cümle Type 2 Conditional\'dır?',
      options: [
        'If it rains, I will stay home.',
        'If I have money, I travel.',
        'If I had money, I would travel.',
        'If I would have money, I travel.',
      ],
      correctIndex: 2,
    },
  },
  {
    id: '5',
    title: 'Passive Voice',
    level: 'Advanced',
    levelColor: '#EF4444',
    subtitle: 'Aktif → Pasif dönüşüm',
    description: 'Pasif yapıda özne eylemi gerçekleştirmek yerine eylemi alır. Yapım: be + past participle (V3).',
    rules: [
      'Aktif: Özne + Fiil + Nesne → Pasif: Nesne + be + V3 + (by + Özne)',
      'Simple Present: "The letter is written (by John)."',
      'Simple Past: "The cake was baked (by Mary)."',
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
      { suffix: '-ed', usage: 'Düzenli V3 (past participle)', example: 'cleaned, painted, finished' },
      { suffix: '-en', usage: 'Düzensiz V3', example: 'written, spoken, broken, taken' },
      { suffix: '-t', usage: 'Düzensiz V3', example: 'built, sent, spent, kept' },
    ],
    tip: 'Pasifi ne zaman kullan? Yapanı bilmiyorsak, önemsizse ya da zaten belliyse: "My bike was stolen." (kim çaldı önemli değil)',
    quiz: {
      question: '"They built the house in 1990." → Pasife çevirin:',
      options: [
        'The house is built in 1990.',
        'The house was built in 1990.',
        'The house has been built in 1990.',
        'The house had built in 1990.',
      ],
      correctIndex: 1,
    },
  },
  {
    id: '6',
    title: 'Relative Clauses',
    level: 'Advanced',
    levelColor: '#EF4444',
    subtitle: 'Who, Which, That, Where, When',
    description: 'Relative clauses (ilgi cümleleri), bir isim hakkında ek bilgi vermek için kullanılır. Relative pronoun ile başlarlar.',
    rules: [
      '"Who" → kişiler için: The man who called you is here.',
      '"Which" → şeyler/hayvanlar için: The book which I bought is great.',
      '"That" → kişi veya şeyler (gayri resmi): The car that I drive is old.',
      '"Where" → yerler için: The city where I was born is beautiful.',
      '"Whose" → sahiplik: The girl whose bag was stolen called the police.',
      'Defining (tanımlayıcı) → virgül yok. Non-defining (ek bilgi) → virgül var.',
    ],
    examples: [
      'The woman who lives next door is a doctor. (defining)',
      'My car, which is red, needs a new engine. (non-defining)',
      'This is the restaurant where we had dinner last week.',
      'I met a man whose sister works at Google.',
    ],
    suffixes: [
      { suffix: '-er', usage: 'Eylem yapan kişi', example: 'teacher, worker, speaker' },
      { suffix: '-ist', usage: 'Uzman kişi', example: 'artist, scientist, pianist' },
      { suffix: '-ee', usage: 'Eylemi alan kişi', example: 'employee, trainee, interviewee' },
    ],
    tip: '"That" yalnızca defining clause\'da kullanılır. Non-defining\'de "which" veya "who" kullan.',
    quiz: {
      question: 'Hangi cümle non-defining relative clause içerir?',
      options: [
        'The man who called is here.',
        'My car, which is red, is fast.',
        'The book that I read is good.',
        'She is the girl who won.',
      ],
      correctIndex: 1,
    },
  },
  {
    id: '7',
    title: 'Comparative & Superlative',
    level: 'Beginner',
    levelColor: '#10B981',
    subtitle: 'Bigger, the biggest, more beautiful',
    description: 'Comparative (karşılaştırma) iki şeyi kıyaslarken, superlative (üstünlük) üç veya daha fazla şey arasındaki en uç özelliği anlatır.',
    rules: [
      'Kısa sıfatlar (1-2 hece) → -er / -est: tall → taller → tallest',
      'Uzun sıfatlar (3+ hece) → more / most: beautiful → more beautiful → most beautiful',
      'Düzensiz: good → better → best | bad → worse → worst | far → farther → farthest',
      'Comparative\'de "than" kullanılır: She is taller than her brother.',
      'Superlative\'de "the" kullanılır: He is the tallest in the class.',
      '-y ile biten sıfatlar → y→i+er/est: happy → happier → happiest',
    ],
    examples: [
      'This box is heavier than that one.',
      'Mount Everest is the highest mountain in the world.',
      'She is more intelligent than I thought.',
      'Today is the worst day of my week.',
    ],
    suffixes: [
      { suffix: '-er', usage: 'Comparative (kısa sıfat)', example: 'taller, faster, cheaper, happier' },
      { suffix: '-est', usage: 'Superlative (kısa sıfat)', example: 'tallest, fastest, happiest' },
    ],
    tip: 'Hece sayısını say: 1-2 hece → -er/-est. 3+ hece → more/most. "Beautiful" → more beautiful (asla beautifuler değil!)',
    quiz: {
      question: 'Hangi seçenek doğrudur?',
      options: ['more tall than', 'taller than', 'tallest than', 'most tall than'],
      correctIndex: 1,
    },
  },
  {
    id: '8',
    title: 'Question Tags',
    level: 'Intermediate',
    levelColor: '#F59E0B',
    subtitle: '...isn\'t it? ...don\'t you?',
    description: 'Question tags (ek sorular), cümle sonuna eklenen kısa soru ekleridir. Onay almak veya doğrulamak için kullanılır.',
    rules: [
      'Olumlu cümle → olumsuz tag: "You are tired, aren\'t you?"',
      'Olumsuz cümle → olumlu tag: "She can\'t drive, can she?"',
      'Ana cümledeki yardımcı fiil/modal tag\'da tekrar kullanılır',
      'Yardımcı fiil yoksa do/does/did kullanılır: "She works here, doesn\'t she?"',
      '"I am" istisnası → "aren\'t I?": "I\'m right, aren\'t I?"',
      '"Let\'s" ile → "shall we?": "Let\'s take a break, shall we?"',
    ],
    examples: [
      'It\'s a beautiful day, isn\'t it?',
      'You didn\'t go to the party, did you?',
      'She has been working hard, hasn\'t she?',
      'Let\'s take a break, shall we?',
    ],
    tip: 'Temel kural: TERS çevir! Olumlu → olumsuz tag. Olumsuz → olumlu tag. İkisi de olumlu OLMAZ.',
    quiz: {
      question: '"You speak French, ___ ___?"',
      options: ['do you', 'don\'t you', 'aren\'t you', 'can you'],
      correctIndex: 1,
    },
  },
  {
    id: '9',
    title: 'Gerunds & Infinitives',
    level: 'Advanced',
    levelColor: '#EF4444',
    subtitle: 'V-ing (gerund) vs To + V (infinitive)',
    description: 'Gerund, fiilden türetilmiş isim görevinde kullanılan -ing ekli yapıdır. Infinitive ise "to + yalın fiil" biçimidir. Bazı fiiller sadece biriyle kullanılır.',
    rules: [
      'Gerund (V-ing) → özne olarak: Swimming is great exercise.',
      'Gerund → edat sonrasında: good at swimming, tired of waiting',
      'Gerund → belirli fiillerden sonra: enjoy, avoid, finish, mind, suggest + V-ing',
      'Infinitive → amaç belirtmek: I went there to buy milk.',
      'Infinitive → belirli fiillerden sonra: want, need, hope, decide, plan + to V',
      'İkisi de mümkün ama anlam FARKLI: "stop smoking" (bırakmak) ≠ "stop to smoke" (durup içmek)',
    ],
    examples: [
      'I enjoy reading novels in the evenings.',
      'She decided to leave early.',
      'He stopped smoking. (= sigarayı bıraktı)',
      'He stopped to smoke. (= sigarayı içmek için durdu)',
    ],
    suffixes: [
      { suffix: '-ing', usage: 'Gerund eki', example: 'swimming, reading, working, studying' },
    ],
    tip: '"Sevme/Beğenme" fiilleri gerund alır: love, like, hate, enjoy, prefer → I love swimming. Ama "want" her zaman infinitive alır: I want to swim.',
    quiz: {
      question: 'Hangi fiilden sonra gerund (-ing) kullanılır?',
      options: ['want to run', 'decide to run', 'enjoy running', 'hope to run'],
      correctIndex: 2,
    },
  },
  {
    id: '10',
    title: 'Reported Speech',
    level: 'Advanced',
    levelColor: '#EF4444',
    subtitle: 'Dolaylı anlatım (aktarma)',
    description: 'Reported speech (dolaylı anlatım), bir kişinin söylediklerini başkasına aktarmak için kullanılır. Fiil zamanları genellikle bir adım geriye kayar.',
    rules: [
      'Present → Past: "I am tired." → She said she WAS tired.',
      'Past → Past Perfect: "I went." → He said he HAD GONE.',
      'Will → Would: "I will come." → She said she WOULD COME.',
      'Can → Could: "I can help." → He said he COULD help.',
      'Zaman ifadeleri değişir: now→then, today→that day, tomorrow→the next day',
      'This/these → that/those olarak değişir',
    ],
    examples: [
      '"I love pizza." → She said (that) she loved pizza.',
      '"I will call you." → He said he would call me.',
      '"I have finished." → She said she had finished.',
      '"Can you help me?" → He asked if I could help him.',
    ],
    tip: 'Bunu bir zaman makinesi gibi düşün: Her şey bir adım geçmişe kayar. Present→Past, Will→Would, Can→Could.',
    quiz: {
      question: '"I am studying." → She said she ___ studying.',
      options: ['is', 'was', 'will be', 'has been'],
      correctIndex: 1,
    },
  },
];

export default function GrammarScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuiz, setShowQuiz] = useState<Record<string, boolean>>({});

  const filteredTopics = topics.filter(topic => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || topic.level === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));
    setExploredIds(prev => new Set([...prev, id]));
  };

  const handleQuizAnswer = (topicId: string, selectedIndex: number) => {
    if (quizAnswers[topicId] === undefined) {
      setQuizAnswers(prev => ({ ...prev, [topicId]: selectedIndex }));
    }
  };

  const toggleQuiz = (topicId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowQuiz(prev => ({ ...prev, [topicId]: !prev[topicId] }));
    setQuizAnswers(prev => { const n = { ...prev }; delete n[topicId]; return n; });
  };

  const retryQuiz = (topicId: string) => {
    setQuizAnswers(prev => { const n = { ...prev }; delete n[topicId]; return n; });
  };

  const exploredCount = exploredIds.size;
  const totalCount = topics.length;
  const progress = exploredCount / totalCount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Grammar Rules</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Keşfedilen Konular</Text>
            <Text style={styles.progressCount}>{exploredCount}/{totalCount}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Konu ara..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
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
              const isExplored = exploredIds.has(topic.id);
              const quizShown = !!showQuiz[topic.id];
              const selectedAnswer = quizAnswers[topic.id];
              const answered = selectedAnswer !== undefined;
              const isCorrect = answered && selectedAnswer === topic.quiz.correctIndex;

              return (
                <View key={topic.id}>
                  <TouchableOpacity
                    style={[styles.topicCard, isExpanded && styles.topicCardExpanded]}
                    onPress={() => toggleExpand(topic.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.topicHeader}>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                      <View style={styles.topicBadges}>
                        {isExplored && (
                          <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginRight: 6 }} />
                        )}
                        <View style={[styles.levelBadge, { backgroundColor: topic.levelColor + '20' }]}>
                          <View style={[styles.levelDot, { backgroundColor: topic.levelColor }]} />
                          <Text style={[styles.topicLevel, { color: topic.levelColor }]}>{topic.level}</Text>
                        </View>
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
                              <Text style={styles.suffixExample}>Örnek: {s.example}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Tip */}
                      <View style={styles.tipCard}>
                        <Ionicons name="bulb" size={18} color="#D97706" />
                        <Text style={styles.tipText}>{topic.tip}</Text>
                      </View>

                      {/* Quiz */}
                      <View style={styles.detailSection}>
                        <TouchableOpacity
                          style={[styles.quizToggleBtn, { borderColor: topic.levelColor }]}
                          onPress={() => toggleQuiz(topic.id)}
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name={quizShown ? 'close-circle-outline' : 'help-circle-outline'}
                            size={18}
                            color={topic.levelColor}
                          />
                          <Text style={[styles.quizToggleBtnText, { color: topic.levelColor }]}>
                            {quizShown ? 'Quiz\'i Kapat' : 'Quiz Sorusunu Gör'}
                          </Text>
                        </TouchableOpacity>

                        {quizShown && (
                          <View style={styles.quizContainer}>
                            <Text style={styles.quizQuestion}>{topic.quiz.question}</Text>
                            {topic.quiz.options.map((option, i) => {
                              const isThisCorrect = i === topic.quiz.correctIndex;
                              const isThisSelected = i === selectedAnswer;
                              return (
                                <TouchableOpacity
                                  key={i}
                                  style={[
                                    styles.quizOption,
                                    answered && isThisCorrect && styles.quizOptionCorrect,
                                    answered && isThisSelected && !isThisCorrect && styles.quizOptionWrong,
                                  ]}
                                  onPress={() => handleQuizAnswer(topic.id, i)}
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
                                  <TouchableOpacity onPress={() => retryQuiz(topic.id)} style={styles.retryBtn}>
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
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Konu bulunamadı.</Text>
          )}
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#1E293B',
    paddingHorizontal: 20, marginTop: 20, marginBottom: 12,
  },

  progressContainer: { marginHorizontal: 20, marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  progressCount: { fontSize: 12, color: '#2EBC9D', fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#2EBC9D', borderRadius: 3 },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9',
    marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#1E293B' },

  filterContainer: { marginBottom: 16 },
  filterScroll: { paddingHorizontal: 16 },
  filterPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F1F5F9', marginHorizontal: 4,
  },
  filterPillActive: { backgroundColor: '#2EBC9D' },
  filterText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },

  listContainer: { paddingHorizontal: 20 },

  topicCard: {
    paddingVertical: 16, borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9', position: 'relative', justifyContent: 'center',
  },
  topicCardExpanded: { borderBottomWidth: 0 },
  topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  topicTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginRight: 8, flex: 1 },
  topicBadges: { flexDirection: 'row', alignItems: 'center' },
  levelBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  levelDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  topicLevel: { fontSize: 11, fontWeight: '600' },
  topicSubtitle: { fontSize: 14, color: '#64748B', paddingRight: 30 },
  chevron: { position: 'absolute', right: 0, top: '50%', transform: [{ translateY: -10 }] },

  detailContainer: {
    backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
  },
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
  suffixUsage: { fontSize: 12, color: '#6D28D9', flex: 1 },
  suffixExample: { fontSize: 13, color: '#475569', lineHeight: 20 },

  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#FFFBEB', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#FCD34D', marginBottom: 16,
  },
  tipText: { flex: 1, fontSize: 13, color: '#92400E', lineHeight: 20 },

  quizToggleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 10, borderRadius: 12,
    borderWidth: 2, backgroundColor: 'transparent',
  },
  quizToggleBtnText: { fontWeight: '700', fontSize: 14 },

  quizContainer: { marginTop: 12 },
  quizQuestion: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 12, lineHeight: 22 },

  quizOption: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12,
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
  retryBtn: { backgroundColor: '#DC2626', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  retryText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  emptyText: { textAlign: 'center', marginTop: 40, color: '#94A3B8', fontSize: 16 },
});
