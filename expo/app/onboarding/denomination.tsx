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

const DENOMINATIONS = [
  { id: 'non-denominational', text: 'non denominational' },
  { id: 'protestant', text: 'protestant' },
  { id: 'catholic', text: 'catholic' },
  { id: 'orthodox', text: 'orthodox' },
  { id: 'none', text: 'none of the above' },
];

export default function DenominationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useUser();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) {
      updateUser({ denomination: selected });
      router.push('/onboarding/gender');
    }
  };

  const progress = 8 / 12;

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
        <Text style={styles.subtitle}>
          to make sure the prayers and scriptures feel{' '}
          <Text style={styles.highlightText}>right for you</Text>
        </Text>
        <Text style={styles.title}>what is your christian denomination?</Text>

        <View style={styles.optionsContainer}>
          {DENOMINATIONS.map((item) => {
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
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 24,
  },
  highlightText: {
    color: Colors.orange,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 38,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  optionButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.orange,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionText: {
    fontSize: 17,
    color: Colors.text,
    fontWeight: '500',
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
