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
import { ChevronLeft, Clock } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = ['00', '15', '30', '45'];

export default function TimeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useUser();
  const [selectedHour, setSelectedHour] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState('00');

  const formatHour = (hour: number) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return { display: h.toString().padStart(2, '0'), ampm };
  };

  const handleContinue = () => {
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute}`;
    updateUser({ prayerTime: timeString });
    router.push('/onboarding/topics');
  };

  const { display: hourDisplay, ampm } = formatHour(selectedHour);

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

      <View style={styles.content}>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepCompleted]} />
          <View style={[styles.stepDot, styles.stepActive]} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
        </View>

        <Text style={styles.title}>
          {user.name ? `${user.name}, when` : 'When'} would you like your daily prayer call?
        </Text>
        <Text style={styles.subtitle}>
          Choose a time when you can pause and connect with God.
        </Text>

        <View style={styles.timePickerContainer}>
          <View style={styles.clockIcon}>
            <Clock size={32} color={Colors.primary} />
          </View>
          
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>
              {hourDisplay}:{selectedMinute}
            </Text>
            <Text style={styles.ampmText}>{ampm}</Text>
          </View>
        </View>

        <View style={styles.pickerSection}>
          <Text style={styles.pickerLabel}>Hour</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pickerScroll}
          >
            {HOURS.map((hour) => {
              const { display, ampm: ap } = formatHour(hour);
              return (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.pickerItem,
                    selectedHour === hour && styles.pickerItemSelected,
                  ]}
                  onPress={() => setSelectedHour(hour)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedHour === hour && styles.pickerItemTextSelected,
                    ]}
                  >
                    {display}
                  </Text>
                  <Text
                    style={[
                      styles.pickerItemAmPm,
                      selectedHour === hour && styles.pickerItemTextSelected,
                    ]}
                  >
                    {ap}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.pickerSection}>
          <Text style={styles.pickerLabel}>Minute</Text>
          <View style={styles.minutePicker}>
            {MINUTES.map((minute) => (
              <TouchableOpacity
                key={minute}
                style={[
                  styles.minuteItem,
                  selectedMinute === minute && styles.minuteItemSelected,
                ]}
                onPress={() => setSelectedMinute(minute)}
              >
                <Text
                  style={[
                    styles.minuteItemText,
                    selectedMinute === minute && styles.minuteItemTextSelected,
                  ]}
                >
                  :{minute}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
    marginBottom: 32,
    lineHeight: 24,
  },
  timePickerContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clockIcon: {
    marginBottom: 16,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.primary,
  },
  ampmText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primaryLight,
  },
  pickerSection: {
    marginBottom: 24,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pickerScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginRight: 8,
  },
  pickerItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pickerItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  pickerItemAmPm: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pickerItemTextSelected: {
    color: Colors.textInverse,
  },
  minutePicker: {
    flexDirection: 'row',
    gap: 12,
  },
  minuteItem: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  minuteItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  minuteItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  minuteItemTextSelected: {
    color: Colors.textInverse,
  },
  footer: {
    paddingHorizontal: 24,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
});
