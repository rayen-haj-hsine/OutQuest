import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Award, ShieldAlert, ArrowLeft } from 'lucide-react-native';
import { Quest } from '../types';
import { useTheme } from '../context/ThemeContext';

export default function QuestDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { quest } = route.params as { quest: Quest };
  const { theme, fontScale } = useTheme();
  const styles = useMemo(() => createStyles(theme, fontScale), [theme, fontScale]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.category}>{quest.category.toUpperCase()}</Text>
          <Text style={styles.title}>{quest.title}</Text>
          <View style={[styles.difficultyBadge, { borderColor: theme.colors.primary }]}>
            <Text style={styles.difficultyText}>{quest.difficulty}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Award color={theme.colors.primary} size={20 * fontScale} />
            <Text style={styles.infoValue}>{quest.baseXp}</Text>
            <Text style={styles.infoLabel}>XP REWARD</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THE MISSION</Text>
          <Text style={styles.description}>{quest.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROOF REQUIRED</Text>
          <View style={styles.proofBox}>
            <Text style={styles.proofText}>{quest.proofRequired}</Text>
          </View>
        </View>

        {quest.safetyNotes && (
          <View style={styles.safetySection}>
            <ShieldAlert color={theme.colors.danger} size={18 * fontScale} />
            <Text style={styles.safetyText}>{quest.safetyNotes}</Text>
          </View>
        )}

        <TouchableOpacity 
          activeOpacity={0.8}
          style={styles.acceptButtonContainer}
          onPress={() => navigation.navigate('CompleteQuest', { quest })}
        >
          <LinearGradient
            colors={[theme.colors.secondary, theme.colors.background === '#0F0F12' ? '#5A1212' : '#C62828']}
            style={styles.acceptButton}
          >
            <Text style={styles.acceptButtonText}>ACCEPT QUEST</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any, fontScale: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  category: {
    color: theme.colors.textMuted,
    fontSize: 12 * fontScale,
    fontFamily: theme.fonts.body,
    letterSpacing: 2,
    marginBottom: theme.spacing.s,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32 * fontScale,
    fontFamily: theme.fonts.title,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  difficultyText: {
    color: theme.colors.primary,
    fontSize: 12 * fontScale,
    fontFamily: theme.fonts.subtitle,
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    color: theme.colors.text,
    fontSize: 18 * fontScale,
    fontFamily: theme.fonts.title,
    marginTop: theme.spacing.s,
  },
  infoLabel: {
    color: theme.colors.textMuted,
    fontSize: 10 * fontScale,
    fontFamily: theme.fonts.body,
    marginTop: 2,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 14 * fontScale,
    fontFamily: theme.fonts.subtitle,
    letterSpacing: 2,
    marginBottom: theme.spacing.m,
  },
  description: {
    color: theme.colors.text,
    fontSize: 16 * fontScale,
    fontFamily: theme.fonts.body,
    lineHeight: 24 * fontScale,
  },
  proofBox: {
    backgroundColor: theme.colors.background === '#0F0F12' ? '#000' : '#E5E0D8',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  proofText: {
    color: theme.colors.text,
    fontSize: 14 * fontScale,
    fontFamily: theme.fonts.body,
    fontStyle: 'italic',
  },
  safetySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.danger + '15',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.xxl,
  },
  safetyText: {
    color: theme.colors.danger,
    fontSize: 12 * fontScale,
    fontFamily: theme.fonts.body,
    marginLeft: theme.spacing.s,
    flex: 1,
  },
  acceptButtonContainer: {
    ...theme.shadows.card,
  },
  acceptButton: {
    paddingVertical: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 18 * fontScale,
    fontFamily: theme.fonts.title,
    letterSpacing: 2,
  },
});
