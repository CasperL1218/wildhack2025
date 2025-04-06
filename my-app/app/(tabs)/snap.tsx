import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable, Modal, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { usePhotoContext } from '../../context/PhotoContext';
import { useResponseContext } from '../../context/ResponseContext';

import axios from 'axios';
import FormData from 'form-data';

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
  const [zipCode, setZipCode] = useState<string>('60201');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [editingZip, setEditingZip] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);
  const { setPhotos: setGlobalPhotos } = usePhotoContext();
  const { setResponse } = useResponseContext();

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
    setShowUploadModal(true);
  };

  // Handle generating with the photos
  const generateWithPhotos = async () => {
    console.log("generateWithPhotos called");
    if (photos.length === 0) {
      // Show toast message if no photos
      try {
        Alert.alert("No photos", "Please snap your meal first!");
      } catch (error) {
        console.error("Alert error:", error);
      }
      return;
    }

    // Log photo info before navigating
    console.log('Image data being passed:', photos);

    const formData = new FormData();
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];

      console.log(`Processing photo at index ${i}:`, photo);

      if (!photo || !photo.uri) {
          console.error(`Invalid photo at index ${i}:`, photo);
          Alert.alert("Error", `Invalid photo data at index ${i}.`);
          return; // Stop processing if an invalid photo is found
      }

      try {
          console.log(`Photo URI at index ${i}:`, photo.uri);
          const base64Data = photo.uri.split(',')[1];
          console.log(`Base64 data at index ${i}:`, base64Data); // Add this line
          const byteCharacters = atob(base64Data);
          console.log(`Byte characters length at index ${i}:`, byteCharacters.length);
          const byteArray = new Uint8Array(byteCharacters.length);

          for (let j = 0; j < byteCharacters.length; j++) {
              byteArray[j] = byteCharacters.charCodeAt(j);
          }

          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          console.log(`Blob created at index ${i}:`, blob);
          const file = new File([blob], photo.dishName || `image_${i}.jpg`, { type: 'image/jpeg' });
          console.log(`File at index ${i}:`, file);

          formData.append('file', file); // Append each file with a unique name
          console.log(`File appended to formData at index ${i}`);

          

      } catch (error) {
          console.error(`Error processing photo at index ${i}:`, error);
          Alert.alert("Error", `Failed to process photo at index ${i}.`);
          return; // Stop processing if there's an error
      }
  }

  formData.append('zipcode', zipCode);
  console.log('Form data prepared:', formData);

  setGlobalPhotos(photos);
  try {
      const response = await axios.post('http://127.0.0.1:5000/scan-food', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      console.log('Response from server:', response);
      
      setResponse(response.data);

      
      router.push('/(tabs)/results');
      // router.push({
      //   pathname: '/(tabs)/results'
      // });

  } catch (error) {
      console.error('Error sending data to server:', error);
      Alert.alert("Error", "Failed to send data to server.");
  }

    // // Save photos to global state
    // setGlobalPhotos(photos);

    // // Navigate to results tab
    // router.push('/(tabs)/results');
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

          {/* ZIP Code Input */}
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
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.zipText}>Your ZIP Code: {zipCode}</Text>
            )}
          </TouchableOpacity>

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

          <TouchableOpacity
            style={styles.uploadPhotoButton}
            onPress={addNewPhoto}
          >
            <Ionicons name="camera" size={32} color="white" />
            <Text style={styles.uploadPhotoText}>+ Upload Image / Take Photo</Text>
          </TouchableOpacity>

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

          {/* Always show generate button */}
          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateWithPhotos}
          >
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>

          {/* Upload Modal */}
          <Modal
            visible={showUploadModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowUploadModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Choose an Option</Text>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowUploadModal(false);
                    requestPermissions();
                    setShowCamera(true);
                  }}
                >
                  <Ionicons name="camera" size={24} color="white" style={styles.modalIcon} />
                  <Text style={styles.modalButtonText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowUploadModal(false);
                    setShowGallery(true);
                  }}
                >
                  <Ionicons name="images" size={24} color="white" style={styles.modalIcon} />
                  <Text style={styles.modalButtonText}>Upload from Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowUploadModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  zipContainer: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zipText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  zipInput: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 5,
  },
  photosContainer: {
    marginBottom: 25,
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
  uploadPhotoButton: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 25,
  },
  uploadPhotoText: {
    color: 'white',
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  dishNameContainer: {
    marginBottom: 25,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  modalIcon: {
    marginRight: 15,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  cancelButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
});