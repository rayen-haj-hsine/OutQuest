import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { auth, fetchUserProfile } from '../services/firebase';
import { UserProfile } from '../types';
import { theme } from '../utils/theme';

export default function ProfileScreen() {
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
    loadProfile();
  }, []);

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avatar}>{profile.avatarPreset}</Text>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.title}>{profile.title}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{profile.level}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total XP</Text>
          <Text style={styles.statValue}>{profile.xp}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Quests Completed</Text>
          <Text style={styles.statValue}>{profile.completedQuestCount}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Mythic Quests</Text>
          <Text style={styles.statValue}>{profile.mythicQuestCount}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  header: { alignItems: 'center', marginVertical: theme.spacing.xl },
  avatar: { fontSize: 64, marginBottom: theme.spacing.s },
  username: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  title: { fontSize: 18, color: theme.colors.primary, marginTop: theme.spacing.s },
  statsCard: { backgroundColor: theme.colors.card, borderRadius: theme.borderRadius.m, padding: theme.spacing.l, borderWidth: 1, borderColor: theme.colors.primary + '40' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.m },
  statLabel: { fontSize: 16, color: theme.colors.textMuted },
  statValue: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
  divider: { height: 1, backgroundColor: theme.colors.textMuted + '40' }
});
