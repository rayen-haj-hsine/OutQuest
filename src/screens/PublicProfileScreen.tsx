import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Scroll, Calendar, X, ExternalLink } from 'lucide-react-native';
import { fetchUserProfile, fetchUserCompletions } from '../services/supabase';
import { UserProfile, QuestCompletion } from '../types';
import { useTheme } from '../context/ThemeContext';

export default function PublicProfileScreen() {
  const route = useRoute<any>();
  const { uid } = route.params;
  const { theme, fontScale } = useTheme();
  const styles = useMemo(() => createStyles(theme, fontScale), [theme, fontScale]);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completions, setCompletions] = useState<QuestCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Detail View State
  const [selectedAchievement, setSelectedAchievement] = useState<QuestCompletion | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [uProfile, uCompletions] = await Promise.all([
          fetchUserProfile(uid),
          fetchUserCompletions(uid)
        ]);
        setProfile(uProfile);
        setCompletions(uCompletions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [uid]);

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderCompletion = ({ item }: { item: QuestCompletion }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => setSelectedAchievement(item)}
      style={styles.achievementCard}
    >
      <View style={styles.achievementMain}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementTitle}>{item.questTitle}</Text>
          <Text style={styles.achievementXp}>+{item.xpEarned} XP</Text>
        </View>
        <View style={styles.achievementMeta}>
          <Calendar size={12 * fontScale} color={theme.colors.textMuted} />
          <Text style={styles.achievementDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      {item.photoUrl && (
        <View style={styles.achievementThumbContainer}>
          <Image source={{ uri: item.photoUrl }} style={styles.achievementThumb} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.card, theme.colors.background]}
        style={styles.header}
      >
        <Text style={styles.avatar}>{profile.avatarPreset}</Text>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.titleText}>{profile.title}</Text>
        
        <View style={styles.statsBar}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{profile.level}</Text>
            <Text style={styles.statLab}>LEVEL</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{profile.completedQuestCount}</Text>
            <Text style={styles.statLab}>QUESTS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{profile.xp}</Text>
            <Text style={styles.statLab}>TOTAL XP</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.sectionTitleRow}>
          <Scroll color={theme.colors.primary} size={20 * fontScale} />
          <Text style={styles.sectionTitle}>CHRONICLE OF DEEDS</Text>
        </View>

        {completions.length === 0 ? (
          <Text style={styles.emptyText}>No deeds have been chronicled yet.</Text>
        ) : (
          <FlatList
            data={completions}
            renderItem={renderCompletion}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Detail Modal */}
      <Modal
        visible={!!selectedAchievement}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedAchievement(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>DEED DETAILS</Text>
              <TouchableOpacity onPress={() => setSelectedAchievement(null)}>
                <X color={theme.colors.text} size={24 * fontScale} />
              </TouchableOpacity>
            </View>

            {selectedAchievement && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.detailQuestTitle}>{selectedAchievement.questTitle}</Text>
                
                {selectedAchievement.photoUrl && (
                  <View style={styles.detailImageContainer}>
                    <Image 
                      source={{ uri: selectedAchievement.photoUrl }} 
                      style={styles.detailImage} 
                      resizeMode="cover"
                    />
                  </View>
                )}

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>SCRIBE'S RECORD</Text>
                  <Text style={styles.detailReport}>
                    {selectedAchievement.reportFull || "No written record was made for this deed."}
                  </Text>
                </View>

                <View style={styles.detailFooter}>
                  <Text style={styles.detailDate}>
                    Dated: {new Date(selectedAchievement.createdAt).toLocaleString()}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme: any, fontScale: number) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  header: { alignItems: 'center', paddingVertical: theme.spacing.xl, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  avatar: { fontSize: 64 * fontScale, marginBottom: theme.spacing.s },
  username: { fontSize: 24 * fontScale, fontFamily: theme.fonts.title, color: theme.colors.text },
  titleText: { fontSize: 14 * fontScale, fontFamily: theme.fonts.subtitle, color: theme.colors.primary, marginTop: 4, letterSpacing: 2 },
  statsBar: { flexDirection: 'row', marginTop: theme.spacing.xl, width: '100%', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statVal: { color: theme.colors.text, fontSize: 18 * fontScale, fontFamily: theme.fonts.title },
  statLab: { color: theme.colors.textMuted, fontSize: 9 * fontScale, fontFamily: theme.fonts.body, marginTop: 2 },
  body: { flex: 1, padding: theme.spacing.l },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m },
  sectionTitle: { color: theme.colors.primary, fontSize: 14 * fontScale, fontFamily: theme.fonts.subtitle, letterSpacing: 2, marginLeft: theme.spacing.s },
  list: { paddingBottom: theme.spacing.xl },
  achievementCard: { backgroundColor: theme.colors.card, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.s, borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', alignItems: 'center' },
  achievementMain: { flex: 1 },
  achievementHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  achievementTitle: { color: theme.colors.text, fontSize: 16 * fontScale, fontFamily: theme.fonts.title },
  achievementXp: { color: theme.colors.primary, fontSize: 12 * fontScale, fontFamily: theme.fonts.bodyBold },
  achievementMeta: { flexDirection: 'row', alignItems: 'center' },
  achievementDate: { color: theme.colors.textMuted, fontSize: 11 * fontScale, fontFamily: theme.fonts.body, marginLeft: 4 },
  achievementThumbContainer: { marginLeft: theme.spacing.m, borderWidth: 1, borderColor: theme.colors.primary + '40', borderRadius: 4, overflow: 'hidden' },
  achievementThumb: { width: 40 * fontScale, height: 40 * fontScale },
  emptyText: { color: theme.colors.textMuted, textAlign: 'center', marginTop: theme.spacing.xxl, fontFamily: theme.fonts.body, fontStyle: 'italic', fontSize: 14 * fontScale },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.card, height: '80%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: theme.spacing.l, borderTopWidth: 2, borderTopColor: theme.colors.primary },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.l, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: theme.spacing.m },
  modalTitle: { color: theme.colors.primary, fontFamily: theme.fonts.subtitle, letterSpacing: 2, fontSize: 14 * fontScale },
  detailQuestTitle: { color: theme.colors.text, fontSize: 24 * fontScale, fontFamily: theme.fonts.title, marginBottom: theme.spacing.l, textAlign: 'center' },
  detailImageContainer: { width: '100%', height: 300 * fontScale, borderRadius: theme.borderRadius.l, overflow: 'hidden', marginBottom: theme.spacing.l, backgroundColor: theme.colors.background === '#0F0F12' ? '#000' : '#EAE6DF' },
  detailImage: { width: '100%', height: '100%' },
  detailSection: { marginBottom: theme.spacing.xl },
  detailLabel: { color: theme.colors.primary, fontSize: 12 * fontScale, fontFamily: theme.fonts.subtitle, letterSpacing: 1, marginBottom: theme.spacing.s },
  detailReport: { color: theme.colors.text, fontSize: 16 * fontScale, fontFamily: theme.fonts.body, lineHeight: 24 * fontScale, fontStyle: 'italic' },
  detailFooter: { borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.m, alignItems: 'center' },
  detailDate: { color: theme.colors.textMuted, fontSize: 12 * fontScale, fontFamily: theme.fonts.body }
});
