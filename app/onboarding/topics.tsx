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
import { ChevronLeft } from 'lucide-react-native';
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
    router.push('/onboarding/confirmation');
  };

  const getTopicsByCategory = (categoryId: string) => {
    return TOPICS.filter(topic => topic.category === categoryId);
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

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepCompleted]} />
          <View style={[styles.stepDot, styles.stepCompleted]} />
          <View style={[styles.stepDot, styles.stepActive]} />
          <View style={styles.stepDot} />
        </View>

        <Text style={styles.title}>
          {user.name ? `${user.name}, what` : 'What'} weighs on your heart?
        </Text>
        <Text style={styles.subtitle}>
          Select 1-3 areas where you need God&apos;s help most.
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
          <Text style={styles.continueButtonText}>Continue</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  selectionCount: {
    backgroundColor: Colors.primaryLight + '20',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
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
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 8,
  },
  topicButtonSelected: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
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
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.border,
  },
  continueButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
});
