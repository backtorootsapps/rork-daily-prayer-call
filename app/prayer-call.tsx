import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Phone, X, Play, Pause } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/contexts/UserContext';
import { TOPICS } from '@/constants/topics';
import { getVersesByTopic } from '@/constants/verses';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

type CallStep = 'incoming' | 'greeting' | 'context' | 'verse' | 'prayer-prompt' | 'prayer-time' | 'closing' | 'completion';

export default function PrayerCallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, incrementStreak } = useUser();
  
  const [step, setStep] = useState<CallStep>('incoming');
  const [selectedVerse, setSelectedVerse] = useState<{ reference: string; text: string } | null>(null);
  const [prayerTimeRemaining, setPrayerTimeRemaining] = useState(120);
  const [isPaused, setIsPaused] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (step === 'incoming') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [step, pulseAnim]);

  useEffect(() => {
    if (step === 'prayer-time' && !isPaused && prayerTimeRemaining > 0) {
      const timer = setInterval(() => {
        setPrayerTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (prayerTimeRemaining === 0 && step === 'prayer-time') {
      setStep('closing');
    }
  }, [step, isPaused, prayerTimeRemaining]);

  const handleAnswer = () => {
    setStep('greeting');
    
    const topicId = user.selectedTopics[0] || 'faith';
    const verses = getVersesByTopic(topicId);
    if (verses.length > 0) {
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      setSelectedVerse({ reference: randomVerse.reference, text: randomVerse.text });
    }

    setTimeout(() => setStep('context'), 3000);
  };

  const handleSkip = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTopicName = () => {
    const topic = TOPICS.find(t => t.id === user.selectedTopics[0]);
    return topic?.name.toLowerCase() || 'your walk with God';
  };

  const renderStep = () => {
    switch (step) {
      case 'incoming':
        return (
          <View style={styles.incomingContainer}>
            <Animated.View style={[styles.avatarRing, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>🙏</Text>
              </View>
            </Animated.View>
            
            <Text style={styles.callerName}>Daily Prayer Call</Text>
            <Text style={styles.callerSubtext}>Your moment with God</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.declineButton}
                onPress={handleSkip}
              >
                <X size={28} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.answerButton}
                onPress={handleAnswer}
              >
                <Phone size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.swipeHint}>Tap to answer</Text>
          </View>
        );

      case 'greeting':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.stepTitle}>🙏</Text>
            <Text style={styles.greetingText}>
              Good {getTimeOfDay()}, {user.name}.
            </Text>
            <Text style={styles.subText}>God is glad you are here.</Text>
          </View>
        );

      case 'context':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.stepTitle}>💭</Text>
            <Text style={styles.contextText}>
              Today, let us bring your {getTopicName()} before the Lord.
            </Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => setStep('verse')}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        );

      case 'verse':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.verseLabel}>📖 Scripture for Today</Text>
            <Text style={styles.verseReference}>{selectedVerse?.reference}</Text>
            <Text style={styles.verseText}>{selectedVerse?.text}</Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => setStep('prayer-prompt')}
            >
              <Text style={styles.continueButtonText}>Continue to Prayer</Text>
            </TouchableOpacity>
          </View>
        );

      case 'prayer-prompt':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.stepTitle}>🙏</Text>
            <Text style={styles.promptTitle}>Time to Pray</Text>
            <Text style={styles.promptText}>
              {user.name}, take a moment to talk to God about what is on your heart.
            </Text>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setStep('prayer-time')}
            >
              <Text style={styles.primaryButtonText}>Begin 2-Minute Prayer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => setStep('closing')}
            >
              <Text style={styles.skipButtonText}>Skip Prayer Time</Text>
            </TouchableOpacity>
          </View>
        );

      case 'prayer-time':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.timerLabel}>Prayer Time</Text>
            <Text style={styles.timer}>{formatTime(prayerTimeRemaining)}</Text>
            <Text style={styles.timerHint}>Speak to God in silence...</Text>
            
            <View style={styles.timerControls}>
              <TouchableOpacity 
                style={styles.timerButton}
                onPress={() => setIsPaused(!isPaused)}
              >
                {isPaused ? (
                  <Play size={32} color={Colors.primary} />
                ) : (
                  <Pause size={32} color={Colors.primary} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.endEarlyButton}
              onPress={() => setStep('closing')}
            >
              <Text style={styles.endEarlyText}>End Early</Text>
            </TouchableOpacity>
          </View>
        );

      case 'closing':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.stepTitle}>✨</Text>
            <Text style={styles.closingTitle}>Amen</Text>
            <Text style={styles.closingText}>
              God hears you, {user.name}. He is with you today and always.
            </Text>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => {
                incrementStreak();
                setStep('completion');
              }}
            >
              <Text style={styles.primaryButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        );

      case 'completion':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.completionEmoji}>🎉</Text>
            <Text style={styles.completionTitle}>Beautiful, {user.name}!</Text>
            <Text style={styles.completionText}>
              You have prayed {user.currentStreak + 1} days in a row.
            </Text>
            
            <View style={styles.streakBadge}>
              <Text style={styles.streakNumber}>{user.currentStreak + 1}</Text>
              <Text style={styles.streakLabel}>Day Streak 🔥</Text>
            </View>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.replace('/(main)/home')}
            >
              <Text style={styles.primaryButtonText}>Return Home</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim, paddingTop: insets.top }]}>
        {step !== 'incoming' && (
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color="#FFF" />
          </TouchableOpacity>
        )}
        
        {renderStep()}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  avatarRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 56,
  },
  callerName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  callerSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 60,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 48,
    marginBottom: 32,
  },
  declineButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#27AE60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  stepTitle: {
    fontSize: 64,
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  contextText: {
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 40,
  },
  verseLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  verseReference: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 20,
  },
  verseText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
  },
  promptTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  promptText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 16,
    minWidth: width - 96,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  timerLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timer: {
    fontSize: 72,
    fontWeight: '200',
    color: '#FFF',
    marginBottom: 8,
  },
  timerHint: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 40,
  },
  timerControls: {
    marginBottom: 32,
  },
  timerButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  endEarlyButton: {
    paddingVertical: 12,
  },
  endEarlyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  closingTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  closingText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  completionEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  completionText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 32,
  },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFF',
  },
  streakLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
});
