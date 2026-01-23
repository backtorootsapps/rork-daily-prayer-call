export interface User {
  name: string;
  onboardingComplete: boolean;
  createdAt: string;
  prayerTime: string;
  timezone: string;
  selectedTopics: string[];
  customDescription: string | null;
  currentStreak: number;
  longestStreak: number;
  totalPrayers: number;
  lastPrayerDate: string | null;
  completedToday: boolean;
  voiceGender: 'male' | 'female';
  backgroundMusicEnabled: boolean;
  topicLastPlayed: Record<string, string>;
  topicPlayCount: Record<string, number>;
  favoriteVerses: string[];
  ageRange: string;
  goals: string[];
  faithVision: string[];
  screenTime: string;
}

export interface Topic {
  id: string;
  name: string;
  emoji: string;
  category: TopicCategory;
  description: string;
}

export type TopicCategory = 'emotions' | 'life' | 'relationships' | 'spiritual';

export interface Verse {
  id: string;
  reference: string;
  text: string;
  tags: string[];
  category: VerseCategory;
  audioUrl: string;
  duration?: number;
}

export type VerseCategory = 'emotion' | 'spiritual' | 'relationship' | 'life' | 'health';

export interface PrayerCallState {
  step: 'incoming' | 'greeting' | 'context' | 'verse-intro' | 'verse' | 'prayer-prompt' | 'prayer-time' | 'closing' | 'completion';
  selectedVerse: Verse | null;
  selectedTopic: string | null;
}

export const DEFAULT_USER: User = {
  name: '',
  onboardingComplete: false,
  createdAt: '',
  prayerTime: '07:00',
  timezone: 'America/New_York',
  selectedTopics: [],
  customDescription: null,
  currentStreak: 0,
  longestStreak: 0,
  totalPrayers: 0,
  lastPrayerDate: null,
  completedToday: false,
  voiceGender: 'female',
  backgroundMusicEnabled: true,
  topicLastPlayed: {},
  topicPlayCount: {},
  favoriteVerses: [],
  ageRange: '',
  goals: [],
  faithVision: [],
  screenTime: '',
};
