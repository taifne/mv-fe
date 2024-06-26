/* eslint-disable*/
import React, {useContext, useState, useEffect} from 'react';

import moment from 'moment';

import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import TaskShorcut from '../tasks/TaskShortcut';
import AuthContext from '../../store/auth-context';
import {useNavigation} from '@react-navigation/native';

const PlaylistCard = props => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);

  const [playlist, setPlaylist] = useState({});
  const PlaylistSelectHandler = () => {};
  const EditPlaylistHandler = () => {};
  const CopyPlaylistHandler = () => {};
  const SharePlaylistHandler = () => {};
  const DeletePlaylistHandler = () => {};

  useEffect(() => {
    console.log('########################Playlistcard props');

    console.log(props);

    const temp = {
      ...props.playlist,
      updateDate: moment(props.playlist.updateDate).format(
        'dddd, Do MMM YYYY, h:mm a',
      ),
    };
    setPlaylist(() => {
      return temp;
    });
  }, [props.playlist]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          console.log('TouchableOpacity PlaylistCard');
          console.log(playlist);
          const payload = playlist;
          navigation.navigate('PlaylistInfo', payload);
        }}>
        <View style={styles.playlistCard__content}>
          <Image
            source={require('../../imagePoster/user/userAvatar.jpg')}
            style={styles.bannerImage}
          />
          <Text>{playlist.playlistname}</Text>
          <Text style={styles.playlistCard_lastUpdated}>
            {playlist.updateDate}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  playlistCard: {
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
    marginBottom: '5%',
    borderRadius: 10,
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
export default PlaylistCard;
