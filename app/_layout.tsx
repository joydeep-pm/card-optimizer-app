import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { migrateDbIfNeeded } from '@/lib/db';

// Database file stored persistently on device (not in-memory)
const DATABASE_FILE = 'cardoptimizer.db';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * OLED Deep Black Theme - Pure black for maximum contrast and battery savings
 */
const OLEDDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#00FF85',      // Super Mint
    background: '#000000',   // Pure OLED black
    card: '#000000',         // Cards also pure black
    text: '#FFFFFF',
    border: 'rgba(255,255,255,0.1)',
    notification: '#00FF85',
  },
};

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DATABASE_FILE} onInit={migrateDbIfNeeded}>
      <ThemeProvider value={OLEDDarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Details',
              headerStyle: { backgroundColor: '#000000' },
              headerTintColor: '#FFFFFF',
            }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
