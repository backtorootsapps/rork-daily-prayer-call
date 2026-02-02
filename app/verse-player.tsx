import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { 
  ChevronLeft, 
  Heart, 
  RefreshCw,
  Play,
  Pause,
} from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { TOPICS } from '@/constants/topics';
import { getVersesByTopic } from '@/constants/verses';
import Colors from '@/constants/colors';

export default function VersePlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const { user, toggleFavoriteVerse, recordTopicPlay } = useUser();

  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const hasRecordedPlay = useRef(false);

  const topic = TOPICS.find(t => t.id === topicId);
  const verses = getVersesByTopic(topicId || '');
  const currentVerse = verses[currentVerseIndex];

  useEffect(() => {
    if (topicId && !hasRecordedPlay.current) {
      hasRecordedPlay.current = true;
      recordTopicPlay(topicId);
    }
  }, [topicId, recordTopicPlay]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
    }
    setError(null);
  }, [currentVerseIndex]);

  const playAudio = useCallback(async () => {
    if (!currentVerse) return;

    const audioUrl = currentVerse.audioUrl;
    
    if (!audioUrl || !audioUrl.startsWith('http')) {
      setError('Audio not available for this verse yet');
      console.log('Verse audio URL is not a full URL:', audioUrl);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      console.log('Loading audio from:', audioUrl);
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status: AVPlaybackStatus) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          } else if ('error' in status && status.error) {
            console.error('Audio playback error:', status.error);
            setError('Audio playback failed');
            setIsPlaying(false);
          }
        }
      );

      soundRef.current = sound;
      setIsPlaying(true);
      console.log('Audio started playing');
    } catch (err: unknown) {
      console.error('Error playing audio:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('NotSupportedError') || errorMessage.includes('no supported source') || errorMessage.includes('404')) {
        setError('Audio not uploaded yet. Read the verse for now.');
      } else {
        setError('Failed to play audio. Please try again.');
      }
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [currentVerse]);

  const pauseAudio = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } catch (err) {
        console.error('Error pausing audio:', err);
      }
    }
  }, []);

  const resumeAudio = useCallback(async () => {
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        } else {
          await playAudio();
        }
      } catch (err) {
        console.error('Error resuming audio:', err);
        await playAudio();
      }
    } else {
      await playAudio();
    }
  }, [playAudio]);

  const handlePlayPause = useCallback(async () => {
    if (isLoading) return;

    if (isPlaying) {
      await pauseAudio();
    } else {
      await resumeAudio();
    }
  }, [isPlaying, isLoading, pauseAudio, resumeAudio]);

  const handleNextVerse = useCallback(() => {
    const nextIndex = (currentVerseIndex + 1) % verses.length;
    setCurrentVerseIndex(nextIndex);
  }, [currentVerseIndex, verses.length]);

  const isFavorite = currentVerse && user.favoriteVerses.includes(currentVerse.id);

  const hasAudio = currentVerse?.audioUrl?.startsWith('http');

  if (!topic || verses.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📖</Text>
          <Text style={styles.emptyText}>No verses found for this topic.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{topic.emoji} {topic.name}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.verseCard}>
          <Text style={styles.verseReference}>{currentVerse?.reference}</Text>
          <Text style={styles.verseText}>{currentVerse?.text}</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => currentVerse && toggleFavoriteVerse(currentVerse.id)}
          >
            <Heart 
              size={24} 
              color={isFavorite ? '#E74C3C' : Colors.textSecondary}
              fill={isFavorite ? '#E74C3C' : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.playButton,
              !hasAudio && styles.playButtonDisabled
            ]}
            onPress={handlePlayPause}
            disabled={isLoading || !hasAudio}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.textInverse} />
            ) : isPlaying ? (
              <Pause size={32} color={Colors.textInverse} />
            ) : (
              <Play size={32} color={Colors.textInverse} style={{ marginLeft: 4 }} />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleNextVerse}
          >
            <RefreshCw size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.verseCounter}>
          <Text style={styles.counterText}>
            Verse {currentVerseIndex + 1} of {verses.length}
          </Text>
          {!hasAudio && (
            <Text style={styles.noAudioText}>
              Audio coming soon
            </Text>
          )}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Tip</Text>
          <Text style={styles.tipText}>
            {hasAudio 
              ? "Press play to hear this verse. Let God&apos;s word sink deep into your heart."
              : "Take a moment to read and meditate on this verse. Audio will be available soon."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  verseCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  verseText: {
    fontSize: 20,
    lineHeight: 32,
    color: Colors.text,
    textAlign: 'center' as const,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center' as const,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  playButtonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  verseCounter: {
    alignItems: 'center',
    marginBottom: 32,
  },
  counterText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  noAudioText: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  tipCard: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 16,
    padding: 20,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
