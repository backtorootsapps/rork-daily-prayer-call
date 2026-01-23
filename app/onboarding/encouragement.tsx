import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

const PARAGRAPHS = [
  { text: "struggles like these are a part of walking with ", highlight: "faith", suffix: " in a broken world." },
  { text: "the apostle paul wrote about his own constant battles.", highlight: null, suffix: null },
  { text: "you are not alone in this.", highlight: null, suffix: null },
  { text: "the good news is that we have a ", highlight: "Savior", suffix: " who understands our weaknesses perfectly (hebrews 4:15)." },
  { text: "", highlight: "prayer", suffix: " is how we can approach ", highlight2: "Him", suffix2: " with confidence to find the ", highlight3: "grace", suffix3: " and help we need for each day." },
];

export default function EncouragementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [, setShowContinue] = useState(false);
  
  const emojiOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const paragraphOpacities = useRef(PARAGRAPHS.map(() => new Animated.Value(0))).current;
  const continueOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      Animated.timing(emojiOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      await new Promise(resolve => setTimeout(resolve, 200));
      
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      for (let i = 0; i < PARAGRAPHS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        Animated.timing(paragraphOpacities[i], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }

      await new Promise(resolve => setTimeout(resolve, 500));
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
    router.push('/onboarding/denomination');
  };

  const userName = user.name || 'friend';

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text style={[styles.emoji, { opacity: emojiOpacity }]}>
          ✍️
        </Animated.Text>
        
        <Animated.View style={{ opacity: titleOpacity }}>
          <Text style={styles.title}>
            thank you for your{'\n'}
            <Text style={styles.highlightText}>honesty</Text>, {userName}.
          </Text>
        </Animated.View>

        <View style={styles.paragraphsContainer}>
          <Animated.Text style={[styles.paragraph, { opacity: paragraphOpacities[0] }]}>
            struggles like these are a part of walking with <Text style={styles.highlightText}>faith</Text> in a broken world.
          </Animated.Text>
          
          <Animated.Text style={[styles.paragraph, { opacity: paragraphOpacities[1] }]}>
            the apostle paul wrote about his own constant battles.
          </Animated.Text>
          
          <Animated.Text style={[styles.paragraph, { opacity: paragraphOpacities[2] }]}>
            you are not alone in this.
          </Animated.Text>
          
          <Animated.Text style={[styles.paragraph, { opacity: paragraphOpacities[3] }]}>
            the good news is that we have a <Text style={styles.highlightText}>Savior</Text> who understands our weaknesses perfectly (hebrews 4:15).
          </Animated.Text>
          
          <Animated.Text style={[styles.paragraph, { opacity: paragraphOpacities[4] }]}>
            <Text style={styles.highlightText}>prayer</Text> is how we can approach <Text style={styles.highlightText}>Him</Text> with confidence to find the <Text style={styles.highlightText}>grace</Text> and help we need for each day.
          </Animated.Text>
        </View>
      </ScrollView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 38,
    marginBottom: 28,
  },
  highlightText: {
    color: Colors.orange,
  },
  paragraphsContainer: {
    gap: 20,
  },
  paragraph: {
    fontSize: 18,
    color: Colors.text,
    lineHeight: 28,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: Colors.background,
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
