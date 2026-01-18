import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Clock, Heart, Sparkles } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { TOPICS } from '@/constants/topics';
import { getVersesByTopic } from '@/constants/verses';
import Colors from '@/constants/colors';

export default function ConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useUser();

  const selectedTopicNames = user.selectedTopics
    .map(id => TOPICS.find(t => t.id === id)?.name)
    .filter(Boolean);

  const totalVerses = new Set(
    user.selectedTopics.flatMap(topicId => 
      getVersesByTopic(topicId).map(v => v.id)
    )
  ).size;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const h = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleComplete = () => {
    updateUser({ 
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    });
    router.replace('/(main)/home');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepCompleted]} />
          <View style={[styles.stepDot, styles.stepCompleted]} />
          <View style={[styles.stepDot, styles.stepCompleted]} />
          <View style={[styles.stepDot, styles.stepActive]} />
        </View>

        <View style={styles.celebrationIcon}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
        </View>

        <Text style={styles.title}>
          Perfect, {user.name}!
        </Text>
        <Text style={styles.subtitle}>
          Your personalized prayer journey is ready.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <Clock size={20} color={Colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Daily Prayer Time</Text>
              <Text style={styles.summaryValue}>{formatTime(user.prayerTime)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <Heart size={20} color={Colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Prayer Focus Areas</Text>
              <Text style={styles.summaryValue}>
                {selectedTopicNames.join(', ')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <Sparkles size={20} color={Colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Verses Selected For You</Text>
              <Text style={styles.summaryValue}>{totalVerses} Bible verses</Text>
            </View>
          </View>
        </View>

        <Text style={styles.noteText}>
          You can change these settings anytime.
        </Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start My Journey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  stepActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  stepCompleted: {
    backgroundColor: Colors.primary,
  },
  celebrationIcon: {
    alignItems: 'center',
    marginBottom: 24,
  },
  celebrationEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  noteText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  footer: {
    paddingHorizontal: 24,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
});
