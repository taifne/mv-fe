/* eslint-disable*/
import React, { useState, useEffect, useCallback, useContext } from 'react';

import Task from './Task';
import Icon from "react-native-vector-icons/Octicons";
import AppContext from '../../utils/AppContext';
import TaskModel from '../../classes/Task.js';
import Clipboard from '@react-native-clipboard/clipboard';

import { TextInput, IconButton } from '@react-native-material/core';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const TaskList = (props) => {
    const supportedURL = 'https://google.com/search?q=';

    const appContext = useContext(AppContext);

    const [task, setTask] = useState();
    const [taskItems, setTaskItems] = useState(props.taskItems);

    const completeTask = async (index) => {
        let itemsCopy = [...taskItems];
        itemsCopy[index].isFinished = !itemsCopy[index].isFinished;
        setTaskItems(itemsCopy);
    }

    const deleteTask = async (index) => {
        let itemsCopy = [...taskItems];
        itemsCopy.splice(index, 1);
        setTaskItems(itemsCopy);

    }

    const HandleAddTask = async () => {
        const temp = new TaskModel(task, false);
        if (temp.toDo == null || temp.toDo.trim() === "") {
            appContext.callSnackBar({
                type: "error",
                message: "Please enter task content!"
            });
        } else {
            setTaskItems(prev => { return [...prev, temp] });
            setTask(null);
        }
    };

    const CopyTaskHandler = (item) => {
        try {
            Clipboard.setString(item);
        } catch (error) {
            console.log(error);
        }
    }

    const WebSearch = useCallback(async (index) => {
        await Linking.openURL(supportedURL + taskItems[index].toDo);
    }, [taskItems]);

    useEffect(() => {
        props.onTasksChange(taskItems);
    }, [taskItems]);

    const styles = StyleSheet.create({
        items: {
            //marginTop: 30
        },

        taskContent: {
            height: "100%",
            flex: 1,
            backgroundColor: "transparent",
            marginHorizontal: "3%",
        },
        noteCard: {
            flexDirection: "column",
            backgroundColor: appContext.appTheme?.secondary,
            color: appContext.appTheme.text,
            width: "100%",
            height: "auto",
            marginBottom: "5%",
            borderRadius: 10,
        },

        noteCard__image: {
            width: "100%",
            aspectRatio: 3 / 2,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
        },

        noteCard__content: {
            flexDirection: "column",
            padding: 10,
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
        <View>
            <View>
                <TextInput
                    style={{ marginBottom: 20 }}
                    color={appContext.appTheme?.text}
                    inputStyle={{ color: appContext.appTheme?.text, padding: 0 }}
                    inputContainerStyle={{ backgroundColor: appContext.appTheme?.primary }}
                    placeholder="To do"
                    value={task}
                    onChangeText={text => setTask(text)}
                    variant="outlined"
                    trailing={
                        props => (
                            <IconButton
                                onPress={HandleAddTask}
                                icon={props => <Icon name="plus" {...props} />} {...props} />
                        )} />
            </View>
            <View style={styles.items}>
                {taskItems.map((item, index) => {
                    return (
                        <View key={index}>
                            <Menu>
                                <MenuTrigger triggerOnLongPress
                                    onAlternativeAction={() => completeTask(index)}
                                    customStyles={{
                                        TriggerTouchableComponent: TouchableOpacity,
                                        triggerWrapper: styles.noteCard,
                                    }}>
                                    {
                                        <Task isFinished={item.isFinished} text={item.toDo} />
                                    }
                                </MenuTrigger>
                                <MenuOptions style={styles.noteCard_popupMenu}>
                                    <Text style={styles.popupMenu_title}>{item.toDo}</Text>
                                    <MenuOption customStyles={styles.popupMenu_options} onSelect={props.showEditTaskDialog} value={{ isVisible: true, index: index, task: item }} text="Edit Task" />
                                    <MenuOption customStyles={styles.popupMenu_options} onSelect={WebSearch} value={index} text="Web Search" />
                                    <MenuOption customStyles={styles.popupMenu_options} onSelect={CopyTaskHandler} value={item.toDo} text="Copy To Clipboard" />
                                    <MenuOption customStyles={styles.popupMenu_options} onSelect={deleteTask} value={index} text="Delete Task" />
                                </MenuOptions>
                            </Menu >
                        </View>
                    )
                })
                }
            </View>
        </View >
    );
};

export default TaskList;