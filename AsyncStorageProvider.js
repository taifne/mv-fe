import React, { createContext, useReducer, useContext } from 'react';

const AsyncStorageContext = createContext();

const initialState = {
  // Define your initial AsyncStorage data structure here
  // For example:
  userData: null,
};

const asyncStorageReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_USER_DATA':
      return { ...state, userData: action.payload };
      case 'UPDATE_USER_DATA_PRIMIUM':
        return {
          ...state,
          userData: {
            ...state.userData,
            isVip: action.payload
          }
        };
        
    default:
      return state;
  }
};

export const AsyncStorageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(asyncStorageReducer, initialState);

  return (
    <AsyncStorageContext.Provider value={{ state, dispatch }}>
      {children}
    </AsyncStorageContext.Provider>
  );
};

export const useAsyncStorage = () => {
  return useContext(AsyncStorageContext);
};
