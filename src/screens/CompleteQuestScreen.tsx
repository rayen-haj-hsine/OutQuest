import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ShieldCheck, Feather, Scroll as ScrollIcon, Camera, X } from 'lucide-react-native';
import { auth, fetchUserProfile, updateUserProfile, recordQuestCompletion, uploadImage } from '../services/supabase';
import { Quest } from '../types';
import { useTheme } from '../context/ThemeContext';
import { calculateLevel } from '../utils/xp';

export default function CompleteQuestScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { quest } = route.params as { quest: Quest };
  const { theme, fontScale } = useTheme();
  const styles = useMemo(() => createStyles(theme, fontScale), [theme, fontScale]);

  const [report, setReport] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need access to your photos to chronicle your deeds.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2, 
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setPhotoPreview(result.assets[0].uri);
      setPhotoBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleComplete = async () => {
    if (!report.trim() && !photoBase64) {
      Alert.alert("Proof Required", "You must provide either a scribe's note or a photo proof to swear the oath.");
      return;
    }

    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Not logged in");

      const profile = await fetchUserProfile(uid);
      if (!profile) throw new Error("Profile not found");

      let earnedXp = quest.baseXp;
      const proofTypes = [];
      
      if (report.trim().length > 0) {
        earnedXp += 15;
        proofTypes.push('written');
      }
      if (photoBase64) {
        earnedXp += 25; 
        proofTypes.push('photo');
      }
      if (quest.difficulty === 'Mythic') {
        earnedXp += 50;
      }

      const newTotalXp = profile.xp + earnedXp;
      const newLevel = calculateLevel(newTotalXp);
      const levelUp = newLevel > profile.level;
      
      let newTitle = profile.title;
      if (quest.titleReward) newTitle = quest.titleReward;
      else if (levelUp && newLevel === 5) newTitle = 'Apprentice';
      else if (levelUp && newLevel === 10) newTitle = 'Adventurer';

      await updateUserProfile(uid, {
        xp: newTotalXp,
        level: newLevel,
        title: newTitle,
        completedQuestCount: profile.completedQuestCount + 1,
        mythicQuestCount: profile.mythicQuestCount + (quest.difficulty === 'Mythic' ? 1 : 0),
        updatedAt: Date.now()
      });

      await recordQuestCompletion({
        userId: uid,
        questId: quest.id,
        questTitle: quest.title,
        difficulty: quest.difficulty,
        xpEarned: earnedXp,
        proofTypes,
        reportPreview: report.substring(0, 100),
        reportFull: report,
        photoUrl: photoBase64 || undefined,
        createdAt: Date.now()
      });

      navigation.reset({
        index: 0,
        routes: [
          { name: 'Home' },
          { name: 'Result', params: { quest, earnedXp, levelUp, newTitle } }
        ],
      });
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to chronicle your deed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <ScrollIcon color={theme.colors.primary} size={32 * fontScale} />
        <Text style={styles.headerTitle}>CHRONICLE YOUR DEED</Text>
        <Text style={styles.questTitle}>{quest.title}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Feather color={theme.colors.primary} size={16 * fontScale} />
          <Text style={styles.label}>SCRIBE'S NOTES (+15 XP)</Text>
        </View>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="Describe your journey briefly..."
          placeholderTextColor={theme.colors.textMuted}
          value={report}
          onChangeText={setReport}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Camera color={theme.colors.primary} size={16 * fontScale} />
          <Text style={styles.label}>VISUAL EVIDENCE (+25 XP)</Text>
        </View>
        
        {photoPreview ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photoPreview }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removePhoto} onPress={() => { setPhotoPreview(null); setPhotoBase64(null); }}>
              <X color="#fff" size={20 * fontScale} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>CAPTURE EVIDENCE</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.oathContainer}>
        <ShieldCheck color={theme.colors.primary} size={24 * fontScale} />
        <Text style={styles.oathTitle}>THE OATH OF TRUTH</Text>
        <Text style={styles.oathText}>
          "I take a solemn oath upon my honor as a Wanderer that I have completed this quest in the physical realm."
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
        onPress={handleComplete}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.background === '#0F0F12' ? theme.colors.background : '#FFF'} />
        ) : (
          <Text style={styles.submitButtonText}>I SWEAR BY THE MYTH</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme: any, fontScale: number) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.l, paddingTop: theme.spacing.xl },
  header: { alignItems: 'center', marginBottom: theme.spacing.xl },
  headerTitle: { color: theme.colors.textMuted, fontSize: 12 * fontScale, fontFamily: theme.fonts.subtitle, letterSpacing: 3, marginTop: theme.spacing.m },
  questTitle: { color: theme.colors.text, fontSize: 24 * fontScale, fontFamily: theme.fonts.title, textAlign: 'center', marginTop: theme.spacing.xs },
  section: { marginBottom: theme.spacing.xl },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.s },
  label: { color: theme.colors.primary, fontSize: 12 * fontScale, fontFamily: theme.fonts.subtitle, marginLeft: theme.spacing.s, letterSpacing: 1 },
  input: { backgroundColor: theme.colors.card, color: theme.colors.text, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, borderWidth: 1, borderColor: theme.colors.border, minHeight: 100, textAlignVertical: 'top', fontFamily: theme.fonts.body, fontSize: 14 * fontScale },
  photoButton: { backgroundColor: theme.colors.card, paddingVertical: theme.spacing.xl, borderRadius: theme.borderRadius.m, borderWidth: 1, borderColor: theme.colors.primary, borderStyle: 'dashed', alignItems: 'center' },
  photoButtonText: { color: theme.colors.primary, fontSize: 14 * fontScale, fontFamily: theme.fonts.title, letterSpacing: 1 },
  previewContainer: { position: 'relative' },
  previewImage: { width: '100%', height: 200, borderRadius: theme.borderRadius.m },
  removePhoto: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 15, padding: 5 },
  oathContainer: { backgroundColor: theme.colors.card, padding: theme.spacing.l, borderRadius: theme.borderRadius.l, borderWidth: 1, borderColor: theme.colors.primary + '40', alignItems: 'center', marginBottom: theme.spacing.xxl, borderStyle: 'dashed' },
  oathTitle: { color: theme.colors.primary, fontSize: 14 * fontScale, fontFamily: theme.fonts.title, marginTop: theme.spacing.s, letterSpacing: 2 },
  oathText: { color: theme.colors.text, fontSize: 14 * fontScale, fontFamily: theme.fonts.body, fontStyle: 'italic', textAlign: 'center', marginTop: theme.spacing.m, lineHeight: 20 * fontScale, opacity: 0.8 },
  submitButton: { backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.l, borderRadius: theme.borderRadius.xl, alignItems: 'center', ...theme.shadows.glow },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: theme.colors.background === '#0F0F12' ? theme.colors.background : '#FFF', fontSize: 16 * fontScale, fontFamily: theme.fonts.title, letterSpacing: 1 }
});
