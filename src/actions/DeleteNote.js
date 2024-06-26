/* eslint-disable*/
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DeleteNoteAction = async (ID) => {
    try {
        const deleteNoteData = await AsyncStorage.removeItem('Note_'+ID);
           return{result:'success',message:'success delete!',result:deleteNoteData};

  }catch(error){console.log(error)
  return{result:'fail',error:error};
}};

export const DeleteAllNoteAction = async () => {
    try {
      let notesDeleteData=[];
      const allKeys=await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiRemove(allKeys, err => {
        notesDeleteData.push('Success delete noteData!')
      });

      return{result:'success',result:notesDeleteData};


  }catch(error){console.log(error)
  return{result:'fail',error:error};
}};