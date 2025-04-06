import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
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
  // const [showAlternativeInput, setShowAlternativeInput] = useState(false);
  const { photos } = usePhotoContext();
  const { response } = useResponseContext();

  const [r, setR] = useState<string | null>(null);
  

  useEffect(() => {
    // Log the received photos
    console.log('Received images in results page:', photos);
    
    console.log('Received server data in results page:', response);
    // console.log('Response type:', typeof response);
    console.log('Full response:', JSON.stringify(response, null, 2));
    setR(JSON.stringify(response));


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
          {/* <Text style={styles.dishName}>Dish Name</Text> */}

          {r && typeof r === 'string' && r.indexOf("food_name") !== -1 && (
          <Text style={styles.dishName}>
            {(() => {
              const startIndex = r.indexOf('food_name') + 'food_name'.length + 10;
              const nextComma = r.indexOf(',', startIndex) - 4;

              if (nextComma !== -1) {
                return r.substring(startIndex, nextComma).trim();
              } else {
                return r.substring(startIndex).trim();
              }
            })()}
          </Text>
        )}

        </View>

        {/* <Text style={styles.dishDescription}>15-20 word short blurb</Text> */}
        {r && typeof r === 'string' && r.indexOf("description") !== -1 && (
          <Text style={styles.dishDescription}>
            {(() => {
              const startIndex = r.indexOf('description') + 'description'.length + 10;
              const nextComma = r.indexOf('\\"', startIndex) - 2;

              if (nextComma !== -1) {
                return r.substring(startIndex, nextComma).trim();
              } else {
                return r.substring(startIndex).trim();
              }
            })()}
          </Text>
        )}

        <TouchableOpacity
          style={styles.alternativeButton}
          onPress={() => router.push('/snap')}
        >
          <Text style={styles.alternativeButtonText}>Something else?</Text>
        </TouchableOpacity>
        
      </ImageBackground>
  
  

      <ScrollView style={styles.optionsScrollView}>
      <Text style={styles.subtitle}>Choose your own route!</Text>
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
    backgroundColor: '#e5dbd0',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
  },  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(230, 224, 217, 0.6)',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  logo: {
    width: 50,
    height: 40,
    paddingRight: 5,
  },
  
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
  },

  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dishName: {
    marginTop: 50,
    marginLeft: 15,
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
  },
  dishDescription: {
    fontWeight: 'bold',
    fontFamily: 'Nunito',
    padding:10,
    marginLeft: 20,
  },
  alternativeButton: {
    backgroundColor: '#84A24D',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    marginLeft: 250,
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
    padding: 20,
    flex: 1,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  optionCircle: {
    width: 100,
    height: 100,
    borderRadius: 60,
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