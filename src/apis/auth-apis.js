import axios from 'axios';
import {PROXY_CLOUD, PROXY_TUE_LOCAL} from '@env';
// POST
export const LoginAction = async userData => {
  if (!userData) {
    return null;
  }
  console.log(userData);

  var url = PROXY_TUE_LOCAL + '/api/v1/users/signin';
  const {data} = await axios({
    method: 'post',
    url: url,
    validateStatus: () => true,
    data: userData,
  });
  return data.data;
};

// POST
export const RegisterAction = async userData => {
  if (!userData) {
    return null;
  }
  var url = PROXY_TUE_LOCAL + '/api/v1/users/signup';
  const {data} = await axios({
    method: 'post',
    url: url,
    validateStatus: () => true,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: {userData},
  });

  return data.data;
};

// POST
export const RegisterActionFormDataVersion = async userFormData => {
  if (!userFormData) {
    return {status: 'fail'};
  }
  const response = await fetch('/api/v1/users/signup', {
    method: 'POST',
    body: userFormData,
  });
  const data = await response.json();
  return data;
};

// GET
export const CheckTokenAction = async token => {
  if (!token) {
    return {status: 'fail'};
  }
  const response = await fetch('/api/v1/auth/check-token', {
    method: 'GET',
    headers: {
      // 'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  const data = await response.json();
  return data;
};
