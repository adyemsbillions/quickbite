import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f97316', // Orange background for other screens
        },
        headerTintColor: '#fff', // White text/icon color
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // No header for home screen
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false, // No header for login screen
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false, // No header for signup screen
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: false, // No header for forgot password screen
        }}
      />
      <Stack.Screen
        name="restaurant"
        options={{
          headerShown: false, // No header for dashboard screen
        }}
      />
      <Stack.Screen
        name="admin"
        options={{
          title: 'Admin Panel',
          headerStyle: { backgroundColor: '#f97316' },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
}