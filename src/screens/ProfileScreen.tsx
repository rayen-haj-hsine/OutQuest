import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, Shield, LogOut, Trash2, Settings as SettingsIcon, ChevronRight, Volume2, Fingerprint } from 'lucide-react-native';
import { auth, fetchUserProfile } from '../services/firebase';
import { UserProfile } from '../types';
import { theme } from '../utils/theme';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Settings States (Mocked for UI)
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [sounds, setSounds] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const data = await fetchUserProfile(uid);
        setProfile(data);
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to return to the shadows? Your progress is saved to this device.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => {} } // In a real app, call auth.signOut()
    ]);
  };

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[theme.colors.card, theme.colors.background]}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{profile.avatarPreset}</Text>
          {profile.isTester && (
            <View style={styles.testerBadge}>
              <Text style={styles.testerText}>TESTER</Text>
            </View>
          )}
        </View>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.titleText}>{profile.title}</Text>
        
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{profile.level}</Text>
            <Text style={styles.quickStatLabel}>LEVEL</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{profile.completedQuestCount}</Text>
            <Text style={styles.quickStatLabel}>QUESTS</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{profile.mythicQuestCount}</Text>
            <Text style={styles.quickStatLabel}>MYTHIC</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Bell color={theme.colors.primary} size={20} />
            <Text style={styles.settingLabel}>Quest Reminders</Text>
          </View>
          <Switch 
            value={notifications} 
            onValueChange={setNotifications}
            trackColor={{ false: '#333', true: theme.colors.primary + '80' }}
            thumbColor={notifications ? theme.colors.primary : '#666'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Fingerprint color={theme.colors.primary} size={20} />
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
          </View>
          <Switch 
            value={haptics} 
            onValueChange={setHaptics}
            trackColor={{ false: '#333', true: theme.colors.primary + '80' }}
            thumbColor={haptics ? theme.colors.primary : '#666'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Volume2 color={theme.colors.primary} size={20} />
            <Text style={styles.settingLabel}>Sound Effects</Text>
          </View>
          <Switch 
            value={sounds} 
            onValueChange={setSounds}
            trackColor={{ false: '#333', true: theme.colors.primary + '80' }}
            thumbColor={sounds ? theme.colors.primary : '#666'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        
        <TouchableOpacity style={styles.settingRow} onPress={() => {}}>
          <View style={styles.settingInfo}>
            <Shield color={theme.colors.primary} size={20} />
            <Text style={styles.settingLabel}>Privacy & Terms</Text>
          </View>
          <ChevronRight color={theme.colors.textMuted} size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
          <View style={styles.settingInfo}>
            <LogOut color={theme.colors.danger} size={20} />
            <Text style={[styles.settingLabel, { color: theme.colors.danger }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={() => {}}>
          <View style={styles.settingInfo}>
            <Trash2 color={theme.colors.danger} size={20} />
            <Text style={[styles.settingLabel, { color: theme.colors.danger }]}>Delete Data</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.version}>OUTQUEST v1.0.0 (MVP)</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.m,
  },
  avatar: {
    fontSize: 72,
    marginBottom: theme.spacing.s,
  },
  testerBadge: {
    position: 'absolute',
    bottom: 5,
    right: -10,
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.text,
  },
  testerText: {
    color: theme.colors.text,
    fontSize: 8,
    fontFamily: theme.fonts.bodyBold,
  },
  username: {
    fontSize: 28,
    fontFamily: theme.fonts.title,
    color: theme.colors.text,
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 16,
    fontFamily: theme.fonts.subtitle,
    color: theme.colors.primary,
    marginTop: 4,
    letterSpacing: 2,
  },
  quickStats: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
    backgroundColor: '#00000040',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    width: '90%',
    justifyContent: 'space-around',
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontFamily: theme.fonts.title,
  },
  quickStatLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: theme.fonts.body,
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    height: '100%',
  },
  section: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.l,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 12,
    fontFamily: theme.fonts.subtitle,
    letterSpacing: 2,
    marginBottom: theme.spacing.m,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + '40',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    marginLeft: theme.spacing.m,
  },
  version: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: theme.fonts.body,
    marginTop: theme.spacing.xxl,
    letterSpacing: 1,
  }
});
