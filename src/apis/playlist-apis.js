import axios from 'axios';
import {PROXY_CLOUD, PROXY_TUE_LOCAL} from '@env';

export const GETAllPlaylistByUser = async token => {
  var url = PROXY_TUE_LOCAL + '/api/v1/playlist/get-all-playlist';
  const {data} = await axios({
    method: 'get',
    url: url,
    validateStatus: () => true,
    headers: {
      authorization: 'Bearer ' + token,
    },
  });
  return data.data;
};

export const POSTCreatePlaylist = async playlistname => {
  var url = PROXY_TUE_LOCAL + '/api/v1/playlist/create-playlist';
  const {data} = await axios({
    method: 'post',
    url: url,
    validateStatus: () => true,
    headers: {
      authorization: 'Bearer ' + token,
    },
    body: {playlistname},
  });
  return data;
};

export const POSTAddVideoToPlaylistAction = async (
  videoID,
  infoID,
  token,
  playlistID,
) => {
  console.log({videoID, infoID, token, playlistID});
  var url = PROXY_TUE_LOCAL + '/api/v1/playlist/add-playlist';
  const {data} = await axios.post(
    url,
    {playlistID: playlistID, videoID: videoID, infoID: infoID},
    {
      validateStatus: () => true,
      headers: {
        authorization: 'Bearer ' + token,
      },
    },
  );
  return data;
};

const playlistAPIs = {
  POSTAddVideoToPlaylistAction,
  GETAllPlaylistByUser,
  POSTCreatePlaylist,
};

export default playlistAPIs;
