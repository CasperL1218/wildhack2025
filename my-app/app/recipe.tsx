import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type RecipeIngredient = {
  name: string;
  isAdapted?: boolean;
};

type RecipeSection = {
  title: string;
  ingredients: RecipeIngredient[];
};

type RecipeProps = {
  dishName: string;
  ingredients: RecipeSection[];
  co2Emitted: string;
  waterUsage: number;
  foodMiles: number;
};

export default function RecipeModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ optionType?: string }>();
  const optionType = params.optionType || 'original';
  const [viewType, setViewType] = useState<'adapted' | 'original'>(optionType === 'original' ? 'original' : 'adapted');

  // Get the header color and title based on the recipe type
  const getHeaderColorAndTitle = () => {
    switch (optionType) {
      case 'sustainable':
        return {
          backgroundColor: '#8dc8c8', // Light teal color
          title: 'Green Warrior',
          subtitle: 'Reimagine your dish optimizing sustainabililty.'
        };
      case 'local':
        return {
          backgroundColor: '#9376b4', // Purple color
          title: 'Local Lover',
          subtitle: 'Reimagine your dish using local produce.'
        };
      default:
        return {
          backgroundColor: '#e18e2b', // Orange color
          title: 'The OG',
          subtitle: 'Recreate your dish true-to-flavor.'
        };
    }
  };

  // Get the tab color based on the recipe type
  const getTabColor = () => {
    switch (optionType) {
      case 'sustainable':
        return '#8dc8c8'; // Light teal
      case 'local':
        return '#9376b4'; // Purple
      default:
        return '#e18e2b'; // Orange
    }
  };

  const getTabText = () => {
    switch (optionType) {
      case 'sustainable':
        return 'Sustainable';
      case 'local':
        return 'Local';
      default:
        return 'Original';
    }
  };

  // Sample recipe data - this would normally come from an API or state
  const recipe: RecipeProps = {
    dishName: optionType === 'sustainable' ? 'Recreate Sustainably' : optionType === 'local' ? 'Recreate Locally' : 'Recreate Originally',
    waterUsage: 85,
    co2Emitted: 'medium',
    foodMiles: 90,
    ingredients: [
      {
        title: 'Section a',
        ingredients: [
          { name: 'Ingredient 1', isAdapted: true },
          { name: 'Ingredient 2' },
          { name: 'Ingredient 3', isAdapted: true }
        ]
      },
      {
        title: 'Section b',
        ingredients: [
          { name: 'Ingredient 1' },
          { name: 'Ingredient 2', isAdapted: true },
          { name: 'Ingredient 3' }
        ]
      },
      {
        title: 'Section c',
        ingredients: [
          { name: 'Ingredient 1', isAdapted: true },
          { name: 'Ingredient 2' },
          { name: 'Ingredient 3' }
        ]
      }
    ]
  };

  const calculateCO2Status = (co2Emitted: string) => {
    if (co2Emitted == "low") {
      return 110; 
    } else if (co2Emitted == "medium") {
      return 230; 
    } else {
      return 360; 
    }
  };
  const co2Status = calculateCO2Status(recipe.co2Emitted);

  const handleBack = () => {
    router.back();
  };

  const { backgroundColor, title, subtitle } = getHeaderColorAndTitle();
  const tabColor = getTabColor();
  const tabText = getTabText();

  // If this is the original recipe, render a simpler layout
  if (optionType === 'original') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor }]}>
          {/* <Text style={styles.appName}>RePlate</Text> */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => router.push({
            pathname: '/endrecipe',
            params: {
              mode: recipe.dishName,
            }})}>
            <Text style={styles.startButtonText}>Start Cooking!</Text>
            
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.metricsContainer}>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>CO2 Emitted</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { backgroundColor: tabColor }, { width: co2Status }]} />
              </View>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Water Usage</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { backgroundColor: tabColor }, { width: `${recipe.waterUsage}%` }]} />
              </View>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Food Miles</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { backgroundColor: tabColor }, { width: `${recipe.foodMiles}%` }]} />
              </View>
            </View>
          </View>

          {/* Recipe Sections - directly shown without tabs or notes */}
          {recipe.ingredients.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.ingredients.map((ingredient, ingredientIndex) => (
                <View key={ingredientIndex} style={styles.ingredientItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.ingredientText}>
                    {ingredient.name}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          {/* Footer Space */}
          {/* <View style={styles.footerSpace} /> */}
        </ScrollView>

        {/* Green Footer */}
        {/* <View style={styles.footer} /> */}
      </View>
    );
  }

  // For sustainable and local recipes, use the layout with tabs
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor }]}>
        {/* <Text style={styles.appName}>RePlate</Text> */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <TouchableOpacity style={styles.startButton}
        onPress={() => router.push({
          pathname: '/endrecipe',
          params: {
            mode: recipe.dishName,
          }})}>
          <Text style={styles.startButtonText}>Start Cooking!</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsContainer}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>CO2 Emitted</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, , { backgroundColor: tabColor }, { width: co2Status}]} />
            </View>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Water Usage</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, , { backgroundColor: tabColor }, { width: `${recipe.waterUsage}%` }]} />
            </View>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Food Miles</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { backgroundColor: tabColor }, { width: `${recipe.foodMiles}%` }]} />
            </View>
          </View>
        </View>

        {/* Ingredients Header if Local */}
        <Text style={styles.ingredientsHeader}>Ingredients</Text>

        {/* Recipe Type Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              viewType === 'adapted' ? { backgroundColor: tabColor } : null
            ]}
            onPress={() => setViewType('adapted')}
          >
            <Text style={[
              styles.tabText,
              viewType === 'adapted' ? styles.activeTabText : null
            ]}>{tabText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              viewType === 'original' ? { backgroundColor: tabColor } : null
            ]}
            onPress={() => setViewType('original')}
          >
            <Text style={[
              styles.tabText,
              viewType === 'original' ? styles.activeTabText : null
            ]}>Original</Text>
          </TouchableOpacity>
        </View>

        {/* Note about adapted ingredients */}
        <Text style={styles.noteText}>
          {viewType === 'adapted' && (
            `** ${optionType === 'local' ? 'Locally' : 'Sustainably'} adapted ingredients are bolded.`
            )}
            </Text>


        {/* Recipe Sections */}
        {recipe.ingredients.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.ingredients.map((ingredient, ingredientIndex) => (
              <View key={ingredientIndex} style={styles.ingredientItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={[
                  styles.ingredientText,
                  (viewType === 'adapted' && ingredient.isAdapted) ? styles.adaptedIngredient : null
                ]}>
                  {ingredient.name}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Source Nearby for Local recipes */}
        {optionType === 'local' && (
          <View style={styles.sourceSection}>
            <Text style={styles.sourceTitle}>Source Nearby</Text>
            {/* <View style={styles.mapIconContainer}>
              <Ionicons name="location" size={40} color="#333" />
            </View> */}
            <View style={styles.mapContainer}>
              <Text>Map Container</Text>
              {/* <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 37.78825, // placeholder
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              /> */}
            </View>
          </View>
        )}

        {/* Footer Space */}
        {/* <View style={styles.footerSpace} /> */}
      </ScrollView>

      {/* Green Footer */}
      {/* <View style={styles.footer} /> */}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e0d9', // Cream background
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Baloo',
  },
  title: {
    fontSize: 32,
    color: '#000',
    marginBottom: 0,
    fontFamily: 'Baloo',
  },
  subtitle: {
    fontSize: 24,
    color: '#000',
    marginBottom: 15,
    fontFamily: 'Nunito',
  },
  startButton: {
    backgroundColor: '#e8dfd5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Baloo',
  },
  scrollView: {
    flex: 1,
  },
  metricsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  metricLabel: {
    width: 120,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Baloo',
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#d9d9d9',
    borderRadius: 5,
    flex: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tabText: {
    fontWeight: '500',
    fontFamily: 'Baloo',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Baloo',
  },
  noteText: {
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 20,
    fontStyle: 'italic',
    fontFamily: 'Nunito',
    fontSize: 14,
  },
  ingredientsHeader: {
    fontSize: 20,
    fontFamily: 'Baloo',
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Baloo',
  },
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 5,
  },
  bulletPoint: {
    marginRight: 10,
    fontSize: 18,
  },
  ingredientText: {
    fontSize: 16,
    fontFamily: 'Nunito',
  },
  adaptedIngredient: {
    fontFamily: 'NunitoBold'
  },
  sourceSection: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  sourceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textDecorationLine: 'underline',
    fontFamily: 'Baloo',
  },
  mapContainer: {
    borderColor: "red",
    borderWidth: 2,
    height: 250,
    marginBottom: 35,
  },
  // footerSpace: {
  //   height: 50,
  // },
  // footer: {
  //   fontFamily: 'Baloo',
  //   height: 70,
  //   backgroundColor: '#84a24d', // Green footer
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  // }
}); 
