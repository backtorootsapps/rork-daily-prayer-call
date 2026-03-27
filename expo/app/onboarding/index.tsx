import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

const LINES = [
  { text: 'ever feel like your phone', highlight: false },
  { text: 'gets more attention', highlight: false },
  { text: 'than ', highlight: false, inline: true },
  { text: 'God', highlight: true, inline: true },
  { text: ' ?', highlight: false, inline: true },
];

const SUBLINES = [
  "you're not alone",
  'distractions are everywhere,',
  'quietly pulling you away from the',
  'peace you\'re looking for.',
];

export default function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [, setCurrentLine] = useState(0);
  const [, setCurrentSubLine] = useState(-1);
  const [showContinue, setShowContinue] = useState(false);
  
  const lineOpacities = useRef(LINES.map(() => new Animated.Value(0))).current;
  const subLineOpacities = useRef(SUBLINES.map(() => new Animated.Value(0))).current;
  const continueOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateLines = async () => {
      for (let i = 0; i < LINES.length; i++) {
        await new Promise(resolve => setTimeout(resolve, i === 0 ? 500 : 300));
        Animated.timing(lineOpacities[i], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
        setCurrentLine(i + 1);
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      for (let i = 0; i < SUBLINES.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        Animated.timing(subLineOpacities[i], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
        setCurrentSubLine(i);
      }

      await new Promise(resolve => setTimeout(resolve, 600));
      setShowContinue(true);
      Animated.timing(continueOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    };

    animateLines();
  }, []);

  const handleContinue = () => {
    router.push('/onboarding/app-intro');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={1}
      onPress={showContinue ? handleContinue : undefined}
    >
      <View style={[styles.content, { paddingTop: insets.top + 80 }]}>
        <View style={styles.mainTextContainer}>
          <View style={styles.lineRow}>
            <Animated.Text style={[styles.mainText, { opacity: lineOpacities[0] }]}>
              {LINES[0].text}
            </Animated.Text>
          </View>
          <View style={styles.lineRow}>
            <Animated.Text style={[styles.mainText, { opacity: lineOpacities[1] }]}>
              {LINES[1].text}
            </Animated.Text>
          </View>
          <View style={styles.lineRow}>
            <Animated.Text style={[styles.mainText, { opacity: lineOpacities[2] }]}>
              than{' '}
            </Animated.Text>
            <Animated.Text style={[styles.mainText, styles.highlightText, { opacity: lineOpacities[3] }]}>
              God
            </Animated.Text>
            <Animated.Text style={[styles.mainText, { opacity: lineOpacities[4] }]}>
              {' '}?
            </Animated.Text>
          </View>
        </View>

        <View style={styles.subTextContainer}>
          {SUBLINES.map((line, index) => (
            <Animated.Text 
              key={index} 
              style={[styles.subText, { opacity: subLineOpacities[index] }]}
            >
              {line}
            </Animated.Text>
          ))}
        </View>
      </View>

      <Animated.View 
        style={[
          styles.footer, 
          { paddingBottom: insets.bottom + 24, opacity: continueOpacity }
        ]}
      >
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.continueText}>tap to continue</Text>
          <ArrowRight size={20} color={Colors.orange} />
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
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
  mainTextContainer: {
    marginBottom: 40,
  },
  lineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mainText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 42,
  },
  highlightText: {
    color: Colors.orange,
  },
  subTextContainer: {
    gap: 4,
  },
  subText: {
    fontSize: 18,
    color: Colors.text,
    lineHeight: 28,
  },
  footer: {
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
