import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radii, spacing } from '../theme';
import Button from '../components/Button';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width;

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
    description:
      'Seu companheiro de saúde para gerenciar o diabetes de forma simples, segura e eficiente.',
  },
  {
    id: '2',
    icon: 'pulse',
    title: 'Acompanhe sua Glicose',
    description:
      'Registre medições, visualize gráficos e acompanhe sua evolução ao longo do tempo.',
  },
  {
    id: '3',
    icon: 'nutrition',
    title: 'Plano Alimentar',
    description:
      'Receba dicas de alimentação e mantenha uma dieta equilibrada para o seu bem-estar.',
  },
  {
    id: '4',
    icon: 'medkit',
    title: 'Exames e Hospitais',
    description:
      'Organize seus exames e encontre hospitais parceiros perto de você.',
  },
];

interface Props {
  onDone: () => void;
}

function Dot({ scrollX, index }: { scrollX: Animated.Value; index: number }) {
  const inputRange = [
    (index - 1) * SLIDE_WIDTH,
    index * SLIDE_WIDTH,
    (index + 1) * SLIDE_WIDTH,
  ];

  const width = scrollX.interpolate({
    inputRange,
    outputRange: [8, 22, 8],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[styles.dot, { width, backgroundColor: colors.primary }]}
    />
  );
}

interface SlideContentProps {
  item: Slide;
  index: number;
  scrollX: Animated.Value;
}

function SlideContent({ item, index, scrollX }: SlideContentProps) {
  const inputRange = [
    (index - 1) * SLIDE_WIDTH,
    index * SLIDE_WIDTH,
    (index + 1) * SLIDE_WIDTH,
  ];

  const contentStyle = {
    opacity: scrollX.interpolate({
      inputRange,
      outputRange: [0.35, 1, 0.35],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateX: scrollX.interpolate({
          inputRange,
          outputRange: [40, 0, -40],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.slideInner, contentStyle]}>
        <View style={styles.iconWrap}>
          <View style={styles.iconRing} />
          <View style={styles.iconContainer}>
            <Ionicons name={item.icon} size={56} color={colors.primary} />
          </View>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen({ onDone }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onDone();
    }
  };

  const isLast = currentIndex === slides.length - 1;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.skipContainer}>
        {!isLast ? (
          <Pressable onPress={onDone} hitSlop={12} style={styles.skipButton}>
            <Text style={styles.skipText}>Pular</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.list}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
            listener: handleScroll,
          }
        )}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: SLIDE_WIDTH,
          offset: SLIDE_WIDTH * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <SlideContent item={item} index={index} scrollX={scrollX} />
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <Dot key={index} scrollX={scrollX} index={index} />
          ))}
        </View>

        <Button
          title={isLast ? 'Começar' : 'Próximo'}
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  skipButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray400,
  },
  list: {
    flex: 1,
  },
  slide: {
    width: SLIDE_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  slideInner: {
    alignItems: 'center',
  },
  iconWrap: {
    width: 176,
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  iconRing: {
    position: 'absolute',
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: colors.green50,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.gray800,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: fontSize.base,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    height: 8,
  },
  dot: {
    height: 8,
    borderRadius: radii.full,
  },
  nextButton: {
    width: '100%',
  },
});
