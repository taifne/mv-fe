import React, { useContext } from "react";

import AppContext from "../../utils/AppContext";
import TaskList from '../tasks/TaskList';
import HyperLink from "../others/HyperLink";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from 'moment';

import { colorTags } from "../../utils/AppColors";
import { View, StyleSheet, TextInput, Text, Image } from "react-native";

const titleMaxLength = 50;
const subTitleMaxLength = 70;

const NoteDetails = (props) => {
    const note = {
        title: props.note.title,
        subTitle: props.note.subTitle,
        colorTag: props.note.colorTag,
        createdDate: props.note.createdDate,
        lastUpdated: moment(props.note.lastUpdated).format("dddd, Do MMM YYYY h:mm a"),
        content: props.note.content,
        image: props.note.image,
        url: props.note.url,
        tasks: props.note.tasks,
    }

    const appContext = useContext(AppContext);

    const styles = StyleSheet.create({
        noteDetails: {
            backgroundColor: "transparent",
            height: "100%",
            paddingVertical: 0,
            paddingHorizontal: 10,
        },

        noteDetails_title: {
            color: appContext.appTheme?.text,
            fontSize: 23,
            fontWeight: "600",
        },

        noteDetails_subTitle: {
            flexDirection: "row",
            marginVertical: 20,
            marginHorizontal: 3,
        },

        noteDetails_lastUpdated: {
            color: appContext.appTheme?.icon,
            fontSize: 16,
            paddingStart: 3,
        },

        subTitle_container: {
            flexDirection: "row",
            marginVertical: 20,
            marginHorizontal: 3,
        },

        subTitle_colorTag: {
            borderRadius: 10,
            width: 5,
        },

        subTitle_content: {
            color: appContext.appTheme?.text,
            width: "98%",
            minHeight: 50,
            height: "auto",
            fontSize: 18,
            marginHorizontal: 3,
        },

        content_imageDeleteIcon: {
            backgroundColor: "white",
            position: "absolute",
            top: 10,
            right: 20,
            padding: 5,
            borderRadius: 50,
        },

        content_text: {
            color: appContext.appTheme?.text,
            width: "98%",
            minHeight: 50,
            height: "auto",
            marginHorizontal: 3,
            textAlign: "justify",
            fontSize: 18,
        },
    });

    return (
        <View style={styles.noteDetails}>
            <TextInput style={styles.noteDetails_title}
                maxLength={titleMaxLength}
                selectionColor={"#fcba03"}
                value={note.title}
                onChangeText={text => props.onTitleChange(text)}
                placeholder="Note Title"
                placeholderTextColor={appContext.appTheme?.icon} />
            <Text style={styles.noteDetails_lastUpdated}>{note.lastUpdated}</Text>
            <View style={styles.noteDetails_subTitle}>
                <View style={{
                    ...styles.subTitle_colorTag,
                    backgroundColor: note.colorTag != colorTags[0] ? note.colorTag : appContext.appTheme?.secondary,
                }} />
                <TextInput style={styles.subTitle_content}
                    editable
                    multiline
                    maxLength={subTitleMaxLength}
                    selectionColor={"#fcba03"}
                    value={note.subTitle}
                    onChangeText={text => props.onSubTitleChange(text)}
                    placeholder="Note Subtitle"
                    placeholderTextColor={appContext.appTheme?.icon} />
            </View>
            <View style={styles.noteDetails_content}>
                {note.url != null && note.tasks == null && <HyperLink link={note.url} onLinkDelete={() => props.onUrlChange(null)} />}
                {note.image != null && note.tasks == null && <View>
                    <Image
                        style={{
                            width: "98%",
                            aspectRatio: note.image.width / note.image.height,
                        }}
                        source={{ uri: note.image.uri }}
                        resizeMode="stretch" />
                    <MatComIcon style={styles.content_imageDeleteIcon}
                        name="trash-can"
                        color="red"
                        size={30}
                        onPress={() => props.onImageDelete(null)} />
                </View>}
                {note.tasks == null && <TextInput style={styles.content_text}
                    editable
                    multiline
                    value={note.content}
                    onChangeText={text => props.onContentChange(text)}
                    selectionColor={"#fcba03"}
                    placeholder="Type Your Note Here"
                    placeholderTextColor={appContext.appTheme?.icon} />}
                {note.tasks != null &&
                    <TaskList
                        taskItems={note.tasks}
                        showEditTaskDialog={props.showEditTaskDialog}
                        onTasksChange={props.onTasksChange}
                    />}
                <View style={{ height: 100 }} />
            </View>
        </View >
    );
};

export default NoteDetails;