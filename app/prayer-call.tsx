import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Phone, 
  X, 
  Volume2, 
  VolumeX,
  BookOpen, 
  MicOff, 
  Mic,
  Pause, 
  Play,
  FileText,
  PhoneOff,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useUser } from '@/contexts/UserContext';
import { TOPICS } from '@/constants/topics';
import { getVersesByTopic } from '@/constants/verses';

const { width, height } = Dimensions.get('window');

type CallPhase = 'greeting' | 'context' | 'verse' | 'prayer-intro' | 'prayer-time' | 'closing' | 'amen';

interface CallContent {
  phase: CallPhase;
  title: string;
  subtitle?: string;
  emoji?: string;
}

export default function PrayerCallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, incrementStreak } = useUser();
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<CallPhase>('greeting');
  const [selectedVerse, setSelectedVerse] = useState<{ reference: string; text: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showVerse, setShowVerse] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [prayerTimeRemaining, setPrayerTimeRemaining] = useState(120);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentFadeAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!isCallActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      
      const ring = Animated.loop(
        Animated.sequence([
          Animated.timing(ringAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(ringAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      
      pulse.start();
      ring.start();
      
      return () => {
        pulse.stop();
        ring.stop();
      };
    }
  }, [isCallActive]);

  useEffect(() => {
    if (isCallActive && !isPaused) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCallActive, isPaused]);

  useEffect(() => {
    if (currentPhase === 'prayer-time' && !isPaused && prayerTimeRemaining > 0) {
      const timer = setInterval(() => {
        setPrayerTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (prayerTimeRemaining === 0 && currentPhase === 'prayer-time') {
      transitionToPhase('closing');
    }
  }, [currentPhase, isPaused, prayerTimeRemaining]);

  // Auto-progression through phases
  useEffect(() => {
    if (!isCallActive || isPaused) return;
    
    const phaseTimings: Partial<Record<CallPhase, number>> = {
      'greeting': 4000,
      'context': 5000,
      'verse': 8000,
      'prayer-intro': 5000,
      'closing': 6000,
    };
    
    const duration = phaseTimings[currentPhase];
    if (!duration) return;
    
    const nextPhaseMap: Partial<Record<CallPhase, CallPhase>> = {
      'greeting': 'context',
      'context': 'verse',
      'verse': 'prayer-intro',
      'prayer-intro': 'prayer-time',
      'closing': 'amen',
    };
    
    const nextPhase = nextPhaseMap[currentPhase];
    if (!nextPhase) return;
    
    const timer = setTimeout(() => {
      transitionToPhase(nextPhase);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [currentPhase, isCallActive, isPaused, transitionToPhase]);

  const transitionToPhase = useCallback((newPhase: CallPhase) => {
    Animated.sequence([
      Animated.timing(contentFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => {
      setCurrentPhase(newPhase);
    }, 200);
  }, []);

  const handleAnswer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsCallActive(true);
    
    const topicId = user.selectedTopics[0] || 'faith';
    const verses = getVersesByTopic(topicId);
    if (verses.length > 0) {
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      setSelectedVerse({ reference: randomVerse.reference, text: randomVerse.text });
    }
  };

  const handleDecline = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleEndCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentPhase === 'amen') {
      incrementStreak();
      router.replace('/(main)/home');
    } else {
      transitionToPhase('amen');
    }
  };

  const handleNextPhase = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const phases: CallPhase[] = ['greeting', 'context', 'verse', 'prayer-intro', 'prayer-time', 'closing', 'amen'];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex < phases.length - 1) {
      transitionToPhase(phases[currentIndex + 1]);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getTopicName = () => {
    const topic = TOPICS.find(t => t.id === user.selectedTopics[0]);
    return topic?.name.toLowerCase() || 'faith';
  };

  const getPhaseContent = (): CallContent => {
    switch (currentPhase) {
      case 'greeting':
        return {
          phase: 'greeting',
          title: `Good ${getTimeOfDay()},\n${user.name}`,
          subtitle: "Welcome to your daily prayer call. Let's spend a few moments together in God's presence.",
          emoji: '🙏',
        };
      case 'context':
        return {
          phase: 'context',
          title: `Praying for ${getTopicName()}`,
          subtitle: `Today, let us bring your ${getTopicName()} before the Lord. He knows your heart and wants to meet you here.`,
          emoji: '💭',
        };
      case 'verse':
        return {
          phase: 'verse',
          title: selectedVerse?.reference || 'Scripture',
          subtitle: selectedVerse?.text || '',
          emoji: '📖',
        };
      case 'prayer-intro':
        return {
          phase: 'prayer-intro',
          title: 'Time to Pray',
          subtitle: `${user.name}, take a moment to talk to God about what's on your heart. He's listening.`,
          emoji: '🙏',
        };
      case 'prayer-time':
        return {
          phase: 'prayer-time',
          title: formatDuration(prayerTimeRemaining),
          subtitle: 'Speak to God in silence... He hears every word of your heart.',
          emoji: '✨',
        };
      case 'closing':
        return {
          phase: 'closing',
          title: 'Amen',
          subtitle: `God hears you, ${user.name}. He is with you today and always. Go in His peace.`,
          emoji: '✨',
        };
      case 'amen':
        return {
          phase: 'amen',
          title: `Beautiful, ${user.name}!`,
          subtitle: `You've prayed ${user.currentStreak + 1} days in a row. Keep walking with Him! 🔥`,
          emoji: '🎉',
        };
    }
  };

  const phases: CallPhase[] = ['greeting', 'context', 'verse', 'prayer-intro', 'prayer-time', 'closing', 'amen'];
  const currentPhaseIndex = phases.indexOf(currentPhase);

  const renderIncomingCall = () => (
    <View style={styles.incomingContainer}>
      <View style={styles.incomingTop}>
        <Animated.View 
          style={[
            styles.ringEffect,
            {
              opacity: ringAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.6, 0.2, 0],
              }),
              transform: [{
                scale: ringAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2],
                }),
              }],
            },
          ]}
        />
        <Animated.View style={[styles.avatarRing, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🙏</Text>
          </View>
        </Animated.View>
        
        <Text style={styles.callerName}>Daily Prayer Call</Text>
        <Text style={styles.callerSubtext}>Your moment with God</Text>
      </View>

      <View style={[styles.incomingBottom, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.actionButtons}>
          <View style={styles.actionButtonWrapper}>
            <TouchableOpacity 
              style={styles.declineButton}
              onPress={handleDecline}
              activeOpacity={0.8}
            >
              <PhoneOff size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Decline</Text>
          </View>
          
          <View style={styles.actionButtonWrapper}>
            <TouchableOpacity 
              style={styles.answerButton}
              onPress={handleAnswer}
              activeOpacity={0.8}
            >
              <Phone size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Accept</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActiveCall = () => {
    const content = getPhaseContent();
    
    return (
      <View style={styles.activeCallContainer}>
        <View style={[styles.callHeader, { paddingTop: insets.top + 12 }]}>
          <View style={styles.durationBadge}>
            <View style={styles.durationDot} />
            <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
          </View>
          
          <Text style={styles.callTitle}>Daily Prayer Call 🙏</Text>
          <Text style={styles.callSubtitle}>Praying for {getTopicName()}</Text>
        </View>

        <Animated.View style={[styles.contentArea, { opacity: contentFadeAnim }]}>
          <TouchableOpacity 
            style={styles.contentTouchable} 
            onPress={currentPhase !== 'prayer-time' && currentPhase !== 'amen' ? handleNextPhase : undefined}
            activeOpacity={0.9}
          >
            {content.emoji && currentPhase !== 'prayer-time' && (
              <Text style={styles.phaseEmoji}>{content.emoji}</Text>
            )}
            
            <Text style={[
              styles.contentTitle,
              currentPhase === 'prayer-time' && styles.timerTitle,
            ]}>
              {content.title}
            </Text>
            
            <Text style={styles.contentSubtitle}>{content.subtitle}</Text>
            
            {currentPhase === 'amen' && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakNumber}>{user.currentStreak + 1}</Text>
                <Text style={styles.streakLabel}>Day Streak 🔥</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.phaseDots}>
          {phases.slice(0, -1).map((_, index) => (
            <View 
              key={index}
              style={[
                styles.phaseDot,
                index <= currentPhaseIndex && styles.phaseDotActive,
              ]}
            />
          ))}
        </View>

        <View style={[styles.controlsContainer, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.controlsRow}>
            <TouchableOpacity 
              style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsSpeakerOn(!isSpeakerOn);
              }}
              activeOpacity={0.7}
            >
              {isSpeakerOn ? (
                <Volume2 size={24} color="#FFF" />
              ) : (
                <VolumeX size={24} color="#FFF" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, showVerse && styles.controlButtonActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowVerse(!showVerse);
              }}
              activeOpacity={0.7}
            >
              <BookOpen size={24} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsMuted(!isMuted);
              }}
              activeOpacity={0.7}
            >
              {isMuted ? (
                <MicOff size={24} color="#FFF" />
              ) : (
                <Mic size={24} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.controlsRowLabels}>
            <Text style={styles.controlLabel}>Speaker</Text>
            {'          '}
            <Text style={styles.controlLabel}>Verse</Text>
            {'          '}
            <Text style={styles.controlLabel}>Mute</Text>
          </Text>

          <View style={styles.controlsRow}>
            <TouchableOpacity 
              style={[styles.controlButton, isPaused && styles.controlButtonActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsPaused(!isPaused);
              }}
              activeOpacity={0.7}
            >
              {isPaused ? (
                <Play size={24} color="#FFF" />
              ) : (
                <Pause size={24} color="#FFF" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.endCallButton}
              onPress={handleEndCall}
              activeOpacity={0.8}
            >
              <PhoneOff size={28} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, showNotes && styles.controlButtonActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowNotes(true);
              }}
              activeOpacity={0.7}
            >
              <FileText size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.controlsRowLabels}>
            <Text style={styles.controlLabel}>{isPaused ? 'Resume' : 'Pause'}</Text>
            {'                          '}
            <Text style={styles.controlLabel}>Notes</Text>
          </Text>
        </View>

        <Modal
          visible={showVerse}
          transparent
          animationType="fade"
          onRequestClose={() => setShowVerse(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowVerse(false)}
          >
            <View style={styles.verseModal}>
              <Text style={styles.verseModalLabel}>📖 Today's Scripture</Text>
              <Text style={styles.verseModalReference}>{selectedVerse?.reference}</Text>
              <Text style={styles.verseModalText}>{selectedVerse?.text}</Text>
              <TouchableOpacity 
                style={styles.verseModalClose}
                onPress={() => setShowVerse(false)}
              >
                <Text style={styles.verseModalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={showNotes}
          transparent
          animationType="slide"
          onRequestClose={() => setShowNotes(false)}
        >
          <KeyboardAvoidingView 
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={[styles.notesModal, { paddingBottom: insets.bottom + 20 }]}>
              <View style={styles.notesHeader}>
                <Text style={styles.notesTitle}>Prayer Notes</Text>
                <TouchableOpacity onPress={() => setShowNotes(false)}>
                  <X size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.notesInput}
                multiline
                placeholder="Write your thoughts, prayers, or reflections..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={isCallActive ? ['#2d1b4e', '#1a1035', '#0d0a1a'] : ['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {isCallActive ? renderActiveCall() : renderIncomingCall()}
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
  incomingContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  incomingTop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringEffect: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
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
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  callerSubtext: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
  },
  incomingBottom: {
    paddingHorizontal: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButtonWrapper: {
    alignItems: 'center',
  },
  declineButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  answerButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#27AE60',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  activeCallContainer: {
    flex: 1,
  },
  callHeader: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  durationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27AE60',
    marginRight: 8,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  callTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  callSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  contentTouchable: {
    alignItems: 'center',
  },
  phaseEmoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  timerTitle: {
    fontSize: 64,
    fontWeight: '200',
    letterSpacing: 4,
  },
  contentSubtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  streakNumber: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFF',
  },
  streakLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  phaseDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  phaseDotActive: {
    backgroundColor: '#FFF',
  },
  controlsContainer: {
    paddingHorizontal: 24,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 8,
  },
  controlsRowLabels: {
    textAlign: 'center',
    marginBottom: 20,
  },
  controlLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(139,92,246,0.5)',
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseModal: {
    backgroundColor: '#1a1035',
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  verseModalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  verseModalReference: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  verseModalText: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  verseModalClose: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
  },
  verseModalCloseText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notesModal: {
    backgroundColor: '#1a1035',
    marginTop: 'auto',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: height * 0.6,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  notesInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#FFF',
    minHeight: 200,
    textAlignVertical: 'top',
  },
});
