import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { debounce } from 'lodash';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://quickbite.truszedproperties.com';
const IMAGE_BASE_URL = 'https://quickbite.truszedproperties.com/quickbite/api/uploads/';

// Placeholder image for fallback
const PLACEHOLDER_RECIPE = require('../assets/images/recipe_chicken.jpg');

// Interfaces for TypeScript
interface Recipe {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category_id: string;
  restaurantId: string | number; // Allow string or number to match API response
  vat_fee: string;
  delivery_fee: string;
}

interface Restaurant {
  id: string;
  name: string;
}

interface User {
  name: string;
  location: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Sample recipe IDs to fetch (replace with actual IDs from your database)
const recipeIds = ['1', '2', '3'];

const RecipeCard = memo(
  ({ result, onPress }: { result: Recipe; onPress: () => void }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${result.name} details`}
    >
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${result.image_url}` }}
        style={styles.recipeImage}
        defaultSource={PLACEHOLDER_RECIPE}
        onError={(e) => console.log(`Image load error for ${result.image_url}:`, e.nativeEvent.error)}
      />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName}>{result.name}</Text>
        <Text style={styles.recipeDescription}>{result.description}</Text>
        <Text style={styles.recipePrice}>₦{result.price}</Text>
      </View>
    </TouchableOpacity>
  )
);

const Search: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [restaurantFilter, setRestaurantFilter] = useState<string>('');
  const [userName, setUserName] = useState<string>('Jenny');
  const [userLocation, setUserLocation] = useState<string>('N.Y Bronx');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        if (id) {
          const userResponse = await fetch(`${API_URL}/quickbite/api/get_user.php?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          const userResult: ApiResponse<User> = await userResponse.json();
          if (userResult.success) {
            const user = userResult.data;
            setUserName(user.name || 'Jenny');
            setUserLocation(user.location || 'N.Y Bronx');
          } else {
            console.error('Failed to fetch user data:', userResult.message);
            Toast.show('Failed to fetch user data.', {
              duration: Toast.durations.SHORT,
              position: Toast.positions.BOTTOM,
              backgroundColor: '#d32f2f',
            });
          }
        } else {
          console.warn('No user ID found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Toast.show('Network error. Please try again.', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#d32f2f',
        });
      }
    };
    fetchUserData();
  }, []);

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const fetchedRestaurants: Restaurant[] = [];
        const restaurantIds = ['1', '2']; // Sample restaurant IDs
        for (const id of restaurantIds) {
          const response = await fetch(`${API_URL}/quickbite/api/get_restaurant.php?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          const result: ApiResponse<Restaurant> = await response.json();
          if (result.success) {
            fetchedRestaurants.push({ id, name: result.data.name });
          } else {
            console.warn(`Failed to fetch restaurant with ID ${id}: ${result.message}`);
          }
        }
        console.log('Fetched restaurants:', fetchedRestaurants);
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        Toast.show('Network error fetching restaurants.', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#d32f2f',
        });
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes: Recipe[] = [];
        for (const id of recipeIds) {
          const response = await fetch(`${API_URL}/quickbite/api/get_recipe.php?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          const result: ApiResponse<Recipe> = await response.json();
          if (result.success) {
            fetchedRecipes.push(result.data);
          } else {
            console.warn(`Failed to fetch recipe with ID ${id}: ${result.message}`);
          }
        }
        console.log('Fetched recipes:', fetchedRecipes);
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        Toast.show('Network error fetching recipes.', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: '#d32f2f',
        });
      }
    };
    fetchRecipes();
  }, []);

  // Debounced search handler
  const handleSearchChange = useCallback(
    debounce((text: string) => {
      setSearchQuery(text);
    }, 300),
    []
  );

  // Handle text input changes
  const handleInputChange = (text: string) => {
    setInputValue(text);
    handleSearchChange(text);
  };

  // Randomize and filter results
  const filteredResults = useMemo(() => {
    const filtered = recipes.filter(
      (result) =>
        (result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!restaurantFilter || result.restaurantId.toString() === restaurantFilter)
    );
    console.log('Filtered results:', filtered, 'Restaurant filter:', restaurantFilter);
    return [...filtered].sort(() => Math.random() - 0.5);
  }, [recipes, searchQuery, restaurantFilter]);

  // Get restaurant name for no-recipes message
  const selectedRestaurantName = restaurants.find((r) => r.id === restaurantFilter)?.name || 'this restaurant';

  return (
    <View style={styles.container}>
      <View style={[styles.statusBarPlaceholder, { height: StatusBar.currentHeight || 0 }]} />
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top, backgroundColor: '#ffffff' }]}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: `${IMAGE_BASE_URL}avatar.jpg` }}
              style={styles.avatar}
              defaultSource={PLACEHOLDER_RECIPE}
              accessibilityLabel="User avatar"
            />
            <View>
              <Text style={styles.greeting}>Hello {userName}</Text>
              <View style={styles.location}>
                <Feather name="map-pin" size={16} color="#4ade80" />
                <Text style={styles.locationText}>{userLocation}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} accessibilityRole="button" accessibilityLabel="Notifications">
            <Feather name="bell" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search and Filter Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes, categories..."
              placeholderTextColor="#999"
              value={inputValue}
              onChangeText={handleInputChange}
              accessibilityLabel="Search recipes"
            />
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filter by Restaurant:</Text>
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setRestaurantFilter('')}
                accessibilityRole="button"
                accessibilityLabel="Select all restaurants"
              >
                <Text style={styles.dropdownText}>All</Text>
              </TouchableOpacity>
              {restaurants.map((restaurant) => (
                <TouchableOpacity
                  key={restaurant.id}
                  style={styles.dropdownButton}
                  onPress={() => setRestaurantFilter(restaurant.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${restaurant.name}`}
                >
                  <Text style={styles.dropdownText}>{restaurant.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Search Results */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Search Results</Text>
        </View>
        <View style={styles.recipeList}>
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <RecipeCard
                key={result.id}
                result={result}
                onPress={() => router.push(`/recipe-details?id=${result.id}`)}
              />
            ))
          ) : (
            <Text style={styles.noRecipesText}>
              {restaurantFilter
                ? `No recipes found for ${selectedRestaurantName}`
                : 'No recipes found'}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/restaurant')}
          accessibilityRole="button"
          accessibilityLabel="Go to Home"
        >
          <Feather name="home" size={24} color="#999" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/search')}
          accessibilityRole="button"
          accessibilityLabel="Go to Search"
        >
          <Feather name="search" size={24} color="#ff5722" />
          <Text style={styles.navTextActive}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/cart')}
          accessibilityRole="button"
          accessibilityLabel="Go to Cart"
        >
          <Feather name="shopping-cart" size={24} color="#999" />
          <Text style={styles.navText}>My Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/profile')}
          accessibilityRole="button"
          accessibilityLabel="Go to Profile"
        >
          <Feather name="user" size={24} color="#999" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  statusBarPlaceholder: {
    backgroundColor: '#ffffff',
  },
  scrollViewContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ff5722',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginLeft: 5,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
  },
  filterContainer: {
    marginTop: 10,
  },
  filterLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  dropdownButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  recipeList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  recipeInfo: {
    padding: 15,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  recipePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4ade80',
  },
  noRecipesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontWeight: '600',
  },
  navTextActive: {
    fontSize: 12,
    color: '#ff5722',
    marginTop: 4,
    fontWeight: '700',
  },
});

export default Search;