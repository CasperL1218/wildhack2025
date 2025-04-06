import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { PhotoProvider } from '../../context/PhotoContext';

export default function TabLayout() {
  return (
    <PhotoProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#E6E0D9',
          tabBarInactiveTintColor: '#333D1E',
          tabBarStyle: {
            backgroundColor: '#84A24D',
            borderTopWidth: 1,
            borderTopColor: '#32401A',
            height: 55,
            paddingBottom: 26,
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
            tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="map-marker" size={32} color={color} />,
          }}
        />
        <Tabs.Screen
          name="snap"
          options={{
            title: 'Snap',
            tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="camera" size={32} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            headerShown: false,
            title: 'Saved Recipes',
            tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="book" size={32} color={color} />,
          }}
        />
        <Tabs.Screen
          name="results"
          options={{
            headerShown: false,
            headerTitle: 'Recipe Results',
            href: null,
            tabBarItemStyle: { display: 'none' }
          }}
        />
      </Tabs>
    </PhotoProvider>
  );
}
