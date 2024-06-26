import React, { useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AppController from "../controllers/AppController";

import { DarkTheme, LightTheme } from "./AppColors";

const AppContext = React.createContext({
    appTheme: {
        primary: "",
        secondary: "",
        icon: "",
        text: "",
    },
    appLayout: null,
    snackBarMessage: null,
    callSnackBar: ({ type, message }) => { },
    changeAppLayout: () => { },
    changeAppTheme: () => { },
});

export const AppContextProvider = (props) => {
    const [appTheme, setAppTheme] = useState(null);
    const [appLayout, setAppLayout] = useState(null);
    const [snackBarMessage, setSnackbarMessage] = useState({ type: null, message: null });

    const CallSnackBar = ({ type, message }) => {
        setSnackbarMessage({
            type: type,
            message: message,
        })
    }

    const ChangeAppLayout = () => {
        setAppLayout(prev => prev !== "grid" ? "grid" : "column");
    }

    const ChangeAppTheme = () => {
        if (appTheme !== DarkTheme) {
            setAppTheme(DarkTheme);
        } else {
            setAppTheme(LightTheme);
        }
    }

    useEffect(() => {
        const SaveAppLayout = async () => {
            await AppController.SaveAppLayout(appLayout);
        }

        const GetAppLayout = async () => {
            const saveLayout = await AppController.GetAppLayout();
            setAppLayout(saveLayout != null ? saveLayout : "grid");
        }

        if (appLayout == null) {
            GetAppLayout();
        } else {
            SaveAppLayout();
        }
    }, [appLayout]);

    useEffect(() => {
        const SaveAppTheme = async () => {
            try {
                const json = JSON.stringify(appTheme);
                await AsyncStorage.setItem("_AppTheme", json);
            } catch (error) {
                console.log(error);
            }
        }

        const GetAppTheme = async () => {
            try {
                let saveTheme = await AsyncStorage.getItem("_AppTheme");
                saveTheme = JSON.parse(saveTheme);
                setAppTheme(saveTheme != null ? saveTheme : DarkTheme);
            } catch (error) {
                console.log(error);
            }
        }

        if (appTheme == null) {
            GetAppTheme();
        } else {
            SaveAppTheme();
        }
    }, [appTheme])

    return (
        <AppContext.Provider
            value={{
                appTheme: appTheme,
                appLayout: appLayout,
                snackBarMessage: snackBarMessage,
                callSnackBar: CallSnackBar,
                changeAppLayout: ChangeAppLayout,
                changeAppTheme: ChangeAppTheme,
            }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContext;