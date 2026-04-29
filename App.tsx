import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { auth, signInAndGetUid, fetchUserProfile, createUserProfile } from './src/services/firebase';
import { theme } from './src/utils/theme';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QuestPickerScreen from './src/screens/QuestPickerScreen';
import QuestDetailScreen from './src/screens/QuestDetailScreen';
import CompleteQuestScreen from './src/screens/CompleteQuestScreen';
import ResultScreen from './src/screens/ResultScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      let currentUid = auth.currentUser?.uid;
      if (!currentUid) {
        currentUid = await signInAndGetUid();
      }
      
      const profile = await fetchUserProfile(currentUid);
      if (!profile) {
        await createUserProfile({
          uid: currentUid,
          username: `Wanderer_${currentUid.substring(0, 5)}`,
          avatarPreset: '🧙‍♂️',
          xp: 0,
          level: 1,
          title: 'Novice',
          completedQuestCount: 0,
          mythicQuestCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    } catch (err: any) {
      console.error("Auth init error:", err);
      setError(err.message || "Failed to connect to the myth.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  if (loading || error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background, padding: 20 }}>
        {loading ? (
          <>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary, marginTop: 10 }}>Entering the myth...</Text>
          </>
        ) : (
          <>
            <Text style={{ color: theme.colors.danger, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
            <TouchableOpacity 
              style={{ backgroundColor: theme.colors.primary, padding: 15, borderRadius: 8 }}
              onPress={initAuth}
            >
              <Text style={{ color: theme.colors.background, fontWeight: 'bold' }}>Retry Connection</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.card} />
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.card },
            headerTintColor: theme.colors.primary,
            headerTitleStyle: { fontWeight: 'bold' },
            contentStyle: { backgroundColor: theme.colors.background }
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'OutQuest' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="QuestPicker" component={QuestPickerScreen} options={{ title: 'Find a Quest' }} />
          <Stack.Screen name="QuestDetail" component={QuestDetailScreen} options={{ title: 'Quest Details' }} />
          <Stack.Screen name="CompleteQuest" component={CompleteQuestScreen} options={{ title: 'Submit Proof' }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Quest Complete', headerShown: false }} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
