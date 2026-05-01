import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bell, Shield, LogOut, Trash2, ChevronRight, Volume2, Fingerprint, Moon, Sun, Type } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { theme, isDark, toggleTheme, fontScale, setFontScale } = useTheme();
  const styles = useMemo(() => createStyles(theme, fontScale), [theme, fontScale]);

  // Settings States
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [sounds, setSounds] = useState(false);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to return to the shadows? Your progress is saved to this device.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => {} }
    ]);
  };

  const handleDecreaseFont = () => {
    if (fontScale > 0.8) setFontScale(fontScale - 0.1);
  };

  const handleIncreaseFont = () => {
    if (fontScale < 1.5) setFontScale(fontScale + 0.1);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCESSIBILITY & APPEARANCE</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            {isDark ? <Moon color={theme.colors.primary} size={20 * fontScale} /> : <Sun color={theme.colors.primary} size={20 * fontScale} />}
            <Text style={styles.settingLabel}>Dark Theme</Text>
          </View>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
            thumbColor={isDark ? theme.colors.primary : theme.colors.textMuted}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Type color={theme.colors.primary} size={20 * fontScale} />
            <Text style={styles.settingLabel}>Text Size ({Math.round(fontScale * 100)}%)</Text>
          </View>
          <View style={styles.scaleControls}>
             <TouchableOpacity onPress={handleDecreaseFont} style={styles.scaleButton}>
               <Text style={styles.scaleButtonText}>-</Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={handleIncreaseFont} style={styles.scaleButton}>
               <Text style={styles.scaleButtonText}>+</Text>
             </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Bell color={theme.colors.primary} size={20 * fontScale} />
            <Text style={styles.settingLabel}>Quest Reminders</Text>
          </View>
          <Switch 
            value={notifications} 
            onValueChange={setNotifications}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
            thumbColor={notifications ? theme.colors.primary : theme.colors.textMuted}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Fingerprint color={theme.colors.primary} size={20 * fontScale} />
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
          </View>
          <Switch 
            value={haptics} 
            onValueChange={setHaptics}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
            thumbColor={haptics ? theme.colors.primary : theme.colors.textMuted}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Volume2 color={theme.colors.primary} size={20 * fontScale} />
            <Text style={styles.settingLabel}>Sound Effects</Text>
          </View>
          <Switch 
            value={sounds} 
            onValueChange={setSounds}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
            thumbColor={sounds ? theme.colors.primary : theme.colors.textMuted}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        
        <TouchableOpacity style={styles.settingRow} onPress={() => {}}>
          <View style={styles.settingInfo}>
            <Shield color={theme.colors.primary} size={20 * fontScale} />
            <Text style={styles.settingLabel}>Privacy & Terms</Text>
          </View>
          <ChevronRight color={theme.colors.textMuted} size={18 * fontScale} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
          <View style={styles.settingInfo}>
            <LogOut color={theme.colors.danger} size={20 * fontScale} />
            <Text style={[styles.settingLabel, { color: theme.colors.danger }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={() => {}}>
          <View style={styles.settingInfo}>
            <Trash2 color={theme.colors.danger} size={20 * fontScale} />
            <Text style={[styles.settingLabel, { color: theme.colors.danger }]}>Delete Data</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.version}>OUTQUEST v1.0.0 (MVP)</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const createStyles = (theme: any, fontScale: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.l,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 12 * fontScale,
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
    borderBottomColor: theme.colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    color: theme.colors.text,
    fontSize: 16 * fontScale,
    fontFamily: theme.fonts.body,
    marginLeft: theme.spacing.m,
  },
  version: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: 10 * fontScale,
    fontFamily: theme.fonts.body,
    marginTop: theme.spacing.xxl,
    letterSpacing: 1,
  },
  scaleControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scaleButton: {
    backgroundColor: theme.colors.card,
    width: 32 * fontScale,
    height: 32 * fontScale,
    borderRadius: 16 * fontScale,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scaleButtonText: {
    color: theme.colors.text,
    fontSize: 18 * fontScale,
    fontFamily: theme.fonts.bodyBold,
  }
});
