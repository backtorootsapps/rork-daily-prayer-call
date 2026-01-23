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
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

export default function GreetingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  
  const greetingOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const continueOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      Animated.timing(greetingOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
      setCurrentStep(1);

      await new Promise(resolve => setTimeout(resolve, 1000));
      Animated.timing(nameOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
      setCurrentStep(2);

      await new Promise(resolve => setTimeout(resolve, 1000));
      Animated.timing(messageOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
      setCurrentStep(3);

      await new Promise(resolve => setTimeout(resolve, 800));
      setShowContinue(true);
      Animated.timing(continueOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    };

    animate();
  }, []);

  const handleComplete = () => {
    updateUser({ 
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    });
    router.replace('/(main)/home');
  };

  return (
    <LinearGradient
      colors={[Colors.orange, Colors.orangeDark]}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.touchArea} 
        activeOpacity={1}
        onPress={showContinue ? handleComplete : undefined}
      >
        <View style={[styles.content, { paddingTop: insets.top }]}>
          <View style={styles.centerContent}>
            <Animated.Text style={[styles.greetingText, { opacity: greetingOpacity }]}>
              hey
            </Animated.Text>
            
            {currentStep >= 2 && (
              <Animated.Text style={[styles.nameText, { opacity: nameOpacity }]}>
                {user.name || 'friend'}
              </Animated.Text>
            )}

            {currentStep >= 3 && (
              <Animated.Text style={[styles.messageText, { opacity: messageOpacity }]}>
                your journey begins now
              </Animated.Text>
            )}
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
            onPress={handleComplete}
            activeOpacity={0.7}
          >
            <Text style={styles.continueText}>tap to continue</Text>
            <ArrowRight size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  touchArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  centerContent: {
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.textInverse,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.textInverse,
    marginBottom: 24,
  },
  messageText: {
    fontSize: 20,
    color: Colors.textInverse,
    opacity: 0.9,
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
    color: 'rgba(255,255,255,0.8)',
  },
});
