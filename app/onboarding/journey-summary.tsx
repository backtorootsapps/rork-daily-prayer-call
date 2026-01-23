import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

const FAITH_VISION_LABELS: Record<string, { emoji: string; text: string }> = {
  'trust': { emoji: '🤝', text: 'trusting God\'s plan, even when it\'s hard' },
  'peace': { emoji: '☮️', text: 'finding lasting peace and rest' },
  'purpose': { emoji: '🎯', text: 'discovering my purpose' },
  'closer': { emoji: '❤️', text: 'feeling closer to God daily' },
  'growth': { emoji: '🌱', text: 'growing spiritually stronger' },
  'community': { emoji: '👥', text: 'deeper connections with others' },
};

const RELATIONSHIP_LABELS: Record<string, { emoji: string; text: string }> = {
  'ups-downs': { emoji: '🎢', text: 'it has its ups and downs' },
  'distant': { emoji: '😔', text: 'feeling a bit distant lately' },
  'starting': { emoji: '🌱', text: 'just starting or rebuilding' },
  'close': { emoji: '🙏', text: 'close and consistent' },
};

const OBSTACLE_LABELS: Record<string, { emoji: string; text: string }> = {
  'phone': { emoji: '📱', text: 'phone & social media distraction' },
  'focus': { emoji: '🧠', text: 'lack of focus or wandering thoughts' },
  'motivation': { emoji: '😰', text: 'lack of motivation or feeling dry' },
  'busyness': { emoji: '⏰', text: 'busyness and lack of time' },
};

export default function JourneySummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  const handleContinue = () => {
    router.push('/onboarding/prayer-power');
  };

  const handleBack = () => {
    router.back();
  };

  const userName = user.name || 'friend';
  const faithVision = user.faithVision?.[0] || 'trust';
  const godRelationship = user.godRelationship || 'ups-downs';
  const obstacles = user.faithObstacles || [];

  const visionData = FAITH_VISION_LABELS[faithVision] || FAITH_VISION_LABELS['trust'];
  const relationshipData = RELATIONSHIP_LABELS[godRelationship] || RELATIONSHIP_LABELS['ups-downs'];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>thanks, {userName}.</Text>
        <Text style={styles.subtitle}>
          based on what you have shared, let us look at your journey together.
        </Text>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.cardLabel}>
              <Text style={styles.cardLabelText}>where you want to go</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>{visionData.emoji}</Text>
              <Text style={styles.cardText}>{visionData.text}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardLabel}>
              <Text style={styles.cardLabelText}>where you are now</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>{relationshipData.emoji}</Text>
              <Text style={styles.cardText}>{relationshipData.text}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={[styles.cardLabel, styles.cardLabelWarning]}>
              <Text style={styles.cardLabelText}>what is standing in the way</Text>
            </View>
            <View style={styles.cardContentList}>
              {obstacles.slice(0, 2).map((obstacleId, index) => {
                const obstacleData = OBSTACLE_LABELS[obstacleId];
                if (!obstacleData) return null;
                return (
                  <View key={index} style={styles.obstacleItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.cardEmoji}>{obstacleData.emoji}</Text>
                    <Text style={styles.cardText}>{obstacleData.text}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <Text style={styles.messageText}>
          {userName}, we see where you are and where you want to go. together, we can build a personal plan that helps you grow stronger in your faith every single day.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.orange,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textInverse,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 26,
    marginBottom: 24,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
  },
  cardLabel: {
    backgroundColor: '#FFE4C4',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardLabelWarning: {
    backgroundColor: '#FFECD2',
  },
  cardLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.orange,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardContentList: {
    gap: 8,
  },
  obstacleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.orange,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: 24,
  },
  continueButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.orange,
    fontSize: 18,
    fontWeight: '600',
  },
});
