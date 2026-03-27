import { Topic, TopicCategory } from '@/types';

export const TOPIC_CATEGORIES: { id: TopicCategory; name: string; emoji: string }[] = [
  { id: 'emotions', name: 'Emotions', emoji: '💭' },
  { id: 'life', name: 'Life Challenges', emoji: '🌟' },
  { id: 'relationships', name: 'Relationships', emoji: '💝' },
  { id: 'spiritual', name: 'Spiritual Growth', emoji: '✨' },
];

export const TOPICS: Topic[] = [
  // Emotions
  { id: 'anxiety', name: 'Anxiety', emoji: '😰', category: 'emotions', description: 'Finding peace in worry' },
  { id: 'fear', name: 'Fear', emoji: '😨', category: 'emotions', description: 'Courage in uncertainty' },
  { id: 'grief', name: 'Grief', emoji: '😢', category: 'emotions', description: 'Comfort in loss' },
  { id: 'anger', name: 'Anger', emoji: '😠', category: 'emotions', description: 'Peace in frustration' },
  { id: 'depression', name: 'Depression', emoji: '😔', category: 'emotions', description: 'Hope in darkness' },
  { id: 'loneliness', name: 'Loneliness', emoji: '🥺', category: 'emotions', description: 'Never alone' },
  
  // Life Challenges
  { id: 'health', name: 'Health', emoji: '🏥', category: 'life', description: 'Healing and strength' },
  { id: 'finances', name: 'Finances', emoji: '💰', category: 'life', description: 'Provision and trust' },
  { id: 'work', name: 'Work', emoji: '💼', category: 'life', description: 'Purpose in labor' },
  { id: 'addiction', name: 'Addiction', emoji: '⛓️', category: 'life', description: 'Freedom and renewal' },
  { id: 'decisions', name: 'Decisions', emoji: '🤔', category: 'life', description: 'Wisdom and clarity' },
  { id: 'stress', name: 'Stress', emoji: '😫', category: 'life', description: 'Rest and renewal' },
  
  // Relationships
  { id: 'marriage', name: 'Marriage', emoji: '💑', category: 'relationships', description: 'Love and unity' },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧', category: 'relationships', description: 'Harmony at home' },
  { id: 'conflict', name: 'Conflict', emoji: '🤝', category: 'relationships', description: 'Peace and reconciliation' },
  { id: 'parenting', name: 'Parenting', emoji: '👶', category: 'relationships', description: 'Wisdom for children' },
  { id: 'forgiveness', name: 'Forgiveness', emoji: '🕊️', category: 'relationships', description: 'Release and healing' },
  
  // Spiritual
  { id: 'faith', name: 'Faith', emoji: '✝️', category: 'spiritual', description: 'Trust in God' },
  { id: 'doubt', name: 'Doubt', emoji: '❓', category: 'spiritual', description: 'Questions welcomed' },
  { id: 'purpose', name: 'Purpose', emoji: '🎯', category: 'spiritual', description: 'Your calling' },
  { id: 'guidance', name: 'Guidance', emoji: '🧭', category: 'spiritual', description: 'Direction for life' },
  { id: 'gratitude', name: 'Gratitude', emoji: '🙏', category: 'spiritual', description: 'Thankful heart' },
  { id: 'strength', name: 'Strength', emoji: '💪', category: 'spiritual', description: 'Power in weakness' },
  { id: 'peace', name: 'Peace', emoji: '☮️', category: 'spiritual', description: 'Inner tranquility' },
];

export const getTopicsByCategory = (category: TopicCategory): Topic[] => {
  return TOPICS.filter(topic => topic.category === category);
};

export const getTopicById = (id: string): Topic | undefined => {
  return TOPICS.find(topic => topic.id === id);
};
