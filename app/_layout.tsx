import { Stack } from 'expo-router';
import { Colors } from '../constants/colors';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
