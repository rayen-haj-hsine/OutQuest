import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { STARTER_QUESTS } from '../data/quests';
import { Difficulty } from '../types';
import { theme } from '../utils/theme';

export default function QuestPickerScreen() {
  const navigation = useNavigation<any>();

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    const quests = STARTER_QUESTS.filter(q => q.difficulty === difficulty);
    if (quests.length > 0) {
      const randomQuest = quests[Math.floor(Math.random() * quests.length)];
      navigation.navigate('QuestDetail', { quest: randomQuest });
    }
  };

  const difficulties: { label: Difficulty, time: string, desc: string }[] = [
    { label: 'Common', time: '15-30 min', desc: 'Simple local tasks' },
    { label: 'Rare', time: '~1 hour', desc: 'Slightly more involved' },
    { label: 'Epic', time: '2-3 hours', desc: 'A dedicated adventure' },
    { label: 'Legendary', time: 'Requires a friend', desc: 'Co-op journey' },
    { label: 'Mythic', time: 'Variable', desc: 'A story worth sharing' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Difficulty</Text>
      {difficulties.map(d => (
        <TouchableOpacity key={d.label} style={styles.card} onPress={() => handleSelectDifficulty(d.label)}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{d.label}</Text>
            <Text style={styles.time}>{d.time}</Text>
          </View>
          <Text style={styles.desc}>{d.desc}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m },
  header: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.m, textAlign: 'center' },
  card: { backgroundColor: theme.colors.card, padding: theme.spacing.l, borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.m, borderWidth: 1, borderColor: theme.colors.primary + '40' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.s },
  title: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
  time: { fontSize: 14, color: theme.colors.primary },
  desc: { fontSize: 14, color: theme.colors.textMuted },
});
