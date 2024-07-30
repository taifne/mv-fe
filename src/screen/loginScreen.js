import React, { useState, useContext } from 'react';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { newip, ip } from '@env';
import i18n from '../utils/i18n';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  ImageBackground,
  Text,
  Button,
  ToastAndroid,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import CustomBox from 'react-native-customized-box';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { showMessage, hideMessage } from 'react-native-flash-message';
import Toast from 'react-native-toast-message';
import { useAsyncStorage } from '../../AsyncStorageProvider';

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginScreen = () => {
  const { state, dispatch } = useAsyncStorage();
  const [getEmailId, setEmailId] = useState('');
  const [getPassword, setPassword] = useState('');
  const [getError, setError] = useState(false);
  const [throwError, setThrowError] = useState('');
  const [getDisabled, setDisabled] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { t } = useTranslation();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const handleLogin = async () => {
    try {
      console.log(`http://172.27.80.1:9000/api/v1/users/signin`);
      const response = await axios.post(
        `http://172.27.80.1:9000/api/v1/users/signin`,
        {
          account: getEmailId,
          password: getPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data) {
        // Assuming you have obtained user data after login
        const userData = response.data.data;

        dispatch({ type: 'UPDATE_USER_DATA', payload: userData });
        // Save the user data to AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(userData))
          .then(() => {
            console.log('User data saved successfully');
            setEmailId('');
            setPassword('');
            setPasswordError('');
            setEmailError('');

            ToastAndroid.showWithGravityAndOffset(
              t('loginsuccess'),
              ToastAndroid.LONG,
              0,
              250,
              500,
            );
            navigation.navigate('Home', {
              showSuccessMessage: true,
              dsadsa: 'dsadsa',
            });
          })
          .catch(error => {
            console.error('Error saving user data: ', error);
          });
      } else {
      }
    } catch (error) {
      setShowErrorModal(true);
    }
  };
  const moveToRegister = () => {
    // Perform login logic here

    // Navigate to the home screen
    navigation.navigate('Register');
  };

  const handleEmailChange = value => {
    setEmailId(value);
    setError(false);
    setEmailError('');

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setEmailError(t('Please enter a valid email address.'));
    }
    // ... rest of the function
  };
  const handlePasswordChange = value => {
    setPassword(value);
    setError(false);
    setPasswordError('');
    // Validate password complexity
    if (
      value.length < 8 ||
      !/[A-Z]/.test(value) ||
      !/[a-z]/.test(value) ||
      !/[!@#$%^&*?.]/.test(value)
    ) {
      setPasswordError(
        t('Password must be at least 8 characters long,\n Contain at least one uppercase letter,\n One special character (!@#$%^&*).')
      );
    } else {
      setPasswordError(
        <Text style={{ color: 'green', marginTop: '10' }}>
          Password is valid.
          <FontAwesomeIcon
            style={{ color: 'green' }}
            icon={faCheckCircle}></FontAwesomeIcon>
        </Text>,
      );
    }
  };
  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <Image
            style={styles.loginImage}
            source={require('../assets/login.png')}
          />
          <Image
            style={styles.loginImage}
            source={require('../assets/login.png')}
          />
          <Image
            style={styles.loginImage}
            source={require('../assets/login.png')}
          />
        </View>

        {getError ? (
          <View style={styles.errorCard}>
            <TouchableOpacity
              style={styles.cross}
              onPress={() => {
                setError(false);
              }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
            </TouchableOpacity>
            <Text style={styles.errorCardText}>{throwError}</Text>
          </View>
        ) : null}
        <CustomBox
          style={{ backgroundColor: 'white' }}
          tabIndex={1}
          placeholder={'Email'}
          boxColor={'#2f94aa'}
          focusColor={'#e65c40'}
          keyboardType="email-address"
          boxStyle={{ borderRadius: 5, borderWidth: 1 }}
          inputStyle={{
            fontWeight: 'bold',
            color: 'white',
            paddingLeft: 20,
            borderRadius: 40,
          }}
          labelConfig={{
            text: t('email'),
            style: {
              color: 'white',
              fontWeight: 'bold',
            },
          }}
          requiredConfig={{
            text: <Text style={{ color: 'black' }}>{emailError}</Text>,
          }}
          values={getEmailId}
          onChangeText={value => {
            handleEmailChange(value);
          }}
        />
        <CustomBox
          tabIndex={2}
          placeholderTextColor="red"
          placeholder={'Password'}
          toggle={true}
          boxColor={'#2f94aa'}
          focusColor={'#e65c40'}
          boxStyle={{ borderRadius: 5, borderWidth: 1 }}
          inputStyle={{
            fontWeight: 'bold',
            color: 'white',
            paddingLeft: 20,
            borderRadius: 40,
          }}
          labelConfig={{
            text: t('password'),
            style: {
              color: 'white',
              fontWeight: 'bold',
            },
          }}
          requiredConfig={{
            text: <Text style={{ color: 'red' }}>{passwordError}</Text>,
          }}
          values={getPassword}
          onChangeText={value => {
            handlePasswordChange(value);
          }}
        />
        {/* ForgotPassword */}
        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => {
            navigation.navigate('ForgotPassword');
          }}>
          <Text style={styles.forgotBtnText}>{t('ForgotPassword')}</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={getDisabled}>
          <Text style={styles.loginBtnText}>{t('login')}</Text>
          {loading && loading ? (
            <ActivityIndicator style={styles.indicator} color={'white'} />
          ) : null}
        </TouchableOpacity>
        <Modal isVisible={showErrorModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={require('../assets/logginfail.png')}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{t('Login Failed')}</Text>
              <Text style={styles.modalText}>
                {t('Incorrect username or password. Please try again.')}
              </Text>
              <Button
                title={t("Try Again")}
                onPress={() => setShowErrorModal(false)}
              />
            </View>
          </View>
        </Modal>
        {/* Register Button */}
        <View style={styles.createAccount}>
          <Text style={styles.createAccountText}>
            {t(`dont'thaveanaccount`)}
          </Text>
          <TouchableOpacity style={styles.registerBtn} onPress={moveToRegister}>
            <Text style={styles.registerBtnText}>{t('registerforfree')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
    // Other styling properties
  },
  container: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 100,
    padding: 30,
    paddingTop: 50,
    borderRadius: 10,
    backgroundColor: '#3f4445',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorCard: {
    width: 300,
    height: 50,
    backgroundColor: '#de3138',
    justifyContent: 'center',
    paddingLeft: 15,
    borderRadius: 40,
  },
  errorCardText: {
    paddingLeft: 15,
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    position: 'absolute',
  },
  cross: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    left: 250,
    position: 'relative',
  },
  loginImage: {
    marginTop: 20,
    width: 70,
    height: 70,
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#0e0e21',
    textAlign: 'center',
    marginTop: 20,
    textTransform: 'uppercase',
  },
  loginBtn: {
    marginTop: 10,
    backgroundColor: '#2f94aa',
    width: 300,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loginBtnText: {
    color: 'white',
    fontSize: 22,
  },
  forgotBtn: {
    marginTop: -20,
    width: 280,
    height: 20,
    justifyContent: 'center',
  },
  forgotBtnText: {
    color: '#c29700',
    fontSize: 12,
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
  },
  createAccount: {
    marginTop: 10,
    width: 280,
    height: 20,
    flexDirection: 'row',
  },
  createAccountText: {
    color: 'white',
  },
  registerBtn: {},
  registerBtnText: {
    color: '#e65c40',
    textDecorationLine: 'underline',
  },
  myLogo: {
    width: 100,
    height: 70,
    borderRadius: 40,
    left: 150,
    top: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
export default LoginScreen;
