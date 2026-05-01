import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Medal, Star } from 'lucide-react-native';
import { getTopUsers } from '../services/supabase';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

const RankIcon = ({ rank, theme, fontScale }: { rank: number, theme: any, fontScale: number }) => {
  if (rank === 1) return <Trophy color={theme.colors.gold} size={24 * fontScale} />;
  if (rank === 2) return <Medal color={theme.colors.silver} size={22 * fontScale} />;
  if (rank === 3) return <Medal color={theme.colors.bronze} size={20 * fontScale} />;
  return <Text style={{ color: theme.colors.textMuted, fontSize: 16 * fontScale, fontFamily: theme.fonts.title }}>{rank}</Text>;
};

export default function LeaderboardScreen() {
  const navigation = useNavigation<any>();
  const { theme, fontScale } = useTheme();
  const styles = useMemo(() => createStyles(theme, fontScale), [theme, fontScale]);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const data = await getTopUsers();
      setUsers(data);
      setLoading(false);
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

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.headerTitle}>HALL OF FAME</Text>
      <Text style={styles.headerSub}>The Greatest Adventurers</Text>
    </View>
  );

  const renderUser = ({ item, index }: { item: UserProfile, index: number }) => {
    const isTop3 = index < 3;
    const rank = index + 1;

    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => navigation.navigate('PublicProfile', { uid: item.uid })}
      >
        <LinearGradient
          colors={isTop3 ? (theme.colors.background === '#0F0F12' ? ['#2D2D35', '#1A1A1F'] : ['#EAE6DF', '#F4F1EA']) : [theme.colors.card, theme.colors.card]}
          style={[styles.userRow, isTop3 && styles.top3Row]}
        >
          <View style={styles.rankSection}>
            <RankIcon rank={rank} theme={theme} fontScale={fontScale} />
          </View>

          <View style={styles.userSection}>
            <Text style={[styles.username, isTop3 && styles.top3Username]}>
              {item.avatarPreset} {item.username}
            </Text>
            <Text style={styles.userTitle}>{item.title}</Text>
          </View>

          <View style={styles.xpSection}>
            <Text style={styles.xpValue}>{item.xp}</Text>
            <Text style={styles.xpLabel}>XP</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.uid}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (theme: any, fontScale: number) => StyleSheet.create({
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
  list: {
    padding: theme.spacing.m,
  },
  listHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.m,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontSize: 24 * fontScale,
    fontFamily: theme.fonts.title,
    letterSpacing: 2,
  },
  headerSub: {
    color: theme.colors.textMuted,
    fontSize: 12 * fontScale,
    fontFamily: theme.fonts.body,
    marginTop: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  top3Row: {
    borderColor: theme.colors.primary + '60',
    paddingVertical: theme.spacing.l,
  },
  rankSection: {
    width: 40 * fontScale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userSection: {
    flex: 1,
    marginLeft: theme.spacing.m,
  },
  username: {
    color: theme.colors.text,
    fontSize: 16 * fontScale,
    fontFamily: theme.fonts.bodyBold,
  },
  top3Username: {
    fontSize: 18 * fontScale,
    color: theme.colors.primary,
  },
  userTitle: {
    color: theme.colors.textMuted,
    fontSize: 12 * fontScale,
    fontFamily: theme.fonts.subtitle,
  },
  xpSection: {
    alignItems: 'flex-end',
  },
  xpValue: {
    color: theme.colors.text,
    fontSize: 16 * fontScale,
    fontFamily: theme.fonts.bodyBold,
  },
  xpLabel: {
    color: theme.colors.textMuted,
    fontSize: 10 * fontScale,
    fontFamily: theme.fonts.body,
  }
});
