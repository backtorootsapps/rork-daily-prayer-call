import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Volume2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const CONFESSION_TOPICS = [
  { id: '1', name: 'Health', color: '#4ECDC4' },
  { id: '2', name: 'Healing', color: '#45B7AA' },
  { id: '3', name: 'Peace', color: '#36D7B7' },
  { id: '4', name: 'Anxiety', color: '#5DADE2' },
  { id: '5', name: 'Provision', color: '#F4D03F' },
  { id: '6', name: 'Finances', color: '#F5B041' },
  { id: '7', name: 'Identity', color: '#EB984E' },
  { id: '8', name: 'Worth', color: '#E59866' },
  { id: '9', name: 'Relationships', color: '#EC7063' },
  { id: '10', name: 'Family', color: '#F1948A' },
  { id: '11', name: 'Protection', color: '#AF7AC5' },
  { id: '12', name: 'Deliverance', color: '#A569BD' },
  { id: '13', name: 'Wisdom', color: '#5499C7' },
  { id: '14', name: 'Guidance', color: '#5DADE2' },
  { id: '15', name: 'Strength', color: '#F39C12' },
  { id: '16', name: 'Perseverance', color: '#E67E22' },
  { id: '17', name: 'Faith', color: '#48C9B0' },
  { id: '18', name: 'Trust', color: '#45B39D' },
  { id: '19', name: 'Victory', color: '#F7DC6F' },
  { id: '20', name: 'Overcoming', color: '#F8C471' },
  { id: '21', name: 'Purpose', color: '#85C1E9' },
  { id: '22', name: 'Calling', color: '#76D7C4' },
  { id: '23', name: 'Joy', color: '#FAD7A0' },
  { id: '24', name: 'Gratitude', color: '#ABEBC6' },
  { id: '25', name: 'Forgiveness', color: '#D7BDE2' },
  { id: '26', name: 'Grace', color: '#D2B4DE' },
  { id: '27', name: 'Work', color: '#AED6F1' },
  { id: '28', name: 'Career', color: '#A9DFBF' },
  { id: '29', name: 'Spiritual Growth', color: '#82E0AA' },
  { id: '30', name: 'Prayer', color: '#7DCEA0' },
  { id: '31', name: 'Communion', color: '#73C6B6' },
  { id: '32', name: 'Hope', color: '#F9E79F' },
  { id: '33', name: 'Future', color: '#FADBD8' },
  { id: '34', name: 'Love', color: '#F5B7B1' },
  { id: '35', name: 'Compassion', color: '#EDBB99' },
  { id: '36', name: 'Humility', color: '#D5D8DC' },
  { id: '37', name: 'Servanthood', color: '#ABB2B9' },
  { id: '38', name: 'Renewal', color: '#A3E4D7' },
  { id: '39', name: 'Transformation', color: '#AED6F1' },
  { id: '40', name: 'Spiritual Warfare', color: '#E74C3C' },
  { id: '41', name: 'Patience', color: '#BB8FCE' },
  { id: '42', name: 'Waiting', color: '#C39BD3' },
  { id: '43', name: 'Obedience', color: '#7FB3D5' },
  { id: '44', name: 'Submission', color: '#76D7C4' },
  { id: '45', name: 'Fruitfulness', color: '#7DCEA0' },
  { id: '46', name: 'Multiplication', color: '#F7DC6F' },
  { id: '47', name: 'Rest', color: '#85C1E9' },
];

const BUBBLE_SIZE = 95;
const BUBBLE_MARGIN = 8;
const COLUMNS = 4;

