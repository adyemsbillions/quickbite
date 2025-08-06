import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  category_id: string;
  restaurantId: string;
  vat_fee: string;
  delivery_fee: string;
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
  const [restaurantName, setRestaurantName] = useState<string>('');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`https://cravii.ng/cravii/api/get_recipe.php?id=${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const result = await response.json();
        if (result.success) {
          setRecipe(result.data);
          if (result.data.restaurantId) {
            const restaurantResponse = await fetch(
              `https://cravii.ng/cravii/api/get_restaurant.php?id=${result.data.restaurantId}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
              }
            );
            const restaurantResult = await restaurantResponse.json();
            if (restaurantResult.success) {
              setRestaurantName(restaurantResult.data.name);
            } else {
              console.error('Failed to fetch restaurant name:', restaurantResult.message);
              setRestaurantName('Unknown Restaurant');
            }
          }
        } else {
          console.error('Failed to fetch recipe details:', result.message);
          Alert.alert('Error', 'Failed to load recipe details. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        Alert.alert('Error', 'Failed to load recipe details. Please check your connection and try again.');
      }
    };
    fetchRecipeDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (!recipe) {
        Alert.alert('Error', 'Recipe details not loaded. Please try again.');
        return;
      }
      const cart = await AsyncStorage.getItem('cart');
      const cartItems = cart ? JSON.parse(cart) : [];
      const itemExists = cartItems.some((item: Recipe) => item.id === id);
      if (itemExists) {
        Alert.alert(
          'Item Already in Cart',
          `${recipe.name} is already in your cart. You can adjust the quantity in the cart.`,
          [{ text: 'Go to Cart', onPress: () => router.push('/cart') }, { text: 'OK' }]
        );
        return;
      }
      const newItem = {
        id,
        name: recipe.name,
        price: recipe.price,
        image_url: recipe.image_url,
        restaurantId: recipe.restaurantId,
        vat_fee: recipe.vat_fee,
        delivery_fee: recipe.delivery_fee,
        quantity: 1,
      };
      cartItems.push(newItem);
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      console.log(`Added ${recipe.name} to cart`);
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
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
              ? { uri: `https://cravii.ng/cravii/api/uploads/${recipe.image_url}` }
              : PLACEHOLDER_RECIPE
          }
          style={styles.detailImage}
          onError={(e) => console.log(`Image load error for ${recipe?.image_url}:`, e.nativeEvent.error)}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.detailName}>{recipe?.name || 'Recipe Name'}</Text>
          <Text style={styles.restaurantName}>From: {restaurantName || 'Unknown Restaurant'}</Text>
          <Text style={styles.detailDescription}>{recipe?.description || 'No description available.'}</Text>
          <Text style={styles.detailPrice}>{`₦${recipe?.price || '0.00'}`}</Text>
          <Text style={styles.feeText}>VAT Fee (Maiduguri): ₦{recipe?.vat_fee || '0.00'}</Text>
          <Text style={styles.feeText}>Delivery Fee (Maiduguri): ₦{recipe?.delivery_fee || '0.00'}</Text>
          <Text style={styles.deliveryPartner}>Safe and Fast Delivery by Satisfy</Text>
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
    height: StatusBar.currentHeight || 0,
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
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4ade80',
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
    marginBottom: 10,
  },
  feeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  deliveryPartner: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff5722',
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