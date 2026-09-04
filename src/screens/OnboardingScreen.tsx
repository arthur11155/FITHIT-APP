import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radii } from '../theme';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: '1',
    icon: 'heart',
    title: 'Bem-vindo ao FITHIT',
    description: 'Seu companheiro de saúde para gerenciar diabetes de forma simples e eficiente.',
  },
  {
    id: '2',
    icon: 'pulse',
    title: 'Acompanhe sua Glicose',
    description: 'Registre medições, veja gráficos e acompanhe sua evolução ao longo do tempo.',
  },
  {
    id: '3',
    icon: 'nutrition',
    title: 'Plano Alimentar',
    description: 'Receba dicas de alimentação e mantenha uma dieta equilibrada para seu bem-estar.',
  },
];

interface Props {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onDone();
    }
  };

  const handleSkip = () => {
    onDone();
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={64} color={colors.primary} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          {currentIndex < slides.length - 1 ? (
            <Button title="Pular" variant="outline" onPress={handleSkip} />
          ) : null}
          <Button
            title={currentIndex === slides.length - 1 ? 'Começar' : 'Próximo'}
            onPress={handleNext}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.green50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.gray800,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray200,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
