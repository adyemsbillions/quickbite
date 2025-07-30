import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
  restaurantId?: string;
}

const { width } = Dimensions.get('window');

// Placeholder images
const PLACEHOLDER_AVATAR = require('../assets/images/avatar.jpg');
const PLACEHOLDER_RECIPE_CHICKEN = require('../assets/images/recipe_chicken.jpg');

export default function Checkout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const webviewRef = useRef<WebView>(null);

  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [userLocation, setUserLocation] = useState<string>('');
  const [total, setTotal] = useState<string>('0.00');
  const [showWebView, setShowWebView] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const id = await AsyncStorage.getItem('id');
        console.log('Retrieved ID from AsyncStorage:', id);
        if (id) {
          const userResponse = await fetch(`https://quickbite.truszedproperties.com/quickbite/api/get_user.php?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          const userResult = await userResponse.json();
          console.log('Fetch User Data Response:', userResult);
          if (userResult.success) {
            const user = userResult.data;
            setName(user.name || '');
            setLocation(user.location || '');
            setDeliveryAddress(user.location || '');
          } else {
            console.error('Failed to fetch user data:', userResult.message);
            alert('Session expired. Please log in again.');
            router.replace('/login');
          }
        } else {
          console.warn('No user ID found. Redirecting to login.');
          router.replace('/login');
        }

        // Fetch cart data
        const cart = await AsyncStorage.getItem('cart');
        if (cart) {
          const items = JSON.parse(cart);
          setCartItems(items);
          const calculatedTotal = items
            .reduce((sum, item) => sum + parseFloat(item.price.replace('₦', '') || '0') * item.quantity, 0)
            .toFixed(2);
          setTotal(calculatedTotal);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred. Please try again.');
      }
    };
    fetchData();
  }, []);

  const handlePayment = async () => {
    if (!deliveryAddress || !phoneNumber || !userLocation) {
      alert('Please fill in all delivery information fields.');
      return;
    }

    const restaurantId = cartItems[0]?.restaurantId || '1';
    const payload = {
      deliveryAddress,
      phoneNumber,
      userLocation,
      cartItems,
      total,
      restaurantId,
    };

    try {
      console.log('Sending payload to process_checkout.php:', payload);
      const response = await fetch('https://quickbite.truszedproperties.com/quickbite/api/process_checkout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const rawResponse = await response.text();
      console.log('Raw response from process_checkout.php:', rawResponse);
      let result;
      try {
        result = JSON.parse(rawResponse);
      } catch (e) {
        console.error('JSON Parse Error:', e, 'Raw Response:', rawResponse);
        throw new Error('Invalid JSON response from server');
      }

      if (result.status === 'success' && result.authorization_url) {
        setShowWebView(true);
        webviewRef.current?.reload();
        webviewRef.current?.injectJavaScript(`window.location.href = "${result.authorization_url}";`);
      } else {
        console.error('Payment initialization failed:', result.error);
        alert(`Payment initialization failed: ${result.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error during payment initiation:', error);
      alert(`Error during payment: ${error.message || 'Please try again.'}`);
    }
  };

  const onNavigationStateChange = (navState: { url: string }) => {
    console.log('Navigation state changed:', navState.url);
    if (navState.url.includes('success')) {
      console.log('Payment successful');
      AsyncStorage.removeItem('cart').then(() => {
        setCartItems([]);
        setTotal('0.00');
        setShowWebView(false);
        alert('Payment successful! Your order has been placed.');
        router.push('/');
      }).catch((error) => {
        console.error('Error clearing cart:', error);
      });
    } else if (navState.url.includes('cancel')) {
      console.log('Payment cancelled');
      setShowWebView(false);
      alert('Payment cancelled.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.statusBarPlaceholder, { backgroundColor: '#f8f8f8', height: insets.top }]} />
      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
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
          <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/cart')}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Delivery Address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Your Location"
            value={userLocation}
            onChangeText={setUserLocation}
          />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
        </View>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>No items in cart.</Text>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={styles.summaryName}>
                {item.name} (x{item.quantity})
              </Text>
              <Text style={styles.summaryPrice}>
                ₦{(parseFloat(item.price.replace('₦', '') || '0') * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>{`₦${total}`}</Text>
        </View>
        {cartItems.length > 0 && (
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      {showWebView && (
        <View style={styles.webviewContainer}>
          <WebView
            ref={webviewRef}
            style={styles.webview}
            source={{ uri: 'about:blank' }}
            onNavigationStateChange={onNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
          <TouchableOpacity
            style={styles.closeWebViewButton}
            onPress={() => setShowWebView(false)}
          >
            <Text style={styles.closeWebViewText}>Close Payment</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <Feather name="home" size={24} color="#999" />
          <Text style={styles.navText}>Home</Text>
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
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  statusBarPlaceholder: { backgroundColor: '#f8f8f8' },
  scrollViewContent: { flex: 1 },
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
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ff5722',
  },
  greeting: { fontSize: 16, color: '#666', fontWeight: '500' },
  location: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationText: { fontSize: 14, color: '#333', fontWeight: '600', marginLeft: 5 },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  inputContainer: { paddingHorizontal: 20, marginBottom: 20 },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 10,
  },
  summaryName: { fontSize: 16, color: '#333' },
  summaryPrice: { fontSize: 16, color: '#4ade80' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
  },
  totalText: { fontSize: 18, fontWeight: '700', color: '#333' },
  totalAmount: { fontSize: 18, fontWeight: '700', color: '#e63946' },
  payButton: {
    backgroundColor: '#ff5722',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  payText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  webviewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  webview: { flex: 1, width: '100%' },
  closeWebViewButton: {
    backgroundColor: '#ff5722',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    margin: 20,
  },
  closeWebViewText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyCartText: { fontSize: 16, color: '#333', textAlign: 'center', marginTop: 20 },
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
  navItem: { alignItems: 'center', paddingVertical: 5 },
  navText: { fontSize: 12, color: '#999', marginTop: 4, fontWeight: '600' },
  navTextActive: { fontSize: 12, color: '#ff5722', marginTop: 4, fontWeight: '700' },
});