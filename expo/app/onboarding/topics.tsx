import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { TOPICS, TOPIC_CATEGORIES } from '@/constants/topics';
import Colors from '@/constants/colors';

export default function TopicsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useUser();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleContinue = () => {
    updateUser({ selectedTopics });
    router.push('/onboarding/time');
  };

  const getTopicsByCategory = (categoryId: string) => {
    return TOPICS.filter(topic => topic.category === categoryId);
  };

  const progress = 3 / 7;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {user.name ? `${user.name}, what` : 'what'}{' '}
          </Text>
          <Text style={[styles.title, styles.highlightText]}>weighs</Text>
          <Text style={styles.title}> on your heart?</Text>
        </View>
        <Text style={styles.subtitle}>
          select 1-3 areas where you need God's help most
        </Text>

        <View style={styles.selectionCount}>
          <Text style={styles.selectionText}>
            {selectedTopics.length} of 3 selected
          </Text>
        </View>

        {TOPIC_CATEGORIES.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>
              {category.emoji} {category.name}
            </Text>
            <View style={styles.topicsGrid}>
              {getTopicsByCategory(category.id).map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                const isDisabled = !isSelected && selectedTopics.length >= 3;
                
                return (
                  <TouchableOpacity
                    key={topic.id}
                    style={[
                      styles.topicButton,
                      isSelected && styles.topicButtonSelected,
                      isDisabled && styles.topicButtonDisabled,
                    ]}
                    onPress={() => toggleTopic(topic.id)}
                    disabled={isDisabled}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.topicEmoji}>{topic.emoji}</Text>
                    <Text 
                      style={[
                        styles.topicName,
                        isSelected && styles.topicNameSelected,
                      ]}
                    >
                      {topic.name}
                    </Text>
                    {isSelected && (
                      <Check size={16} color={Colors.orange} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedTopics.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedTopics.length === 0}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            selectedTopics.length === 0 && styles.continueButtonTextDisabled,
          ]}>
            continue
          </Text>
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
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.orange,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 34,
  },
  highlightText: {
    color: Colors.orange,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  selectionCount: {
    backgroundColor: Colors.orange + '20',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.orange,
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
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    gap: 8,
  },
  topicButtonSelected: {
    backgroundColor: Colors.orange + '15',
    borderWidth: 2,
    borderColor: Colors.orange,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  topicButtonDisabled: {
    opacity: 0.4,
  },
  topicEmoji: {
    fontSize: 18,
  },
  topicName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  topicNameSelected: {
    color: Colors.orange,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: Colors.orange,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  continueButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: Colors.textLight,
  },
});
