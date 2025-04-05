import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

type PhotoItem = {
  uri: string;
  dishName?: string;
};

export default function SnapScreen() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [dishName, setDishName] = useState<string>('');
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [pressedPhotoIndex, setPressedPhotoIndex] = useState<number | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Request permissions
  const requestPermissions = async () => {
    if (cameraPermission?.status !== 'granted') {
      await requestCameraPermission();
    }
  };

  // Handle taking a photo
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCurrentPhoto(photo?.uri || null);
        setShowCamera(false);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  // Handle picking an image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setCurrentPhoto(result.assets[0].uri);
        setShowGallery(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Handle using the current photo
  const usePhoto = () => {
    if (currentPhoto) {
      setPhotos([...photos, { uri: currentPhoto }]);
      setCurrentPhoto(null);
      setDishName('');
    }
  };

  // Handle retaking the current photo
  const retakePhoto = () => {
    setCurrentPhoto(null);
  };

  // Handle adding a new photo
  const addNewPhoto = () => {
    setShowCamera(true);
  };

  // Handle generating with the photos
  const generateWithPhotos = () => {
    // Here you would implement the logic to process the photos
    console.log('Generating with photos:', photos);
    console.log('Dish name:', dishName);

    // Navigate to the recipe modal
    router.push('/recipe');
  };

  // Main landing page
  if (!currentPhoto && !showCamera && !showGallery) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Food Recognition</Text>
            <Text style={styles.subtitle}>Take or upload photos of your food</Text>
          </View>

          {photos.length > 0 && (
            <View style={styles.photosContainer}>
              <Text style={styles.sectionTitle}>Your Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                {photos.map((photo, index) => (
                  <View key={index} style={styles.photoItem}>
                    <View style={styles.photoWrapper}>
                      <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          const newPhotos = [...photos];
                          newPhotos.splice(index, 1);
                          setPhotos(newPhotos);
                        }}
                      >
                        <Ionicons name="close-circle" size={24} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                    {photo.dishName && <Text style={styles.photoLabel}>{photo.dishName}</Text>}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                requestPermissions();
                setShowCamera(true);
              }}
            >
              <Ionicons name="camera" size={32} color="white" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setShowGallery(true)}
            >
              <Ionicons name="images" size={32} color="white" />
              <Text style={styles.optionText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>

          {photos.length > 0 && (
            <View style={styles.dishNameContainer}>
              <Text style={styles.sectionTitle}>Dish Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter dish name"
                value={dishName}
                onChangeText={setDishName}
                placeholderTextColor="#999"
              />
            </View>
          )}

          {photos.length > 0 && (
            <TouchableOpacity
              style={styles.generateButton}
              onPress={generateWithPhotos}
            >
              <Text style={styles.generateButtonText}>Generate</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Camera view
  if (showCamera) {
    if (!permission) {
      return <View />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.topControls}>
              <TouchableOpacity style={styles.backButton} onPress={() => setShowCamera(false)}>
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.flipButton} onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}>
                <Ionicons name="camera-reverse" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomControls}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // Gallery view
  if (showGallery) {
    return (
      <View style={styles.container}>
        <View style={styles.galleryHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowGallery(false)}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.galleryTitle}>Select from Gallery</Text>
        </View>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Ionicons name="images" size={32} color="white" />
          <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Photo preview
  if (currentPhoto) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: currentPhoto }} style={styles.previewImage} />
        <View style={styles.previewControls}>
          <TouchableOpacity style={styles.previewButton} onPress={retakePhoto}>
            <Ionicons name="refresh" size={30} color="white" />
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.previewButton} onPress={usePhoto}>
            <Ionicons name="checkmark" size={30} color="white" />
            <Text style={styles.buttonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  photosContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  photosScroll: {
    flexDirection: 'row',
  },
  photoItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  photoLabel: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 120,
  },
  optionText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  dishNameContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  permissionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
    borderRadius: 30,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
    borderRadius: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  previewButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  galleryTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 20,
  },
  galleryButton: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    flexDirection: 'row',
  },
  galleryButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '500',
  },
  photoWrapper: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 2,
  },
});