interface BubbleProps {
  topic: typeof CONFESSION_TOPICS[0];
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

const Bubble: React.FC<BubbleProps> = ({ topic, isSelected, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const row = Math.floor(index / COLUMNS);
  const isOffsetRow = row % 2 === 1;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.bubbleWrapper,
        {
          transform: [{ scale: scaleAnim }],
          marginLeft: isOffsetRow ? BUBBLE_SIZE / 2 + BUBBLE_MARGIN : 0,
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={[
          styles.bubble,
          {
            backgroundColor: topic.color,
            width: isSelected ? BUBBLE_SIZE * 1.3 : BUBBLE_SIZE,
            height: isSelected ? BUBBLE_SIZE * 1.3 : BUBBLE_SIZE,
            borderRadius: isSelected ? (BUBBLE_SIZE * 1.3) / 2 : BUBBLE_SIZE / 2,
          },
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            {
              fontSize: isSelected ? 15 : 12,
              color: getBubbleTextColor(topic.color),
            },
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {topic.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const getBubbleTextColor = (bgColor: string): string => {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
};

export default function ConfessionsScreen() {
  const [selectedTopic, setSelectedTopic] = useState<typeof CONFESSION_TOPICS[0] | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const cardAnim = useRef(new Animated.Value(0)).current;

  const handleTopicSelect = useCallback((topic: typeof CONFESSION_TOPICS[0]) => {
    setSelectedTopic(topic);
    Animated.spring(cardAnim, {
      toValue: 1,
      friction: 8,
      tension: 65,
      useNativeDriver: true,
    }).start();
  }, [cardAnim]);

  const handlePlayAudio = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Play audio for:', selectedTopic?.name);
  }, [selectedTopic]);

  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const renderRows = () => {
    const rows: React.ReactElement[] = [];
    const totalRows = Math.ceil(CONFESSION_TOPICS.length / COLUMNS);

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const startIndex = rowIndex * COLUMNS;
      const rowTopics = CONFESSION_TOPICS.slice(startIndex, startIndex + COLUMNS);
      const isOffsetRow = rowIndex % 2 === 1;

      rows.push(
        <View
          key={`row-${rowIndex}`}
          style={[
            styles.row,
            {
              marginLeft: isOffsetRow ? (BUBBLE_SIZE / 2) : 0,
              marginTop: rowIndex === 0 ? 0 : -15,
            },
          ]}
        >
          {rowTopics.map((topic, colIndex) => (
            <Bubble
              key={topic.id}
              topic={topic}
              isSelected={selectedTopic?.id === topic.id}
              onPress={() => handleTopicSelect(topic)}
              index={startIndex + colIndex}
            />
          ))}
        </View>
      );
    }

    return rows;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Confessions</Text>
          <Text style={styles.headerSubtitle}>Tap a topic to hear God&apos;s Word</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.bubblesContainer}>
          {renderRows()}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {selectedTopic && (
        <Animated.View
          style={[
            styles.bottomCard,
            {
              transform: [{ translateY: cardTranslateY }],
              opacity: cardAnim,
            },
          ]}
        >
          <SafeAreaView edges={['bottom']} style={styles.cardSafeArea}>
            <View style={styles.cardContent}>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { color: selectedTopic.color }]}>
                  {selectedTopic.name}
                </Text>
                <Text style={styles.cardDescription}>
                  Tap play to hear confessions about {selectedTopic.name.toLowerCase()}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.playButton, { backgroundColor: selectedTopic.color }]}
                onPress={handlePlayAudio}
                activeOpacity={0.8}
              >
                <Volume2 size={24} color={getBubbleTextColor(selectedTopic.color)} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}

      {!selectedTopic && (
        <View style={styles.hintContainer}>
          <SafeAreaView edges={['bottom']} style={styles.hintSafeArea}>
            <View style={styles.hintCard}>
              <Text style={styles.hintText}>
                Tap a confession topic to begin listening
              </Text>
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
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  bubblesContainer: {
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row' as const,
    marginBottom: 8,
  },
  bubbleWrapper: {
    marginHorizontal: BUBBLE_MARGIN / 2,
    marginVertical: BUBBLE_MARGIN / 2,
  },
  bubble: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bubbleText: {
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    paddingHorizontal: 8,
  },
  bottomSpacer: {
    height: 150,
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
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  cardSafeArea: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  cardContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#999999',
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
    backgroundColor: '#2c2c2e',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  hintText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  hintArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3c3c3e',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
});
