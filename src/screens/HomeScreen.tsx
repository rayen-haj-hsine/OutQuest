import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Trophy, Sword, ChevronRight } from 'lucide-react-native';
import { auth, fetchUserProfile } from '../services/supabase';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { getTotalXpForLevel } from '../utils/xp';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { theme, fontScale } = useTheme();
  const styles = useMemo(() => createStyles(theme, fontScale), [theme, fontScale]);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const data = await fetchUserProfile(uid);
        setProfile(data);
      }
      setLoading(false);
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Profile not found.</Text>
      </View>
    );
  }

  const currentLevelMinXp = getTotalXpForLevel(profile.level);
  const nextLevelMinXp = getTotalXpForLevel(profile.level + 1);
  const xpInCurrentLevel = profile.xp - currentLevelMinXp;
  const xpNeededForNextLevel = nextLevelMinXp - currentLevelMinXp;
  const progressPercent = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{profile.title}</Text>
        <Text style={styles.username}>{profile.avatarPreset} {profile.username}</Text>
      </View>
      
      <LinearGradient
        colors={[theme.colors.card, theme.colors.background === '#0F0F12' ? '#121217' : '#EAE6DF']}
        style={[styles.statsCard, theme.shadows.card]}
      >
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{profile.level}</Text>
          <Text style={styles.levelLabel}>LEVEL</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.background === '#0F0F12' ? '#B8860B' : '#8A6308']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>
          <View style={styles.xpRow}>
            <Text style={styles.xpText}>{profile.xp} XP</Text>
            <Text style={styles.xpTextMuted}>/ {nextLevelMinXp} XP</Text>
          </View>
        </View>
      </LinearGradient>

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('QuestPicker')}
        style={styles.mainAction}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.background === '#0F0F12' ? '#B8860B' : '#8A6308']}
          style={styles.mainActionButton}
        >
          <Sword color={theme.colors.background === '#0F0F12' ? theme.colors.background : '#FFF'} size={24} />
          <Text style={styles.mainActionText}>FIND A QUEST</Text>
          <ChevronRight color={theme.colors.background === '#0F0F12' ? theme.colors.background : '#FFF'} size={20} />
        </LinearGradient>
      </TouchableOpacity>
      
      <View style={styles.rowButtons}>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => navigation.navigate('Profile')}
        >
          <User color={theme.colors.primary} size={20} />
          <Text style={styles.secondaryButtonText}>PROFILE</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <Trophy color={theme.colors.primary} size={20} />
          <Text style={styles.secondaryButtonText}>HALL OF FAME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any, fontScale: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.l,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 28 * fontScale,
    fontFamily: theme.fonts.title,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  username: {
    color: theme.colors.textMuted,
    fontSize: 16 * fontScale,
    fontFamily: theme.fonts.body,
    letterSpacing: 1,
  },
  statsCard: {
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background === '#0F0F12' ? '#000' : '#FFF',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  levelNumber: {
    color: theme.colors.primary,
    fontSize: 22 * fontScale,
    fontFamily: theme.fonts.title,
    lineHeight: 26 * fontScale,
  },
  levelLabel: {
    color: theme.colors.primary,
    fontSize: 8 * fontScale,
    fontFamily: theme.fonts.subtitle,
    marginTop: -2,
  },
  progressSection: {
    flex: 1,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: theme.colors.background === '#0F0F12' ? '#000' : '#E5E0D8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.s,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  xpText: {
    color: theme.colors.text,
    fontSize: 14 * fontScale,
    fontFamily: theme.fonts.bodyBold,
  },
  xpTextMuted: {
    color: theme.colors.textMuted,
    fontSize: 12 * fontScale,
    fontFamily: theme.fonts.body,
    marginLeft: 4,
  },
  mainAction: {
    marginBottom: theme.spacing.l,
    ...theme.shadows.glow,
  },
  mainActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
  },
  mainActionText: {
    color: theme.colors.background === '#0F0F12' ? theme.colors.background : '#FFF',
    fontSize: 18 * fontScale,
    fontFamily: theme.fonts.title,
    letterSpacing: 2,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    flex: 0.48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 12 * fontScale,
    fontFamily: theme.fonts.subtitle,
    marginLeft: theme.spacing.s,
    letterSpacing: 1,
  },
  text: {
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
    fontSize: 14 * fontScale,
  }
});
