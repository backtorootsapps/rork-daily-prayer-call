import React, { useEffect, useRef } from 'react';
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
import { Dumbbell } from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 96;
const CHART_HEIGHT = 180;

export default function PrayerPowerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const prayerLineWidth = useRef(new Animated.Value(0)).current;
  const skippedLineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(prayerLineWidth, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(skippedLineWidth, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    router.push('/onboarding/screen-time');
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={1}
      onPress={handleContinue}
    >
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <Text style={styles.title}>prayer is powerful</Text>

        <Animated.View 
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>relationship with God</Text>
              <View style={styles.legendItem}>
                <Text style={styles.legendX}>✕</Text>
                <Text style={styles.legendText}>-skipped prayer</Text>
              </View>
            </View>
            <View style={styles.iconContainer}>
              <Dumbbell size={20} color={Colors.orange} />
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chartArea}>
              <Animated.View 
                style={[
                  styles.prayerLine,
                  {
                    width: prayerLineWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, CHART_WIDTH * 0.85],
                    }),
                  }
                ]}
              />
              <View style={styles.prayerEndpoint}>
                <View style={styles.prayerDot} />
                <Text style={styles.prayerLabel}>prayer{'\n'}journey</Text>
              </View>
              
              <Animated.View 
                style={[
                  styles.skippedLine,
                  {
                    width: skippedLineWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, CHART_WIDTH * 0.9],
                    }),
                  }
                ]}
              />
              
              <View style={styles.skippedMarkers}>
                <View style={[styles.emptyCircle, { left: '5%', top: '55%' }]} />
                <View style={[styles.emptyCircle, { left: '8%', top: '70%' }]} />
                <Text style={[styles.xMark, { left: '25%', top: '45%' }]}>✕</Text>
                <Text style={[styles.xMark, { left: '42%', top: '55%' }]}>✕</Text>
                <View style={styles.laterLabel}>
                  <Text style={styles.laterText}>I will pray later</Text>
                </View>
                <Text style={[styles.xMark, { left: '58%', top: '50%' }]}>✕</Text>
                <Text style={[styles.xMark, { left: '65%', top: '55%' }]}>✕</Text>
                <Text style={[styles.xMark, { left: '75%', top: '60%' }]}>✕</Text>
              </View>

              <View style={styles.devilLabel}>
                <Text style={styles.devilText}>the devil{'\n'}won again</Text>
                <View style={styles.devilDot} />
              </View>
            </View>

            <View style={styles.xAxis}>
              <Text style={styles.xAxisLabel}>week 1</Text>
              <Text style={styles.xAxisLabel}>week 2</Text>
              <Text style={styles.xAxisLabel}>week 3</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.Text style={[styles.messageText, { opacity: textOpacity }]}>
          keep talking to Him, the more you show up, the more room you give God to show up in your life
        </Animated.Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.continueText}>tap to continue</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.orange,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendX: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '700',
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF5E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    height: CHART_HEIGHT + 30,
  },
  chartArea: {
    height: CHART_HEIGHT,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  prayerLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: Colors.orange,
    top: '20%',
    left: 0,
    borderRadius: 2,
  },
  prayerEndpoint: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    alignItems: 'center',
  },
  prayerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.orange,
    marginBottom: 4,
  },
  prayerLabel: {
    fontSize: 10,
    color: Colors.orange,
    fontWeight: '600',
    textAlign: 'center',
  },
  skippedLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#FFCDD2',
    top: '65%',
    left: 0,
    borderRadius: 2,
  },
  skippedMarkers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyCircle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFCDD2',
  },
  xMark: {
    position: 'absolute',
    fontSize: 14,
    color: '#E53935',
    fontWeight: '700',
  },
  laterLabel: {
    position: 'absolute',
    left: '48%',
    top: '38%',
  },
  laterText: {
    fontSize: 9,
    color: '#E53935',
    fontStyle: 'italic',
  },
  devilLabel: {
    position: 'absolute',
    right: '2%',
    top: '55%',
    alignItems: 'flex-end',
  },
  devilText: {
    fontSize: 10,
    color: '#E53935',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 4,
  },
  devilDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E53935',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  xAxisLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  messageText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 12,
  },
  footer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  continueButton: {
    paddingVertical: 12,
  },
  continueText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
});
