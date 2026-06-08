import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export const ONBOARDING_SEEN_KEY = '@onboarding_seen_v1';

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  accentColor: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: '1',
    icon: 'school',
    iconColor: '#2EBC9D',
    iconBg: '#E6FAF7',
    accentColor: '#2EBC9D',
    title: 'İngilizce Öğrenmeye\nHoş Geldin! 🎉',
    description:
      'Gramer, kelime, zaman kiplerini öğren. Oyunlar ve quizlerle kendini test et.',
  },
  {
    id: '2',
    icon: 'book',
    iconColor: '#0284C7',
    iconBg: '#E0F2FE',
    accentColor: '#0284C7',
    title: 'Gramer & Zaman\nKipleri',
    description:
      '12 gramer konusu ve 12 zaman kipini adım adım öğren. Her konu için açıklamalar ve örnekler mevcut.',
  },
  {
    id: '3',
    icon: 'text-outline',
    iconColor: '#0D9488',
    iconBg: '#CCFBF1',
    accentColor: '#0D9488',
    title: '500+ Kelime\nDağarcığı',
    description:
      'Geniş kelime bankasından çalış. Günün kelimesiyle her gün yeni bir kelime öğren.',
  },
  {
    id: '4',
    icon: 'game-controller',
    iconColor: '#7C3AED',
    iconBg: '#EDE9FE',
    accentColor: '#7C3AED',
    title: 'Kelime Oyunu\n& Quiz',
    description:
      'Öğrendiklerini oyun ve quizlerle pekiştir. Yanlışlarını takip et ve üzerinde çalış.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
    router.replace('/(tabs)');
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      finishOnboarding();
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={styles.slide}>
      <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={72} color={item.iconColor} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const currentSlide = slides[currentIndex];
  const isLast = currentIndex === slides.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={finishOnboarding}>
        <Text style={styles.skipText}>Geç</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex
                  ? [styles.dotActive, { backgroundColor: currentSlide.accentColor }]
                  : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: currentSlide.accentColor }]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          {isLast ? (
            <Text style={styles.nextBtnText}>Başla</Text>
          ) : (
            <>
              <Text style={styles.nextBtnText}>İleri</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  skipBtn: { alignSelf: 'flex-end', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 4 },
  skipText: { fontSize: 15, color: '#94A3B8', fontWeight: '500' },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 20,
  },
  iconWrapper: {
    width: 152,
    height: 152,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 36,
    paddingTop: 16,
    alignItems: 'center',
    gap: 28,
  },
  dotsRow: { flexDirection: 'row', gap: 8 },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 28 },
  dotInactive: { width: 8, backgroundColor: '#CBD5E1' },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
