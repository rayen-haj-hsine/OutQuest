import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Quest } from '../types';
import { theme } from '../utils/theme';

export default function QuestDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { quest } = route.params as { quest: Quest };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.difficulty}>{quest.difficulty}</Text>
          <Text style={styles.time}>{quest.estimatedTime}</Text>
        </View>
        <Text style={styles.title}>{quest.title}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objective</Text>
          <Text style={styles.text}>{quest.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proof Required</Text>
          <Text style={styles.text}>{quest.proofRequired}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          <Text style={styles.rewardText}>+{quest.baseXp} XP</Text>
          {quest.bonusXpRules && <Text style={styles.bonusText}>{quest.bonusXpRules}</Text>}
          {quest.titleReward && <Text style={styles.titleRewardText}>Title: {quest.titleReward}</Text>}
        </View>

        {quest.safetyNotes && (
          <View style={styles.safetyBox}>
            <Text style={styles.safetyTitle}>Safety Note</Text>
            <Text style={styles.safetyText}>{quest.safetyNotes}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('CompleteQuest', { quest })}>
        <Text style={styles.startButtonText}>Accept Quest</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m },
  card: { backgroundColor: theme.colors.card, padding: theme.spacing.l, borderRadius: theme.borderRadius.m, borderWidth: 1, borderColor: theme.colors.primary + '40', marginBottom: theme.spacing.l },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.s },
  difficulty: { color: theme.colors.primary, fontWeight: 'bold', textTransform: 'uppercase' },
  time: { color: theme.colors.textMuted },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.m },
  section: { marginBottom: theme.spacing.m },
  sectionTitle: { fontSize: 16, color: theme.colors.primary, marginBottom: theme.spacing.s },
  text: { color: theme.colors.text, lineHeight: 22 },
  rewardText: { color: theme.colors.secondary, fontWeight: 'bold', fontSize: 18 },
  bonusText: { color: theme.colors.secondary, marginTop: 4 },
  titleRewardText: { color: theme.colors.primary, marginTop: 4, fontWeight: 'bold' },
  safetyBox: { backgroundColor: theme.colors.danger + '20', padding: theme.spacing.m, borderRadius: theme.borderRadius.s, borderWidth: 1, borderColor: theme.colors.danger + '50' },
  safetyTitle: { color: theme.colors.danger, fontWeight: 'bold', marginBottom: 4 },
  safetyText: { color: theme.colors.text, fontSize: 14 },
  startButton: { backgroundColor: theme.colors.primary, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, alignItems: 'center', marginBottom: theme.spacing.xl },
  startButtonText: { color: theme.colors.background, fontSize: 18, fontWeight: 'bold' }
});
