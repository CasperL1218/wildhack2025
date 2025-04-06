import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
    name: "Kim",
    role: "Food Explorer",
    location: "Lincoln, NE",
    zipcode: "60201",
    favoriteRoute: "FavRoute",
    recipesCount: 27,
    bio: "Passionate about local food and supporting farmers in my community. I love creating seasonal recipes and exploring new farmers markets.",
    achievements: ["Market Maven", "Recipe Creator", "Local Food Champion"]
  });

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);  

  const pickProfile = async () => {
    try {

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need media library permissions.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled && result.assets[0].uri) {
        setProfilePhoto(result.assets[0].uri); 
      }
    } catch (error) {
        console.error('Error picking profile image:', error);
    }
  };

  const router = useRouter();
  const routesPress = (optionType: string) => {
    router.push({
      pathname: '/explore'
    });
  };

  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
          <Image
              source={require('../../assets/images/replatelogo1.png')} // Make sure the logo path is correct
              style={styles.logo}
            />
          <Text style={styles.title}>RePlate</Text>
        </View>
      
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={pickProfile}>
              <Image
                source={{ uri: profilePhoto || 'https://via.placeholder.com/150' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>Hi {profile.name}!</Text>
          <Text style={styles.userRole}>You are a {profile.role}!</Text>
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

        <View style={styles.actionsContainer}>
          {/* <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings-outline" size={16} color="black" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={[styles.actionButton, styles.mapButton]} onPress={() => routesPress('run')}>
            <Ionicons name="map-outline" size={16} color="black" />
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
    backgroundColor: '#84a24d', 
    padding: 20,
  },
  header: {
    flexDirection: 'row', // Align logo and title horizontally
    alignItems: 'center', // Vertically center them
    marginBottom: 20, // Add some spacing below the header
  },
  logo: {
    width: 50, // Adjust width as per your logo size
    height: 40, // Adjust height as per your logo size
    paddingRight: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: "Baloo",
    color: 'black',
    marginTop: 15,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e6e0d9', 
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
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: "Baloo",
    color: 'black',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 20,
    fontFamily: "Baloo",
    color: 'black',
  },
  favoriteRoute: {
    fontSize: 16,
    fontFamily: "Nunito",
    color: '#333d1e',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'column',
    width: '100%',
    marginVertical: 10,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    fontFamily: "Nunito",
    fontWeight: "bold",
    color: '#333d1e',
    marginRight: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "Nunito",
    color: '#333d1e',
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 10,
    marginBottom: 100, 
  },
  // actionButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#e6e0d9',
  //   paddingVertical: 12,
  //   paddingHorizontal: 20,
  //   borderRadius: 8,
  //   gap: 8,
  // },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e0d9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
});
