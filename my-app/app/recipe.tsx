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
  co2Emitted: number;
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
          title: 'Recreate Sustainably'
        };
      case 'local':
        return {
          backgroundColor: '#9376b4', // Purple color
          title: 'Recreate Locally'
        };
      default:
        return {
          backgroundColor: '#e18e2b', // Orange color
          title: 'Recreate Originally'
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
        return 'Sustainably';
      case 'local':
        return 'Locally';
      default:
        return 'Originally';
    }
  };

  // Sample recipe data - this would normally come from an API or state
  const recipe: RecipeProps = {
    dishName: optionType === 'sustainable' ? 'Recreate Sustainably' : optionType === 'local' ? 'Recreate Locally' : 'Recreate Originally',
    co2Emitted: 78,
    waterUsage: 85,
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

  const handleBack = () => {
    router.back();
  };

  const { backgroundColor, title } = getHeaderColorAndTitle();
  const tabColor = getTabColor();
  const tabText = getTabText();

  // If this is the original recipe, render a simpler layout
  if (optionType === 'original') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor }]}>
          <Text style={styles.appName}>myApp</Text>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Cooking!</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.metricsContainer}>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>CO2 Emitted</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${recipe.co2Emitted}%` }]} />
              </View>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Water Usage</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${recipe.waterUsage}%` }]} />
              </View>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Food Miles</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${recipe.foodMiles}%` }]} />
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
          <View style={styles.footerSpace} />
        </ScrollView>

        {/* Green Footer */}
        <View style={styles.footer} />
      </View>
    );
  }

  // For sustainable and local recipes, use the layout with tabs
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor }]}>
        <Text style={styles.appName}>myApp</Text>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Cooking!</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsContainer}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>CO2 Emitted</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${recipe.co2Emitted}%` }]} />
            </View>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Water Usage</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${recipe.waterUsage}%` }]} />
            </View>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Food Miles</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${recipe.foodMiles}%` }]} />
            </View>
          </View>
        </View>

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
          ** {viewType === 'adapted' ? (optionType === 'local' ? 'Locally' : 'Sustainably') : 'Originally'} adapted ingredients are bolded.
        </Text>

        {/* Ingredients Header if Local */}
        {optionType === 'local' && <Text style={styles.ingredientsHeader}>Ingredients</Text>}

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
            <View style={styles.mapIconContainer}>
              <Ionicons name="location" size={40} color="#333" />
            </View>
          </View>
        )}

        {/* Footer Space */}
        <View style={styles.footerSpace} />
      </ScrollView>

      {/* Green Footer */}
      <View style={styles.footer} />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e4d9', // Cream background
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
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
    backgroundColor: '#92b579', // Green progress bar
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
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noteText: {
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 20,
    fontStyle: 'italic',
    fontSize: 14,
  },
  ingredientsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    fontStyle: 'italic',
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
  },
  adaptedIngredient: {
    fontWeight: 'bold',
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
  },
  mapIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerSpace: {
    height: 50,
  },
  footer: {
    height: 50,
    backgroundColor: '#92b579', // Green footer
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
}); 