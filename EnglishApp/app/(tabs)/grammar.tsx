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

// ─────────────────────────── GRAMMAR DATA ───────────────────────────

const grammarFilters = ['All', 'Beginner', 'Intermediate', 'Advanced'];

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

const grammarTopics: GrammarTopic[] = [
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

// ─────────────────────────── TENSES DATA ───────────────────────────

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
    id: 't1',
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
    id: 't2',
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
    id: 't3',
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
    id: 't4',
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
    id: 't5',
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
    id: 't6',
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
    id: 't7',
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
    id: 't8',
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
    id: 't9',
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

const TENSE_GROUP_FILTERS: TenseGroup[] = ['All', 'Present', 'Past', 'Future'];
const TENSE_GROUP_COLORS: Record<TenseGroup, string> = {
  All: '#64748B',
  Present: '#10B981',
  Past: '#F59E0B',
  Future: '#8B5CF6',
};

// ─────────────────────────── COMPONENT ───────────────────────────

type ActiveTab = 'grammar' | 'tenses';

export default function GrammarScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('grammar');

  // Grammar state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedGrammarId, setExpandedGrammarId] = useState<string | null>(null);
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());
  const [grammarQuizAnswers, setGrammarQuizAnswers] = useState<Record<string, number>>({});
  const [grammarShowQuiz, setGrammarShowQuiz] = useState<Record<string, boolean>>({});

  // Tenses state
  const [expandedTenseId, setExpandedTenseId] = useState<string | null>(null);
  const [activeTenseGroup, setActiveTenseGroup] = useState<TenseGroup>('All');
  const [tenseQuizAnswers, setTenseQuizAnswers] = useState<Record<string, number>>({});
  const [tenseShowQuiz, setTenseShowQuiz] = useState<Record<string, boolean>>({});

  // ── Grammar helpers ──
  const filteredTopics = grammarTopics.filter(topic => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || topic.level === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleGrammarExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedGrammarId(prev => (prev === id ? null : id));
    setExploredIds(prev => new Set([...prev, id]));
  };

  const handleGrammarQuizAnswer = (topicId: string, selectedIndex: number) => {
    if (grammarQuizAnswers[topicId] === undefined) {
      setGrammarQuizAnswers(prev => ({ ...prev, [topicId]: selectedIndex }));
    }
  };

  const toggleGrammarQuiz = (topicId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setGrammarShowQuiz(prev => ({ ...prev, [topicId]: !prev[topicId] }));
    setGrammarQuizAnswers(prev => { const n = { ...prev }; delete n[topicId]; return n; });
  };

  const retryGrammarQuiz = (topicId: string) => {
    setGrammarQuizAnswers(prev => { const n = { ...prev }; delete n[topicId]; return n; });
  };

  // ── Tenses helpers ──
  const filteredTenses = tensesData.filter(t => activeTenseGroup === 'All' || t.group === activeTenseGroup);

  const toggleTenseExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTenseId(expandedTenseId === id ? null : id);
  };

  const handleTenseQuizAnswer = (tenseId: string, selectedIndex: number) => {
    if (tenseQuizAnswers[tenseId] === undefined) {
      setTenseQuizAnswers(prev => ({ ...prev, [tenseId]: selectedIndex }));
    }
  };

  const toggleTenseQuiz = (tenseId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTenseShowQuiz(prev => ({ ...prev, [tenseId]: !prev[tenseId] }));
    setTenseQuizAnswers(prev => { const n = { ...prev }; delete n[tenseId]; return n; });
  };

  const retryTenseQuiz = (tenseId: string) => {
    setTenseQuizAnswers(prev => { const n = { ...prev }; delete n[tenseId]; return n; });
  };

  const exploredCount = exploredIds.size;
  const totalCount = grammarTopics.length;
  const progress = exploredCount / totalCount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ── Tab Switcher ── */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'grammar' && styles.tabBtnActive]}
            onPress={() => setActiveTab('grammar')}
            activeOpacity={0.7}
          >
            <Ionicons name="book-outline" size={16} color={activeTab === 'grammar' ? '#fff' : '#64748B'} />
            <Text style={[styles.tabBtnText, activeTab === 'grammar' && styles.tabBtnTextActive]}>Grammar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'tenses' && styles.tabBtnActive]}
            onPress={() => setActiveTab('tenses')}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={16} color={activeTab === 'tenses' ? '#fff' : '#64748B'} />
            <Text style={[styles.tabBtnText, activeTab === 'tenses' && styles.tabBtnTextActive]}>Tenses</Text>
          </TouchableOpacity>
        </View>

        {/* ══════════════ GRAMMAR TAB ══════════════ */}
        {activeTab === 'grammar' && (
          <>
            <Text style={styles.headerTitle}>Grammar Rules</Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Keşfedilen Konular</Text>
                <Text style={styles.progressCount}>{exploredCount}/{totalCount}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
              </View>
            </View>

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

            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {grammarFilters.map((filter) => (
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

            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => {
                  const isExpanded = expandedGrammarId === topic.id;
                  const isExplored = exploredIds.has(topic.id);
                  const quizShown = !!grammarShowQuiz[topic.id];
                  const selectedAnswer = grammarQuizAnswers[topic.id];
                  const answered = selectedAnswer !== undefined;
                  const isCorrect = answered && selectedAnswer === topic.quiz.correctIndex;

                  return (
                    <View key={topic.id}>
                      <TouchableOpacity
                        style={[styles.topicCard, isExpanded && styles.topicCardExpanded]}
                        onPress={() => toggleGrammarExpand(topic.id)}
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
                          <Text style={styles.detailDescription}>{topic.description}</Text>

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

                          <View style={styles.tipCard}>
                            <Ionicons name="bulb" size={18} color="#D97706" />
                            <Text style={styles.tipText}>{topic.tip}</Text>
                          </View>

                          <View style={styles.detailSection}>
                            <TouchableOpacity
                              style={[styles.quizToggleBtn, { borderColor: topic.levelColor }]}
                              onPress={() => toggleGrammarQuiz(topic.id)}
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
                                      onPress={() => handleGrammarQuizAnswer(topic.id, i)}
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
                                      <TouchableOpacity onPress={() => retryGrammarQuiz(topic.id)} style={styles.retryBtn}>
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
          </>
        )}

        {/* ══════════════ TENSES TAB ══════════════ */}
        {activeTab === 'tenses' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.tensesHeader}>
              <Text style={styles.headerTitle}>İngilizce Zamanlar</Text>
              <Text style={styles.tensesHeaderDesc}>{tensesData.length} Tense · Formüller · Sinyal Kelimeler · Quiz</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterWrapper}
              contentContainerStyle={styles.filterContent}
            >
              {TENSE_GROUP_FILTERS.map(group => (
                <TouchableOpacity
                  key={group}
                  style={[styles.tenseFilterPill, activeTenseGroup === group && { backgroundColor: TENSE_GROUP_COLORS[group] }]}
                  onPress={() => setActiveTenseGroup(group)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterText, activeTenseGroup === group && styles.filterTextActive]}>
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.tenseListContainer}>
              {filteredTenses.map(item => {
                const isExpanded = expandedTenseId === item.id;
                const quizShown = !!tenseShowQuiz[item.id];
                const selectedAnswer = tenseQuizAnswers[item.id];
                const answered = selectedAnswer !== undefined;
                const isCorrect = answered && selectedAnswer === item.quiz.correctIndex;

                return (
                  <View key={item.id}>
                    <TouchableOpacity
                      style={[styles.tenseCard, isExpanded && { borderColor: item.color + '60', borderWidth: 2 }]}
                      onPress={() => toggleTenseExpand(item.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.tenseCardHeader}>
                        <View style={[styles.tenseIconContainer, { backgroundColor: item.color + '20' }]}>
                          <Ionicons name={item.icon as any} size={24} color={item.color} />
                        </View>
                        <View style={styles.tenseTitleContainer}>
                          <View style={styles.tenseNameLine}>
                            <Text style={styles.tenseTitle}>{item.name}</Text>
                            <View style={[styles.tenseGroupBadge, { backgroundColor: item.color + '20' }]}>
                              <Text style={[styles.tenseGroupBadgeText, { color: item.color }]}>{item.group}</Text>
                            </View>
                          </View>
                          <Text style={styles.tenseSubtitle}>{item.trName}</Text>
                        </View>
                        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#94A3B8" />
                      </View>

                      {isExpanded && (
                        <View style={styles.tenseExpandedContent}>
                          <View style={styles.tenseDivider} />

                          <View style={styles.tenseSection}>
                            <View style={styles.tenseSectionHeader}>
                              <Ionicons name="information-circle-outline" size={16} color="#64748B" />
                              <Text style={styles.tenseSectionTitle}>Kullanım</Text>
                            </View>
                            <Text style={styles.tenseSectionText}>{item.usage}</Text>
                          </View>

                          <View style={styles.tenseSection}>
                            <View style={styles.tenseSectionHeader}>
                              <Ionicons name="code-slash-outline" size={16} color="#64748B" />
                              <Text style={styles.tenseSectionTitle}>Formüller</Text>
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

                          <View style={styles.tenseSection}>
                            <View style={styles.tenseSectionHeader}>
                              <Ionicons name="key-outline" size={16} color="#64748B" />
                              <Text style={styles.tenseSectionTitle}>Sinyal Kelimeler</Text>
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

                          <View style={styles.tenseSection}>
                            <View style={styles.tenseSectionHeader}>
                              <Ionicons name="chatbubbles-outline" size={16} color="#64748B" />
                              <Text style={styles.tenseSectionTitle}>Örnekler</Text>
                            </View>
                            {item.examples.map((ex, i) => (
                              <View key={i} style={[styles.tenseExampleBox, { borderLeftColor: item.color }]}>
                                <Text style={styles.tenseExampleEn}>{ex.en}</Text>
                                <Text style={styles.tenseExampleTr}>{ex.tr}</Text>
                              </View>
                            ))}
                          </View>

                          <View style={styles.tenseSection}>
                            <TouchableOpacity
                              style={[styles.tenseQuizToggleBtn, { backgroundColor: item.color }]}
                              onPress={() => toggleTenseQuiz(item.id)}
                              activeOpacity={0.8}
                            >
                              <Ionicons name={quizShown ? 'close-circle-outline' : 'bulb-outline'} size={18} color="#FFFFFF" />
                              <Text style={styles.tenseQuizToggleBtnText}>
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
                                      onPress={() => handleTenseQuizAnswer(item.id, i)}
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
                                      <TouchableOpacity onPress={() => retryTenseQuiz(item.id)} style={styles.retryBtn}>
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
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  // ── Tab Switcher ──
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  tabBtnActive: { backgroundColor: '#2EBC9D' },
  tabBtnText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  tabBtnTextActive: { color: '#FFFFFF' },

  // ── Grammar ──
  headerTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#1E293B',
    paddingHorizontal: 20, marginTop: 16, marginBottom: 12,
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

  // ── Tenses ──
  tensesHeader: { paddingHorizontal: 20, paddingBottom: 8 },
  tensesHeaderDesc: { fontSize: 14, color: '#64748B', paddingHorizontal: 20, marginBottom: 8 },

  filterWrapper: { marginBottom: 16 },
  filterContent: { paddingHorizontal: 16, flexDirection: 'row' },
  tenseFilterPill: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F1F5F9', marginRight: 8,
  },

  tenseListContainer: { paddingHorizontal: 16 },

  tenseCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    borderWidth: 1.5, borderColor: '#F1F5F9',
  },
  tenseCardHeader: { flexDirection: 'row', alignItems: 'center' },
  tenseIconContainer: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tenseTitleContainer: { flex: 1, marginLeft: 14 },
  tenseNameLine: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  tenseTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  tenseGroupBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  tenseGroupBadgeText: { fontSize: 11, fontWeight: '700' },
  tenseSubtitle: { fontSize: 13, color: '#94A3B8', marginTop: 2 },

  tenseExpandedContent: { marginTop: 14 },
  tenseDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },

  tenseSection: { marginBottom: 16 },
  tenseSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  tenseSectionTitle: {
    fontSize: 11, fontWeight: '700', color: '#64748B',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  tenseSectionText: { fontSize: 14, color: '#334155', lineHeight: 22 },

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

  tenseExampleBox: {
    borderLeftWidth: 4, borderRadius: 8, padding: 12, marginBottom: 8,
    backgroundColor: '#F0FDF4',
  },
  tenseExampleEn: { fontSize: 15, fontWeight: '600', color: '#166534', marginBottom: 4 },
  tenseExampleTr: { fontSize: 13, color: '#15803D', fontStyle: 'italic' },

  tenseQuizToggleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 11, borderRadius: 12,
  },
  tenseQuizToggleBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
