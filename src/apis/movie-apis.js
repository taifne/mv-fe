import axios from 'axios';
import {PROXY_CLOUD, PROXY_TUE_LOCAL} from '@env';

export const GETThreadAction = async slug => {
  if (!slug) {
    return {status: 'fail'};
  }
  // const storedToken = localStorage.getItem('token');
  const response = await fetch('/api/v1/threads/' + slug, {
    method: 'GET',
    headers: {
      // 'Content-Type': 'application/json',
      // Authorization: token,
    },
  });
  if (!response.status || response.status === 'error') {
    throw new Error('Something went wrong!');
  }
  const data = await response.json();
  //   console.log(data);
  return data;
};

export const GETAllThreadAction = async () => {
  try {
    const {data} = await axios({
      method: 'get',
      url: PROXY_TUE_LOCAL + '/api/v1/info',
      validateStatus: () => true,
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NWVmMjczODBjMjY4YmE2MjgxNGJlMyIsImlhdCI6MTcwMDcyMTI2OCwiZXhwIjoxNzA4NDk3MjY4fQ.R3bCwb1b78bicyW5aw_koTLOpUtiwPZOlkNqlb4QZ0g',
      },
    });
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const GETAllThreadsByUserAction = async (account, token) => {
  const response = await fetch('/api/v1/threads/content-creator/' + account, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  if (!response.status || response.status === 'error') {
    throw new Error('Something went wrong!');
  }

  const data = await response.json();
  return data;
};

export const POSTThreadAction = async (thread, token) => {
  if (!thread) {
    return {status: 'fail'};
  }

  const response = await fetch('/api/v1/threads', {
    method: 'POST',
    body: JSON.stringify(thread),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  const data = await response.json();
  // console.log(data);
  return data;
};

export const POSTVideoUploadAction = async formData => {
  if (!formData) {
    return {status: 'fail'};
  }
  const response = await fetch('/api/v1/threads/upload-video', {
    method: 'POST',
    body: formData,
  });
};

export const POSTLargeVideoUploadAction = async formData => {
  if (!formData) {
    return {status: 'fail'};
  }
  const response = await fetch('/api/test/upload-video', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  // console.log(data);

  return data;
};

export const POSTLargeVideoMultipartUploadHlsAction = async (
  formData,
  index,
  chunkName,
  arrayChunkName,
  filename,
  ext,
  title,
  infoID,
) => {
  if (!formData) {
    return {status: 'fail'};
  }

  const response = await fetch(
    '/api/v1/video/upload-video-large-multipart-hls',
    {
      method: 'POST',
      body: formData,
      headers: {
        type: 'blob',
        index: index,
        chunkname: chunkName,
        filename: filename,
        arrayChunkName,
        ext,
        title,
        infoID: infoID,
      },
    },
  );
  const data = await response.json();
  // console.log(data);
  return data;
};

export const POSTLargeVideoMultipartUploadDashAction = async (
  formData,
  index,
  chunkName,
  arrayChunkName,
  filename,
  ext,
  title,
  infoID,
) => {
  if (!formData) {
    return {status: 'fail'};
  }
  const response = await fetch(
    '/api/v1/video/upload-video-large-multipart-dash',
    {
      method: 'POST',
      body: formData,
      headers: {
        type: 'blob',
        index: index,
        chunkname: chunkName,
        filename: filename,
        arrayChunkName,
        ext,
        title,
        infoID,
      },
    },
  );
  const data = await response.json();
  // console.log(data);
  return data;
};

export const POSTLargeVideoMultipartUploadConcatenateAction = async (
  arrayChunkName,
  filename,
  destination,
  ext,
) => {
  const response = await fetch(
    '/api/test/upload-video-large-multipart-concatenate',
    {
      method: 'POST',
      body: JSON.stringify({
        arraychunkname: arrayChunkName,
      }),
      headers: {
        'Content-Type': 'application/json',
        filename,
        destination,
        ext,
      },
    },
  );
  const data = await response.json();
  // console.log(data);
  return data;
};

export const OPTIONSLargeVideoMultipartUploadAction = async (
  formData,
  index,
  chunkName,
  arrayChunkName,
  filename,
  ext,
) => {
  if (!formData) {
    return {status: 'fail'};
  }
  const response = await fetch('/redirect/upload-video-large-multipart', {
    method: 'OPTIONS',
    body: formData,
    headers: {
      type: 'blob',
      index: index,
      chunkname: chunkName,
      filename: filename,
      arrayChunkName,
      ext,
    },
  });
  const data = await response.json();
  // console.log(data);
  return data;
};

export const OPTIONSLargeVideoMultipartUploadConcatenateAction = async (
  arrayChunkName,
  filename,
  destination,
  ext,
) => {
  const response = await fetch(
    '/redirect/upload-video-large-multipart-concatenate',
    {
      method: 'OPTIONS',
      body: JSON.stringify({
        arraychunkname: arrayChunkName,
      }),
      headers: {
        'Content-Type': 'application/json',
        filename,
        destination,
        ext,
      },
    },
  );
  const data = await response.json();
  // console.log(data);
  return data;
};

export const DELETEThreadAction = async (token, payload) => {
  try {
    const response = await fetch('/api/v1/threads/' + payload.thread.slug, {
      method: 'DELETE',
      body: JSON.stringify(payload),
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const PATCHThreadUpdateAction = async (token, oldSlug, payload) => {
  try {
    const response = await fetch('/api/v1/threads/' + oldSlug, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GETAllThreadsByTitleAction = async title => {
  try {
    const response = await fetch('/api/v1/threads/search/' + title, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.status || response.status === 'error') {
      throw new Error('Something went wrong!');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GETAllThreadsByTagAction = async tag => {
  try {
    const response = await fetch('/api/v1/threads/tag/' + tag, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.status || response.status === 'error') {
      throw new Error('Something went wrong!');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GETAllThreadsByUserIdAction = async id => {
  try {
    const response = await fetch('/api/v1/threads/user/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.status || response.status === 'error') {
      throw new Error('Something went wrong!');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getDashUrl = async filename => {
  var url = PROXY_TUE_LOCAL + '/redirect/dash/' + filename + '/' + filename;

  const {data} = await axios({
    method: 'get',
    url: url,
    validateStatus: () => true,
    headers: {myaxiosfetch: '123'},
  });
  console.log(data);
  var subserverurl = data.subserverurl;
  return subserverurl;
};

const movieAPIs = {
  GETThreadAction,
  GETAllThreadAction,
  GETAllThreadsByUserAction,
  GETAllThreadsByUserIdAction,
  GETAllThreadsByTitleAction,
  GETAllThreadsByTagAction,
  POSTThreadAction,
  POSTVideoUploadAction,
  DELETEThreadAction,
  PATCHThreadUpdateAction,
  POSTLargeVideoUploadAction,
  POSTLargeVideoMultipartUploadHlsAction,
  POSTLargeVideoMultipartUploadDashAction,

  POSTLargeVideoMultipartUploadConcatenateAction,
  OPTIONSLargeVideoMultipartUploadAction,
  OPTIONSLargeVideoMultipartUploadConcatenateAction,
  getDashUrl,
};

export default movieAPIs;
