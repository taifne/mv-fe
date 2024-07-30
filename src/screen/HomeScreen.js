import { React, useRef, useEffect, useState, useCallback } from 'react';
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
  ToastAndroid,
  ImageBackground,
  Button,
  Alert,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { height } from '@fortawesome/free-solid-svg-icons/faMugSaucer';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { PROXY_CLOUD, PROXY_TUE_LOCAL } from '@env';
import { ip, newip } from '@env';
import { faDog } from '@fortawesome/free-solid-svg-icons/faDog';
import i18n from '../utils/i18n';
import Star from './Star';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserLock } from '@fortawesome/free-solid-svg-icons/faUserLock';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { useRoute } from '@react-navigation/native';
import { useAsyncStorage } from '../../AsyncStorageProvider';
const HomeScreen = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [datas, setData] = useState([]);
  const { state, dispatch } = useAsyncStorage();
  const [userData, setUser] = useState({});
  const [flagSrc, setFlagSrc] = useState(require('../assets/engflag.png'));
  const { t } = useTranslation();
  useEffect(() => {
    showMessage({
      message: 'Login successful',
      type: 'success',
    });
  }, []);
  useEffect(() => {
    axios
      .get(`http://172.27.80.1:9000/api/v1/info`)
      .then(function (response) {
        setData(response.data.data);
      })
      .catch(function (error) {
        console.log('homescreen' + error);
      });
    const retrieveUserData = async () => {
      try {
        const Data = await AsyncStorage.getItem('userData');
        if (Data !== null) {
          const parsedUserData = JSON.parse(Data);
          setUser(parsedUserData);
          console.log('Retrieved user data: ', Data);
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
  // Retrieve the user data from AsyncStorage
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: (currentIndex + 1) % 3,
        });
        setCurrentIndex(prevIndex => (prevIndex + 1) % 3);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const bannerData = [
    { id: 1, image: require('../imagePoster/local/banner1.png') },
    { id: 2, image: require('../imagePoster/local/banner2.png') },
    { id: 3, image: require('../imagePoster/local/banner3.png') },
    // Add more banner items as needed
  ];

  const handleMoviePress = movie => {
    navigation.navigate('MovieDetail', { movie });
  };
  const handleMPaymentPress = movie => {
    setModalVisible(!modalVisible);
    navigation.navigate('Payment');
  };
  const renderBannerItem = ({ item }) => {
    return (
      <ImageBackground
        key={item._id}
        source={{
          uri:
            'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
            item.filmInfo.backdrop_path,
        }}
        style={{
          width: Dimensions.get('window').width,
          height: 400,
          margin: 10,
        }}>
        <View
          key={item._id}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            width: '100%',
            height: '100%',
            padding: 10,
          }}>
          <TouchableOpacity
            key={item._id}
            style={{
              backgroundColor: '#2f94aa',
              width: 200,
              height: 50,
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 24,
                margin: 5,
                textTransform: 'uppercase',
                fontWeight: '700',
              }}>
              Watch Now
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  };
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const changeLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLanguage);
    setFlagSrc(
      newLanguage === 'en'
        ? require('../assets/engflag.png')
        : require('../assets/vnflag.png'),
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: 100,
          margin: 10,
          backgroundColor: '#3f4445',
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            padding: 10,
            margin: 10,
            width: '35%',
          }}>
          <Text style={{ color: 'white', fontSize: 20 }}>{t('welcome')}</Text>
          <Text style={{ color: '#2f94aa', fontSize: 25, fontWeight: 'bold' }}>
            CineVerse{' '}
          </Text>
          <Text style={{ color: '#2f94aa', fontSize: 25, fontWeight: 'bold' }}>
            {' '}
            Cinema
          </Text>
        </View>
        <Image
          source={require('../imagePoster/local/logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity
          onPress={changeLanguage}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
            width: '30%',
          }}>
          <Image
            source={
              i18n.language === 'en'
                ? require('../assets/engflag.png')
                : require('../assets/vnflag.png')
            }
            style={{ width: 50, height: 50, borderRadius: 8 }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />

      <View
        style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {datas.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={datas}
            renderItem={renderBannerItem}
            style={{ width: '95%', height: 400, marginBottom: 10 }}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: 1000,
              offset: Dimensions.get('window').width * index,
              index,
            })}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              });
            }}
          />
        ) : (
          <Text>loadding</Text>
        )}
        <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />
      </View>
      <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>{t('popular')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {datas.length > 0 ? (
            datas.sort((a, b) => b.filmInfo.popularity - a.filmInfo.popularity).slice(0, Math.min(datas.length, 10)).map(movie => (
              <TouchableOpacity
                key={movie._id}
                style={styles.movieContainer}
                onPress={() => handleMoviePress(movie)}>
                <ImageBackground
                  source={{
                    uri:
                      'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                      movie.filmInfo.backdrop_path,
                  }}
                  style={{
                    width: 180,
                    height: 220,
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}>
                  {movie.primaryTag && (
                    <View
                      style={{
                        width: '100%',
                        height: 40,
                        backgroundColor: 'red',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          width: '100%',
                          textTransform: 'uppercase',
                          overflow: 'hidden',
                          fontWeight: 'bold',
                          color: 'black',
                        }}>
                        {movie.primaryTag ? t('primium') : 'no '}
                        <FontAwesomeIcon
                          style={{
                            fontSize: 17,
                            width: '100%',
                            textTransform: 'uppercase',
                            overflow: 'hidden',
                            fontWeight: 'bold',
                            color: 'black',
                          }}
                          icon={faUserLock}
                        />{' '}
                      </Text>
                    </View>
                  )}
                </ImageBackground>
                <View key={movie._id} style={styles.movieDetails}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={styles.title}>
                      {movie.filmInfo.title
                        ? movie.filmInfo.title
                        : movie.filmInfo.name}{' '}
                      {t('rate')}
                    </Text>
                    <Text style={styles.genre}>
                      {movie.filmInfo.popularity}{' '}
                      <FontAwesomeIcon
                        style={{ color: 'white', fontSize: 20, margin: 10 }}
                        icon={faArrowUp}
                      />
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>loadding</Text>
          )}
        </ScrollView>

        {/* Add more sections as needed */}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>{t('mostview')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {datas.length > 0 ? (
            datas.sort((a, b) => b.filmInfo.vote_count - a.filmInfo.vote_count).slice(0, Math.min(datas.length, 10)).map(movie => (
              <TouchableOpacity
                key={movie._id}
                style={styles.movieContainer}
                onPress={() => handleMoviePress(movie)}>
                <ImageBackground
                  source={{
                    uri:
                      'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                      movie.filmInfo.backdrop_path,
                  }}
                  style={{
                    width: 180,
                    height: 220,
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}>
                  {movie.primaryTag && (
                    <View
                      style={{
                        width: '100%',
                        height: 40,
                        backgroundColor: 'red',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          width: '100%',
                          textTransform: 'uppercase',
                          overflow: 'hidden',
                          fontWeight: 'bold',
                          color: 'black',
                        }}>
                        {movie.primaryTag ? t('primium') : 'no '}
                        <FontAwesomeIcon
                          style={{
                            fontSize: 17,
                            width: '100%',
                            textTransform: 'uppercase',
                            overflow: 'hidden',
                            fontWeight: 'bold',
                            color: 'black',
                          }}
                          icon={faUserLock}
                        />{' '}
                      </Text>
                    </View>
                  )}
                </ImageBackground>
                <View key={movie._id} style={styles.movieDetails}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={styles.title}>
                      {movie.filmInfo.title
                        ? movie.filmInfo.title
                        : movie.filmInfo.name}{' '}
                      {t('rate')}
                    </Text>
                    <Text style={styles.genre}>
                      {movie.filmInfo.popularity}{' '}
                      <FontAwesomeIcon
                        style={{ color: 'white', fontSize: 20, margin: 10 }}
                        icon={faEye}
                      />
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>loadding</Text>
          )}
        </ScrollView>

        {/* Add more sections as needed */}
      </View>
      <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>{t('tvshow')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {datas.length > 0 ? (
            datas.filter(x => x.filmType === 'TV').map(movie => (
              <TouchableOpacity
                key={movie._id}
                style={styles.movieContainer}
                onPress={() => handleMoviePress(movie)}>
                <ImageBackground
                  source={{
                    uri:
                      'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                      movie.filmInfo.backdrop_path,
                  }}
                  style={{
                    width: 180,
                    height: 220,
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}>
                  {movie.primaryTag && (
                    <View
                      style={{
                        width: '100%',
                        height: 40,
                        backgroundColor: 'red',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          width: '100%',
                          textTransform: 'uppercase',
                          overflow: 'hidden',
                          fontWeight: 'bold',
                          color: 'black',
                        }}>
                        {movie.primaryTag ? t('primium') : 'no '}
                        <FontAwesomeIcon
                          style={{
                            fontSize: 17,
                            width: '100%',
                            textTransform: 'uppercase',
                            overflow: 'hidden',
                            fontWeight: 'bold',
                            color: 'black',
                          }}
                          icon={faUserLock}
                        />{' '}
                      </Text>
                    </View>
                  )}
                </ImageBackground>
                <View key={movie._id} style={styles.movieDetails}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={styles.title}>
                      {movie.filmInfo.title
                        ? movie.filmInfo.title
                        : movie.filmInfo.name}{' '}
                      {t('rate')}
                    </Text>
                    <Text style={styles.genre}>
                      {movie.filmInfo.popularity}{' '}
                      <FontAwesomeIcon
                        style={{ color: 'white', fontSize: 20, margin: 10 }}
                        icon={faEye}
                      />
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>loadding</Text>
          )}
        </ScrollView>

        {/* Add more sections as needed */}
      </View>
      <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>{t('movie')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {datas.length > 0 ? (
            datas.filter(x => x.filmType === 'Movie').map(movie => (
              <TouchableOpacity
                key={movie._id}
                style={styles.movieContainer}
                onPress={() => handleMoviePress(movie)}>
                <ImageBackground
                  source={{
                    uri:
                      'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                      movie.filmInfo.backdrop_path,
                  }}
                  style={{
                    width: 180,
                    height: 220,
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}>
                  {movie.primaryTag && (
                    <View
                      style={{
                        width: '100%',
                        height: 40,
                        backgroundColor: 'red',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          width: '100%',
                          textTransform: 'uppercase',
                          overflow: 'hidden',
                          fontWeight: 'bold',
                          color: 'black',
                        }}>
                        {movie.primaryTag ? t('primium') : 'no '}
                        <FontAwesomeIcon
                          style={{
                            fontSize: 17,
                            width: '100%',
                            textTransform: 'uppercase',
                            overflow: 'hidden',
                            fontWeight: 'bold',
                            color: 'black',
                          }}
                          icon={faUserLock}
                        />{' '}
                      </Text>
                    </View>
                  )}
                </ImageBackground>
                <View key={movie._id} style={styles.movieDetails}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={styles.title}>
                      {movie.filmInfo.title
                        ? movie.filmInfo.title
                        : movie.filmInfo.name}{' '}
                      {t('rate')}
                    </Text>
                    <Text style={styles.genre}>
                      {movie.filmInfo.popularity}{' '}
                      <FontAwesomeIcon
                        style={{ color: 'white', fontSize: 20, margin: 10 }}
                        icon={faEye}
                      />
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>loadding</Text>
          )}
        </ScrollView>

        {/* Add more sections as needed */}
      </View>
      <View style={{ height: 1, width: '100%', backgroundColor: 'white' }} />
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>{t('continuewatching')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {datas.length > 0 ? (
            datas.filter(x => x.filmType === 'TV').map(movie => (
              <TouchableOpacity
                key={movie._id}
                style={styles.movieContainer}
                onPress={() => handleMoviePress(movie)}>
                <ImageBackground
                  source={{
                    uri:
                      'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                      movie.filmInfo.backdrop_path,
                  }}
                  style={{
                    width: 180,
                    height: 220,
                    resizeMode: 'cover',
                    borderRadius: 10,
                  }}>
                  {movie.primaryTag && (
                    <View
                      style={{
                        width: '100%',
                        height: 40,
                        backgroundColor: 'red',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          width: '100%',
                          textTransform: 'uppercase',
                          overflow: 'hidden',
                          fontWeight: 'bold',
                          color: 'black',
                        }}>
                        {movie.primaryTag ? t('primium') : 'no '}
                        <FontAwesomeIcon
                          style={{
                            fontSize: 17,
                            width: '100%',
                            textTransform: 'uppercase',
                            overflow: 'hidden',
                            fontWeight: 'bold',
                            color: 'black',
                          }}
                          icon={faUserLock}
                        />{' '}
                      </Text>
                    </View>
                  )}
                </ImageBackground>
                <View key={movie._id} style={styles.movieDetails}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={styles.title}>
                      {movie.filmInfo.title
                        ? movie.filmInfo.title
                        : movie.filmInfo.name}{' '}
                      {t('rate')}
                    </Text>
                    <Text style={styles.genre}>
                      {movie.filmInfo.popularity}{' '}
                      <FontAwesomeIcon
                        style={{ color: 'white', fontSize: 20, margin: 10 }}
                        icon={faEye}
                      />
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>loadding</Text>
          )}
        </ScrollView>

        {/* Add more sections as needed */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',

    backgroundColor: '#000',
  },
  logo: {
    width: '20%',
    height: '70%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  banner: {
    height: 200,

    backgroundColor: '#FFFFFF',
  },
  bannerImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  movieContainer: {
    margin: 10,

    width: 180,
    height: 300,

    borderRadius: 10,
  },
  poster: {
    width: 180,
    height: 220,
    resizeMode: 'cover',
    borderRadius: 10,
    padding: 10,
  },
  movieDetails: {
    width: '100%',
    height: '100%',

    marginTop: 8,
    padding: 3,
  },
  title: {
    color: 'orange',
    fontSize: 17,
    width: '60%',
    textTransform: 'uppercase',
    overflow: 'hidden',
    fontWeight: 'bold',

    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    backgroundColor: '#2f94aa',
    padding: 3,
    borderRadius: 3,
    color: '#fff',
    margin: 4,
  },
  modalContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    width: 400,
    justifyContent: 'end',
    alignItems: 'start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#ff6f00',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  set: {
    position: 'absolute',
    top: 10,
    right: 0,
    backgroundColor: '#ff6f00',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 3,
    display: 'flex',
  },
});

export default HomeScreen;
