import React, { useContext, useEffect, useState } from "react";

import { StyleSheet, TextInput, View } from "react-native";

import AppContext from "../../utils/AppContext";
import OctIcon from "react-native-vector-icons/Octicons";
import MatIcon from "react-native-vector-icons/MaterialIcons";
import FeaIcon from "react-native-vector-icons/Feather";

const SearchBar = (props) => {
    const appContext = useContext(AppContext);

    const [searchInput, setSearchInput] = useState("");

    const InputTextChangeHandler = (value) => {
        setSearchInput(value);
    }

    useEffect(() => {
        const onSearch = setTimeout(_ => props.onSearch(searchInput), 500);
        return () => clearTimeout(onSearch);
    }, [searchInput]);

    const styles = StyleSheet.create({
        searchBar: {
            backgroundColor: appContext.appTheme?.secondary,
            color: appContext.appTheme?.text,
            flexDirection: "row",
            width: "95%",
            height: 50,
            marginBottom: "5%",
            marginHorizontal: "2.5%",
            borderRadius: 10,
        },

        searchBar__iconContainer: {
            flex: 1.5,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        },

        searchBar__icon: {
            color: appContext.appTheme?.icon,
            size: 30,
        },

        searchBar__textInputContainer: {
            flex: 7,
            alignSelf: "center",
            height: "100%",
        },

        searchBar__textInput: {
            flex: 1,
            color: appContext.appTheme?.text,
            fontSize: 18,
            padding: 0,
        },
    });

    return (
        <View style={{ ...styles.searchBar, ...props.style }}>
            <View style={styles.searchBar__iconContainer}>
                <MatIcon name="search" {...styles.searchBar__icon} />
            </View>
            <View style={styles.searchBar__textInputContainer}>
                <TextInput
                    style={styles.searchBar__textInput}
                    autoFocus={false}
                    placeholder="Search notes"
                    placeholderTextColor={appContext.appTheme?.icon}
                    selectionColor={"#fcba03"}
                    value={searchInput}
                    onChangeText={InputTextChangeHandler} />
            </View>
            <View style={styles.searchBar__iconContainer} >
                {props.layout === "grid" && <FeaIcon
                    name="layout"
                    {...styles.searchBar__icon}
                    onPress={props.onChangeLayout} />}
                {props.layout === "column" && <OctIcon
                    name="rows"
                    {...styles.searchBar__icon}
                    onPress={props.onChangeLayout} />}
            </View>
        </View>
    );
}

export default SearchBar;