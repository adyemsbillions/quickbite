import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Recipe {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
}

const { width } = Dimensions.get('window');
const PLACEHOLDER_RECIPE = require('../assets/images/promo_burger.png');

export default function RecipeDetails() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id, name, description, price, image_url } = useLocalSearchParams() as {
    id: string;
    name: string;
    description: string;
    price: string;
    image_url: string;
  };

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`https://quickbite.truszedproperties.com/quickbite/api/get_recipe.php?id=${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        if (result.success) {
          setRecipe(result.data);
        } else {
          console.error('Failed to fetch recipe details:', result.message);
          setRecipe({ id, name, description, price, image_url } as Recipe);
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setRecipe({ id, name, description, price, image_url } as Recipe);
      }
    };
    fetchRecipeDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      const cartItems = cart ? JSON.parse(cart) : [];
      const newItem = { id, name, price, image_url };
      cartItems.push(newItem);
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      console.log(`Added ${name} to cart`);
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.statusBarPlaceholder, { backgroundColor: '#ffffff' }]} />
      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <Image
          source={
            recipe?.image_url
              ? { uri: `https://quickbite.truszedproperties.com/quickbite/api/uploads/${recipe.image_url}` } // Adjusted URL
              : PLACEHOLDER_RECIPE
          }
          style={styles.detailImage}
          onError={(e) => console.log(`Image load error for ${recipe?.image_url}:`, e.nativeEvent.error)}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.detailName}>{recipe?.name || 'Recipe Name'}</Text>
          <Text style={styles.detailDescription}>{recipe?.description || 'No description available.'}</Text>
          <Text style={styles.detailPrice}>{`₦${recipe?.price || '0.00'}`}</Text>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  statusBarPlaceholder: {
    height: StatusBar.currentHeight || 0, // Handle status bar height
  },
  scrollViewContent: {
    flex: 1,
  },
  detailImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  detailName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  detailPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#e63946',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#ff5722',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#333',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});