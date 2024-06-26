import React, { useContext, useRef, useState } from "react";

import OctIcon from 'react-native-vector-icons/Octicons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import ColorPicker from "../others/ColorPicker";
import AppContext from "../../utils/AppContext";

import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

const Mischellaneous = (props) => {
    const appContext = useContext(AppContext);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [isVisible, setIsVisible] = useState(false);

    const ToggleMischellaneousBar = () => {
        if (isVisible === false) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setIsVisible(true));
        }
        else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setIsVisible(false));
        }
    }

    const AddTasksHandler = () => {
        props.addTasks([]);
        ToggleMischellaneousBar();
    }

    const OptionHandler = (callback) => {
        callback();
        ToggleMischellaneousBar();
    }

    const styles = StyleSheet.create({
        mischellaneous: {
            backgroundColor: appContext.appTheme?.secondary,
            position: "absolute",
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
        },

        mischellaneousToggleButton: {
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 50,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
        },

        mischellaneous_text: {
            color: appContext.appTheme?.text,
            fontSize: 17,
        },

        mischellaneousOption: {
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingVertical: 10,
        },

        mischellaneousIcon: {
            color: appContext.appTheme?.icon,
            size: 30,
            marginHorizontal: 15,
        },
    });

    return (
        <Animated.View style={{
            ...styles.mischellaneous,
            transform: [
                {
                    translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [255, props.isCreateNote === true ? 50 : 0]
                    })
                }]
        }}>
            <Pressable style={styles.mischellaneousToggleButton} onPress={ToggleMischellaneousBar}>
                <Text style={styles.mischellaneous_text}>Mischellaneous</Text>
            </Pressable>
            <ColorPicker
                onSelectTag={props.onSelectTag}
                onTagChange={(tag) => props.selectTag(tag)} />
            <Pressable style={styles.mischellaneousOption} onPress={AddTasksHandler}>
                <OctIcon name="checklist" {...styles.mischellaneousIcon} />
                <Text style={styles.mischellaneous_text}>Add Checklist</Text>
            </Pressable>
            <Pressable style={styles.mischellaneousOption} onPress={() => OptionHandler(props.addImage)}>
                <MatIcon name="image" {...styles.mischellaneousIcon} />
                <Text style={styles.mischellaneous_text}>Add Image</Text>
            </Pressable>
            <Pressable style={styles.mischellaneousOption} onPress={() => OptionHandler(props.addUrl)}>
                <OctIcon name="globe" {...styles.mischellaneousIcon} />
                <Text style={styles.mischellaneous_text}>Add Url</Text>
            </Pressable>
            <Pressable style={styles.mischellaneousOption} onPress={() => OptionHandler(props.deleteNote)}>
                <MatComIcon
                    name="trash-can"
                    {...styles.mischellaneousIcon}
                    color="red"
                    size={30} />
                <Text style={styles.mischellaneous_text}>Delete Note</Text>
            </Pressable>
        </Animated.View >
    );
}

export default Mischellaneous;