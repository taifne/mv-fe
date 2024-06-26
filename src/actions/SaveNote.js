/* eslint-disable*/
/*notes for my friend Phat- this is being used for Task, not notes anymore*/
import AsyncStorage from '@react-native-async-storage/async-storage';
import Note from './../classes/Note'
function makeid(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZa_xXx_I_Put_A_Little_Secret_Here_xXx_bcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const SaveNoteAction = async (noteData) => {
  try {
    const jsonData = JSON.stringify(noteData);

    await AsyncStorage.setItem('Note_' + noteData.ID, jsonData);

    return { result: 'success', data: { noteData } }
  }
  catch (error) {
    console.log(error)
    return { result: 'fail', error: error }
  }
};