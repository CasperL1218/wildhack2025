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

      <ImageBackground source={{ uri: photos[0].uri }}>
        <View
          style={{
            position: 'absolute', 
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(230, 224, 217, 0.6)', 
          }}
        />
        <View style={styles.dishHeader}>
          <Text style={styles.dishName}>Dish Name</Text>
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
          <View style={[styles.optionCircle, { backgroundColor: '#e18e2b' }]} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
              <Text>The <Text style={styles.underline}>OG</Text></Text>
            </Text>
            <Text style={styles.emissionsText}>__ CO2 emissions</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleOptionPress('sustainable')}
          activeOpacity={0.7}
        >
          <View style={[styles.optionCircle, { backgroundColor: '#8dc8c8'}]} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
            <Text style={styles.underline}>Green</Text> Warrior
            </Text>
            <Text style={styles.emissionsText}>__ CO2 emissions</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleOptionPress('local')}
          activeOpacity={0.7}
        >
          <View style={[styles.optionCircle, { backgroundColor: '#9376b4' }]} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>
            <Text style={styles.underline}>Local</Text> Lover 
            </Text>
            <Text style={styles.emissionsText}>__ CO2 emissions</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E0D9',
    padding: 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
    marginBottom: 20,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dishName: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
  },
  dishDescription: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
    marginLeft: 10,
    marginBottom: 10,
  },
  alternativeButton: {
    backgroundColor: '#84A24D',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: -650,
    marginBottom: 10,
  },
  alternativeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Baloo',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
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
    fontFamily: 'Baloo',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  emissionsText: {
    fontSize: 15,
    fontFamily: 'Nunito',
  },
}); 