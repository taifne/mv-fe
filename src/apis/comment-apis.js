import axios from 'axios';
import {PROXY_CLOUD, PROXY_TUE_LOCAL} from '@env';

export const GETAllCommentByVideoAction = async videoID => {
  var url = PROXY_TUE_LOCAL + '/api/v1/comment/video/' + videoID;
  const {data} = await axios({
    method: 'get',
    url: url,
    validateStatus: () => true,
  });
  console.log(data);
  var comments = data.comments;
  return comments;
};

export const GETAllCommentsByUserAction = async userID => {
  var url = '/api/v1/comment/user/' + userID;
  const {data} = await axios({
    method: 'get',
    url: url,
    validateStatus: () => true,
  });
  console.log(data);
  var comments = data.comments;
  return comments;
};

export const POSTCommentAction = async (videoID, token, content) => {
  var url = PROXY_TUE_LOCAL + '/api/v1/comment/video/' + videoID;
  const {data} = await axios({
    method: 'post',
    url: url,
    validateStatus: () => true,
    headers: {
      authorization: 'Bearer ' + token,
    },
    data: {content},
  });
  console.log(data);
  return data.comment;
};

const movieAPIs = {
  POSTCommentAction,
  GETAllCommentByVideoAction,
  GETAllCommentsByUserAction,
};

export default movieAPIs;
