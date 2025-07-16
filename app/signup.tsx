import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignUp = () => {
    // Implement your sign-up logic here
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Sign Up attempt with:', { email, password });
    // Example: router.replace('/home'); // Navigate to main app screen after successful signup
  };

  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.container}
        resizeMode="cover"
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            {/* Sign Up Card */}
            <View style={styles.signupCard}>
              <Text style={styles.cardTitle}>Join Us!</Text>
              <Text style={styles.cardSubtitle}>Create your account</Text>

              <View style={styles.inputGroup}>
                <Feather name="mail" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputGroup}>
                <Feather name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <View style={styles.inputGroup}>
                <Feather name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSignUp}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryButtonText}>Sign Up</Text>
                <Feather name="user-plus" size={20} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>
            </View>

            {/* Social Login Grid (Optional, can be removed if not needed on signup) */}
            <View style={styles.socialSection}>
              <Text style={styles.orText}>Or sign up with</Text>
              <View style={styles.socialGrid}>
                <TouchableOpacity style={styles.socialCard}>
                  <Feather name="facebook" size={28} color="#3b5998" />
                  <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialCard}>
                  <Feather name="google" size={28} color="#db4437" />
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialCard}>
                  <Feather name="twitter" size={28} color="#1da1f2" />
                  <Text style={styles.socialText}>Twitter</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom CTA */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginLink}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    resizeMode: 'cover',
    top: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    paddingVertical: 60,
  },

  // Sign Up Card
  signupCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 25,
    padding: 30,
    marginHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: '100%',
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#ff5722',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 5,
  },

  // Social Section (copied from HomeScreen)
  socialSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  orText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '500',
  },
  socialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  socialCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 80) / 3,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },

  // Bottom Section (copied from HomeScreen)
  bottomSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loginLink: {
    color: '#4ade80',
    fontWeight: '700',
  },
});