import React, { useEffect, useRef, useState } from 'react';
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
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

export default function HonestyThanksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [showContinue, setShowContinue] = useState(false);
  
  const emojiOpacity = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const continueOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      Animated.parallel([
        Animated.timing(emojiOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(emojiScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      await new Promise(resolve => setTimeout(resolve, 600));
      
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

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

  const handleContinue = () => {
    router.push('/onboarding/encouragement');
  };

  const userName = user.name || 'friend';

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={1}
      onPress={showContinue ? handleContinue : undefined}
    >
      <View style={[styles.content, { paddingTop: insets.top + 80 }]}>
        <Animated.Text 
          style={[
            styles.emoji, 
            { 
              opacity: emojiOpacity,
              transform: [{ scale: emojiScale }],
            }
          ]}
        >
          🕊️
        </Animated.Text>
        
        <Animated.View style={{ opacity: textOpacity }}>
          <Text style={styles.title}>
            thank you for your{'\n'}
            <Text style={styles.highlightText}>honesty</Text>, {userName}.
          </Text>
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
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 44,
  },
  highlightText: {
    color: Colors.orange,
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
