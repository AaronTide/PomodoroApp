import { Tabs } from 'expo-router';
import { Sword, Timer, User, Zap } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopWidth: 2,
          borderTopColor: '#16213e',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#ffd700',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontFamily: 'monospace',
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          tabBarIcon: ({ size, color }) => (
            <Timer size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: 'Character',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="battle"
        options={{
          title: 'Battle',
          tabBarIcon: ({ size, color }) => (
            <Sword size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}