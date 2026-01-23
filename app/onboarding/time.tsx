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
import { Clock } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = ['00', '15', '30', '45'];

export default function TimeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useUser();
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
    router.push('/onboarding/summary');
  };

  const { display: hourDisplay, ampm } = formatHour(selectedHour);
  const progress = 4 / 7;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>when would you like your </Text>
          <Text style={[styles.title, styles.highlightText]}>daily prayer call</Text>
          <Text style={styles.title}>?</Text>
        </View>
        <Text style={styles.subtitle}>
          choose a time when you can pause and connect with God
        </Text>

        <View style={styles.timePickerContainer}>
          <View style={styles.clockIcon}>
            <Clock size={28} color={Colors.orange} />
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
    marginBottom: 32,
    lineHeight: 24,
  },
  timePickerContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  clockIcon: {
    marginBottom: 12,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  timeText: {
    fontSize: 44,
    fontWeight: '700',
    color: Colors.orange,
  },
  ampmText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.orangeLight,
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
    alignItems: 'center',
    marginRight: 8,
  },
  pickerItemSelected: {
    backgroundColor: Colors.orange,
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
    alignItems: 'center',
  },
  minuteItemSelected: {
    backgroundColor: Colors.orange,
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
