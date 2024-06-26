import React, { useContext } from "react";

import AppContext from "../../utils/AppContext";
import Icon from "react-native-vector-icons/Octicons";

import { TouchableOpacity, StyleSheet, View, Text } from "react-native";

const TaskShorcut = (props) => {
    const appContext = useContext(AppContext);

    const styles = StyleSheet.create({
        taskShorcut: {
            flexDirection: "row",
            alignItems: "center",
            width: "95%",
            marginVertical: 10,
        },

        checkbox: {
            width: 24,
            height: 24,
            backgroundColor: 'transparent',
            borderRadius: 50,
            borderWidth: 1,
            borderColor: appContext.appTheme?.text,
            marginRight: 15,
            alignItems: "center"
        },

        checked: {
            width: 24,
            height: 24,
            backgroundColor: '#424242',
            borderRadius: 50,
            borderWidth: 1,
            borderColor: "transparent",
            marginRight: 15,
            alignItems: "center"
        },

        text: {
            width: "80%",
            color: appContext.appTheme?.text,
        },

        textChecked: {
            width: '80%',
            color: appContext.appTheme?.text,
            textDecorationLine: "line-through",
        },
    })

    return (
        <TouchableOpacity style={styles.taskShorcut} onPress={() => props.onCheck(props.index)}>
            <View style={props.content.isFinished ? styles.checked : styles.checkbox}>
                {props.content.isFinished && <Icon name="check" size={24} style={{}} color={"#fff"} />}
            </View>
            <Text style={props.content.isFinished ? styles.textChecked : styles.text}>{props.content.toDo} </Text>
        </TouchableOpacity>
    );
}

export default TaskShorcut;