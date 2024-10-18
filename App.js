import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import * as Font from 'expo-font';
import fonts from './fonts';
import { supabase } from "./lib/supabase";

// screens
import Home from './mainTab/Home';
import InfoScreen from './mainTab/InfoScreen';
import ResultScreen from './mainTab/ResultScreen';
import ProfileScreen from './mainTab/Profile/ProfileScreen';
import EyeCareFAQScreen from './mainTab/EyeCareFAQScreen';
import AstigmatismTestScreen from './mainTab/EyeTests/AstigmatismTestScreen';
import VisualAcuityTestScreen from './mainTab/EyeTests/VisualAcuityTestScreen';
import SettingsScreen from './mainTab/Settings/SettingsScreen';
import PrivacyPolicyScreen from './mainTab/Settings/PrivacyPolicyScreen';
import ChangePassword from './mainTab/Settings/ChangePasswordScreen';

import Welcome from './welcomeTab/Welcome';
import Signup from './welcomeTab/Signup';
import Terms from './welcomeTab/Terms';
import Login from './welcomeTab/Login';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const getFonts = () => Font.loadAsync({
  'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
  'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
  'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
  'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
});


function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="VisualAcuityTestScreen" component={VisualAcuityTestScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AstigmatismTestScreen" component={AstigmatismTestScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="InfoScreen" component={InfoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <Tab.Navigator
        initialRouteName="HomeStack"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'HomeStack') {
              iconName = 'home';
            } else if (route.name === 'Profile') {
              iconName = 'account';
            } else if (route.name === 'Favorites') {
              iconName = 'heart';
            } else if (route.name === 'Settings') {
              iconName = 'cog';
            }
            return (
              <View style={styles.iconContainer}>
                <Icon name={iconName} size={size} color={color} />
              </View>
            );
          },
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: [styles.bottomNavigation, keyboardVisible && { display: 'none' }],
          headerShown: false,
        })}
      >
        <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Favorites" component={EyeCareFAQScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen}>
        </Tab.Screen>
      </Tab.Navigator>
    </KeyboardAvoidingView>
  );
}

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  //For the fonts
  useEffect(() => {
    async function loadFonts() {
      await getFonts();
      setFontsLoaded(true);
    }
    loadFonts();
    }, []);

  if (!fontsLoaded) {
    return;
  }

  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabel: {
    marginBottom: 10,
  },
});

export default App;