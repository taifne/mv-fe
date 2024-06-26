/* eslint-disable*/
import React, { useContext, useState, useEffect } from 'react';

import AppController from '../../controllers/AppController';
import AppContext from '../../utils/AppContext';
import moment from 'moment';

import { colorTags } from '../../utils/AppColors';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import TaskShorcut from '../tasks/TaskShortcut';

const NoteCard = (props) => {
  const appContext = useContext(AppContext);

  const [note, setNote] = useState({});

  const NoteSelectHandler = () => props.onSelect(props.index);
  const EditNoteHandler = () => props.onSelect(props.index);
  const CopyNoteHandler = () => props.onCopy(props.index);
  const ShareNoteHandler = () => props.onShare(props.index);
  const DeleteNoteHandler = () => props.onDelete(props.index);

  const NoteTasksChangeHandler = async (index) => {
    let itemsCopy = [...note.tasks];
    itemsCopy[index].isFinished = !itemsCopy[index].isFinished;
    await AppController.SaveNote({
      note: { ...note, tasks: itemsCopy },
      onSuccess: () => setNote(prev => { return { ...prev, tasks: itemsCopy } }),
      onFailed: (response) => console.log(response),
    })
  }

  useEffect(() => {
    const temp = {
      ID: props.note.ID,
      title: props.note.title,
      subTitle: props.note.subTitle,
      colorTag: props.note.colorTag,
      lastUpdated: moment(props.note.lastUpdated).format("dddd, Do MMM YYYY, h:mm a"),
      image: props.note.image,
      tasks: props.note.tasks,
    }
    setNote(temp);
  }, [props.note])

  const styles = StyleSheet.create({
    noteCard: {
      flexDirection: "column",
      color: appContext.appTheme?.text,
      width: "100%",
      height: "auto",
      marginBottom: "5%",
      borderRadius: 10,
    },

    noteCard__image: {
      width: "100%",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },

    noteCard__content: {
      flexDirection: "column",
      padding: 10,
    },

    noteCard_title: {
      color: note.colorTag === colorTags[0] ? appContext.appTheme?.text : "black",
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 10,
    },

    noteCard_subTitle: {
      color: note.colorTag === colorTags[0] ? appContext.appTheme?.text : "black",
      flexWrap: "wrap",
      marginBottom: 10,
    },

    noteCard_lastUpdated: {
      color: note.colorTag === colorTags[0] ? appContext.appTheme?.text : "black",
      fontSize: 10,
    },

    noteCard_popupMenu: {
      backgroundColor: appContext.appTheme?.secondary,
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "flex-start",
      height: 190,
    },

    popupMenu_title: {
      color: "#fcba03",
      padding: 10,
    },

    popupMenu_options: {
      optionWrapper: {
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 0,
      },
      optionText: {
        color: appContext.appTheme?.text,
        paddingHorizontal: 10,
      },
    },
  });

  return (
    <Menu>
      <MenuTrigger triggerOnLongPress
        onAlternativeAction={NoteSelectHandler}
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
          triggerWrapper: {
            ...styles.noteCard,
            backgroundColor: note.colorTag != colorTags[0] ? note.colorTag : appContext.appTheme?.secondary,
          }
        }}>
        {note.image != null &&
          <Image
            style={{
              ...styles.noteCard__image,
              aspectRatio: note.image.width / note.image.height,
            }}
            source={{ uri: note.image.uri }}
            resizeMode="stretch" />}
        <View style={styles.noteCard__content}>
          <Text style={styles.noteCard_title}>{note.title}</Text>
          {(note.subTitle != null || note.tasks == null) && <Text style={styles.noteCard_subTitle} numberOfLines={5}>{note.subTitle}</Text>}
          {note.tasks != null && note.tasks.map((item, index) => <TaskShorcut key={index} index={index} content={item} onCheck={NoteTasksChangeHandler} />)}
          <Text style={styles.noteCard_lastUpdated}>{note.lastUpdated}  </Text>
        </View>
      </MenuTrigger>
      <MenuOptions style={styles.noteCard_popupMenu}>
        <Text style={styles.popupMenu_title}>{note.title}</Text>
        <MenuOption customStyles={styles.popupMenu_options} onSelect={EditNoteHandler} value={1} text="Edit Note" />
        <MenuOption customStyles={styles.popupMenu_options} onSelect={CopyNoteHandler} value={1} text="Copy Note" />
        <MenuOption customStyles={styles.popupMenu_options} onSelect={ShareNoteHandler} value={2} text="Share Note" />
        <MenuOption customStyles={styles.popupMenu_options} onSelect={DeleteNoteHandler} value={3} text="Delete Note" />
      </MenuOptions>
    </Menu >
  );
};

export default NoteCard;
