import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { TOPICS, TOPIC_CATEGORIES } from '@/constants/topics';
import Colors from '@/constants/colors';

export default function VersesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'forMe' | 'forAll'>('forMe');
  const [searchQuery, setSearchQuery] = useState('');

  const userTopics = user.selectedTopics
    .map(id => TOPICS.find(t => t.id === id))
    .filter(Boolean);

  const filteredTopics = TOPICS.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTopicPress = (topicId: string) => {
    router.push(`/verse-player?topic=${topicId}`);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Verses</Text>
        <Text style={styles.subtitle}>Tap a topic to hear God&apos;s word</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'forMe' && styles.tabActive]}
          onPress={() => setActiveTab('forMe')}
        >
          <Text style={[styles.tabText, activeTab === 'forMe' && styles.tabTextActive]}>
            For Me
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'forAll' && styles.tabActive]}
          onPress={() => setActiveTab('forAll')}
        >
          <Text style={[styles.tabText, activeTab === 'forAll' && styles.tabTextActive]}>
            For All
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'forMe' ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionDescription}>
            Your personalized verses based on your prayer focus areas.
          </Text>

          <View style={styles.topicsGrid}>
            {userTopics.map((topic, index) => (
              <TouchableOpacity
                key={topic?.id}
                style={[
                  styles.topicCard,
                  { backgroundColor: Colors.bubbleColors[index % Colors.bubbleColors.length] }
                ]}
                onPress={() => handleTopicPress(topic?.id || '')}
                activeOpacity={0.8}
              >
                <Text style={styles.topicEmoji}>{topic?.emoji}</Text>
                <Text style={styles.topicName}>{topic?.name}</Text>
                <Text style={styles.topicDescription}>{topic?.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {userTopics.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={styles.emptyText}>
                No topics selected yet. Go to Settings to add your prayer focus areas.
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search topics..."
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {TOPIC_CATEGORIES.map((category) => {
            const categoryTopics = filteredTopics.filter(t => t.category === category.id);
            if (categoryTopics.length === 0) return null;

            return (
              <View key={category.id} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>
                  {category.emoji} {category.name}
                </Text>
                <View style={styles.categoryTopics}>
                  {categoryTopics.map((topic, index) => (
                    <TouchableOpacity
                      key={topic.id}
                      style={[
                        styles.topicChip,
                        { backgroundColor: Colors.bubbleColors[index % Colors.bubbleColors.length] }
                      ]}
                      onPress={() => handleTopicPress(topic.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.chipEmoji}>{topic.emoji}</Text>
                      <Text style={styles.chipText}>{topic.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: Colors.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.cardBackground,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  topicsGrid: {
    gap: 16,
  },
  topicCard: {
    borderRadius: 20,
    padding: 24,
  },
  topicEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  topicName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  categoryTopics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
});
