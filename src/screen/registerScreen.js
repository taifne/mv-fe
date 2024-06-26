import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import React, { useState } from "react";
import CustomBox from "react-native-customized-box";
import { useNavigation } from '@react-navigation/native';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { ip } from '@env'
const RegisterScreen = () => {
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getEmailId, setEmailId] = useState("");
  const [getPassword, setPassword] = useState("");

  const [getError, setError] = useState(false);
  const [throwError, setThrowError] = useState("");
  const [firstError, setFirstError] = useState("");
  const [lastError, setLastError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const handleRegister = async () => {
    // Perform login logic here

    // Navigate to the home screen
    const registedData = {
      account: getEmailId.trim(),
      username: getFirstName.trim() + getLastName.trim(),
      email: getEmailId.trim(),
      password: getPassword.trim(),
      passwordConfirm: getPassword.trim(),
      role: 'user',
    };
    console.log("register hadle")
    const response = await fetch(`http://192.168.233.187:9000/api/v1/users/signup`, {
      method: 'POST',
      body: JSON.stringify(registedData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data.status);
    if (data.status === 'success create new user') {
      Alert.alert(
        'wrong user name or password',
        getEmailId,
        [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ],
        { cancelable: false }
      );

    }
    else {
      Alert.alert(
        'wrong user name or password',
        getEmailId,
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );
    }
  }
  const moveToLogin = () => {
    // Perform login logic here

    // Navigate to the home screen
    navigation.navigate('Login');

  };
  const handleEmailChange = (value) => {
    setEmailId(value);
    setError(false);
    setEmailError('');

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {

      setEmailError('Please enter a valid email address.');
    }
    // ... rest of the function
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
    setError(false);
    setPasswordError("");
    // Validate password complexity
    if (
      value.length < 8 ||
      !/[A-Z]/.test(value) ||
      !/[a-z]/.test(value) ||
      !/[!@#$%^&*?.]/.test(value)
    ) {

      setPasswordError(

        ' Password must be at least 8 characters long,\n Contain at least one uppercase letter,\n One special character (!@#$%^&*).'
      );
    }
    else {
      setPasswordError(
        <Text style={{ color: 'green', marginTop: '10' }}>
          Password is valid.
          <FontAwesomeIcon style={{ color: "green" }} icon={faCheckCircle} ></FontAwesomeIcon>
        </Text>
      );
    }
  };
  return (
    <View style={{ backgroundColor: "white" }}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={{ paddingTop: 20 }}>
        <View style={styles.container}>
          <Image
            style={styles.myLogo}
            source={{
              uri: "https://raw.githubusercontent.com/hirishu10/my-assets/main/top_log.png",
            }}
          />
          <Text style={styles.header}>Create Account for Free!</Text>
          <Image
            style={styles.registerImage}
            source={{
              uri: "https://raw.githubusercontent.com/hirishu10/my-assets/main/register.png",
            }}
          />
          {getError ? (
            <View style={styles.errorCard}>
              <TouchableOpacity
                style={styles.cross}
                onPress={() => {
                  setError(false);
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>
              <Text style={styles.errorCardText}>{throwError}</Text>
            </View>
          ) : null}
          {/* UserId */}

          {/* First Name */}
          <CustomBox
            placeholder={"First Name"}
            boxColor={"silver"}
            focusColor={"#e07964"}
            boxStyle={{ borderRadius: 40, borderWidth: 2 }}
            inputStyle={{
              fontWeight: "bold",
              color: "#30302e",
              paddingLeft: 20,
              borderRadius: 40,
            }}
            labelConfig={{
              text: "First Name",
              style: {
                color: "#0e0e21",
                fontWeight: "bold",
              },
            }}
            requiredConfig={{
              text: <Text>{firstError}</Text>,
              style: {
                marginBottom: 10,
              },
            }}
            values={getFirstName}
            onChangeText={(value) => {
              setFirstName(value);
              setError(false);
              setFirstError("");
            }}
          />
          {/* Last Name */}
          <CustomBox
            placeholder={"Last Name"}
            boxColor={"silver"}
            focusColor={"#e07964"}
            boxStyle={{ borderRadius: 40, borderWidth: 2 }}
            inputStyle={{
              fontWeight: "bold",
              color: "#30302e",
              paddingLeft: 20,
              borderRadius: 40,
            }}
            labelConfig={{
              text: "Last Name",
              style: {
                color: "#0e0e21",
                fontWeight: "bold",
              },
            }}
            requiredConfig={{
              text: <Text>{lastError}</Text>,
              style: {
                marginBottom: 10,
              },
            }}
            values={getLastName}
            onChangeText={(value) => {
              setLastName(value);
              setError(false);
              setLastError("");
            }}
          />
          {/* Email Id */}
          <CustomBox
            placeholder={"Email"}
            boxColor={"silver"}
            focusColor={"#e07964"}
            type={"email"}
            boxStyle={{ borderRadius: 40, borderWidth: 2 }}
            inputStyle={{
              fontWeight: "bold",
              color: "#30302e",
              paddingLeft: 20,
              borderRadius: 40,
            }}
            labelConfig={{
              text: "Email",
              style: {
                color: "#0e0e21",
                fontWeight: "bold",
              },
            }}
            requiredConfig={{
              text: <Text>{emailError}</Text>,
              style: {
                marginBottom: 10,
              },
            }}
            values={getEmailId}
            onChangeText={(value) => {

              handleEmailChange(value);
            }}
          />
          {/* Password */}
          <CustomBox
            placeholder={"Password"}
            boxColor={"silver"}
            focusColor={"#e07964"}
            boxStyle={{ borderRadius: 40, borderWidth: 2 }}
            inputStyle={{
              fontWeight: "bold",
              color: "#30302e",
              paddingLeft: 20,
              borderRadius: 40,
              overflow: "hidden",
            }}
            labelConfig={{
              text: "Password",
              style: {
                color: "#0e0e21",
                fontWeight: "bold",
              },
            }}
            toggle={true}
            requiredConfig={{
              text: <Text>{passwordError}</Text>,
              style: {
                marginBottom: 10,
              },
            }}
            values={getPassword}
            onChangeText={(value) => {

              handlePasswordChange(value);
            }}
          />
          {/* Login Button */}
          <TouchableOpacity
            style={styles.registerbtn}
            onPress={handleRegister}
          >
            <Text style={styles.registerBtnText}>Register</Text>
            {loading && loading ? (
              <ActivityIndicator style={styles.indicator} color={"white"} />
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ height: 30, marginBottom: 30 }}
            onPress={moveToLogin}
          >
            <Text style={{ color: "red", marginBottom: 30, height: 50 }}>Already have account ?!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  errorCard: {
    width: 300,
    height: 50,
    backgroundColor: "#de3138",
    justifyContent: "center",
    paddingLeft: 15,
    borderRadius: 40,
  },
  errorCardText: {
    paddingLeft: 15,
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    position: "absolute",
  },
  cross: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    left: 250,
    position: "relative",
  },
  registerImage: {
    marginTop: 20,
    width: 200,
    height: 200,
  },
  myLogo: {
    width: 70,
    height: 70,
    borderRadius: 40,
    left: 150,
    marginBottom: 20,
  },
  header: {
    fontSize: 25,
  },
  registerbtn: {
    marginTop: 10,
    backgroundColor: "#e65c40",
    width: 300,
    height: 30,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
  },
  registerBtnText: {
    color: "white",
    fontSize: 22,
  },
});
export default RegisterScreen;
