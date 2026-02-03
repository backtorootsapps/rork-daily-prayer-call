import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Volume2, Pause, Play, SkipForward, SkipBack } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { CONFESSION_AUDIOS } from '@/constants/confessions';

const CONFESSION_TOPICS = [
  { id: 'health', name: 'Health', color: '#4ECDC4' },
  { id: 'healing', name: 'Healing', color: '#45B7AA' },
  { id: 'peace', name: 'Peace', color: '#36D7B7' },
  { id: 'anxiety', name: 'Anxiety', color: '#5DADE2' },
  { id: 'provision', name: 'Provision', color: '#F4D03F' },
  { id: 'finances', name: 'Finances', color: '#F5B041' },
  { id: 'identity', name: 'Identity', color: '#EB984E' },
  { id: 'worth', name: 'Worth', color: '#E59866' },
  { id: 'relationships', name: 'Relationships', color: '#EC7063' },
  { id: 'family', name: 'Family', color: '#F1948A' },
  { id: 'protection', name: 'Protection', color: '#AF7AC5' },
  { id: 'deliverance', name: 'Deliverance', color: '#A569BD' },
  { id: 'wisdom', name: 'Wisdom', color: '#5499C7' },
  { id: 'guidance', name: 'Guidance', color: '#5DADE2' },
  { id: 'strength', name: 'Strength', color: '#F39C12' },
  { id: 'perseverance', name: 'Perseverance', color: '#E67E22' },
  { id: 'faith', name: 'Faith', color: '#48C9B0' },
  { id: 'trust', name: 'Trust', color: '#45B39D' },
  { id: 'victory', name: 'Victory', color: '#F7DC6F' },
  { id: 'overcoming', name: 'Overcoming', color: '#F8C471' },
  { id: 'purpose', name: 'Purpose', color: '#85C1E9' },
  { id: 'calling', name: 'Calling', color: '#76D7C4' },
  { id: 'joy', name: 'Joy', color: '#FAD7A0' },
  { id: 'gratitude', name: 'Gratitude', color: '#ABEBC6' },
  { id: 'forgiveness', name: 'Forgiveness', color: '#D7BDE2' },
  { id: 'grace', name: 'Grace', color: '#D2B4DE' },
  { id: 'work', name: 'Work', color: '#AED6F1' },
  { id: 'career', name: 'Career', color: '#A9DFBF' },
  { id: 'spiritual-growth', name: 'Spiritual Growth', color: '#82E0AA' },
  { id: 'prayer', name: 'Prayer', color: '#7DCEA0' },
  { id: 'communion', name: 'Communion with God', color: '#73C6B6' },
  { id: 'hope', name: 'Hope', color: '#F9E79F' },
  { id: 'future', name: 'Future', color: '#FADBD8' },
  { id: 'love', name: 'Love', color: '#F5B7B1' },
  { id: 'compassion', name: 'Compassion', color: '#EDBB99' },
  { id: 'humility', name: 'Humility', color: '#D5D8DC' },
  { id: 'servanthood', name: 'Servanthood', color: '#ABB2B9' },
  { id: 'renewal', name: 'Renewal', color: '#A3E4D7' },
  { id: 'transformation', name: 'Transformation', color: '#AED6F1' },
  { id: 'spiritual-warfare', name: 'Spiritual Warfare', color: '#E74C3C' },
  { id: 'patience', name: 'Patience', color: '#BB8FCE' },
  { id: 'waiting', name: 'Waiting', color: '#C39BD3' },
  { id: 'obedience', name: 'Obedience', color: '#7FB3D5' },
  { id: 'submission', name: 'Submission', color: '#76D7C4' },
  { id: 'fruitfulness', name: 'Fruitfulness', color: '#7DCEA0' },
  { id: 'multiplication', name: 'Multiplication', color: '#F7DC6F' },
  { id: 'rest', name: 'Rest', color: '#85C1E9' },
] as const;

type ConfessionTopic = (typeof CONFESSION_TOPICS)[number];

