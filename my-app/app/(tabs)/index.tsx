import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
<<<<<<< HEAD
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
=======
import { useRouter, useLocalSearchParams } from 'expo-router';
>>>>>>> 7579ee1b39ce557d39554c11e483639cc686c2ed

// Define a type for user data
type UserProfile = {
  name: string;
  role: string;
  location: string;
  zipcode: string;
  favoriteRoute: string;
  recipesCount: number;
};

// Define a type for the most common route response
type MostCommonRouteResponse = {
  success: boolean;
  data: {
    userId: string;
    mostCommonRoute: string;
    count: number;
    totalRecipes: number;
    percentage: number;
    routeCounts: {
      original: number;
      local: number;
      sustainable: number;
    }
  }
}

// Function to get a human-readable route name
const getRouteDisplayName = (route: string): string => {
  switch (route) {
    case 'original': return 'The OG';
    case 'local': return 'Local';
    case 'sustainable': return 'Green Warrior';
    default: return route;
  }
};

export default function ProfileScreen() {
  // Get auth context for logout
  const { logout, userInfo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<MostCommonRouteResponse['data'] | null>(null);

  // Log user info for debugging
  useEffect(() => {
    if (userInfo) {
      console.log('Profile Screen - Auth0 User Info:', userInfo);
      // Fetch user's favorite route and recipe count
      fetchUserRouteInfo();
    }
  }, [userInfo]);

  // Fetch user's favorite route info from the API
  const fetchUserRouteInfo = async () => {
    if (!userInfo?.sub) return;

    setLoading(true);
    try {
      // Try different API URLs in order of preference
      const API_URLS = [
        'http://127.0.0.1:5000',
        'http://10.0.2.2:5000'
      ];

      let response = null;

      // Try each URL until one works
      for (const baseUrl of API_URLS) {
        const url = `${baseUrl}/users/${userInfo.sub}/most-common-route`;
        console.log(`Fetching route info from: ${url}`);

        try {
          const res = await fetch(url);
          if (res.ok) {
            response = res;
            console.log(`Successfully connected to: ${baseUrl}`);
            break; // Exit the loop if successful
          }
        } catch (error) {
          console.log(`Failed to connect to ${baseUrl}: ${error}`);
          // Continue to try the next URL
        }
      }

      if (!response) {
        console.error('Failed to fetch user route info');
        return;
      }

      const data = await response.json() as MostCommonRouteResponse;
      console.log('User route info:', data);

      if (data.success) {
        setRouteInfo(data.data);

        // Update profile with new data
        setProfile(prev => ({
          ...prev,
          favoriteRoute: getRouteDisplayName(data.data.mostCommonRoute),
          recipesCount: data.data.totalRecipes
        }));
      }
    } catch (error) {
      console.error('Error fetching user route info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to the root index page
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  // User profile mock data
  const [profile, setProfile] = useState<UserProfile>({
    name: userInfo?.name || "User",
    role: "Food Explorer",
    location: "Lincoln, NE",
    zipcode: "60201",
    favoriteRoute: "Loading...",
    recipesCount: 0
  });

  // Update profile when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setProfile(prev => ({
        ...prev,
        name: userInfo.name || userInfo.email || "User"
      }));
    }
  }, [userInfo]);

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

          {/* Logout button in top right */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={16} color="#666" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={pickProfile}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
              ) : userInfo?.picture ? (
                <Image source={{ uri: userInfo.picture }} style={styles.profileImage} />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Text style={styles.defaultProfileText}>
                    {profile.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>Hi {profile.name}!</Text>
          <Text style={styles.userRole}>You are a {profile.role}!</Text>

          {routeInfo ? (
            <Text style={styles.favoriteRoute}>
              {routeInfo.totalRecipes > 0
                ? `Your preferred route is ${profile.favoriteRoute} (${routeInfo.percentage}%)`
                : 'You haven\'t created any recipes yet'}
            </Text>
          ) : (
            <Text style={styles.favoriteRoute}>{profile.favoriteRoute}</Text>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Location:</Text>
              <Text style={styles.statValue}>{profile.zipcode}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}># recipes saved:</Text>
              <Text style={styles.statValue}>{profile.recipesCount}</Text>
            </View>
            {userInfo?.email && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Email:</Text>
                <Text style={styles.statValue}>{userInfo.email}</Text>
              </View>
            )}
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
<<<<<<< HEAD
    justifyContent: 'space-between', // Space elements evenly
=======
    marginTop: 10,
>>>>>>> 7579ee1b39ce557d39554c11e483639cc686c2ed
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    gap: 4,
    marginLeft: 'auto', // Push to the right
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Nunito',
  },
  defaultProfileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    backgroundColor: '#e6e0d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultProfileText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#84a24d',
  },
});
