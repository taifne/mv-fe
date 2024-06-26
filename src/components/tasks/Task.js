import React, { useContext } from 'react';

import AppContext from '../../utils/AppContext';
import Icon from "react-native-vector-icons/Octicons";

import { View, Text, StyleSheet } from 'react-native';

const Task = (props) => {
    const appContext = useContext(AppContext);

    const getFullName = (isFinished, text) => {
        if (isFinished === false) {
            return (
                <View style={styles.itemLeft}>
                    <View style={styles.square}></View>
                    <Text style={styles.itemText}>{text} </Text>
                </View>
            )
        }
        else {
            return (
                <View style={styles.itemLeft}>
                    <View style={styles.squarebutCompleted}>
                        <Icon name="check" size={24} style={{}} color={"#fff"} />
                    </View>
                    <Text style={styles.itemTextButCompleted}>{text} </Text>
                </View>
            )
        }
    };

    const styles = StyleSheet.create({
        item: {
            backgroundColor: 'transparent',
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '95%',
        },

        itemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        square: {
            width: 24,
            height: 24,
            backgroundColor: 'transparent',
            opacity: 1,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: appContext.appTheme?.text,
            marginRight: 15,
            alignItems: "center"

        },

        squarebutCompleted: {
            width: 24,
            height: 24,
            backgroundColor: '#424242',
            opacity: 1,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#424242',
            marginRight: 15,
            alignItems: "center"

        },

        itemText: {
            maxWidth: '95%',
            color: appContext.appTheme?.text,
        },

        itemTextButCompleted: {
            maxWidth: '95%',
            color: appContext.appTheme?.text,
            textDecorationLine: "line-through",
            textDecorationStyle: 'solid'
        },

        circular: {
            width: 12,
            height: 12,
            borderColor: '#55BCF6',
            borderWidth: 2,
            borderRadius: 5,
        }
    })

    return (
        <View style={styles.item}>
            {getFullName(props.isFinished, props.text)}
        </View>
    )
}

export default Task;