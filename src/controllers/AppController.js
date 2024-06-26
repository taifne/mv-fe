import Note from "../classes/Note";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GetAllNoteAction, GetNoteAction } from '../actions/GetNote';
import { SaveNoteAction } from "../actions/SaveNote";
import { DeleteNoteAction } from "../actions/DeleteNote";

const GetAllNotes = async ({ filter, onSuccess, onFailed }) => {
    try {
        const response = await GetAllNoteAction();

        if (response.result === 'success') {
            if (filter == null) {
                onSuccess(response.data);
            }
            else {
                const filterNotes = response.data.filter((note) => note.title.toLowerCase().includes(filter));
                onSuccess(filterNotes);
            }
        }
        else {
            onFailed(response);
        }
    } catch (error) {
        onFailed(error);
    }
}

const GetNote = async ({ ID, onSuccess, onFailed }) => {
    try {
        const response = await GetNoteAction(ID);

        if (response.result === 'success') {
            onSuccess(response.data);
        }
        else {
            onFailed(response);
        }
    } catch (error) {
        onFailed(error);
    }
}

const SaveNote = async ({ note, onSuccess, onFailed }) => {
    try {
        const model = Note.create({ ...note, lastUpdated: new Date() });

        if (model == null) {
            onFailed("Invalid note model!");
            return;
        }

        const response = await SaveNoteAction(model);

        if (response != null) {
            onSuccess();
        }
        else {
            onFailed(response);
        }
    } catch (error) {
        onFailed(error);
    }
}

const DeleteNote = async ({ ID, onSuccess, onFailed }) => {
    try {
        const response = await DeleteNoteAction(ID);

        if (response.message === 'success delete!') {
            onSuccess();
        }
        else {
            onFailed(response);
        }
    } catch (error) {
        onFailed(error);
    }
}

const SaveAppLayout = async (layout) => {
    try {
        await AsyncStorage.setItem("_Layout", layout);
    } catch (error) {
        console.log(error);
    }
}

const GetAppLayout = async () => {
    try {
        const response = await AsyncStorage.getItem("_Layout");
        return response;
    } catch (error) {
        console.log(error);
    }
}

const AppController = {
    GetAllNotes,
    GetNote,
    SaveNote,
    DeleteNote,
    SaveAppLayout,
    GetAppLayout,
}

export default AppController;