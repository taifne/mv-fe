import React, { useContext, useEffect, useState } from "react";

import AppContext from "../utils/AppContext";
import Fa5Icon from 'react-native-vector-icons/FontAwesome5';

import { View, Modal, Text, StyleSheet, TextInput, Pressable, Keyboard } from "react-native";

const EditTaskDialog = (props) => {
    const appContext = useContext(AppContext);

    const [input, setInput] = useState("");

    const EditTaskHandler = () => {
        Keyboard.dismiss();
        if (input != null && input.trim() != "") {
            props.onTaskEdit({ index: props.index, toDo: input });
            props.setIsVisible({ isVisible: false, index: -1, task: null });
        } else {
            appContext.callSnackBar({
                type: "error",
                message: "Task content cannot be blank!",
            });
        }
    }

    useEffect(() => setInput(props.task?.toDo), [props.isVisible]);

    const styles = StyleSheet.create({
        editNoteDialogBackground: {
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
        },

        editNoteDialog: {
            backgroundColor: appContext.appTheme?.secondary,
            width: 300,
            padding: 20,
            borderRadius: 5,
        },

        editNoteDialogText: {
            color: appContext.appTheme?.text,
            fontSize: 17.5,
            fontWeight: 500,
        },

        editNoteDialogIcon: {
            backgroundColor: 'transparent',
            color: appContext.appTheme?.text,
            size: 23,
            marginEnd: 15,
        },

        editNoteDialogAction: {
            color: "#fcba03",
            fontSize: 16,
            fontWeight: 500,
        },
    });

    return (
        <Modal visible={props.isVisible} transparent={true} >
            <Pressable style={styles.editNoteDialogBackground} onPress={() => props.setIsVisible({ isVisible: false, index: -1, task: null })}>
                <View style={styles.editNoteDialog}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                        <Fa5Icon name="pen" {...styles.editNoteDialogIcon} />
                        <Text style={styles.editNoteDialogText}>Edit Task</Text>
                    </View>
                    <TextInput
                        style={styles.editNoteDialogText}
                        value={input}
                        autoFocus={true}
                        onChangeText={(text) => setInput(text)}
                        placeholder="Task Content"
                        placeholderTextColor={appContext.appTheme?.icon}
                        selectionColor={"#fcba03"}
                        inputMode="url"
                        underlineColorAndroid={"#fcba03"} />
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 5 }}>
                        <Pressable onPress={() => props.setIsVisible({ isVisible: false, index: -1, task: null })}>
                            <Text style={{ ...styles.editNoteDialogAction, marginEnd: 20 }}>CANCEL</Text>
                        </Pressable>
                        <Pressable onPress={EditTaskHandler}>
                            <Text style={styles.editNoteDialogAction}>SAVE</Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </Modal >
    )
}

export default EditTaskDialog;