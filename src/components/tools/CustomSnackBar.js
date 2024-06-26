import React, { useContext, useEffect, useRef } from "react";

import AppContext from "../../utils/AppContext";
import OctIcon from "react-native-vector-icons/Octicons";
import FaIcon from "react-native-vector-icons/FontAwesome";

import { Animated, View, StyleSheet, Text } from "react-native";

const CustomSnackBar = (props) => {
    const appContext = useContext(AppContext);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const snackBarAnimation = Animated.sequence([
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        })
    ]);

    useEffect(() => {
        snackBarAnimation.start(() => props.onHideSnackBar());
    }, [fadeAnim]);


    const styles = StyleSheet.create({
        snackBar: {
            backgroundColor: appContext.appTheme?.secondary,
            position: "absolute",
            bottom: -10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            alignSelf: "center",
            width: 350,
            height: 75,
            borderRadius: 10,
        },

        snackBar_iconContainer: {
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            width: 35,
            height: 35,
            marginHorizontal: 20,
        },

        snackBar_text: {
            fontSize: 16.5,
            fontWeight: 600,
            textAlign: "justify",
        }
    });

    return (
        <Animated.View style={{ ...styles.snackBar, opacity: fadeAnim }}>
            <View style={styles.snackBar_iconContainer}>
                {props.info.type === "congrats" && <OctIcon name="check-circle-fill" size={25} color="#2db551" />}
                {props.info.type === "error" && <FaIcon name="exclamation-circle" size={30} color="red" />}
                {(props.info.type == null || props.info.type === "welcome") && <FaIcon name="leaf" size={25} color="blue" />}
            </View>
            <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center", width: 250 }}>
                {props.info.type === "congrats" &&
                    <Text style={{ ...styles.snackBar_text, color: "#2db551", fontSize: 18 }}>Success</Text>}
                {props.info.type === "error" &&
                    <Text style={{ ...styles.snackBar_text, color: "red", fontSize: 18 }}>Error</Text>}
                {(props.info.type == null || props.info.type === "welcome") &&
                    <Text style={{ ...styles.snackBar_text, color: "blue", fontSize: 18, textTransform: "capitalize" }}>{props.info.type}</Text>}
                <Text style={{ ...styles.snackBar_text, color: appContext.appTheme?.text }}>{props.info.message}</Text>
            </View>
        </Animated.View>
    );
};

export default CustomSnackBar;