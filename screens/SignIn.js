
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { HOST } from '../network';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/auth';
import { LinearGradient } from 'expo-linear-gradient';
import FooterList from "../components/footer/FooterList";

const SignIn = ({ navigation }) => {
  const [EmailName, setEmailName] = useState('');
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
    if (email === '' || password === '') {
      alert("All fields are required");
      return;
    }

    const resp = await axios.post(`${HOST}/api/signin`, { email, password });

    try {
      if (resp.data.error)
        alert(resp.data.error)
      else {
        setState(resp.data);
        await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
        alert("Sign In Successfully");
        navigation.navigate("OptionPage");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} >
      <View>
        <LinearGradient
          colors={['#A0E6C3','#FFFFFF']}
          style={styles.background}
          start={[0, 0]}
          end={[1, 1]}
        />
        <View style={styles.circle2} />
        <View style={styles.circle1} />
        <View style={styles.rectangle2} />
        <Text style={{position: 'absolute',fontWeight: 'bold',fontSize: 40,color: 'black', top:128, right: "7%",}}>Spend </Text>
        <Text style={ {position: 'absolute',fontWeight: 'bold',fontSize: 64,color: 'black', top:108,right: "52%",}}>Smart</Text>
        <View style={{ marginVertical: 100 }}>
          <View style={styles.imageContainer}></View>
          <View style={styles.imageContainer}>
            <Image source={require("../assets/loginImage.png")} style={styles.imageStyles} />
          </View>
          <Text style={styles.signupText}>Welcome</Text>
          <View style={{ marginHorizontal: 24 }}>
            <Text style={{ fontWeight: 'bold',fontSize: 16, color: 'black',marginBottom: 10, }}>Email</Text>
            <TextInput style={styles.signupInput} value={email} placeholder="example@gmail.com" placeholderTextColor="#999999"
              onChangeText={text => setEmail(text)} autoCompleteType="email" keyboardType="email-address" />
          </View>
          <View style={{ marginHorizontal: 24 }}>
            <Text style={{ fontWeight: 'bold',fontSize: 16, color: 'black',marginBottom: 10, }}>Password</Text>
            <TextInput style={styles.signupInput} value={password} placeholder="Enter your Password" placeholderTextColor="#999999" onChangeText={text => setPassword(text)} secureTextEntry={true} autoComplteType="password" />
          </View>
          <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 12, textAlign: 'center' }}>Don't have an account? {" "}
            <Text style={{ color: '#008C3B', fontWeight: 'bold' }} onPress={() => navigation.navigate("SignUp")}>
              SignUp here
            </Text>
          </Text>
        </View>
      </View>
      {!keyboardVisible && <FooterList />}
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  signupText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
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
  signupInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    height: 48,
    marginBottom: 10,
  },
  circle1: {
    position: 'absolute',
    top: -100,
    right: 170,
    width: 436,
    height: 429,
    borderRadius: 430 / 2,
    backgroundColor: "#8FE388",
  },
  circle2: {
    position: 'absolute',
    top: -77,
    right: -60,
    width: 310,
    height: 310,
    borderRadius: 310/2,
    backgroundColor: "#67C28D",
  },
  buttonStyle: {
    backgroundColor: "#E4F2F0",
    height: 50,
    width:200,
    marginBottom: 20,
    justifyContent: "center",
    marginHorizontal: 110,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    top:80,
    marginBottom: 100,
  },
  imageStyles: {
    width: 100,
    height: 100,
    borderRadius: 200 / 2,
  }
})

export default SignIn;
