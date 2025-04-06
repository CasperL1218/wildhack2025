import { View, Text, StyleSheet} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function FinalRecipe() {
    // const router = useRouter();
    const params = useLocalSearchParams();

    const final_recipe = "insert prompted recipe here" // from LLM

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe for Dish Name </Text>
      <Text style = {styles.subtitle}> How to {params.mode} </Text>
      <Text style={styles.recipe}> { final_recipe } </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5dbd0',
    padding: 30,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Baloo',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  recipe: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    fontSize: 16,
    fontFamily: 'Nunito',
    textAlignVertical: 'top', // Android fix
    color: '#000',
  },
});



