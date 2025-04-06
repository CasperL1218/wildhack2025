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
            height: 80,
            paddingBottom: 30,
            paddingTop: 6,
            paddingHorizontal: 5,
            // Safe area for iPhone X+ models
            ...(Platform.OS === 'ios' && {
              safeAreaInsets: { bottom: 15 }
            }),
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white',
          },
          headerTintColor: 'white',
        }}>
        <Tabs.Screen
          name="explore"
          options={{
            headerShown: false,
            title: '',
            tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="cutlery" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="snap"
          options={{
            headerShown: false,
            title: '',
            tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="plus-circle" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: '',
            tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="user" size={28} color={color} />,
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
