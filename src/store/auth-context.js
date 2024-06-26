import React, {useEffect, useState} from 'react';
import {GETUserInfoAction, GETSelfUserInfoAction} from '../apis/user-apis';
import {LoginAction} from '../apis/auth-apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = React.createContext({
  isAuthorized: false,
  username: '',
  avatar: '',
  displayName: '',
  token: '',
  role: '',
  isStayLoggedIn: false,
  OnUserLogin: data => {},
  OnUserLogout: () => {},
  OnAvatarUpdate: newAvatar => {},
  OnDisplayNameUpdate: newDisplayName => {},
});

export const AuthContextProvider = props => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isStayLoggedIn, setIsStayLoggedIn] = useState(false);

  const [username, setUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const UserLoginHandler = async data => {
    setIsAuthorized(data.role === 'admin' ? true : false);
    setUsername(data.username);
    setAvatar(data.avatar);
    setDisplayName(data.username);
    setToken(data.token);
    setRole(data.role);
    setIsStayLoggedIn(true);
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('username', data.username);
    await AsyncStorage.setItem('avatar', data.avatar);

    console.log(data);

    console.log('User login!');
  };

  const UserLogOutHandler = async () => {
    setIsAuthorized(false);
    setIsStayLoggedIn(false);
    setUsername(null);
    setAvatar(null);
    setDisplayName(null);
    setToken(null);
    setRole(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('avatar');

    console.log('User log out!');
  };

  const AvatarUpdateHandler = newAvatar => {
    setAvatar(newAvatar);
  };

  const DisplayNameUpdateHandler = newDisplayName => {
    setDisplayName(newDisplayName);
  };

  useEffect(() => {
    const RetrieveUserInfoHandler = async token => {
      try {
        const response = await GETSelfUserInfoAction(token);
        console.log(response);
        if (response) {
          const userInfo = response;
          if (userInfo != null) {
            setAvatar(userInfo.avatar);
            setDisplayName(userInfo.username);
            setRole(userInfo.role);
            setIsAuthorized(userInfo.role === 'admin' ? true : false);
            setUsername(userInfo.username);
            setIsStayLoggedIn(true);
          }
        } else {
          console.log('Failed to retrieve user info!');
        }
      } catch (error) {
        console.log('Can not retrieve user info. Error: ' + error);
      }
    };

    const getAsyncStorageData = async () => {
      const localUsername = await AsyncStorage.getItem('username');
      const localToken = await AsyncStorage.getItem('token');
      const localAvatar = await AsyncStorage.getItem('avatar');

      console.log('@@@@@@@@@@@@@@@@@');

      if (localUsername != null && localToken != null && localAvatar != null) {
        console.log('User already logged in!');
        console.log({localToken, localUsername});
        setIsAuthorized(true);
        setIsStayLoggedIn(true);
        setUsername(localUsername);
        setToken(localToken);
        setAvatar(localAvatar);
        RetrieveUserInfoHandler(localToken);
      }
    };
    getAsyncStorageData();
  }, []);
  const setAsyncStorageData = async () => {
    console.log('^^^^^^^^^^^');
    console.log('State changed!');
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('avatar', avatar);
  };
  useEffect(() => {
    console.log(isStayLoggedIn);
    if (isStayLoggedIn === true) {
      setAsyncStorageData();
      //   localStorage.setItem('username', username);
      //   localStorage.setItem('token', token);
    }
  }, [isStayLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isAuthorized: isAuthorized,
        username: username,
        avatar: avatar,
        displayName: displayName,
        token: token,
        role: role,
        isStayLoggedIn: isStayLoggedIn,
        OnUserLogin: UserLoginHandler,
        OnUserLogout: UserLogOutHandler,
        OnAvatarUpdate: AvatarUpdateHandler,
        OnDisplayNameUpdate: DisplayNameUpdateHandler,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
