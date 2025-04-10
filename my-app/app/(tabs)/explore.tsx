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

  const num_recipes = 40 // change to db call of length(recipes)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
                source={require('../../assets/images/replatelogo1.png')} // Make sure the logo path is correct
                style={styles.logo}
              />
        <Text style={styles.appName}>RePlate</Text>
      </View>
      <Text style={styles.title}>Saved Recipes</Text>
      <View style={styles.subtitle}>
        {/* <Text style={styles.description}>xx week streak</Text> */}
        <Text style={styles.description}>{ num_recipes } recipes saved</Text>
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
    flexDirection: 'row', // Align logo and title horizontally
    alignItems: 'center', // Vertically center them
    margin: 20, // Add some spacing below the header
    marginTop: 30,
  },
  appName: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: "Baloo",
    color: 'black',
    marginTop: 15,
  },
  logo: {
    width: 50, // Adjust width as per your logo size
    height: 40, // Adjust height as per your logo size
    paddingRight: 5,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
    color: 'black',
    textAlign: 'center',
  },
  subtitle: {
  },
  description: {
    fontSize: 20,
    fontFamily: 'Nunito',
    color: 'black',
    textAlign: 'center',
    marginBottom: -5,
  },
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
    marginBottom: 5,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    alignItems: 'center',
    alignSelf: 'center',
  },
  recipeImage: {
    width: 175,
    height: 175,
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