type BubbleLayout = {
  topic: ConfessionTopic;
  index: number;
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const BUBBLE_SIZE = 100;
const BUBBLE_GAP = 25;
const ROWS = 5;
const ROW_VERTICAL_OVERLAP = 0.15;

const getBubbleTextColor = (bgColor: string): string => {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#111111' : '#ffffff';
};

interface BubbleProps {
  item: BubbleLayout;
  isSelected: boolean;
  onPress: (topic: ConfessionTopic) => void;
  scrollX: Animated.Value;
  windowWidth: number;
}

const Bubble = React.memo<BubbleProps>(({ item, isSelected, onPress, scrollX, windowWidth }) => {
  const scaleAnim = useRef<Animated.Value>(new Animated.Value(1)).current;

  // Calculate position-based animations
  // We want the bubble to scale up when it's in the center of the screen
  // and translate slightly to create a fish-eye effect
  
  const itemCenter = item.x + BUBBLE_SIZE / 2;
  const screenCenter = windowWidth / 2;
  // The translateX value required to center this bubble
  const centerOffset = screenCenter - itemCenter;
  
  // Range of influence - how far from center does the effect apply
  const range = windowWidth * 0.8;
  
  const scrollScale = scrollX.interpolate({
    inputRange: [centerOffset - range, centerOffset, centerOffset + range],
    outputRange: [0.75, 1.4, 0.75],
    extrapolate: 'clamp',
  });

  const scrollTranslateX = scrollX.interpolate({
    inputRange: [centerOffset - range, centerOffset, centerOffset + range],
    outputRange: [-40, 0, 40], // Push away from center
    extrapolate: 'clamp',
  });

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 130,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress(item.topic);
  }, [item.topic, onPress]);

  const size = isSelected ? BUBBLE_SIZE * 1.1 : BUBBLE_SIZE; // Reduced selection growth since we have zoom
  const radius = size / 2;

  // Combine scaling
  const finalScale = Animated.multiply(scaleAnim, scrollScale);

  return (
    <Animated.View
      style={[
        styles.bubbleAbs,
        {
          left: item.x,
          top: item.y,
          width: BUBBLE_SIZE,
          height: BUBBLE_SIZE,
          zIndex: isSelected ? 50 : 1,
          transform: [
            { translateX: scrollTranslateX },
            { scale: finalScale }
          ],
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        testID={`confessionTopic-${item.topic.id}`}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[
          styles.bubble,
          {
            backgroundColor: item.topic.color,
            width: size,
            height: size,
            borderRadius: radius,
          },
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            {
              color: getBubbleTextColor(item.topic.color),
              fontSize: 13, // Fixed base font size, scale handles the rest
            },
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {item.topic.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});
Bubble.displayName = 'Bubble';

export default function ConfessionsScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const [selectedTopic, setSelectedTopic] = useState<ConfessionTopic | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  const cardAnim = useRef<Animated.Value>(new Animated.Value(0)).current;
  const translateX = useRef<Animated.Value>(new Animated.Value(0)).current;
  const translateXValueRef = useRef<number>(0);
  const panStartXRef = useRef<number>(0);

  useEffect(() => {
    const id = translateX.addListener(({ value }) => {
      translateXValueRef.current = value;
    });
    return () => {
      translateX.removeListener(id);
    };
  }, [translateX]);

  const { bubbleLayouts, contentWidth, contentHeight, bounds } = useMemo(() => {
    const rowSpacing = Math.round(BUBBLE_SIZE * (1 - ROW_VERTICAL_OVERLAP));
    const colSpacing = BUBBLE_SIZE + BUBBLE_GAP;

    const cols = Math.ceil(CONFESSION_TOPICS.length / ROWS);
    const contentW = cols * colSpacing + BUBBLE_SIZE;
    const contentH = ROWS * rowSpacing + BUBBLE_SIZE;

    const padding = 18;
    const minX = Math.min(0, windowWidth - (contentW + padding * 2));
    const maxX = 0;

    const layouts: BubbleLayout[] = CONFESSION_TOPICS.map((topic, i) => {
      const row = i % ROWS;
      const col = Math.floor(i / ROWS);

      const isOffsetRow = row % 2 === 1;
      const x = padding + col * colSpacing + (isOffsetRow ? colSpacing / 2 : 0);
      const y = 18 + row * rowSpacing;

      return { topic, index: i, x, y };
    });

    return {
      bubbleLayouts: layouts,
      contentWidth: contentW + padding * 2,
      contentHeight: contentH + 36,
      bounds: { minX, maxX },
    };
  }, [windowWidth]);

  useEffect(() => {
    const initial = clamp(0, bounds.minX, bounds.maxX);
    translateX.setValue(initial);
  }, [bounds.maxX, bounds.minX, translateX]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        console.log('[Confessions] cleaning up audio');
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const handleTopicSelect = useCallback(
    async (topic: ConfessionTopic) => {
      console.log('[Confessions] topic selected:', topic.id, topic.name);
      
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      
      setSelectedTopic(topic);
      setIsPlaying(false);
      setCurrentIndex(0);
      
      Animated.spring(cardAnim, {
        toValue: 1,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();
    },
    [cardAnim]
  );

  const playAudio = useCallback(async (index: number) => {
    if (!selectedTopic) return;
    
    const audios = CONFESSION_AUDIOS[selectedTopic.id] || [];
    if (audios.length === 0) {
      console.log('[Confessions] no audios for:', selectedTopic.id);
      return;
    }
    
    if (index < 0 || index >= audios.length) return;
    
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      
      console.log('[Confessions] loading audio:', audios[index]);
      const { sound } = await Audio.Sound.createAsync(
        { uri: audios[index] },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            console.log('[Confessions] audio finished, playing next');
            if (index < audios.length - 1) {
              setCurrentIndex(index + 1);
            } else {
              setIsPlaying(false);
              setCurrentIndex(0);
            }
          }
        }
      );
      
      soundRef.current = sound;
      setIsPlaying(true);
      setCurrentIndex(index);
    } catch (error) {
      console.error('[Confessions] error playing audio:', error);
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (isPlaying && currentIndex >= 0) {
      playAudio(currentIndex);
    }
  }, [currentIndex]);

  const handlePlayPause = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!selectedTopic) return;
    
    const audios = CONFESSION_AUDIOS[selectedTopic.id] || [];
    if (audios.length === 0) return;
    
    if (isPlaying) {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
      setIsPlaying(false);
    } else {
      if (soundRef.current) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      } else {
        await playAudio(currentIndex);
      }
    }
  }, [selectedTopic, isPlaying, currentIndex, playAudio]);

  const handleNext = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!selectedTopic) return;
    const audios = CONFESSION_AUDIOS[selectedTopic.id] || [];
    if (currentIndex < audios.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [selectedTopic, currentIndex]);

  const handlePrevious = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);
        return dx > 6 && dx > dy;
      },
      onPanResponderGrant: () => {
        translateX.stopAnimation((value: number) => {
          panStartXRef.current = value;
        });
      },
      onPanResponderMove: (_evt, gestureState) => {
        const next = clamp(panStartXRef.current + gestureState.dx, bounds.minX, bounds.maxX);
        translateX.setValue(next);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const current = translateXValueRef.current;
        const projected = current + gestureState.vx * 220;
        const target = clamp(projected, bounds.minX, bounds.maxX);

        Animated.spring(translateX, {
          toValue: target,
          friction: 10,
          tension: 120,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminate: () => {
        const current = translateXValueRef.current;
        const target = clamp(current, bounds.minX, bounds.maxX);
        Animated.spring(translateX, {
          toValue: target,
          friction: 10,
          tension: 120,
          useNativeDriver: true,
        }).start();
      },
    });
  }, [bounds.maxX, bounds.minX, translateX]);

  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 0],
  });

  return (
    <View style={styles.container} testID="confessionsScreen">
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Confessions</Text>
          <Text style={styles.headerSubtitle}>Swipe sideways like Apple Watch • Tap to play</Text>
        </View>
      </SafeAreaView>

      <View style={styles.stage} {...panResponder.panHandlers} testID="confessionsStage">
        <Animated.View
          style={[
            styles.honeycomb,
            {
              width: contentWidth,
              height: contentHeight,
              transform: [{ translateX }],
            },
          ]}
          pointerEvents="box-none"
        >
          {bubbleLayouts.map((b) => (
            <Bubble
              key={b.topic.id}
              item={b}
              isSelected={selectedTopic?.id === b.topic.id}
              onPress={handleTopicSelect}
              scrollX={translateX}
              windowWidth={windowWidth}
            />
          ))}
        </Animated.View>
      </View>

      {selectedTopic ? (
        <Animated.View
          style={[
            styles.bottomCard,
            {
              transform: [{ translateY: cardTranslateY }],
              opacity: cardAnim,
            },
          ]}
          testID="confessionsBottomCard"
        >
          <SafeAreaView edges={['bottom']} style={styles.cardSafeArea}>
            <View style={styles.cardContent}>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { color: selectedTopic.color }]}>{selectedTopic.name}</Text>
                <Text style={styles.cardDescription}>
                  {CONFESSION_AUDIOS[selectedTopic.id]?.length || 0} confessions • {currentIndex + 1}/{CONFESSION_AUDIOS[selectedTopic.id]?.length || 0}
                </Text>
              </View>
              <View style={styles.controls}>
                <TouchableOpacity
                  testID="confessionsPreviousButton"
                  style={styles.controlButton}
                  onPress={handlePrevious}
                  disabled={currentIndex === 0}
                  activeOpacity={0.7}
                >
                  <SkipBack size={20} color={currentIndex === 0 ? '#555' : '#fff'} />
                </TouchableOpacity>
                <TouchableOpacity
                  testID="confessionsPlayButton"
                  style={[styles.playButton, { backgroundColor: selectedTopic.color }]}
                  onPress={handlePlayPause}
                  activeOpacity={0.85}
                  disabled={(CONFESSION_AUDIOS[selectedTopic.id]?.length || 0) === 0}
                >
                  {isPlaying ? (
                    <Pause size={24} color={getBubbleTextColor(selectedTopic.color)} />
                  ) : (
                    <Play size={24} color={getBubbleTextColor(selectedTopic.color)} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  testID="confessionsNextButton"
                  style={styles.controlButton}
                  onPress={handleNext}
                  disabled={currentIndex >= (CONFESSION_AUDIOS[selectedTopic.id]?.length || 0) - 1}
                  activeOpacity={0.7}
                >
                  <SkipForward size={20} color={currentIndex >= (CONFESSION_AUDIOS[selectedTopic.id]?.length || 0) - 1 ? '#555' : '#fff'} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <View style={styles.hintContainer} pointerEvents="none">
          <SafeAreaView edges={['bottom']} style={styles.hintSafeArea}>
            <View style={styles.hintCard}>
              <Text style={styles.hintText}>Swipe sideways to browse • Tap a topic to begin listening</Text>
              <View style={styles.hintArrow}>
                <ArrowRight size={20} color="#ffffff" />
              </View>
            </View>
          </SafeAreaView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  safeArea: {
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8b8b8b',
    marginTop: 4,
  },
  stage: {
    flex: 1,
    overflow: 'hidden' as const,
  },
  honeycomb: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
  },
  bubbleAbs: {
    position: 'absolute' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  bubble: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  bubbleText: {
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    paddingHorizontal: 10,
  },
  bottomCard: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 22,
  },
  cardSafeArea: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  cardContent: {
    flexDirection: 'column' as const,
  },
  cardTextContainer: {
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  hintContainer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
  },
  hintSafeArea: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  hintCard: {
    backgroundColor: 'rgba(44,44,46,0.92)',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  hintText: {
    fontSize: 15,
    color: '#ffffff',
    flex: 1,
  },
  hintArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginLeft: 12,
  },
});
