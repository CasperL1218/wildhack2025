import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { usePhotoContext } from '../../context/PhotoContext';
import { useResponseContext } from '../../context/ResponseContext';

type PhotoItem = {
  uri: string;
  dishName?: string;
};

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showAlternativeInput, setShowAlternativeInput] = useState(false);
  const { photos } = usePhotoContext();
  const { response } = useResponseContext();

  useEffect(() => {
    // Log the received photos
    console.log('Received images in results page:', photos);
    
    console.log('Received server data in results page:', response);
    // console.log('Response type:', typeof response);
    console.log('Full response:', JSON.stringify(response, null, 2));
    const r = JSON.stringify(response)


  }, [photos, response]);

  const handleOptionPress = (optionType: string) => {
    // Navigate to recipe screen with option type and photos
    router.push({
      pathname: '/recipe',
      params: {
        optionType,
        photoData: params.photoData
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>myApp</Text>

      <ImageBackground source={{ uri: photos[0].uri }} style={styles.dishHeader}>
        <View style={styles.dishHeader}>
          <Text style={styles.dishName}>Dish Name</Text>
          <View style={styles.profileCircle}>
            <Ionicons name="person" size={28} color="#9b9e8c" />
          </View>
        </View>

        <Text style={styles.dishDescription}>15-20 word short blurb</Text>

        <TouchableOpacity
          style={styles.alternativeButton}
          onPress={() => setShowAlternativeInput(!showAlternativeInput)}
        >
          <Text style={styles.alternativeButtonText}>Something else?</Text>
        </TouchableOpacity>
      </ImageBackground>
      <Text style={styles.subtitle}>Choose your own route!</Text>

      <ScrollView style={styles.optionsScrollView}>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleOptionPress('original')}
          activeOpacity={0.7}
        >
          <View style={[styles.optionCircle, { backgroundColor: '#e89852' }]} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
              Recreate <Text style={styles.underline}>Originally</Text>
            </Text>
            <Text style={styles.emissionsText}>CO2 emissions: xx kg</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleOptionPress('sustainable')}
          activeOpacity={0.7}
        >
          <View style={[styles.optionCircle, { backgroundColor: '#5f9e9f' }]} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
              Recreate <Text style={styles.underline}>Sustainably</Text>
            </Text>
            <Text style={styles.emissionsText}>CO2 emissions: xx kg</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleOptionPress('local')}
          activeOpacity={0.7}
        >
          <View style={[styles.optionCircle, { backgroundColor: '#686f98' }]} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
              Recreate <Text style={styles.underline}>Locally</Text>
            </Text>
            <Text style={styles.emissionsText}>CO2 emissions: xx kg</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9b9e8c',
    padding: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dishName: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishDescription: {
    fontSize: 18,
    marginBottom: 20,
  },
  alternativeButton: {
    backgroundColor: '#e8dfd5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  alternativeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  optionsScrollView: {
    flex: 1,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  optionCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  emissionsText: {
    fontSize: 18,
  },
}); 