import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getTopUsers } from '../services/firebase';
import { UserProfile } from '../types';
import { theme } from '../utils/theme';

export default function LeaderboardScreen() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const topUsers = await getTopUsers();
        setUsers(topUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: UserProfile, index: number }) => (
    <View style={styles.row}>
      <Text style={styles.rank}>{index + 1}</Text>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.avatarPreset} {item.username}</Text>
        <Text style={styles.title}>{item.title} • Lvl {item.level}</Text>
      </View>
      <Text style={styles.xp}>{item.xp} XP</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Global Legends</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  header: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, padding: theme.spacing.m, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: theme.colors.card },
  list: { padding: theme.spacing.m },
  row: { flexDirection: 'row', backgroundColor: theme.colors.card, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.s, alignItems: 'center' },
  rank: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary, width: 40 },
  userInfo: { flex: 1 },
  username: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
  title: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
  xp: { fontSize: 16, fontWeight: 'bold', color: theme.colors.secondary }
});
