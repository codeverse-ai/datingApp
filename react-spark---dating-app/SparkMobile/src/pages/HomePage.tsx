
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type HomeNavigationProp = StackNavigationProp<RootStackParamList>;

const HomePage: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();

  return (
    <LinearGradient
      colors={['#FFF1F2', '#F0F9FF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Spark</Text>
          <Text style={styles.subtitle}>
            Find your flame. Ignite a connection that lasts.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.createAccountButton}
          >
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#F06292',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  createAccountButton: {
    backgroundColor: '#F06292',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#F06292",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  createAccountButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#4B5563',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomePage;
