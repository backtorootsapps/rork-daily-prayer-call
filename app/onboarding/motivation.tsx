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

export default function MotivationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showContinue, setShowContinue] = useState(false);
  
  const line1Opacity = useRef(new Animated.Value(0)).current;
  const line2Opacity = useRef(new Animated.Value(0)).current;
  const line3Opacity = useRef(new Animated.Value(0)).current;
  const continueOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      Animated.timing(line1Opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      await new Promise(resolve => setTimeout(resolve, 600));
      Animated.timing(line2Opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      await new Promise(resolve => setTimeout(resolve, 600));
      Animated.timing(line3Opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      await new Promise(resolve => setTimeout(resolve, 600));
      setShowContinue(true);
      Animated.timing(continueOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    };

    animate();
  }, []);

  const handleContinue = () => {
    router.push('/onboarding/goals');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={1}
      onPress={showContinue ? handleContinue : undefined}
    >
      <View style={[styles.content, { paddingTop: insets.top + 80 }]}>
        <Animated.Text style={[styles.mainText, { opacity: line1Opacity }]}>
          it doesn't have to be{'\n'}this way
        </Animated.Text>

        <Animated.View style={[styles.questionContainer, { opacity: line2Opacity }]}>
          <Text style={styles.mainText}>do you have just </Text>
          <Text style={[styles.mainText, styles.highlightText]}>5 minutes</Text>
          <Text style={styles.mainText}>{'\n'}for </Text>
          <Text style={[styles.mainText, styles.highlightText]}>God</Text>
          <Text style={styles.mainText}> each day?</Text>
        </Animated.View>

        <Animated.View style={[styles.planContainer, { opacity: line3Opacity }]}>
          <Text style={styles.mainText}>let's build a plan for </Text>
          <Text style={[styles.mainText, styles.highlightText]}>you</Text>
        </Animated.View>
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
  mainText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 38,
  },
  highlightText: {
    color: Colors.orange,
  },
  questionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
  },
  planContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
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
