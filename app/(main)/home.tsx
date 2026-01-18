import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Bell, 
  Flame, 
  ChevronRight,
  Calendar,
} from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { TOPICS } from '@/constants/topics';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, checkAndResetDaily } = useUser();

  useEffect(() => {
    checkAndResetDaily();
  }, [checkAndResetDaily]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const h = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const selectedTopics = user.selectedTopics
    .map(id => TOPICS.find(t => t.id === id))
    .filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user.name} 👋</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.prayerCard}
          onPress={() => router.push('/prayer-call')}
          activeOpacity={0.9}
        >
          <View style={styles.prayerCardHeader}>
            <View style={styles.prayerIconContainer}>
              <Text style={styles.prayerIcon}>🙏</Text>
            </View>
            <View style={styles.prayerCardBadge}>
              <Text style={styles.prayerCardBadgeText}>
                {user.completedToday ? 'Completed' : 'Ready'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.prayerCardTitle}>
            {user.completedToday 
              ? 'Great job today!' 
              : 'Your Daily Prayer'}
          </Text>
          <Text style={styles.prayerCardSubtitle}>
            {user.completedToday 
              ? `Come back tomorrow at ${formatTime(user.prayerTime)}`
              : `Scheduled for ${formatTime(user.prayerTime)}`}
          </Text>
          
          <View style={styles.prayerCardAction}>
            <Text style={styles.prayerCardActionText}>
              {user.completedToday ? 'Pray Again' : 'Start Now'}
            </Text>
            <ChevronRight size={20} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.streakCard]}>
            <Flame size={28} color={Colors.streak} />
            <Text style={styles.statValue}>{user.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Calendar size={28} color={Colors.primary} />
            <Text style={styles.statValue}>{user.totalPrayers}</Text>
            <Text style={styles.statLabel}>Total Prayers</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Verses</Text>
          <TouchableOpacity 
            onPress={() => router.push('/(main)/verses')}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicsScroll}
        >
          {selectedTopics.map((topic, index) => (
            <TouchableOpacity
              key={topic?.id}
              style={[
                styles.topicBubble,
                { backgroundColor: Colors.bubbleColors[index % Colors.bubbleColors.length] }
              ]}
              onPress={() => router.push(`/verse-player?topic=${topic?.id}`)}
              activeOpacity={0.8}
            >
              <Text style={styles.topicEmoji}>{topic?.emoji}</Text>
              <Text style={styles.topicName}>{topic?.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.encouragementCard}>
          <Text style={styles.encouragementEmoji}>💫</Text>
          <Text style={styles.encouragementText}>
            {user.currentStreak > 0 
              ? `Amazing! You've been faithful for ${user.currentStreak} days.`
              : 'Start your streak today. Every prayer counts!'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  prayerCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  prayerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  prayerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerIcon: {
    fontSize: 28,
  },
  prayerCardBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  prayerCardBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  prayerCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  prayerCardSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  prayerCardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prayerCardActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakCard: {
    borderColor: Colors.streak + '30',
    backgroundColor: Colors.streak + '08',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  topicsScroll: {
    gap: 12,
    paddingBottom: 4,
  },
  topicBubble: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  topicEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  topicName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  encouragementCard: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
  },
  encouragementEmoji: {
    fontSize: 32,
  },
  encouragementText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
});
