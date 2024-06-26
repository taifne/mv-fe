/* eslint-disable*/
import AsyncStorage from '@react-native-async-storage/async-storage';
import Note from '../classes/Note';


export const GetNoteAction = async (ID) => {
  try {

    const noteData = await AsyncStorage.getItem('Note_' + ID);

    if (noteData === null || noteData === undefined) {
      console.log('Something wrong with noteData in GetNoteAction');
      console.log(noteData);
      return;
    }

    return {
      result: 'success',
      data: JSON.parse(noteData)
    };

  } catch (error) {
    console.log(error)
    return { result: 'fail', error: error };
  }
};

export const GetAllNoteAction = async () => {
  try {
    let notes = [];

    let allKeys = await AsyncStorage.getAllKeys();
    allKeys = allKeys.filter((key) => key.includes("Note_"))

    const data = await AsyncStorage.multiGet(allKeys, (err, stores) => {
      stores.map((result, i, store) => {
        // get at each store's key/value so you can work with it
        let value = store[i][1];

        const note = JSON.parse(value);

        if (note === null || note === undefined) return;

        notes.push(note);
      });
    });

    notes = notes.sort((a, b) => {
      const aDate = new Date(a.lastUpdated);
      const bDate = new Date(b.lastUpdated);
      return aDate.getTime() > bDate.getTime() ? -1 : 1;
    });

    return { result: 'success', data: notes };
  }
  catch (error) {
    return { result: 'fail', error: error };
  }
};