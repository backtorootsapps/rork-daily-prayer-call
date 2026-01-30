import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  User, 
  Clock, 
  Heart, 
  Bell, 
  Volume2,
  RotateCcw,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { TOPICS } from '@/constants/topics';
import Colors from '@/constants/colors';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser, resetStreak, toggleNotifications } = useUser();

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const h = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const selectedTopicNames = user.selectedTopics
    .map(id => TOPICS.find(t => t.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  const handleResetStreak = () => {
    Alert.alert(
      'Reset Streak',
      'Are you sure you want to reset your prayer streak? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => resetStreak(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '15' }]}>
                  <User size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Name</Text>
                  <Text style={styles.settingValue}>{user.name}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.textLight} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prayer Schedule</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.secondary + '30' }]}>
                  <Clock size={20} color={Colors.secondary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Daily Prayer Time</Text>
                  <Text style={styles.settingValue}>{formatTime(user.prayerTime)}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.textLight} />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.accent + '20' }]}>
                  <Heart size={20} color={Colors.accent} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Prayer Focus</Text>
                  <Text style={styles.settingValue} numberOfLines={1}>
                    {selectedTopicNames || 'None selected'}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.textLight} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <Bell size={20} color="#4CAF50" />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Daily Reminder</Text>
                  <Text style={styles.settingValue}>
                    {user.notificationsEnabled ? `At ${formatTime(user.prayerTime)}` : 'Disabled'}
                  </Text>
                </View>
              </View>
              <Switch
                value={user.notificationsEnabled}
                onValueChange={(value) => toggleNotifications(value)}
                trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
                thumbColor={user.notificationsEnabled ? Colors.primary : Colors.textLight}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                  <Volume2 size={20} color="#2196F3" />
                </View>
                <Text style={styles.settingLabel}>Background Music</Text>
              </View>
              <Switch
                value={user.backgroundMusicEnabled}
                onValueChange={(value) => updateUser({ backgroundMusicEnabled: value })}
                trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
                thumbColor={user.backgroundMusicEnabled ? Colors.primary : Colors.textLight}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={handleResetStreak}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
                  <RotateCcw size={20} color="#F44336" />
                </View>
                <Text style={styles.settingLabel}>Reset Streak</Text>
              </View>
              <ChevronRight size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.border }]}>
                  <Info size={20} color={Colors.textSecondary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Version</Text>
                  <Text style={styles.settingValue}>1.0.0</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Daily Prayer Call</Text>
          <Text style={styles.footerSubtext}>Your daily moment with God</Text>
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
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  settingContent: {
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 70,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
