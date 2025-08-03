
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const ZenModePage: React.FC = () => {
  const { user, toggleZenMode } = useAuth();
  const navigation = useNavigation<any>();

  const handleReturnToSpark = async () => {
    if (user?.zenMode.enabled) {
      await toggleZenMode();
    }
    // The main navigator will handle redirecting to the correct screen
  };

  return (
    <LinearGradient colors={['#F0F9FF', '#E0F2FE']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Zen Mode</Text>
          <Text style={styles.subtitle}>
            Taking a peaceful break. Your profile is paused.
          </Text>
          <View style={styles.affirmationBox}>
            <Text style={styles.affirmationText}>
              "{user?.zenMode.lastAffirmation || 'You are worthy of love and connection.'}"
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleReturnToSpark} style={styles.returnButton}>
            <LinearGradient colors={['#f472b6', '#2dd4bf']} style={styles.returnButtonGradient}>
                <Text style={styles.returnButtonText}>Return to Spark</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileFromZen')} style={styles.profileButton}>
            <Text style={styles.profileButtonText}>Go to Profile</Text>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 40,
  },
  affirmationBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  affirmationText: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  returnButton: {
    borderRadius: 50,
    marginBottom: 16,
    shadowColor: "#f472b6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  returnButtonGradient: {
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
  },
  returnButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileButton: {
    paddingVertical: 16,
  },
  profileButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ZenModePage;
