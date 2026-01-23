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

export default function AppIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showContinue, setShowContinue] = useState(false);
  
  const line1Opacity = useRef(new Animated.Value(0)).current;
  const line2Opacity = useRef(new Animated.Value(0)).current;
  const sub1Opacity = useRef(new Animated.Value(0)).current;
  const sub2Opacity = useRef(new Animated.Value(0)).current;
  const sub3Opacity = useRef(new Animated.Value(0)).current;
  const continueOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      Animated.timing(line1Opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      await new Promise(resolve => setTimeout(resolve, 500));
      Animated.timing(line2Opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      await new Promise(resolve => setTimeout(resolve, 800));
      Animated.timing(sub1Opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      await new Promise(resolve => setTimeout(resolve, 400));
      Animated.timing(sub2Opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      await new Promise(resolve => setTimeout(resolve, 400));
      Animated.timing(sub3Opacity, {
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
    router.push('/onboarding/name');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={1}
      onPress={showContinue ? handleContinue : undefined}
    >
      <View style={[styles.content, { paddingTop: insets.top + 80 }]}>
        <View style={styles.mainTextContainer}>
          <Animated.Text style={[styles.mainText, { opacity: line1Opacity }]}>
            daily prayer call helps you put
          </Animated.Text>
          <Animated.Text style={[styles.mainText, styles.highlightText, { opacity: line2Opacity }]}>
            God first
          </Animated.Text>
        </View>

        <View style={styles.subTextContainer}>
          <Animated.View style={[styles.subLine, { opacity: sub1Opacity }]}>
            <Text style={styles.subText}>it&apos;s </Text>
            <Text style={[styles.subText, styles.highlightText]}>simple</Text>
          </Animated.View>
          <Animated.Text style={[styles.subText, { opacity: sub2Opacity }]}>
            every day
          </Animated.Text>
          <Animated.View style={[styles.subLine, { opacity: sub3Opacity }]}>
            <Text style={styles.subText}>you </Text>
            <Text style={[styles.subText, styles.highlightText]}>pray</Text>
            <Text style={styles.subText}> to start your day right</Text>
          </Animated.View>
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
  subLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
