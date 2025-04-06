import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 1,
          borderTopColor: '#333',
          height: 85,
          paddingBottom: 28,
          paddingTop: 6,
          paddingHorizontal: 5,
          // Safe area for iPhone X+ models
          ...(Platform.OS === 'ios' && {
            safeAreaInsets: { bottom: 10 }
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarLabelPosition: 'below-icon',
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: 'white',
        },
        headerTintColor: 'white',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Markets',
          tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="map-marker" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="snap"
        options={{
          title: 'Snap',
          tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="camera" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'My Recipes',
          tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          headerTitle: 'Recipe Results',
          href: null,
          tabBarItemStyle: { display: 'none' }
        }}
      />
    </Tabs>
  );
}
