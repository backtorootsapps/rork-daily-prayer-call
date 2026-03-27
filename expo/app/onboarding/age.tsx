import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

const AGE_RANGES = [
  '14-24',
  '25-34',
  '35-44',
  '45-54',
  '55+',
];

export default function AgeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useUser();
  const [selectedAge, setSelectedAge] = useState('');

  const handleContinue = () => {
    if (selectedAge) {
      updateUser({ ageRange: selectedAge });
      router.push('/onboarding/motivation');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 80 }]}>
        <Text style={styles.title}>how old are you?</Text>

        <View style={styles.optionsContainer}>
          {AGE_RANGES.map((age) => {
            const isSelected = selectedAge === age;
            return (
              <TouchableOpacity
                key={age}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedAge(age)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}>
                  {age}
                </Text>
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Check size={20} color={Colors.orange} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedAge && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedAge}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedAge && styles.continueButtonTextDisabled,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.orange,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: Colors.text,
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
