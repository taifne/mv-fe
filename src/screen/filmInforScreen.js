import { React, useContext, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  Button,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { useAsyncStorage } from '../../AsyncStorageProvider';
import { I18nextProvider, useTranslation } from 'react-i18next';
import axios from 'axios';
import { faAdd } from '@fortawesome/free-solid-svg-icons/faAdd';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faShare } from '@fortawesome/free-solid-svg-icons/faShare';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import { faRankingStar } from '@fortawesome/free-solid-svg-icons/faRankingStar';
import { faHomeUser } from '@fortawesome/free-solid-svg-icons/faHomeUser';
import { faTimeline } from '@fortawesome/free-solid-svg-icons/faTimeline';
import { faFileMedicalAlt } from '@fortawesome/free-solid-svg-icons/faFileMedicalAlt';
import { faTerminal } from '@fortawesome/free-solid-svg-icons/faTerminal';
import Star from './Star';
import Slider from '@react-native-community/slider';
import { PROXY_CLOUD, PROXY_TUE_LOCAL } from '@env';
import { ip, newip } from '@env';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { LogBox } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { State } from 'react-native-gesture-handler';
LogBox.ignoreLogs(['Warning: ...']);
const MovieDetailScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { movie } = route.params;
  const [speed, setSpeed] = useState(1.0);
  const [quality, setQuality] = useState('auto');
  const [clickedButton, setClickedButton] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [userData, setUser] = useState({});
  const [datas, setData] = useState([]);
  const [src, setSrc] = useState();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentList, setCommentList] = useState([{}]);
  const [commentListIndex, setCommentListIndex] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingId, setRatingId] = useState(0);
  const [playlistArr, setPlaylistArr] = useState(['cc']);
  const [playlistId, setPlaylistId] = useState('');
  const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const { state, dispatch } = useAsyncStorage();
  const [esIndex, setEsIndex] = useState(0);
  const handleMPaymentPress = movie => {
    setModalVisible(!modalVisible);
    navigation.navigate('Payment');
  };
  // Create a new comment
  //   {

  //     "movieId":"657b1699158f683d2116299c",
  //     "conversation":[{"user":"642ea70f73c5bc05cbc5585f","text": "This movie was amazing!"}]

  // }
  async function createComment(conversation) {
    try {
      const response = await axios.post(`http://192.168.233.187:9000/comments`, {
        movieId: movie._id,
        conversation: [{ user: userData.id, text: comment }],
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get comments for a particular movie
  async function getCommentsForMovie(movieId) {
    try {
      const response = await axios.get(
        `http://192.168.233.187:9000/comments/${movieId}`,
      );
      setCommentList(response.data);

      setCommentListIndex(commentList[0]._id | '');
    } catch (error) {
      throw error;
    }
  }

  async function getRatingForMovie(movieId) {
    try {
      const response = await axios.get(
        `http://192.168.233.187:9000/rating/${userData.id}/${movieId}`,
      );
      setRating(response.data.point);
      setRatingId(response.data._id);
    } catch (error) {
      throw error;
    }
  }
  async function updateRatingForMovie(movieId) {
    try {
      const response = await axios.put(`http://192.168.233.187:9000/rating`, {
        ratingId: ratingId,
        point: rating,
      });
      setRating(response.data.point);
    } catch (error) {
      throw error;
    }
  }
  async function getPlaylistForMovie(movieId) {
    try {
      console.log(`http://192.168.233.187:9000/rating/${userData.id}/${movieId}`);
      const response = await axios.get(
        `http://192.168.1.9:9000/playlists/${userData.id}`,
      );
      setPlaylistArr(response.data.movieArr);

      setPlaylistId(response.data._id);
    } catch (error) {
      throw error;
    }
  }
  async function updatePLaylistForMovie(cc) {
    try {
      setPlaylistArr(cc);
      const response = await axios.put(`http://192.168.233.187:9000/playlists`, {
        playlistId: playlistId,
        movieArr: cc,
      });
    } catch (error) {
      throw error;
    }
  }

  // Delete a comment
  async function deleteComment(commentId) {
    try {
      await axios.delete(`http://192.168.233.187:9000/comments/${commentId}`);
      return 'Comment deleted';
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  const handleSpeedChange = value => {
    setSpeed(value); // Set the playback speed based on the slider value
  };
  const handleSetRating = value => {
    setRating(value);
    ToastAndroid.showWithGravityAndOffset(
      t('ratesuccessfully'),
      ToastAndroid.LONG,
      0,
      250,
      500,
    );
  };
  const handleQualityChange = value => {
    setQuality(value === 0 ? 'auto' : '720'); // Set the video quality based on the slider value
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          movie.videos.map(video =>
            axios.get(
              `http://192.168.233.187:9000/redirect/hls/` + video.videoname,
              {
                headers: { myaxiosfetch: '123' },
              },
            ),
          ),
        );
        const videoDataArray = responses.map(
          response => response.data.subserverurl,
        );
        setData(videoDataArray);
        setSrc(videoDataArray[0]);
        console.log(src);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchData();
    const retrieveUserData = async () => {
      try {
        await AsyncStorage.getItem('userData').then(data => {
          const parsedUserData = JSON.parse(data);
          setUser(parsedUserData);
          console.log('Retrieved user data: ' + parsedUserData.id);
        });
      } catch (error) {
        console.error('Error retrieving user data: ', error);
      }
    };

    retrieveUserData();
    getCommentsForMovie(movie._id);

    console.log(rating);
  }, []);
  useEffect(() => {
    // Second fetch based on the firstData
    if (userData.id) {
      getRatingForMovie(movie._id);
      getPlaylistForMovie(movie._id);
    }
  }, [userData]);

  const AddComment = () => {
    createComment(comment);
    getCommentsForMovie(movie._id);
    setComment('');
  };
  const DeleteComment = comment => {
    deleteComment(comment);
    getCommentsForMovie(movie._id);
    setComment('');
  };
  const handleType = textSearch => {
    setComment(textSearch);
  };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleRatingButtonPress = () => {
    setModalVisible(true);
  };
  const handleVideoClick = (videoUrl, index) => {
    console.log('Playing video:', videoUrl);
    setClickedButton(index);
    setSrc(videoUrl);
    setEsIndex(index);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleGoBack = () => {
    navigation.goBack();
  };
  const onUpdateRating = () => {
    setModalVisible('false');
    updateRatingForMovie();
  };
  const handlePlay = () => {
    setShowVideo(true);
  };
  const handleAddtoPlaylist = () => {
    if (!playlistArr.includes(movie._id)) {
      const updatedPlaylistArr = [...playlistArr, movie._id];
      ToastAndroid.showWithGravityAndOffset(
        t('addtoplaylistsuccessfully'),
        ToastAndroid.LONG,
        0,
        250,
        500,
      );
      updatePLaylistForMovie(updatedPlaylistArr);
    } else {
      ToastAndroid.showWithGravityAndOffset(
        t('alreadyaddedtoplaylist'),
        ToastAndroid.LONG,
        0,
        250,
        500,
      );
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.index}
        style={[
          styles.spsButton,
          { backgroundColor: clickedButton === item.index ? 'red' : 'blue' },
        ]}
        onPress={() => handleVideoClick(item.videoData, item.index)}>
        <Text style={styles.spsTittle}>Espisole{item.index}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#2f94aa',
          margin: 6,
          borderRadius: 10,
        }}
        onPress={handleGoBack}>
        <FontAwesomeIcon
          style={{
            color: 'white',
            fontSize: '39em',

            padding: 16,
          }}
          icon={faHomeUser}
        />
      </TouchableOpacity>
      {showVideo ? (
        <View style={styles.containerr}>
          <Video
            source={{ uri: src }}
            style={styles.video}
            controls={true}
            rate={speed}
            resizeMode={quality}
          />
          <View style={styles.sliderContainer}>
            <Text style={styles.label}>{t('playspeed')}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              step={0.1}
              value={speed}
              onValueChange={handleSpeedChange}
            />
            <Text style={styles.value}>{speed.toFixed(2)}x</Text>
          </View>
        </View>
      ) : (
        <Image
          source={{
            uri:
              'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
              movie.filmInfo.backdrop_path,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.spsCtainer}>
        {datas.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.spsButton,
              index === esIndex ? { backgroundColor: '#a3cfd9' } : {},
            ]}
            onPress={() => handleVideoClick(item, index)}>
            <Text style={{ color: 'white' }}>
              {t('espisode')} {index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!showVideo &&
        (!movie.primaryTag ? (
          <TouchableOpacity
            style={{
              backgroundColor: '#2f94aa',
              width: 160,
              padding: 10,
              margin: 10,
              borderRadius: 6,
              alignSelf: 'center',
            }}
            onPress={handlePlay}>
            <Text style={styles.buttonText}>{t('playvideo')}</Text>
          </TouchableOpacity>
        ) : state.userData.isVip ? (
          <TouchableOpacity
            style={{
              backgroundColor: '#2f94aa',
              width: 160,
              padding: 10,
              margin: 10,
              borderRadius: 6,
              alignSelf: 'center',
            }}
            onPress={handlePlay}>
            <Text style={styles.buttonText}>{t('play video')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: '#2f94aa',
              width: 160,
              padding: 10,
              margin: 10,
              borderRadius: 6,
              alignSelf: 'center',
            }}
            key={3}
            onPress={() => handleMPaymentPress()}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>
              Buy Primium Package
            </Text>
          </TouchableOpacity>
        ))}

      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{movie.filmInfo.original_title}</Text>
        <Star rating={movie.filmInfo.vote_average} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {movie.filmInfo.adult ? (
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: '#3f4445',
              borderRadius: 3,
              padding: 10,
              alignItems: 'center',
              margin: 5,
            }}>
            <Text style={styles.ageRestriction}>{t('agerestriction')}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.ageRestriction}>18+</Text>
              <FontAwesomeIcon
                style={{
                  color: '#a3cfd9',
                  fontSize: '39em',

                  padding: 26,
                }}
                icon={faTimeline}
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              backgroundColor: '#3f4445',
              borderRadius: 3,
              padding: 10,
              alignItems: 'center',
              margin: 5,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                margin: 2,
                fontSize: 19,
                color: 'white',
              }}>
              6+
            </Text>
            <Text style={{ fontWeight: '200', margin: 2, color: 'white' }}>
              {t('agerestriction')}
            </Text>

            <FontAwesomeIcon
              style={{
                color: '#a3cfd9',

                padding: 10,
              }}
              icon={faTimeline}
            />
          </View>
        )}
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            backgroundColor: '#3f4445',
            borderRadius: 3,
            padding: 10,
            alignItems: 'center',
            margin: 5,
          }}>
          <Text style={styles.ageRestriction}>
            {' '}
            {Object.keys(movie.videos).length}
          </Text>
          <Text style={styles.ageRestriction}>{t('numberofmovies')}</Text>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesomeIcon
              style={{
                color: '#a3cfd9',
                fontSize: '39em',

                padding: 16,
              }}
              icon={faFileMedicalAlt}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'stretch',
            flex: 1,
            backgroundColor: '#3f4445',
            borderRadius: 3,
            padding: 10,
            alignItems: 'center',
            margin: 5,
          }}>
          <Text style={styles.ageRestriction}>{t('dayrelease')}</Text>
          <Text style={styles.ageRestriction}>
            {movie.filmInfo.release_date}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesomeIcon
              style={{
                color: '#a3cfd9',
                fontSize: '39em',

                padding: 16,
              }}
              icon={faCalendarDays}
            />
          </View>
        </View>
      </View>

      <View style={{ alignItems: 'start', flexDirection: 'column' }}>
        <Text
          style={styles.description}
          numberOfLines={isCollapsed ? 1 : undefined}>
          {movie.filmInfo.overview}
        </Text>
      </View>
      <TouchableOpacity style={{}} onPress={toggleCollapse}>
        <Text style={{ color: 'white' }}>
          {isCollapsed ? t('readmore') : t('readless')} ...
        </Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#2f94aa', margin: 10, padding: 5 }}
          onPress={handleAddtoPlaylist}>
          <Text style={styles.buttonText}>
            {t('addtoplaylist')}{' '}
            <FontAwesomeIcon style={{ color: '#a3cfd9' }} icon={faAdd} />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#2f94aa', margin: 10, padding: 5 }}
          onPress={handleRatingButtonPress}>
          <Text style={styles.buttonText}>
            {t('ratemovie')}{' '}
            <FontAwesomeIcon style={{ color: 'white' }} icon={faRankingStar} />
          </Text>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={onUpdateRating}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: 20,
            }}>
            <View
              style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                {t('Ratethismovie')}
              </Text>
              <View style={{ flexDirection: 'row', padding: 3, margin: 10 }}>
                {stars.map(index => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSetRating(index)}>
                    <Text style={{ fontSize: 20 }}>
                      {index <= rating ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={onUpdateRating}>
                <Text>{t('rate')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>{t('comment')}</Text>
        <ScrollView style={styles.commentsScrollView}>
          {commentList.length > 0 &&
            commentList.map(singleOne => {
              return (
                singleOne.conversation &&
                singleOne.conversation.map(comment => (
                  <View key={comment._id} style={styles.commentContainer}>
                    <Avatar
                      rounded
                      source={{ uri: comment.user.avatar }}
                      size="small"
                      containerStyle={styles.avatar}
                    />
                    <View style={styles.commentContent}>
                      <Text style={styles.commentUser}>
                        {comment.user.username}
                      </Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                      {comment.user._id === userData.id && (
                        <TouchableOpacity
                          onPress={() => DeleteComment(comment._id)}>
                          <Text style={{ color: 'red' }}>{t('delete')}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              );
            })}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="Write down something..."
              style={{ color: 'white' }}
              value={comment}
              placeholderTextColor="gray"
              onChangeText={handleType}
            />

            <TouchableOpacity
              style={{
                width: 40,
                height: 20,
                borderRadius: 14,
                padding: 2,
                backgroundColor: '#2f94aa',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              onPress={AddComment}>
              <Text style={{ color: 'white' }}>
                {' '}
                <FontAwesomeIcon
                  style={{
                    color: 'white',
                    fontSize: '39em',

                    padding: 16,
                  }}
                  icon={faTerminal}
                />
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add more comments here */}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  spsCtainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  spsButton: {
    margin: 6,
    padding: 6,
    backgroundColor: '#555959',
    borderRadius: 1,
  },
  spsTittle: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    backgroundColor: '#2a2f30',
    padding: 10,
  },
  button: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    backgroundColor: '#2f94aa',
    borderRadius: 8,
    width: 'auto',
  },
  image: {
    width: '100%',
    height: 400,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  episodes: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  ageRestriction: {
    fontSize: 10,
    color: '#fff',
    marginBottom: 2,
  },
  numMovies: {
    margin: 5,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#e50914',
    padding: 5,
    borderRadius: 4,
    margin: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  commentsContainer: {
    margin: 13,
    height: 'auto',
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  commentsScrollView: {
    maxHeight: 1000,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    padding: 8,
  },
  readmore: {
    alignSelf: 'star',
    width: '20%',
    justifyContent: 'start',
    alignItems: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatar: {
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 10,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 50,
    left: 0,
    bottom: 0,
    right: 0,
    width: 300,
    height: 500,
  },
  containerr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 300,
    marginBottom: 6,
  },
  sliderContainer: {
    width: '100%',
    marginBottom: -10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  slider: {
    width: '100%',
  },
  value: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
  },
});

export default MovieDetailScreen;
