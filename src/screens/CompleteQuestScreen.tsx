import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { auth, fetchUserProfile, updateUserProfile, recordQuestCompletion } from '../services/firebase';
import { Quest } from '../types';
import { theme } from '../utils/theme';
import { calculateLevel } from '../utils/xp';

export default function CompleteQuestScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { quest } = route.params as { quest: Quest };

  const [report, setReport] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Not logged in");

      const profile = await fetchUserProfile(uid);
      if (!profile) throw new Error("Profile not found");

      let earnedXp = quest.baseXp;
      const proofTypes = [];
      
      if (report.trim().length > 0) {
        earnedXp += 10;
        proofTypes.push('written');
      }
      if (photoUri) {
        earnedXp += 15;
        proofTypes.push('photo');
      }
      if (quest.difficulty === 'Mythic') {
        earnedXp += 25;
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
        reportPreview: report.substring(0, 200),
        createdAt: Date.now()
      });

      navigation.reset({
        index: 0,
        routes: [
          { name: 'Home' },
          { name: 'Result', params: { quest, earnedXp, levelUp, newTitle } }
        ],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Submit Proof: {quest.title}</Text>
      <Text style={styles.reqText}>Required: {quest.proofRequired}</Text>

      <Text style={styles.label}>Written Report (Optional, +10 XP)</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="What happened? Keep it brief..."
        placeholderTextColor={theme.colors.textMuted}
        value={report}
        onChangeText={setReport}
      />

      <Text style={styles.label}>Photo Proof (Optional, +15 XP)</Text>
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>{photoUri ? 'Change Photo' : 'Select Photo (Local)'}</Text>
      </TouchableOpacity>
      
      {photoUri && <Image source={{ uri: photoUri }} style={styles.previewImage} />}
      <Text style={styles.disclaimer}>Photos stay on your device. Only metadata is saved.</Text>

      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
        onPress={handleComplete}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color={theme.colors.background} /> : <Text style={styles.submitButtonText}>Complete Quest</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m },
  title: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.s },
  reqText: { color: theme.colors.primary, marginBottom: theme.spacing.l },
  label: { color: theme.colors.text, marginBottom: theme.spacing.s, fontSize: 16 },
  input: { backgroundColor: theme.colors.card, color: theme.colors.text, padding: theme.spacing.m, borderRadius: theme.borderRadius.s, borderWidth: 1, borderColor: theme.colors.primary + '40', marginBottom: theme.spacing.l, textAlignVertical: 'top', minHeight: 100 },
  photoButton: { backgroundColor: theme.colors.card, padding: theme.spacing.m, borderRadius: theme.borderRadius.s, borderWidth: 1, borderColor: theme.colors.primary, alignItems: 'center', marginBottom: theme.spacing.s },
  photoButtonText: { color: theme.colors.primary, fontWeight: 'bold' },
  previewImage: { width: '100%', height: 200, borderRadius: theme.borderRadius.s, marginBottom: theme.spacing.s },
  disclaimer: { color: theme.colors.textMuted, fontSize: 12, marginBottom: theme.spacing.xl, textAlign: 'center' },
  submitButton: { backgroundColor: theme.colors.secondary, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, alignItems: 'center', marginBottom: theme.spacing.xl },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: theme.colors.background, fontSize: 18, fontWeight: 'bold' }
});
