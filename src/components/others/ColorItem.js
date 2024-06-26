import React, { useContext } from "react";

import AppContext from "../../utils/AppContext";
import Fa5Icon from "react-native-vector-icons/FontAwesome5";

import { View, Pressable, StyleSheet } from "react-native";
import { colorTags } from "../../utils/AppColors";

const ColorItem = (props) => {
    const appContext = useContext(AppContext);

    return (
        <Pressable style={{ marginEnd: 20 }} onPress={() => props.onSelect(props.color)}>
            <View style={{
                ...styles.colorItem, width: 40, height: 40,
                backgroundColor: props.color != colorTags[0] ? props.color : appContext.appTheme?.primary
            }}>
                <View style={{ ...styles.colorItem, width: 35, height: 35, backgroundColor: appContext.appTheme?.secondary }}>
                    <View style={{
                        ...styles.colorItem, width: 20, height: 20,
                        backgroundColor: props.color != colorTags[0] ? props.color : appContext.appTheme?.primary
                    }}>
                        {props.isSelected && <Fa5Icon name="check" size={15} color="black" />}
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    colorItem: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    }
})

export default ColorItem;