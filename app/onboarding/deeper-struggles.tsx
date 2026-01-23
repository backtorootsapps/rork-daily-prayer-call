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

const STRUGGLES = [
  { id: 'lust', emoji: '🔥', text: 'struggling with lustful thoughts' },
  { id: 'anxiety', emoji: '😰', text: 'constant worry or anxiety' },
  { id: 'loneliness', emoji: '😔', text: 'feelings of loneliness or emptiness' },
  { id: 'pride', emoji: '💪', text: 'pride or self-reliance' },
  { id: 'anger', emoji: '😤', text: 'anger or unforgiveness' },
  { id: 'doubt', emoji: '❓', text: 'doubt or questioning faith' },
];

export default function DeeperStrugglesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useUser();
  const [selectedStruggles, setSelectedStruggles] = useState<string[]>([]);

  const toggleStruggle = (struggleId: string) => {
    if (selectedStruggles.includes(struggleId)) {
      setSelectedStruggles(selectedStruggles.filter(id => id !== struggleId));
    } else {
      setSelectedStruggles([...selectedStruggles, struggleId]);
    }
  };

  const handleContinue = () => {
    updateUser({ deeperStruggles: selectedStruggles });
    router.push('/onboarding/honesty-thanks');
  };

  const progress = 5 / 12;

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
          <Text style={styles.title}>sometimes, deeper struggles are the </Text>
          <Text style={[styles.title, styles.highlightText]}>real root</Text>
          <Text style={styles.title}>. do any of these get in your way?</Text>
        </View>
        <Text style={styles.subtitle}>choose any that apply</Text>

        <View style={styles.optionsContainer}>
          {STRUGGLES.map((struggle) => {
            const isSelected = selectedStruggles.includes(struggle.id);
            
            return (
              <TouchableOpacity
                key={struggle.id}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => toggleStruggle(struggle.id)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionEmoji}>{struggle.emoji}</Text>
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}>
                    {struggle.text}
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
  continueButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
});
