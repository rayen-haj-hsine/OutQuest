import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Skull, Zap, Gem, Crown, ChevronRight, Lock } from 'lucide-react-native';
import { STARTER_QUESTS as quests } from '../data/quests';
import { auth, fetchUserProfile, getTodayCompletions } from '../services/firebase';
import { theme } from '../utils/theme';
import { Quest, UserProfile, QuestCompletion } from '../types';

const DifficultyIcon = ({ difficulty, size = 20 }: { difficulty: string, size?: number }) => {
  switch (difficulty) {
    case 'Common': return <Shield color="#A1A1A6" size={size} />;
    case 'Rare': return <Zap color="#4A90E2" size={size} />;
    case 'Epic': return <Gem color="#9B51E0" size={size} />;
    case 'Legendary': return <Skull color="#D4AF37" size={size} />;
    case 'Mythic': return <Crown color="#FF4D4D" size={size} />;
    default: return <Shield color="#A1A1A6" size={size} />;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Common': return '#A1A1A6';
    case 'Rare': return '#4A90E2';
    case 'Epic': return '#9B51E0';
    case 'Legendary': return '#D4AF37';
    case 'Mythic': return '#FF4D4D';
    default: return '#A1A1A6';
  }
};

export default function QuestPickerScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayCompletions, setTodayCompletions] = useState<QuestCompletion[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (uid) {
          const [uProfile, completions] = await Promise.all([
            fetchUserProfile(uid),
            getTodayCompletions(uid)
          ]);
          setProfile(uProfile);
          setTodayCompletions(completions);
        }
      } catch (error) {
        console.error("Error loading quests:", error);
      } finally {
        setLoading(false);
      }
    };

    
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const filteredQuests = useMemo(() => {
    const difficulties = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];
    const selection: Quest[] = [];
    difficulties.forEach(diff => {
      const questsOfDiff = quests.filter(q => q.difficulty === diff);
      if (questsOfDiff.length > 0) {
        const randomIndex = Math.floor(Math.random() * questsOfDiff.length);
        selection.push(questsOfDiff[randomIndex]);
      }
    });
    return selection;
  }, []);

  const lowRarityCount = todayCompletions.filter(c => c.difficulty === 'Common' || c.difficulty === 'Rare').length;
  const highRarityCount = todayCompletions.filter(c => c.difficulty === 'Epic' || c.difficulty === 'Legendary' || c.difficulty === 'Mythic').length;

  const isLowLimitReached = !profile?.isTester && lowRarityCount >= 2;
  const isHighLimitReached = !profile?.isTester && highRarityCount >= 1;

  const renderQuest = ({ item }: { item: Quest }) => {
    const isHigh = item.difficulty === 'Epic' || item.difficulty === 'Legendary' || item.difficulty === 'Mythic';
    const isLocked = isHigh ? isHighLimitReached : isLowLimitReached;

    return (
      <TouchableOpacity 
        activeOpacity={isLocked ? 1 : 0.8}
        onPress={() => {
          if (isLocked) {
            Alert.alert("Daily Limit Reached", `You have already completed your daily limit for ${isHigh ? 'High' : 'Low'} rarity quests. Return tomorrow for more!`);
          } else {
            navigation.navigate('QuestDetail', { quest: item });
          }
        }}
        style={[styles.cardContainer, isLocked && styles.cardLocked]}
      >
        <LinearGradient
          colors={[theme.colors.card, '#121217']}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <View style={styles.difficultyBadge}>
              <DifficultyIcon difficulty={item.difficulty} size={14} />
              <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
                {item.difficulty.toUpperCase()}
              </Text>
            </View>
            {isLocked ? (
              <View style={styles.lockIcon}><Lock color={theme.colors.danger} size={14} /></View>
            ) : (
              <Text style={styles.xpBadge}>+{item.baseXp} XP</Text>
            )}
          </View>

          <Text style={[styles.questTitle, isLocked && styles.textLocked]}>{item.title}</Text>
          <Text style={styles.categoryText}>{item.category}</Text>

          <View style={styles.cardFooter}>
            {!isLocked && <ChevronRight color={theme.colors.textMuted} size={16} />}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.limitHeader}>
        <Text style={styles.limitText}>
          Low Rarity: <Text style={{ color: isLowLimitReached ? theme.colors.danger : theme.colors.primary }}>{lowRarityCount}/2</Text>
        </Text>
        <Text style={styles.limitText}>
          High Rarity: <Text style={{ color: isHighLimitReached ? theme.colors.danger : theme.colors.primary }}>{highRarityCount}/1</Text>
        </Text>
      </View>
      <FlatList
        data={filteredQuests}
        renderItem={renderQuest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  limitText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.subtitle,
    fontSize: 12,
  },
  list: {
    padding: theme.spacing.m,
  },
  cardContainer: {
    marginBottom: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardLocked: {
    opacity: 0.6,
    borderColor: theme.colors.danger + '40',
  },
  card: {
    padding: theme.spacing.m,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: theme.fonts.subtitle,
    marginLeft: 6,
    letterSpacing: 1,
  },
  xpBadge: {
    color: theme.colors.primary,
    fontSize: 12,
    fontFamily: theme.fonts.bodyBold,
  },
  lockIcon: {
    backgroundColor: '#000',
    padding: 4,
    borderRadius: 10,
  },
  questTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontFamily: theme.fonts.title,
    marginBottom: 2,
  },
  textLocked: {
    color: theme.colors.textMuted,
  },
  categoryText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.body,
    marginBottom: theme.spacing.m,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border + '40',
    paddingTop: theme.spacing.s,
  },
  timeText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: theme.fonts.body,
  }
});
