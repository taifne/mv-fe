/* eslint-disable*/
import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import moment from 'moment';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import TaskShorcut from '../tasks/TaskShortcut';
import AuthContext from '../../store/auth-context';
import {TextInput} from '@react-native-material/core';
import playlistAPIs, {
  POSTAddVideoToPlaylistAction,
} from '../../apis/playlist-apis';
// import BottomSheet from '@gorhom/bottom-sheet';
const NewPlaylistBottomSheet = props => {
  const authCtx = useContext(AuthContext);
  const [video, setVideo] = useState({});
  const [playlists, setPlaylists] = useState([]);

  const [playlistname, setPlaylistname] = useState('');

  const addToPlaylist = async playlist => {
    if (!props.video || !authCtx.token || !playlist._id) {
      console.log('Failed to add to playlist');
      return;
    }
    const response = await POSTAddVideoToPlaylistAction(
      props.video._id,
      props.info._id,
      authCtx.token,
      playlist._id,
    );
    console.log(response);
  };
  const LoadPlaylists = async () => {
    if (authCtx.isStayLoggedIn === false) {
      console.log('User is not signed in yet, cant find playlists');
    }

    const user_playlists = await playlistAPIs.GETAllPlaylistByUser(
      authCtx.token,
    );
    console.log(user_playlists);
    setPlaylists(prevState => {
      return user_playlists;
    });
  };
  useEffect(() => {
    console.log('########################NewPlaylistBottomSheet props');
    console.log(props);
    setVideo(prevState => {
      return props.video;
    });
    LoadPlaylists();
  }, []);

  return (
    <View>
      {playlists.map((playlist, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              addToPlaylist(playlists[index]);
            }}>
            <Text style={styles.input}>{playlist.playlistname}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  playlistCard: {
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
    marginBottom: '5%',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
  },
  bannerImage: {
    height: 70,
    maxHeight: 70,
    maxWidth: 70,
  },
  playlistCard__image: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  playlistCard__content: {
    flexDirection: 'column',
    padding: 5,
    flex: 1,
  },

  playlistCard_title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
  },

  playlistCard_subTitle: {
    flexWrap: 'wrap',
    marginBottom: 10,
    flex: 1,
  },

  playlistCard_lastUpdated: {
    fontSize: 10,
  },

  playlistCard_popupMenu: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    height: 190,
  },

  popupMenu_title: {
    color: '#fcba03',
    padding: 10,
  },

  popupMenu_options: {
    optionWrapper: {
      width: '100%',
      paddingVertical: 10,
      paddingHorizontal: 0,
    },
    optionText: {
      paddingHorizontal: 10,
    },
  },
});
export default NewPlaylistBottomSheet;
