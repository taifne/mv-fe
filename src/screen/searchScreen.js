import { React, useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faHeartCircleBolt } from '@fortawesome/free-solid-svg-icons/faHeartCircleBolt';
import { faMusic } from '@fortawesome/free-solid-svg-icons/faMusic';
import { faDrumSteelpan } from '@fortawesome/free-solid-svg-icons/faDrumSteelpan';
import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile';
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons/faSearchPlus';
import { faGun } from '@fortawesome/free-solid-svg-icons/faGun';
import { faPersonCircleQuestion } from '@fortawesome/free-solid-svg-icons/faPersonCircleQuestion';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import { faFighterJet } from '@fortawesome/free-solid-svg-icons/faFighterJet';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons/faNewspaper';
import { faDog } from '@fortawesome/free-solid-svg-icons/faDog';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAsyncStorage } from '../../AsyncStorageProvider';

import { I18nextProvider, useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
const Fuse = require('fuse.js');
import axios from 'axios';
import { ip, newip } from '@env';
import Star from './Star';
function SearchScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [datas, setData] = useState([]);
  const [movieTitles, setMovieTitles] = useState([]);
  const [userData, setUser] = useState({});
  const [searchStatus, setSearchStatus] = useState(true);
  const [filmFilterData, setfilmFilterData] = useState({});
  const [inputValue, setInputValue] = useState('');
  const { state } = useAsyncStorage();

  useEffect(() => {
    axios
      .get(`http://172.27.80.1:9000/api/v1/info`)
      .then(function (response) {
        setData(response.data.data);
      })
      .catch(function (error) {
        console.log('search screen' + error);
      });
    const retrieveUserData = async () => {
      try {
        const Data = await AsyncStorage.getItem('userData');
        if (Data !== null) {
          const parsedUserData = JSON.parse(Data);
          setUser(parsedUserData);
        } else {
        }
      } catch (error) { }
    };

    retrieveUserData();

    // Example usage
  }, [navigation]);
  const handleMoviePress = movie => {
    navigation.navigate('MovieDetail', { movie });
  };
  function mapTitlesOrNames(arr) {
    return arr.map(record => {
      if (record.filmInfo.title) {
        return record.filmInfo.title;
      } else if (record.filmInfo.name) {
        return record.filmInfo.name;
      } else {
        return 'Title or name not available';
      }
    });
  }

  const handleType = textSearch => {
    setSearchStatus(true);
    setInputValue(textSearch);
    console.log('before filter : ' + filmFilterData.length);
    // setfilmFilterData(datas.filter(movie => movie.filmInfo.genres.some(g => g.name === genres)));
    setfilmFilterData(fuzzySearchMovies(datas, textSearch));
    filmFilterData.length > 0
      ? setMovieTitles(mapTitlesOrNames(filmFilterData))
      : setMovieTitles(['']);
    console.log('after filtering : ' + filmFilterData.length);
  };
  const handleSearchByCategory = category => {
    console.log('handleSearchByCategory');
    setfilmFilterData(
      datas.filter(movie =>
        movie.filmInfo.genres.some(g => g.name === category),
      ),
    );
    setSearchStatus(false);
  };
  function fuzzySearchMovies(records, textSearch) {
    const options = {
      keys: ['filmInfo.title', 'filmInfo.name'], // Specify the keys to search within
      includeScore: true, // Include search score for ranking
      threshold: 0.4, // Set a threshold for fuzzy matching
    };

    const fuse = new Fuse(records, options);
    const result = fuse.search(textSearch);
    return result.map(item => item.item);
  }

  // Example usage

  function searchByTitleOrName(movieCollection, searchText) {
    return movieCollection.filter(movie => {
      return (
        (movie.filmInfo.title &&
          movie.filmInfo.title
            .toLowerCase()
            .includes(searchText.toLowerCase())) ||
        (movie.filmInfo.name &&
          movie.filmInfo.name.toLowerCase().includes(searchText.toLowerCase()))
      );
    });
  }
  const renderMovieItem = ({ item }) => {
    return (
      <View style={styles.movieItem}>
        <Image source={{ uri: item.poster }} style={styles.poster} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.overview}>{item.overview}</Text>
      </View>
    );
  };
  const handleSearch = value => {
    handleType(value);
    setSearchStatus(false);
  };

  const handleSelectSuggestPress = value => {
    setInputValue(value);

    handleSearch(value);
  };
  const renderMovieSuggest = (movie, index) => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          height: 30,
          padding: 4,
          backgroundColor: '#423D3D',
          margin: 2,
          borderRadius: 8,
        }}
        key={index}
        onPress={() => handleSelectSuggestPress(movie)}
        data={'Value 1'}>
        <Text key={index} style={{ color: 'white' }}>
          {movie}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView style={styles.container}>
      <View
        style={{ height: 150, width: '100%', padding: 10, flexDirection: 'row' }}>
        <View
          style={{
            width: '50%',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '600' }}>
            {t('hi')} , {state.userData.username}
          </Text>
          {/* <Text style={{ color: 'white' }}>{filmFilterData.length}</Text> */}
          <Text style={{ color: 'white' }}> {t(`seewhat'snext`)}</Text>
        </View>
        <View
          style={{
            width: '50%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          {state.userData.avatar && (
            <Image
              source={{ uri: state.userData.avatar }}
              style={{
                borderRadius: 35,
                width: 70,
                height: 70,
                resizeMode: 'cover',
              }}></Image>
          )}
        </View>
      </View>
      <View style={styles.searchContainer}>
        <FontAwesomeIcon
          style={{ color: 'black', fontSize: 20, margin: 10 }}
          icon={faSearch}
        />
        <TextInput
          placeholder={t("searchforamovie")}
          style={styles.searchInput}
          value={inputValue}
          placeholderTextColor="gray"
          onChangeText={handleType}
        />
        {/* <Text>{movieTitles.length}</Text> */}
        <TouchableOpacity
          style={{
            backgroundColor: '#2f94aa',
            width: 60,
            height: 60,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => handleSearch(inputValue)}>
          <FontAwesomeIcon
            style={{ color: 'white', fontSize: 20, margin: 10, padding: 15 }}
            icon={faSearchPlus}
          />
        </TouchableOpacity>
      </View>
      <View>
        {movieTitles.length > 0 && searchStatus === true ? (
          movieTitles.map((movie, index) => renderMovieSuggest(movie, index))
        ) : (
          <Text>loadding</Text>
        )}
      </View>
      <Text style={styles.recentSearches}>{t('category')} :</Text>
      <View style={styles.recentSearchesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ height: 100 }}>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Animation')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faDog}
            />
            <Text style={styles.recentSearch}>{t('animation')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('family')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faHeartCircleBolt}
            />
            <Text style={styles.recentSearch}>{t('family')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Music')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faMusic}
            />
            <Text style={styles.recentSearch}>{t('music')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Fantasy')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faCheckCircle}
            />
            <Text style={styles.recentSearch}>{t('fantasy')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Comedy')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faSmile}
            />
            <Text style={styles.recentSearch}>{t('comedy')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Action')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faGun}
            />
            <Text style={styles.recentSearch}>{t('action')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Drama')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faPersonCircleQuestion}
            />
            <Text style={styles.recentSearch}>{t('drama')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('History')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faCalendarAlt}
            />
            <Text style={styles.recentSearch}>{t('history')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Horror')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faHeartCircleBolt}
            />
            <Text style={styles.recentSearch}>{t('horror')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Science Fiction')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faHeartCircleBolt}
            />
            <Text style={styles.recentSearch}>{t('sciencefiction')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Thriller')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faHeartCircleBolt}
            />
            <Text style={styles.recentSearch}>{t('thriller')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('War')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faFighterJet}
            />
            <Text style={styles.recentSearch}>{t('war')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('News')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faNewspaper}
            />
            <Text style={styles.recentSearch}>{t('news')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Soap')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faHeartCircleBolt}
            />
            <Text style={styles.recentSearch}>{t('soap')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Crime')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faHeartCircleBolt}
            />
            <Text style={styles.recentSearch}>{t('crime')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSearchByCategory('Reality')}
            style={{
              width: 70,
              height: 90,
              borderRadius: 10,
              flexDirection: 'column',
              backgroundColor: '#423D3D',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'center',
              margin: 10,
            }}>
            <FontAwesomeIcon
              style={{ color: 'white', fontSize: 20, margin: 10 }}
              icon={faHeartCircleBolt}
            />
            <Text style={styles.recentSearch}>{t('reality')}</Text>
          </TouchableOpacity>
        </ScrollView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 20, width: 400 }}>
          {filmFilterData.length > 0 ? (
            filmFilterData.map((movie, index) => (
              <ImageBackground
                key={index}
                source={{
                  uri:
                    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                    movie.filmInfo.backdrop_path,
                }}
                style={{ width: 400, height: 200, marginBottom: 20 }}>
                <TouchableOpacity
                  key={index}
                  style={styles.movieContainer}
                  onPress={() => handleMoviePress(movie)}>
                  <View key={movie.id} style={styles.movieDetails}>
                    <Text
                      style={{
                        textTransform: 'uppercase',
                        fontSize: 30,
                        color: 'black',
                        width: '100%',
                        fontWeight: '900',
                      }}>
                      {movie.filmInfo.title
                        ? movie.filmInfo.title
                        : movie.filmInfo.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}></View>
                  </View>
                </TouchableOpacity>
              </ImageBackground>
            ))
          ) : (
            <Text>loadding</Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1D1D1D',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,

    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  recentSearches: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  recentSearchesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#1D1D1D',
  },
  recentSearch: {
    fontSize: 10,
    borderRadius: 8,
    padding: 1,

    color: 'white',
  },

  logo: {
    width: 100,
    height: '100%',
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
    padding: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
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
  },
  movieDetails: {
    width: '100%',
    height: '100%',
    marginTop: 8,
    padding: 3,
  },
  title: {
    fontSize: 17,
    width: '100%',
    textTransform: 'uppercase',
    overflow: 'hidden',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
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

export default SearchScreen;
