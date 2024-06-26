/* eslint-disable*/
import AsyncStorage from '@react-native-async-storage/async-storage';


export const UpdateNoteAction = async (ID,noteUpdateData) => {
    try {
  
        const noteData = await AsyncStorage.mergeItem('Note_'+ID,JSON.stringify(noteUpdateData));
           return{result:'success',data:JSON.parse(noteData)};

  }catch(error){console.log(error)
  return{result:'fail',error:error};
}};