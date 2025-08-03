
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './src/contexts/AuthContext';
import { useAuth } from './src/hooks/useAuth';
import { FilterProvider } from './src/contexts/FilterContext';

// Import Screens
import HomePage from './src/pages/HomePage';
import LoginPage from './src/pages/LoginPage';
import RegisterPage from './src/pages/RegisterPage';
import InterestsPage from './src/pages/onboarding/InterestsPage';
import PhotosPage from './src/pages/onboarding/PhotosPage';
import SwipingPage from './src/pages/SwipingPage';
import ExplorePage from './src/pages/ExplorePage';
import MatchesPage from './src/pages/MatchesPage';
import ChatsListPage from './src/pages/ChatsListPage';
import ProfilePage from './src/pages/ProfilePage';
import ChatPage from './src/pages/ChatPage';
import FiltersPage from './src/pages/FiltersPage';
import ZenModePage from './src/pages/ZenModePage';
import PaymentPage from './src/pages/PaymentPage';

// Import custom tab bar UI
import BottomNavbar from './src/components/BottomNavbar';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();
const OnboardingStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const OnboardingNavigator = () => (
  <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
    <OnboardingStack.Screen name="Interests" component={InterestsPage} />
    <OnboardingStack.Screen name="Photos" component={PhotosPage} />
  </OnboardingStack.Navigator>
);

const MainAppTabs = () => (
  <Tab.Navigator tabBar={(props: BottomTabBarProps) => <BottomNavbar {...props} />} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Discover" component={SwipingPage} />
    <Tab.Screen name="Explore" component={ExplorePage} />
    <Tab.Screen name="Matches" component={MatchesPage} />
    <Tab.Screen name="Chats" component={ChatsListPage} />
    <Tab.Screen name="Profile" component={ProfilePage} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Spark</Text>
        <ActivityIndicator size="large" color="#F06292" />
      </View>
    );
  }

  // If user is logged in, decide which main screen to show
  if (user) {
    if (!user.onboardingCompleted) {
       return <OnboardingNavigator />;
    }
    if (user.zenMode.enabled) {
      return (
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
           <AppStack.Screen name="ZenMode" component={ZenModePage} />
           <AppStack.Screen name="ProfileFromZen" component={ProfilePage} />
        </AppStack.Navigator>
      );
    }
    // Fully authenticated and onboarded user
    return (
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="Main" component={MainAppTabs} options={{ animation: 'none' }} />
        <AppStack.Screen name="Chat" component={ChatPage} />
        <AppStack.Screen name="Filters" component={FiltersPage} options={{ presentation: 'modal' }}/>
        <AppStack.Screen name="Payment" component={PaymentPage} options={{ presentation: 'modal' }} />
      </AppStack.Navigator>
    );
  }

  // Unauthenticated user
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Home" component={HomePage} />
      <AuthStack.Screen name="Login" component={LoginPage} />
      <AuthStack.Screen name="Register" component={RegisterPage} />
    </AuthStack.Navigator>
  );
};


export default function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </FilterProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf2f8',
  },
  loadingText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#F06292',
    marginBottom: 20,
  }
});
