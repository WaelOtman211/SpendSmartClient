import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Keyboard } from 'react-native';

const InvestmentPage = (Props) => {
  const [investmentAmount, setInvestmentAmount] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Props.setNextBlocker(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      Props.setNextBlocker(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleInvestmentChange = (text) => {
    // You can add validation if needed
    if (text === '') {
      Props.setNextBlocker(true);
    } else {
      Props.setNextBlocker(false);
    }

    setInvestmentAmount(text);
    Props.setInvestmentAmount(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How much money do you want to invest?</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleInvestmentChange}
        value={investmentAmount}
        keyboardType="numeric"
        placeholder="Enter amount"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default InvestmentPage;