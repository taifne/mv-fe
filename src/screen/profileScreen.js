import React, { useState, useEffect } from 'react';
import {
  View,
  ToastAndroid,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Modal,
  FlatList,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faSignOut } from '@fortawesome/free-solid-svg-icons/faSignOut';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons/faDoorOpen';
import { ip } from '@env';

import { useAsyncStorage } from '../../AsyncStorageProvider';
import { I18nextProvider, useTranslation } from 'react-i18next';
import axios from 'axios';
const ProfileScreen = () => {
  const navigation = useNavigation();
  const { state, dispatch } = useAsyncStorage();
  const { t } = useTranslation();
  const [userData, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [avatarChange, setAvatarChange] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const [age, setAge] = useState(0);
  const [identifyNumber, setIdentifyNumber] = useState(0);
  const [sex, setSex] = useState('Male');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(
    'https://gravatar.com/avatar/d768c739b1b307dca9ed0deac4a3f4cd?s=400&d=robohash&r=x',
  );
  const [phone, setPhone] = useState('123-456-7890');
  let status = [];
  const [newuserName, setnewUserName] = useState('John Doe');
  const [newage, setnewAge] = useState(0);
  const [newidentifyNumber, setnewIdentifyNumber] = useState(0);
  const [newsex, setnewSex] = useState('Male');
  const [newemail, setnewEmail] = useState('');
  const [newavatar, setnewAvatar] = useState('');
  const [newphone, setnewPhone] = useState('123-456-7890');

  const avatarArr = [
    'https://robohash.org/6059893cf3d871d0bea8b2b6e05fb4d9?set=set2&bgset=&size=400x400',
    'https://robohash.org/127af1660c940e83c350b9b89d87305e?set=set2&bgset=&size=400x400',
    'https://robohash.org/4d08c752394f6ae138c52bb2e15ffa6e?set=set3&bgset=&size=400x400',
    'https://robohash.org/0f5a8290d2d048465e6e9f4f5fca1891?set=set3&bgset=&size=400x400',
    'https://gravatar.com/avatar/d768c739b1b307dca9ed0deac4a3f4cd?s=400&d=robohash&r=x',
    'https://robohash.org/d768c739b1b307dca9ed0deac4a3f4cd?set=set4&bgset=&size=400x400',
    'https://gravatar.com/avatar/df3102b09a8538b610c5f5eecff46136?s=400&d=robohash&r=x',
    'https://robohash.org/24ee31980b8d9d955a31a48001ba873e?set=set4&bgset=&size=400x400',
  ];
  useEffect(() => {
    const retrieveUserData = async () => {
      try {
        const Data = await AsyncStorage.getItem('userData');
        if (Data !== null) {
          console.log('getted new data uer');
          const parsedUserData = JSON.parse(Data);
          setUser(parsedUserData);
          // You can use the user data as needed
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Error retrieving user data: ', error);
      }
    };

    retrieveUserData();
  }, []);
  useEffect(() => {
    setUserName(userData.username);
    setPhone(userData.phone);
    setIdentifyNumber(userData.identifyNumber);
    setEmail(userData.email);
    setAvatar(userData.avatar);
    setnewAvatar(userData.avatar);
    setSex(userData.gender);
    console.log(userData);
  }, [userData]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleTogglePhone = () => {
    setShowPhone(!showPhone);
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    console.log('');
  };
  async function updateUserInformation() {
    try {
      await axios
        .patch(`172.27.80.1:9000/api/v1/users/advanced/${userData.id}`, {
          username: newuserName,
          phone: newphone,
          gender: newsex,
          avatar: newavatar,
        })
        .then(async data => {
          dispatch({ type: 'UPDATE_USER_DATA', payload: data.data.data.user });
          setUser(data.data.data.user);

          await AsyncStorage.setItem(
            'userData',
            JSON.stringify(data.data.data.user),
          )
            .then((newdata) => {
              console.log('updated userdata :' + data.data.data.user.avatar);
            })
            .catch(error => {
              console.error('Error saving user data: ', error);
            });
        });
    } catch (error) {
      throw error;
    }
  }

  const handleSaveProfile = () => {
    updateUserInformation();

    setIsEditMode(false);
  };
  const openChoseAvatar = () => {
    setAvatarChange(!avatarChange);
  };
  const calculateAge = birthday => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const renderAvatarItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 2,
          borderRadius: 25,
          backgroundColor: '#2f94aa',
          margin: 10,
        }}
        onPress={() => setnewAvatar(item)}>
        <Image
          source={{ uri: item }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
      </TouchableOpacity>
    );
  };
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthday(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View
      style={{
        backgroundColor: 'f0f8ff',

        height: 800,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>

      <View style={{ width: '100%', alignItems: 'center', backgroundColor: "#96C9F4", borderBottomLeftRadius: 35, borderBottomRightRadius: 35, padding: 3, opacity: 0.6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
          <TouchableOpacity onPress={() => { navigation.navigate('Login'); }}
            style={{
              width: 100, flexDirection: 'row',
              justifyContent: 'center',
              alignItems: "center",
              height: 40, borderRadius: 10,
              backgroundColor: "white",
              borderWidth: 1,         // Width of the border
              borderColor: '#000',    // Color of the border
              borderRadius: 10,       // Optional: Rounding the corners
              padding: 5
            }}>
            <Text style={{ fontWeight: "bold", color: 'black' }}>
              {t('logout')}
              <FontAwesomeIcon style={{ color: 'black' }} icon={faDoorOpen} />
            </Text>
          </TouchableOpacity>

        </View>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',

          textAlign: "center"
        }}>{userData.username ?? "Jack"}</Text>
        <TouchableOpacity
          style={{
            width: 130,
            height: 130,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 20
          }}
          onPress={() => openChoseAvatar()}>
          {avatar && (
            <Image
              source={{ uri: isEditMode ? newavatar : avatar }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />

          )}
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          width: '90%',
          padding: 20,

          borderWidth: 1,         // Width of the border
          borderColor: '#000',    // Color of the border
          borderRadius: 20,
          margin: 20,
        }}>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 10,
            borderBottomWidth: 1,
            padding: 3,
            borderBottomColor: 'black'
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 19, color: 'black', textTransform: 'uppercase' }}>
            {t('username')} :{' '}
          </Text>
          {isEditMode ? (
            <TextInput
              editable
              multiline
              numberOfLines={1}
              key={1}
              maxLength={40}
              onChangeText={text => setnewUserName(text)}
              value={newuserName}
              style={{ fontWeight: 'bold', fontSize: 19, color: 'black' }}
            />
          ) : (
            <Text style={{ fontWeight: '400', fontSize: 19, color: 'black' }}>
              {userName}
            </Text>
          )}
        </View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 10,
            borderBottomWidth: 1,
            padding: 3,
            borderBottomColor: 'black'
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 19, color: 'black', textTransform: 'uppercase' }}>
            {t('phonenumber')} :
          </Text>
          {isEditMode ? (
            <TextInput
              editable
              multiline
              key={2}
              numberOfLines={1}
              maxLength={40}
              onChangeText={text => setnewPhone(text)}
              value={newphone}
              style={{ fontWeight: 'bold', fontSize: 19, color: 'black' }}
            />
          ) : (
            <Text style={{ fontWeight: '400', fontSize: 19, color: 'black' }}>
              {phone}
            </Text>
          )}
        </View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 10,
            borderBottomWidth: 1,
            padding: 3,
            borderBottomColor: 'black'
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 19, color: 'black', textTransform: 'uppercase' }}>

            living_city :
          </Text>
          {isEditMode ? (
            <TextInput
              value={newsex}
              key={3}
              onChangeText={text => setnewSex(text)}
              placeholder="Enter text here"
              style={{ fontWeight: 'bold', fontSize: 19, color: 'black' }}
            />
          ) : (
            <Text style={{ fontWeight: '400', fontSize: 19, color: 'black', width: '100%' }}>
              {userData.location}
            </Text>
          )}
        </View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 10,
            borderBottomWidth: 1,
            padding: 3,
            borderBottomColor: 'black'
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 19, color: 'black', textTransform: 'uppercase' }}>

            Package :
          </Text>
          {isEditMode ? (
            <TextInput
              value={newsex}
              key={3}
              onChangeText={text => setnewSex(text)}
              placeholder="Enter text here"
              style={{ fontWeight: 'bold', fontSize: 19, color: 'black' }}
            />
          ) : (
            <Text style={{ fontWeight: '400', fontSize: 19, color: 'black', width: '100%' }}>
              Premium
            </Text>
          )}
        </View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 10,
            borderBottomWidth: 1,
            padding: 3,
            borderBottomColor: 'black'
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 19, color: 'black', textTransform: 'uppercase' }}>

            Role :
          </Text>
          {isEditMode ? (
            <TextInput
              value={newsex}
              key={3}
              onChangeText={text => setnewSex(text)}
              placeholder="Enter text here"
              style={{ fontWeight: 'bold', fontSize: 19, color: 'black' }}
            />
          ) : (
            <Text style={{ fontWeight: '400', fontSize: 19, color: 'black', width: '100%' }}>
              User
            </Text>
          )}
        </View>
        <View
          style={{
            width: '70%',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 10,
            justifyContent: 'space-around',
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 19, color: 'black', textTransform: 'uppercase' }}>
            {t('phone')}:
          </Text>
          {showPhone ? (
            isEditMode ? (
              <TextInput
                key={4}
                style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}
                value={phone}
                onChangeText={setPhone}
              />
            ) : (
              <Text style={{ fontWeight: '400', fontSize: 12, color: 'black' }}>
                {phone}
              </Text>
            )
          ) : (
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>
              ********
            </Text>
          )}
          <View>
            <Switch
              style={{
                backgroundColor: '#2f94aa',
                borderRadius: 5,
                color: '#2f94aa',
                margin: 10,
              }}
              value={showPhone}
              onValueChange={handleTogglePhone}
            />
          </View>
        </View>

      </View>

      {isEditMode && (
        <Modal visible={avatarChange} animationType="slide">
          <View
            style={{
              backgroundColor: '#2a2f30',
              flexDirection: 'column',
              height: 700,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {newavatar && (
              <Image
                source={{ uri: newavatar }}
                style={{ width: 100, height: 100, margin: 10, borderRadius: 50 }}
              />
            )}
            <View
              style={{
                width: '90%',
                backgroundColor: '#3f4445',
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderRadius: 10,
                margin: 10,
              }}>
              {avatarArr &&
                avatarArr.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      padding: 10,
                      width: 70,
                      height: 70,
                      borderWidth: 2,
                      borderRadius: 40,
                      backgroundColor: '#2f94aa',
                      margin: 10,
                    }}
                    onPress={() => setnewAvatar(item)}>
                    <Image
                      source={{ uri: item }}
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                  </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
              style={{
                justifyContent: 'space-between',
                backgroundColor: '#2f94aa',
                margin: 10,
                padding: 10,
                width: 100,
                height: 40,
                flexDirection: 'row',
              }}
              onPress={() => {
                setAvatarChange(false);
              }}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>{t('close')}</Text>
              <FontAwesomeIcon style={{ color: 'white' }} icon={faSignOut} />
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {isEditMode ? (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#2f94aa',
              borderRadius: 10,
              margin: 10,
              padding: 10,
              width: 100,
              height: 40,
              flexDirection: 'row',
            }}
            onPress={handleSaveProfile}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>{t('save')}</Text>
            <FontAwesomeIcon style={{ color: 'white' }} icon={faSave} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'space-between',
              backgroundColor: '#2f94aa',
              margin: 10,
              borderRadius: 10,
              padding: 10,
              width: 100,
              height: 40,
              flexDirection: 'row',
            }}
            onPress={() => {
              setIsEditMode(false);
            }}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>{t('lose')}</Text>
            <FontAwesomeIcon style={{ color: 'white' }} icon={faSignOut} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleEditProfile}
          style={{
            justifyContent: 'space-between',
            backgroundColor: '#2f94aa',
            margin: 10,
            padding: 10,
            width: 100,
            height: 40,
            flexDirection: 'row',
          }}>
          <Text style={{ fontWeight: 'bold', color: 'white' }}>{t('edit')}</Text>
          <FontAwesomeIcon style={{ color: 'white' }} icon={faEdit} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    width: 200,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
