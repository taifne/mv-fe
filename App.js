/* eslint-disable*/
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import AppContext, { AppContextProvider } from './src/utils/AppContext';

import HomeScreen from './src/screen/HomeScreen';
import HotFilm from './src/screen/playlistsScreen';
import SearchScreen from './src/screen/searchScreen';
import MovieDetailScreen from './src/screen/filmInforScreen';
import Profile from './src/screen/profileScreen';
import PaymentSceen from './src/screen/paymentScreen';
import LoginScreen from './src/screen/loginScreen';
import RegisterScreen from './src/screen/registerScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { faHomeUser } from '@fortawesome/free-solid-svg-icons/faHomeUser';
import { faHotTub } from '@fortawesome/free-solid-svg-icons/faHotTub';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import i18n from './src/utils/i18n';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { I18nextProvider, useTranslation } from 'react-i18next';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AsyncStorageProvider } from './AsyncStorageProvider';

import { setAttributes } from 'video.js/dist/types/utils/dom';
import AuthContext, { AuthContextProvider } from './src/store/auth-context';

const Tab = createMaterialBottomTabNavigator();

const Stack = createNativeStackNavigator();

const AppChild = () => {
  const { t, i18n } = useTranslation();
  const appContext = useContext(AppContext);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  const OnHideSnackBar = () =>
    appContext.callSnackBar({ type: null, message: null });

  useEffect(() => {
    setIsSnackbarVisible(appContext.snackBarMessage.message != null);
  }, [appContext.snackBarMessage]);

  useEffect(() => {
    appContext.callSnackBar({ type: 'welcome', message: 'Have a nice day!' });
  }, []);

  function HomeStack() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'red',
          style: {
            backgroundColor: '#2f94aa',
          },
          labelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarLabel: <Text style={{ color: '#2f94aa' }}>{t('home')}</Text>,
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon style={{ color: '#2f94aa' }} icon={faHomeUser} /> // Use the icon instead of text
            ),
          }}
        />
        <Tab.Screen
          name="Hot Movies"
          component={HotFilm}
          options={{
            tabBarLabel: (
              <Text style={{ color: '#2f94aa' }}>{t('hotmovie')}</Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon style={{ color: '#2f94aa' }} icon={faHotTub} /> // Use the icon instead of text
            ),
            tabBarVisible: false,
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: <Text style={{ color: '#2f94aa' }}>{t('search')}</Text>,
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon style={{ color: '#2f94aa' }} icon={faSearch} /> // Use the icon instead of text
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: <Text style={{ color: '#2f94aa' }}>{t('profile')}</Text>,
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon style={{ color: '#2f94aa' }} icon={faUserCircle} /> // Use the icon instead of text
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentSceen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MovieDetail"
          component={MovieDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AsyncStorageProvider>
      <AuthContextProvider>
        <AppContextProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <I18nextProvider i18n={i18n}>
                <AppChild />
              </I18nextProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </AppContextProvider>
      </AuthContextProvider>
    </AsyncStorageProvider>
  );
};

export default App;
