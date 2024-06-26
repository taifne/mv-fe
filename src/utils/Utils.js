import AsyncStorage from "@react-native-async-storage/async-storage";
import AppColors from "./AppColors";
import Note from "../classes/Note";

import { SaveNoteAction } from "../actions/SaveNote";

const GenerateSampleNotes = async (amount) => {
  try {
    const sampleNote = {
      title: "Sample Note",
      subTitle: "Sample Subtitle",
      // colorTag: AppColors.secondaryDark,
      content: "Sample Content",
      image: null,
      tasks: null,
      url: null,
      // lastUpdated: new Date(),
    };

    for (let i = 0; i < amount; index++) {
      const newNote = Note.create(sampleNote);

      if (newNote == null) {
        throw new Error("New note is null!");
      }

      const result = await SaveNoteAction(newNote);
      console.log("Save action result: " + result);
    }
  } catch (error) {
    console.log(error);
  }
}

const ClearData = async () => {
  try {
    const appDataKeys = await AsyncStorage.getAllKeys();
    console.log("App Data Keys: " + appDataKeys);
    AsyncStorage.multiRemove(appDataKeys, (result) => {
      console.log("Clear Data Result: " + result);
    });
  } catch (error) {
    console.log(error);
  }
}

const Utils = {
  GenerateSampleNotes,
  ClearData,
}

export default Utils;
