import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Define a type for user data
type UserProfile = {
  name: string;
  role: string;
  location: string;
  zipcode: string;
  favoriteRoute: string;
  recipesCount: number;
  bio?: string;
  achievements?: string[];
};

export default function ProfileScreen() {
  // User profile mock data
  const [profile, setProfile] = useState<UserProfile>({
    name: "Kim Lee",
    role: "Food Explorer",
    location: "Lincoln, NE",
    zipcode: "60201",
    favoriteRoute: "Farmer's Market to Kitchen",
    recipesCount: 27,
    bio: "Passionate about local food and supporting farmers in my community. I love creating seasonal recipes and exploring new farmers markets.",
    achievements: ["Market Maven", "Recipe Creator", "Local Food Champion"]
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>myApp</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
          </View>

          <Text style={styles.userName}>Hi {profile.name}!</Text>
          <Text style={styles.userRole}>Your are a {profile.role}!</Text>
          <Text style={styles.favoriteRoute}>{profile.favoriteRoute} is your most taken route</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Location:</Text>
              <Text style={styles.statValue}>{profile.zipcode}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}># recipes made:</Text>
              <Text style={styles.statValue}>{profile.recipesCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {profile.achievements?.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <Ionicons name="trophy-outline" size={24} color="#4CAF50" />
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings-outline" size={16} color="white" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.mapButton]}>
            <Ionicons name="map-outline" size={16} color="white" />
            <Text style={styles.buttonText}>My Routes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8BAE5F', // Green background color
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F0EDE5', // Light beige color for profile image placeholder
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  userRole: {
    fontSize: 20,
    color: 'black',
    marginBottom: 5,
  },
  favoriteRoute: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'column',
    width: '100%',
    marginVertical: 20,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 20,
    marginBottom: 100, // Add extra space at bottom for the tab bar
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  mapButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
