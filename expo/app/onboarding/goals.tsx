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

const GOALS = [
  { id: 'god-first', emoji: '🙏', text: 'put God first, before my phone' },
  { id: 'prayer-habit', emoji: '🔄', text: 'build a consistent prayer habit' },
  { id: 'relationship', emoji: '❤️‍🔥', text: 'deepen my relationship with God' },
  { id: 'peace', emoji: '😢', text: 'find peace in a chaotic world' },
  { id: 'intention', emoji: '🎯', text: 'start my day with intention, not distraction' },
  { id: 'scripture', emoji: '📖', text: 'engage more with Scripture' },
];

export default function GoalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useUser();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else if (selectedGoals.length < 3) {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      updateUser({ goals: selectedGoals });
      router.push('/onboarding/faith-vision');
    }
  };

  const progress = 1 / 7;

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
          <Text style={styles.title}>what do you want to</Text>
          <Text style={[styles.title, styles.highlightText]}>achieve</Text>
          <Text style={styles.title}> with daily prayer call?</Text>
        </View>
        <Text style={styles.subtitle}>choose up to 3</Text>

        <View style={styles.optionsContainer}>
          {GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            const isDisabled = !isSelected && selectedGoals.length >= 3;
            
            return (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                  isDisabled && styles.optionButtonDisabled,
                ]}
                onPress={() => toggleGoal(goal.id)}
                disabled={isDisabled}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionEmoji}>{goal.emoji}</Text>
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}>
                    {goal.text}
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
            selectedGoals.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedGoals.length === 0}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            selectedGoals.length === 0 && styles.continueButtonTextDisabled,
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
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.orange,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionEmoji: {
    fontSize: 24,
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
