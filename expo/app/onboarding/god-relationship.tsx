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
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

const RELATIONSHIPS = [
  { id: 'ups-downs', emoji: '🎢', text: 'it has its ups and downs' },
  { id: 'distant', emoji: '😔', text: 'feeling a bit distant lately' },
  { id: 'starting', emoji: '🌱', text: 'just starting or rebuilding' },
  { id: 'close', emoji: '🙏', text: 'close and consistent' },
];

export default function GodRelationshipScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useUser();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) {
      updateUser({ godRelationship: selected });
      router.push('/onboarding/faith-obstacles');
    }
  };

  const progress = 3 / 12;

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
          <Text style={styles.title}>and how would you describe your relationship with </Text>
          <Text style={[styles.title, styles.highlightText]}>God</Text>
          <Text style={styles.title}> right now?</Text>
        </View>

        <View style={styles.optionsContainer}>
          {RELATIONSHIPS.map((item) => {
            const isSelected = selected === item.id;
            
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => setSelected(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionEmoji}>{item.emoji}</Text>
                <Text style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selected && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            !selected && styles.continueButtonTextDisabled,
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
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 38,
  },
  highlightText: {
    color: Colors.orange,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.orange,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionEmoji: {
    fontSize: 26,
  },
  optionText: {
    fontSize: 17,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '600',
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
