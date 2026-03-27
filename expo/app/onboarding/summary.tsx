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
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

const GOAL_DETAILS: Record<string, { emoji: string; title: string; description: string }> = {
  'god-first': {
    emoji: '🙏',
    title: 'put God first, before my phone',
    description: "we'll remind you to start with prayer before diving into apps, helping you reclaim your mornings for what matters most.",
  },
  'prayer-habit': {
    emoji: '🔄',
    title: 'build a consistent prayer habit',
    description: "we'll help you build momentum with gentle reminders and satisfying streaks, turning inconsistency into your daily win.",
  },
  'relationship': {
    emoji: '❤️‍🔥',
    title: 'deepen my relationship with God',
    description: "through personalized verses and guided prayer, you'll discover new depths in your walk with God.",
  },
  'peace': {
    emoji: '😢',
    title: 'find peace in a chaotic world',
    description: "start each day grounded in Scripture, finding calm before the storm of notifications hits.",
  },
  'intention': {
    emoji: '🎯',
    title: 'start my day with intention, not distraction',
    description: "trade the morning chaos for quiet confidence. you'll start your day anchored in the Word, not drowning in notifications.",
  },
  'scripture': {
    emoji: '📖',
    title: 'engage more with Scripture',
    description: "daily verses curated for your life will make the Bible feel fresh and relevant again.",
  },
};

const FAITH_VISION_DETAILS: Record<string, { emoji: string; title: string }> = {
  'trust': { emoji: '🤝', title: "trusting God's plan, even when it's hard" },
  'integrity': { emoji: '💯', title: 'living out my faith with integrity' },
  'serve': { emoji: '🙌', title: 'using my gifts to serve others' },
  'word': { emoji: '📖', title: 'building my life on the word of God' },
  'community': { emoji: '👥', title: 'growing in faith with community' },
  'witness': { emoji: '✨', title: 'being a witness to those around me' },
};

export default function SummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  const handleContinue = () => {
    router.push('/onboarding/greeting');
  };

  const selectedGoalDetails = user.goals
    .map(id => GOAL_DETAILS[id])
    .filter(Boolean)
    .slice(0, 2);

  const selectedVision = user.faithVision[0];
  const visionDetail = selectedVision ? FAITH_VISION_DETAILS[selectedVision] : null;

  return (
    <LinearGradient
      colors={[Colors.orange, Colors.orangeDark]}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <ChevronLeft size={28} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedGoalDetails.map((goal, index) => (
          <View key={index} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <Text style={styles.goalTitle}>{goal.title}</Text>
            </View>
            <Text style={styles.goalDescription}>{goal.description}</Text>
          </View>
        ))}

        {visionDetail && (
          <View style={styles.visionCard}>
            <Text style={styles.visionLabel}>where you&apos;re headed</Text>
            <View style={styles.visionContent}>
              <Text style={styles.visionEmoji}>{visionDetail.emoji}</Text>
              <Text style={styles.visionTitle}>{visionDetail.title}</Text>
            </View>
            <Text style={styles.visionStat}>
              92.08% of daily prayer call users formed a daily prayer habit
            </Text>
          </View>
        )}

        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>you&apos;re in the right place</Text>
          <Text style={styles.messageText}>
            tens of thousands have started with the same goals, and daily prayer call helped them get there.
          </Text>
        </View>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  goalCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  goalEmoji: {
    fontSize: 24,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  goalDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  visionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  visionLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  visionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  visionEmoji: {
    fontSize: 24,
  },
  visionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  visionStat: {
    fontSize: 14,
    color: Colors.orange,
    fontWeight: '600',
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textInverse,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.9,
    lineHeight: 24,
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
