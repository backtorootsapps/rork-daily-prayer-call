import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 120;
const THUMB_SIZE = 28;
const STEP_COUNT = 7;

export default function PrayerFrequencyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useUser();
  const [days, setDays] = useState(4);
  
  const pan = useRef(new Animated.Value((days / STEP_COUNT) * SLIDER_WIDTH)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset((pan as any)._value);
        pan.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.max(0, Math.min(SLIDER_WIDTH, (pan as any)._offset + gestureState.dx));
        pan.setValue(newValue - (pan as any)._offset);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const currentValue = (pan as any)._value;
        const stepValue = SLIDER_WIDTH / STEP_COUNT;
        const snappedStep = Math.round(currentValue / stepValue);
        const snappedValue = snappedStep * stepValue;
        
        Animated.spring(pan, {
          toValue: snappedValue,
          useNativeDriver: false,
          friction: 8,
        }).start();
        
        setDays(snappedStep);
      },
    })
  ).current;

  const handleContinue = () => {
    updateUser({ prayerFrequency: days });
    router.push('/onboarding/god-relationship');
  };

  const progress = 2 / 12;

  const fillWidth = pan.interpolate({
    inputRange: [0, SLIDER_WIDTH],
    outputRange: [0, SLIDER_WIDTH],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>be honest, how often do you pray per week?</Text>

        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{days}</Text>
          <Text style={styles.valueLabel}> days</Text>
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <Animated.View style={[styles.sliderFill, { width: fillWidth }]} />
            <View style={styles.stepsContainer}>
              {[...Array(STEP_COUNT + 1)].map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.stepMark,
                    i <= days && styles.stepMarkActive,
                  ]} 
                />
              ))}
            </View>
          </View>
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [{ translateX: pan }],
              },
            ]}
            {...panResponder.panHandlers}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0</Text>
            <Text style={styles.sliderLabel}>7</Text>
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
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 38,
    marginBottom: 60,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 40,
  },
  valueText: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.text,
  },
  valueLabel: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.text,
  },
  sliderContainer: {
    paddingHorizontal: 24,
    position: 'relative',
  },
  sliderTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.orange,
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  stepsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  stepMark: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D0D0',
  },
  stepMarkActive: {
    backgroundColor: 'transparent',
  },
  thumb: {
    position: 'absolute',
    top: -10,
    left: 24 - THUMB_SIZE / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  sliderLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
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
