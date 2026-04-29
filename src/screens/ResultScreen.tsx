import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Quest } from '../types';
import { theme } from '../utils/theme';

export default function ResultScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { quest, earnedXp, levelUp, newTitle } = route.params as { quest: Quest, earnedXp: number, levelUp: boolean, newTitle: string };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just completed the "${quest.title}" quest in OutQuest and earned ${earnedXp} XP!\n\nJoin the adventure and find magic in the mundane.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>QUEST COMPLETED</Text>
      
      <View style={styles.card}>
        <Text style={styles.title}>{quest.title}</Text>
        <Text style={styles.difficulty}>{quest.difficulty} Difficulty</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.xpText}>+{earnedXp} XP</Text>
        
        {levelUp && (
          <View style={styles.levelUpBox}>
            <Text style={styles.levelUpText}>LEVEL UP!</Text>
            {newTitle && <Text style={styles.titleUnlock}>New Title: {newTitle}</Text>}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
        <Text style={styles.primaryButtonText}>Share Legend</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.secondaryButtonText}>Return to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.xl, letterSpacing: 2 },
  card: { backgroundColor: theme.colors.card, padding: theme.spacing.xl, borderRadius: theme.borderRadius.l, width: '100%', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.primary + '80', marginBottom: theme.spacing.xl },
  title: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.s, textAlign: 'center' },
  difficulty: { color: theme.colors.textMuted, marginBottom: theme.spacing.m },
  divider: { height: 1, backgroundColor: theme.colors.textMuted + '40', width: '80%', marginBottom: theme.spacing.m },
  xpText: { fontSize: 32, fontWeight: 'bold', color: theme.colors.secondary, marginBottom: theme.spacing.m },
  levelUpBox: { backgroundColor: theme.colors.primary + '20', padding: theme.spacing.m, borderRadius: theme.borderRadius.s, width: '100%', alignItems: 'center', marginTop: theme.spacing.m },
  levelUpText: { color: theme.colors.primary, fontSize: 18, fontWeight: 'bold' },
  titleUnlock: { color: theme.colors.text, marginTop: theme.spacing.s },
  primaryButton: { backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.xl, borderRadius: theme.borderRadius.m, width: '100%', alignItems: 'center', marginBottom: theme.spacing.m },
  primaryButtonText: { color: theme.colors.background, fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.xl, width: '100%', alignItems: 'center' },
  secondaryButtonText: { color: theme.colors.textMuted, fontSize: 16, fontWeight: 'bold' },
});
