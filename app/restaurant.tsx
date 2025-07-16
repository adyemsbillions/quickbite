import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
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

// Placeholder images (replace with your actual assets)
const PLACEHOLDER_AVATAR = require('../assets/images/avatar.jpg'); // Create this or use a URL
const PLACEHOLDER_BURGER_CATEGORY = require('../assets/images/burger_category.jpg'); // Create this or use a URL
const PLACEHOLDER_PIZZA_CATEGORY = require('../assets/images/pizza_category.jpg'); // Create this or use a URL
const PLACEHOLDER_SALAD_CATEGORY = require('../assets/images/salad_category.jpg'); // Create this or use a URL
const PLACEHOLDER_CHICKEN_CATEGORY = require('../assets/images/chicken_category.jpg'); // Create this or use a URL
const PLACEHOLDER_PROMO_BURGER = require('../assets/images/promo_burger.jpg'); // Create this or use a URL
const PLACEHOLDER_RECIPE_CHICKEN = require('../assets/images/recipe_chicken.jpg'); // Create this or use a URL
const PLACEHOLDER_RECIPE_BURGER = require('../assets/images/recipe_burger.jpg'); // Create this or use a URL

// Sample Data
const categories = [
  { name: 'Burger', image: PLACEHOLDER_BURGER_CATEGORY },
  { name: 'Pizza', image: PLACEHOLDER_PIZZA_CATEGORY },
  { name: 'Salad', image: PLACEHOLDER_SALAD_CATEGORY },
  { name: 'Chicken', image: PLACEHOLDER_CHICKEN_CATEGORY },
  { name: 'Drinks', image: PLACEHOLDER_BURGER_CATEGORY }, // Example additional category
];

const popularRecipes = [
  {
    id: '1',
    name: 'Golden Spicy Chicken',
    description: 'Marinated with a blend of...',
    time: '30 Min',
    price: '$70.00',
    image: PLACEHOLDER_RECIPE_CHICKEN,
  },
  {
    id: '2',
    name: 'Cheese Burger Nagi',
    description: 'The Cheese Burger Nagi is...',
    time: '30 Min',
    price: '$60.00',
    image: PLACEHOLDER_RECIPE_BURGER,
  },
  {
    id: '3',
    name: 'Veggie Delight Pizza',
    description: 'Fresh vegetables and mozzarella...',
    time: '25 Min',
    price: '$55.00',
    image: PLACEHOLDER_PIZZA_CATEGORY, // Reusing for example
  },
];

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }} // Add padding for bottom nav
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View style={styles.userInfo}>
            <Image source={PLACEHOLDER_AVATAR} style={styles.avatar} />
            <View>
              <Text style={styles.greeting}>Hello Jenny</Text>
              <View style={styles.location}>
                <Feather name="map-pin" size={16} color="#4ade80" />
                <Text style={styles.locationText}>N.Y Bronx</Text>
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

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Fast Bites,{"\n"}Faster Orders.</Text>
            <Text style={styles.promoSubtitle}>Up to 3 times per day</Text>
            <TouchableOpacity style={styles.orderNowButton}>
              <Text style={styles.orderNowButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
          <Image source={PLACEHOLDER_PROMO_BURGER} style={styles.promoBurgerImage} />
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
                <Image source={category.image} style={styles.categoryImage} />
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
              <Image source={recipe.image} style={styles.recipeImage} />
              <TouchableOpacity style={styles.heartIcon}>
                <Feather name="heart" size={18} color="#ff5722" />
              </TouchableOpacity>
              <View style={styles.timeBadge}>
                <Feather name="clock" size={12} color="#fff" />
                <Text style={styles.timeText}>{recipe.time}</Text>
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeDescription}>{recipe.description}</Text>
                <View style={styles.recipeFooter}>
                  <Text style={styles.recipePrice}>{recipe.price}</Text>
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
        <TouchableOpacity style={styles.navItem}>
          <Feather name="home" size={24} color="#ff5722" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="search" size={24} color="#999" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="shopping-cart" size={24} color="#999" />
          <Text style={styles.navText}>My Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
    backgroundColor: '#f8f8f8',
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
    backgroundColor: '#fff',
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
    width: width * 0.6, // Adjust width as needed
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
  timeBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
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
    marginTop: 5, // Added margin to separate from description
  },
  recipePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4ade80', // Green color for price
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