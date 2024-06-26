import React, { useCallback, useContext, useEffect, useState } from "react";

import AppContext from "../../utils/AppContext";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

const HyperLink = (props) => {
    const appContext = useContext(AppContext);

    const [url, setUrl] = useState(null);

    const GoToLink = useCallback(async () => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            appContext.callSnackBar({
                type: "error",
                message: `Unexpected error - Could not open URL ${url}`,
            });
        }
    }, [url])

    useEffect(() => setUrl(props.link), [props.link]);

    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <Pressable style={{ maxWidth: "90%", marginStart: 3 }} onPress={GoToLink}>
                <Text style={styles.hyperLink}>{props.link}</Text>
            </Pressable>
            <MatComIcon style={{ marginEnd: 25 }}
                name="trash-can"
                color="red"
                size={30}
                onPress={() => props.onLinkDelete()} />
        </View>
    );
}

const styles = StyleSheet.create({
    hyperLink: {
        color: "#fcba03",
        fontSize: 18,
        textAlign: "justify",
        textDecorationLine: "underline",
    },
})

export default HyperLink;