import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

// Get API key from Expo Constants
const API_KEY = Constants.expoConfig?.extra?.marketApiKey;

// Define a type for market data
type MarketData = {
  listing_name: string;
  listing_id: string;
  brief_desc?: string;
  contact_email?: string;
  contact_name?: string;
  contact_phone?: string;
  listing_desc?: string | null;
  listing_image?: string;
  location_address?: string;
  location_city: string;
  location_state: string;
  location_street?: string;
  location_zipcode: string;
  location_x?: string;
  location_y?: string;
  media_facebook?: string | null;
  media_website?: string | null;
  updatetime?: string;
  directory_type?: string;
  directory_name?: string;
  distance?: string;
};

export default function MarketsScreen() {
  const [zipcode, setZipcode] = useState('48201'); // Detroit, MI zipcode as default
  const [radius, setRadius] = useState('30'); // Default search radius in miles
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load data on mount
  useEffect(() => {
    console.log('Component mounted, loading initial data');
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    if (!zipcode) {
      setError('Please enter a zipcode');
      return;
    }

    if (!/^\d{5}$/.test(zipcode)) {
      setError('Please enter a valid 5-digit zipcode');
      return;
    }

    console.log(`Fetching markets for zipcode ${zipcode} with radius ${radius} miles`);
    setLoading(true);
    setError('');

    try {
      const url = `https://www.usdalocalfoodportal.com/api/farmersmarket/?apikey=${API_KEY}&zip=${zipcode}&radius=${radius}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      // Extract actual data array from response
      const data = responseData.data || responseData;

      if (data && Array.isArray(data)) {
        setMarkets(data);
      } else {
        setError('Invalid data format received from API');
        setMarkets([]);
      }
    } catch (err) {
      setError(`Error fetching data: ${err instanceof Error ? err.message : String(err)}`);
      setMarkets([]);
    } finally {
      setLoading(false);
    }
  };

  const renderMarketItem = ({ item }: { item: MarketData }) => {
    // Format distance for display
    const formattedDistance = item.distance && !isNaN(Number(item.distance))
      ? `${(Number(item.distance) / 1000).toFixed(1)} miles`
      : '';

    // Handle opening maps with coordinates
    const openInMaps = () => {
      if (item.location_x && item.location_y) {
        const url = `https://maps.google.com/maps?q=${item.location_y},${item.location_x}`;
        Linking.openURL(url).catch(err => console.error("Error opening map", err));
      } else if (item.location_address) {
        const query = encodeURIComponent(item.location_address);
        const url = `https://maps.google.com/maps?q=${query}`;
        Linking.openURL(url).catch(err => console.error("Error opening map", err));
      }
    };

    return (
      <TouchableOpacity style={styles.marketCard} onPress={openInMaps}>
        <View style={styles.marketHeader}>
          <Text style={styles.marketName}>{item.listing_name}</Text>
          {formattedDistance && (
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{formattedDistance}</Text>
            </View>
          )}
        </View>

        <Text style={styles.marketAddress}>
          {item.location_street || item.location_address || `${item.location_city}, ${item.location_state}`} {item.location_zipcode}
        </Text>

        {item.contact_name && (
          <Text style={styles.contactInfo}>{item.contact_name}</Text>
        )}

        <View style={styles.buttonsContainer}>
          {item.media_website && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => Linking.openURL(item.media_website!).catch(err => console.error("Error opening website", err))}
            >
              <Ionicons name="globe-outline" size={16} color="white" />
              <Text style={styles.buttonText}>Website</Text>
            </TouchableOpacity>
          )}

          {item.media_facebook && (
            <TouchableOpacity
              style={[styles.actionButton, styles.facebookButton]}
              onPress={() => Linking.openURL(item.media_facebook!).catch(err => console.error("Error opening Facebook", err))}
            >
              <Ionicons name="logo-facebook" size={16} color="white" />
              <Text style={styles.buttonText}>Facebook</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionButton, styles.mapButton]} onPress={openInMaps}>
            <Ionicons name="map-outline" size={16} color="white" />
            <Text style={styles.buttonText}>Map</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Farmers Markets</Text>
        <Text style={styles.subtitle}>Find local farmers markets near you</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Zipcode</Text>
            <TextInput
              style={styles.input}
              placeholder="48201"
              value={zipcode}
              onChangeText={setZipcode}
              keyboardType="numeric"
              maxLength={5}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Radius (miles)</Text>
            <TextInput
              style={styles.input}
              placeholder="30"
              value={radius}
              onChangeText={setRadius}
              keyboardType="numeric"
              maxLength={3}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={fetchMarkets}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Searching for markets...</Text>
        </View>
      ) : markets.length > 0 ? (
        <FlatList
          data={markets}
          keyExtractor={(item) => item.listing_id}
          renderItem={renderMarketItem}
          contentContainerStyle={styles.marketsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={80} color="#666" />
          <Text style={styles.emptyStateText}>No markets found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try changing your zipcode or increasing the radius
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#222',
    marginHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    color: '#aaa',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#aaa',
    marginTop: 10,
  },
  marketsList: {
    padding: 15,
  },
  marketCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  marketName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  marketAddress: {
    color: '#ddd',
    marginBottom: 8,
  },
  contactInfo: {
    color: '#aaa',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  mapButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
});
