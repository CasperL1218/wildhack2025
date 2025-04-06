import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type RecipeCard = {
  id: string;
  dishName: string;
  date: string;
  image: string;
};

export default function MyRecipesScreen() {
  // Sample data for historical recipes
  const recipes: RecipeCard[] = [
    {
      id: '1',
      dishName: 'Spaghetti Carbonara',
      date: 'May 15, 2023',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
    },
    {
      id: '2',
      dishName: 'Chicken Tikka Masala',
      date: 'June 2, 2023',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
    },
    {
      id: '3',
      dishName: 'Vegetable Stir Fry',
      date: 'July 10, 2023',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80',
    },
    {
      id: '4',
      dishName: 'Beef Tacos',
      date: 'August 5, 2023',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Recipes</Text>
      </View>
      <View style={styles.subtitle}>
        <Text style={styles.description}>xx week streaks</Text>
        <Text style={styles.description}>xx recipes saved</Text>
      </View>
      {/* <TouchableOpacity
        style={styles.resumeButton}
        onPress={() => setShowAlternativeInput(!showAlternativeInput)}
      >
        <Text style={styles.resumeButtonText}>Resume Recipe</Text>
      </TouchableOpacity> */}
      {recipes.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.gridContainer}>
            {recipes.map((recipe) => (
              <View key={recipe.id} style={styles.gridItem}>
                <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
                  <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={80} color="#666" />
          <Text style={styles.emptyStateText}>No recipes yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Your generated recipes will appear here
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#84A24D',
  },
  header: {
    padding: 5,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
    color: 'black',
    textAlign: 'center',
  },
  subtitle: {
  },
  description: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
    color: 'black',
    textAlign: 'center',
  },
  // resumeButton: {
  //   backgroundColor: '#e6e0d9',
  //   paddingVertical: 12,
  //   paddingHorizontal: 20,
  //   borderRadius: 25,
  //   alignItems: 'center',
  //   alignSelf: 'center',
  //   marginBottom: 10,
  // },
  // resumeButtonText: {
  //   fontSize: 15,
  //   fontWeight: 'bold',
  //   color: 'black',
  //   textAlign: 'center',
  // },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    height: 200,
    padding: 5,
    aspectRatio: 1,
    marginBottom: 20,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    alignItems: 'center',
    alignSelf: 'center',
  },
  recipeImage: {
    width: 150,
    height: 150,
  },
  recipeInfo: {
    flex: 1,
    padding: 15,
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
