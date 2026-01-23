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
import Colors from '@/constants/colors';

const OBSTACLES = [
  { id: 'phone', emoji: '📱', text: 'phone & social media distraction' },
  { id: 'focus', emoji: '🧠', text: 'lack of focus or wandering thoughts' },
  { id: 'motivation', emoji: '😰', text: 'lack of motivation or feeling dry' },
  { id: 'busyness', emoji: '⏰', text: 'busyness and lack of time' },
];

export default function FaithObstaclesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useUser();
  const [selectedObstacles, setSelectedObstacles] = useState<string[]>([]);

  const toggleObstacle = (obstacleId: string) => {
    if (selectedObstacles.includes(obstacleId)) {
      setSelectedObstacles(selectedObstacles.filter(id => id !== obstacleId));
    } else if (selectedObstacles.length < 3) {
      setSelectedObstacles([...selectedObstacles, obstacleId]);
    }
  };

  const handleContinue = () => {
    if (selectedObstacles.length > 0) {
      updateUser({ faithObstacles: selectedObstacles });
      router.push('/onboarding/deeper-struggles');
    }
  };

  const progress = 4 / 12;

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
          <Text style={styles.title}>what is the main thing that gets in the way of that </Text>
          <Text style={[styles.title, styles.highlightText]}>thriving faith</Text>
          <Text style={styles.title}> you want?</Text>
        </View>
        <Text style={styles.subtitle}>choose up to 3</Text>

        <View style={styles.optionsContainer}>
          {OBSTACLES.map((obstacle) => {
            const isSelected = selectedObstacles.includes(obstacle.id);
            const isDisabled = !isSelected && selectedObstacles.length >= 3;
            
            return (
              <TouchableOpacity
                key={obstacle.id}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                  isDisabled && styles.optionButtonDisabled,
                ]}
                onPress={() => toggleObstacle(obstacle.id)}
                disabled={isDisabled}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionEmoji}>{obstacle.emoji}</Text>
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}>
                    {obstacle.text}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Check size={20} color={Colors.orange} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedObstacles.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedObstacles.length === 0}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            selectedObstacles.length === 0 && styles.continueButtonTextDisabled,
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
    lineHeight: 36,
  },
  highlightText: {
    color: Colors.orange,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.orange,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  optionEmoji: {
    fontSize: 26,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  checkIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 24,
  },
  continueButton: {
    backgroundColor: Colors.orange,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#F5D5B8',
  },
  continueButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#FFFFFF99',
  },
});
