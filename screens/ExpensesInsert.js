import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FooterList from "../components/footer/FooterList";
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HOST } from '../network';

const ExpensesInsert = ({ route, navigation }) => {
  const [name, setName] = useState("");
  const [tracked, setTracked] = useState("");
  const [budget, setBudget] = useState("");
  const [yearNumber, setYearNumber] = useState("");
  const [monthNumber, setMonthNumber] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const currentDate = new Date(); 
    const pastMonthDate = new Date(currentDate);
    pastMonthDate.setMonth(currentDate.getMonth());

    setYearNumber(route.params.yearNumber);
    setMonthNumber(route.params.monthNumber); // Months are 0-based

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [route.params.yearNumber, route.params.monthNumber]);

  const user_id = '645006320188d6681b4db8f4';

  const handleViewExpenses = async () => {
    try {
      const resp = await axios.post(`${HOST}/api/getExpenses`, { user_id, yearNumber, monthNumber });

      navigation.navigate("ExpensesDetailsPage", {
        expensesData: resp.data.expenses,
      });
    } catch (error) {
      console.error("Error fetching expenses data:", error);
    }
  };

  const handleSubmit = async () => {
    if (name === '' || tracked === '' || budget === '') {
      alert("All fields are required");
      return;
    }

    try {
      const resp = await axios.post(`${HOST}/api/insertExpenses`, {
        user_id,
        name,
        tracked,
        budget,
        yearNumber,
        monthNumber,
      });

      await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
      alert("Insert Successfully");
    } catch (error) {
      console.error("Error inserting expenses:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <LinearGradient
          colors={['#C9F0DB', '#A0E6C3']}
          style={styles.gradientBackground}
          start={[0, 0]}
          end={[1, 1]}
        />
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Insert Your Expenses</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Expenses Name </Text>
          <TextInput
            style={styles.input}
            keyboardType="default"
            onChangeText={text => setName(text)}
          />

          <Text style={styles.label}>Tracked</Text>
          <TextInput
            style={styles.input}
            keyboardType="default"
            onChangeText={text => setTracked(text)}
          />

          <Text style={styles.label}>Budget:</Text>
          <TextInput
            style={styles.input}
            keyboardType="default"
            onChangeText={text => setBudget(text)}
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleViewExpenses} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>View Expenses</Text>
          </TouchableOpacity>
        </View>
      </View>
      {!isKeyboardVisible && <FooterList />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    
    paddingTop: 40,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContainer: {
    marginBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 400, // Adjust the maximum width as needed
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  buttonStyle: {
    marginBottom: 15,
    backgroundColor: "#E4F2F0",
    height: 50,
    width: '50%', // Adjust the width as needed
    justifyContent: "center",
    alignSelf: 'center', // Center the button horizontally
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'green',
    borderRadius: 50,
    padding: 10,
  },
 
});

export default ExpensesInsert;
