import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, fetchUserProfile } from '../services/firebase';
import { UserProfile } from '../types';
import { theme } from '../utils/theme';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
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

  const currentLevelXp = profile.xp - ((profile.level - 1) * 100);
  const progressPercent = Math.min((currentLevelXp / 100) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{profile.title}</Text>
      <Text style={styles.username}>{profile.avatarPreset} {profile.username}</Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.levelText}>Level {profile.level}</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.xpText}>{profile.xp} XP</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('QuestPicker')}>
        <Text style={styles.primaryButtonText}>Get Quest</Text>
      </TouchableOpacity>
      
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.secondaryButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  username: {
    color: theme.colors.text,
    fontSize: 18,
    marginBottom: theme.spacing.xl,
  },
  statsCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary + '40',
  },
  levelText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
  },
  progressBarBg: {
    height: 10,
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: theme.spacing.s,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  xpText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.m,
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary + '80',
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: theme.colors.text,
  }
});
