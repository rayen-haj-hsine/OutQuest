import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Share2, Home, Star } from 'lucide-react-native';
import { theme } from '../utils/theme';

export default function ResultScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { quest, earnedXp, levelUp, newTitle } = route.params;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A1A1F', theme.colors.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <CheckCircle color={theme.colors.success} size={80} />
          </View>

          <Text style={styles.congrats}>QUEST COMPLETE</Text>
          <Text style={styles.questTitle}>{quest.title}</Text>

          <View style={styles.rewardCard}>
            <Star color={theme.colors.primary} size={24} fill={theme.colors.primary} />
            <Text style={styles.xpGained}>+{earnedXp} XP</Text>
          </View>

          {levelUp && (
            <View style={styles.levelUpCard}>
              <Text style={styles.levelUpText}>LEVEL UP!</Text>
              {newTitle && <Text style={styles.newTitle}>New Title: {newTitle}</Text>}
            </View>
          )}

          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
            <LinearGradient
              colors={[theme.colors.primary, '#B8860B']}
              style={styles.homeButtonGradient}
            >
              <Home color={theme.colors.background} size={20} />
              <Text style={styles.homeButtonText}>RETURN TO SANCTUARY</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  congrats: {
    color: theme.colors.primary,
    fontSize: 20,
    fontFamily: theme.fonts.subtitle,
    letterSpacing: 4,
    marginBottom: theme.spacing.s,
  },
  questTitle: {
    color: theme.colors.text,
    fontSize: 28,
    fontFamily: theme.fonts.title,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary + '40',
    marginBottom: theme.spacing.xxl,
  },
  xpGained: {
    color: theme.colors.primary,
    fontSize: 24,
    fontFamily: theme.fonts.title,
    marginLeft: theme.spacing.m,
  },
  levelUpCard: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  levelUpText: {
    color: theme.colors.success,
    fontSize: 32,
    fontFamily: theme.fonts.title,
    letterSpacing: 2,
  },
  newTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: theme.fonts.subtitle,
    marginTop: theme.spacing.s,
  },
  homeButton: {
    width: '100%',
    ...theme.shadows.card,
  },
  homeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
  },
  homeButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontFamily: theme.fonts.title,
    marginLeft: theme.spacing.m,
    letterSpacing: 1,
  }
});
