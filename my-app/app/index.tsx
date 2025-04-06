import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';

export default function LandingPage() {
  const [zipCode, setZipCode] = useState('60201');
  const [editingZip, setEditingZip] = useState(false);

  const handleImageUpload = () => {
    router.push('/(tabs)/snap');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>myApp</Text>

      <Text style={styles.title}>Hi USER!</Text>

      <TouchableOpacity
        style={styles.zipContainer}
        onPress={() => setEditingZip(true)}
        activeOpacity={0.8}
      >
        {editingZip ? (
          <TextInput
            style={styles.zipInput}
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
            autoFocus
            onBlur={() => setEditingZip(false)}
            maxLength={5}
            placeholder="Enter ZIP Code"
          />
        ) : (
          <Text style={styles.zipText}>Your ZIP Code: {zipCode}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.uploadButtonText}>+ Upload Image / Take Photo</Text>
      </TouchableOpacity>

      <Link href="/(tabs)" asChild>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9b9e8c',
    alignItems: 'center',
    paddingTop: 40,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  zipContainer: {
    backgroundColor: '#e8dfd5',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  zipText: {
    fontSize: 18,
    fontWeight: '500',
  },
  zipInput: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#e8dfd5',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#e8dfd5',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 40,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
}); 