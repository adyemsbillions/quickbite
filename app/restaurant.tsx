import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Placeholder images (fallbacks if API fails to provide URLs)
const PLACEHOLDER_AVATAR = require('../assets/images/avatar.jpg');
const PLACEHOLDER_CATEGORY = require('../assets/images/burger_category.jpg');
const PLACEHOLDER_RECIPE = require('../assets/images/promo_burger.png');

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State for user data
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  // State for dynamic data
  const [categories, setCategories] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);

  // Fetch user data and dynamic content on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const id = await AsyncStorage.getItem('id');
        if (id) {
          const userResponse = await fetch(`http://192.168.231.38/quickbite/api/get_user.php?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const userResult = await userResponse.json();
          if (userResult.success) {
            const user = userResult.data;
            setName(user.name || '');
            setLocation(user.location || '');
          } else {
            console.error('Failed to fetch user data:', userResult.message);
          }
        } else {
          console.warn('No user ID found. Defaulting to empty name and location.');
        }

        // Fetch categories
        const categoriesResponse = await fetch('http://192.168.231.38/quickbite/api/get_categories.php', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const categoriesResult = await categoriesResponse.json();
        if (categoriesResult.success) {
          setCategories(categoriesResult.data || []);
        } else {
          console.error('Failed to fetch categories:', categoriesResult.message);
          setCategories([]); // Fallback to empty array
        }

        // Fetch popular recipes
        const recipesResponse = await fetch('http://192.168.231.38/quickbite/api/get_recipes.php', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const recipesResult = await recipesResponse.json();
        if (recipesResult.success) {
          setPopularRecipes(recipesResult.data || []);
        } else {
          console.error('Failed to fetch recipes:', recipesResult.message);
          setPopularRecipes([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top, backgroundColor: '#ffffff' }]}>
          <View style={styles.userInfo}>
            <Image source={PLACEHOLDER_AVATAR} style={styles.avatar} />
            <View>
              <Text style={styles.greeting}>Hello {name || 'User'}</Text>
              <View style={styles.location}>
                <Feather name="map-pin" size={16} color="#4ade80" />
                <Text style={styles.locationText}>{location || 'N.Y Bronx'}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Feather name="bell" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>What Service Do You Want?</Text>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder='Search "biryani"'
              placeholderTextColor="#999"
            />
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          </View>
        </View>

        {/* Promotional Banner (using a placeholder or dynamic image if available) */}
        <View style={styles.promoBanner}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Fast Bites,{"\n"}Faster Orders.</Text>
            <Text style={styles.promoSubtitle}>Up to 3 times per day</Text>
            <TouchableOpacity style={styles.orderNowButton}>
              <Text style={styles.orderNowButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
          {/* Fallback to a placeholder since PLACEHOLDER_PROMO_BURGER is missing */}
          <Image source={PLACEHOLDER_RECIPE} style={styles.promoBurgerImage} />
        </View>

        {/* Service Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryItem}>
              <View style={styles.categoryImageWrapper}>
                <Image
                  source={category.image_url ? { uri: `http://192.168.231.38/quickbite/api/uploads/${category.image_url}` } : PLACEHOLDER_CATEGORY}
                  style={styles.categoryImage}
                />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Recipes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Recipes</Text>
          <TouchableOpacity>
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipesScroll}>
          {popularRecipes.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
              <Image
                source={recipe.image_url ? { uri: `http://192.168.231.38/quickbite/api/uploads/${recipe.image_url}` } : PLACEHOLDER_RECIPE}
                style={styles.recipeImage}
              />
              <TouchableOpacity style={styles.heartIcon}>
                <Feather name="heart" size={18} color="#ff5722" />
              </TouchableOpacity>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeDescription}>{recipe.description}</Text>
                <View style={styles.recipeFooter}>
                  <Text style={styles.recipePrice}>{`₦${recipe.price || '0.00'}`}</Text>
                  <TouchableOpacity style={styles.addIcon}>
                    <Feather name="plus" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <Feather name="home" size={24} color="#ff5722" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/search')}>
          <Feather name="search" size={24} color="#999" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/cart')}>
          <Feather name="shopping-cart" size={24} color="#999" />
          <Text style={styles.navText}>My Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Feather name="user" size={24} color="#999" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  searchTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
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
  promoBanner: {
    backgroundColor: '#ff5722',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    height: 180,
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 30,
  },
  promoTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  promoTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
    lineHeight: 30,
  },
  promoSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  orderNowButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  orderNowButtonText: {
    color: '#ff5722',
    fontSize: 16,
    fontWeight: '700',
  },
  promoBurgerImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    position: 'absolute',
    right: -20,
    bottom: -10,
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
  seeMoreText: {
    color: '#ff5722',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingLeft: 20,
    marginBottom: 30,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryImageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  recipesScroll: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.6,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  recipePrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#e63946',
  },
  addIcon: {
    backgroundColor: '#ff5722',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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