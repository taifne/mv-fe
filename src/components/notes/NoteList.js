import React from 'react';

import NoteCard from "./NoteCard";

import { View, StyleSheet, ScrollView } from 'react-native';

const NoteList = (props) => {
  const notes = props.list;

  const SelectNoteHandler = (index) => props.onSelectNote(notes[index].ID);
  const DeleteNoteHandler = (index) => props.onDeleteNote(notes[index].ID);
  const ShareNoteHandler = (index) => props.onShareNote(notes[index].ID);
  const CopyNoteHandler = (index) => props.onCopyNote(notes[index].ID);

  const RenderNoteComponentsHandler = (list) => {
    return list.map((item) => {
      const index = notes.findIndex(noteItem => noteItem.ID === item.ID);
      return <NoteCard
        key={index}
        index={index}
        note={item}
        onSelect={SelectNoteHandler}
        onDelete={DeleteNoteHandler} 
        onShare={ShareNoteHandler}
        onCopy={CopyNoteHandler}
        />
    });
  }

  const RenderColumnLayoutHandler = () => {
    return (
      <View style={styles.noteList__container}>
        <View style={styles.noteList__column}>
          {RenderNoteComponentsHandler(notes)}
        </View>
      </View>);
  };

  const RenderGridLayoutHandler = () => {
    let column_1_Notes = [];
    let column_2_Notes = [];

    notes.map((item, index) => {
      if (index % 2 === 0)
        column_1_Notes.push(item);
      else
        column_2_Notes.push(item);
    })

    return (
      <View style={styles.noteList__container}>
        <View style={styles.noteList__column}>
          {RenderNoteComponentsHandler(column_1_Notes)}
        </View>
        <View style={styles.noteList__column}>
          {RenderNoteComponentsHandler(column_2_Notes)}
        </View>
      </View>);
  }

  const RenderLayoutHandler = () => {
    if (props.layout !== "grid")
      return RenderColumnLayoutHandler();
    else {
      return RenderGridLayoutHandler();
    }
  };

  return (
    <View style={styles.noteList}>
      <ScrollView>
        {RenderLayoutHandler()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  noteList: {
    backgroundColor: "inherit",
    height: "85%",
  },

  noteList__container: {
    flexDirection: "row",
    padding: "1%",
  },

  noteList__column: {
    flex: 1,
    marginHorizontal: "1%",
  },
});

export default NoteList;