
import React from "react";
import Navigation from "./components/Navigation";
import axios from 'axios';
import { HOST } from './network';
const checkConnection =async()=>{
  console.log("here")
  const resp = await axios.get(`${HOST}/api/`).then(res=>{
    console.log(res.data)
  })}
  

export default function App() {
  checkConnection();
return (
  <Navigation/>
)

}
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NavigationContainer } from '@react-navigation/native';
// import SignUp from './screens/SignUp';
// import SignIn from './screens/SignIn';
// import axios from 'axios';
// import { HOST } from './network';
// import { AuthProvider } from './context/auth';
// import Home from './screens/Home';
// const Stack = createNativeStackNavigator();

// const checkConnection =async()=>{
//   console.log("here")
//   const resp = await axios.get(`${HOST}/api/`).then(res=>{
//     console.log(res.data)
//   })
  

// }

// export default function App() {
//   checkConnection()
//   return (
//     <NavigationContainer>
//       <AuthProvider>
//       <Stack.Navigator initialRouteName="SignIn">
//         <Stack.Screen name="SignUp" component={SignUp} />
//         <Stack.Screen name="SignIn" component={SignIn} />
//         <Stack.Screen name="Home" component={Home} />
//       </Stack.Navigator>
//       </AuthProvider>
//     </NavigationContainer>

//   );
// }