
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Keyboard } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { HOST } from '../network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/auth';
import { LinearGradient } from 'expo-linear-gradient';
import FooterList from "../components/footer/FooterList";

const SignUp = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [state, setState] = useContext(AuthContext);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleSubmit = async () => {
        if (name === '' || email === '' || password === '') {
            // Alert if any field is empty
            alert("All fields are required");
            return;
        }
        try {
            // Post user data to the signup endpoint
            const resp = await axios.post(`${HOST}/api/signup`, { name, email, password });
            console.log(resp.data);
            // Check password length after successful signup
            if (password.length < 6) {
                alert("Password should be at least 6 characters long");
                return;
            }
            // Set state with response data
            setState(resp.data);
            // Store user authentication data locally
            await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
            // Alert successful signup
            alert("Sign Up Successful");
            // Navigate to the OptionPage
            navigation.navigate("OptionPage");
        } catch (error) {
            // Handle errors
            console.error(error);
            alert("An error occurred. Please try again later.");
        }
    };
    

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <LinearGradient
                colors={['#A0E6C3', '#FFFFFF']}
                style={styles.background}
                start={[0, 0]}
                end={[1, 1]}
            />
            <View style={styles.circle2} />
            <View style={styles.circle1} />
            <View style={styles.rectangle2} />

            <Text style={{ position: 'absolute', fontWeight: 'bold', fontSize: 40, color: 'black', top: 98, right: "7%", }}>Spend </Text>
            <Text style={{ position: 'absolute', fontWeight: 'bold', fontSize: 64, color: 'black', top: 78, right: '52%', }}>Smart</Text>
            <View style={{ marginVertical: 100 }}>
                <View style={styles.imageContainer}>
                    <Image source={require("../assets/110-1108976_sign-up-now-sign-up-sheet-clip-art.png")} style={styles.imageStyles} />
                </View>
                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontWeight: 'bold', frontSize: 16, color: 'black' }}>Name</Text>
                    <TextInput style={styles.signupInput} value={name} placeholder="Enter Your Name" placeholderTextColor="#999999" onChangeText={text => setName(text)} autoCapitalize="words" autoCorrect={false} />
                </View>
                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontWeight: 'bold', frontSize: 16, color: 'black' }}>Email</Text>
                    <TextInput style={styles.signupInput} value={email} placeholder="example@gmail.com" placeholderTextColor="#999999" onChangeText={text => setEmail(text)} autoCompleteType="email" keyboardType="email-address" />
                </View>
                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontWeight: 'bold', frontSize: 16, color: 'black' }}>Password</Text>
                    <TextInput style={styles.signupInput} value={password} placeholder="Insert a Passowrd" placeholderTextColor="#999999" onChangeText={text => setPassword(text)} secureTextEntry={true} autoCompleteType="password" />
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, textAlign: 'center' }}>Already Joined? {" "}
                    <Text style={{ color: '#008C3B', fontWeight: 'bold' }} onPress={() => navigation.navigate("SignIn")}>
                        Sign In
                    </Text>
                </Text>
            </View>
            {!keyboardVisible && <FooterList />}
        </KeyboardAwareScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    circle1: {
        position: 'absolute',
        top: -135,
        right: 170,
        width: 436,
        height: 429,
        borderRadius: 430 / 2,
        backgroundColor: "#8FE388",
    },
    circle2: {
        position: 'absolute',
        top: -112,
        right: -60,
        width: 310,
        height: 310,
        borderRadius: 310 / 2,
        backgroundColor: "#67C28D",
    },
    rectangle2: {
        position: 'absolute',
        width: 500,
        height: 250,
        backgroundColor: "#8FE388",
        bottom: -165,
        left: -70,
        transform: [{ rotate: '25deg' }],
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    signupText: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center'
    },
    signupInput: {
        borderBottomWidth: 0.5,
        height: 48,
        borderBottomColor: "#8e93a1",
        marginBottom: 30,
    },
    buttonStyle: {
        backgroundColor: "#E4F2F0",
        height: 50,
        width: 200,
        marginBottom: 20,
        justifyContent: "center",
        marginHorizontal: 110,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        marginTop: -5,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'black',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        top: 190,
        marginBottom: 150,
    },
    imageStyles: {
        width: 100,
        height: 100,
        marginVertical: 20,
        borderRadius: 200 / 2,
    }
});

export default SignUp;
