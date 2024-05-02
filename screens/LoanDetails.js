
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FooterList from "../components/footer/FooterList";

const LoanPage = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [income, setIncome] = useState('');
  const [loanEligible, setLoanEligible] = useState(false);
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

  const calculateMonthlyPayment = () => {
    // Validate loan amount, term, and interest rate
    if (!loanAmount || !loanTerm || !interestRate) {
      // Show error message or perform necessary action
      return;
    }

    // Convert loan amount, term, and interest rate to numbers
    const amount = parseFloat(loanAmount);
    const term = parseInt(loanTerm);
    const rate = parseFloat(interestRate) / 100;

    // Calculate monthly payment
    const monthlyRate = rate / 12;
    const numPayments = term * 12;
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));

    // Set the monthly payment state
    setMonthlyPayment(monthlyPayment.toFixed(2));

    // Check if user's income is sufficient to cover the monthly payment
    if (income) {
      const monthlyIncome = parseFloat(income);
      const percentage = (monthlyPayment / monthlyIncome) * 100;
      if (percentage <= 50) {
        setLoanEligible(true);
      } else {
        setLoanEligible(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerr}>
        <LinearGradient
          colors={['#C9F0DB', '#A0E6C3']}
          style={styles.background}
          start={[0, 0]}
          end={[1, 1]}
        />

        <Text style={styles.header}>Loan Details</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Loan Amount:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Loan Amount"
            placeholderTextColor="#999999"
            value={loanAmount}
            onChangeText={text => setLoanAmount(text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Loan Term (in years):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Loan Term"
            placeholderTextColor="#999999"
            value={loanTerm}
            onChangeText={text => setLoanTerm(text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Interest Rate (%):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Interest Rate"
            placeholderTextColor="#999999"
            value={interestRate}
            onChangeText={text => setInterestRate(text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Monthly Income:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Monthly Income"
            placeholderTextColor="#999999"
            value={income}
            onChangeText={text => setIncome(text)}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.calculateButton} onPress={calculateMonthlyPayment}>
            <Text style={styles.calculateButtonText}>Calculate Monthly Payment</Text>
          </TouchableOpacity>

          {monthlyPayment && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Monthly Payment: ${monthlyPayment}</Text>
              {loanEligible ? (
                <Text style={styles.eligibleText}>You are eligible for the loan.</Text>
              ) : (
                <Text style={styles.ineligibleText}>
                  Your monthly payment exceeds 50% of your income. It is not advisable to take the loan.
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
      {!keyboardVisible && <FooterList />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  containerr: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
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
  calculateButton: {
    backgroundColor: '#A0D9BB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: '#D3F1E1',
    borderRadius: 10,
    padding: 10,
  },
  resultText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eligibleText: {
    fontSize: 16,
    color: '#008000',
    fontWeight: 'bold',
  },
  ineligibleText: {
    fontSize: 16,
    color: '#FF0000',
    fontWeight: 'bold',
  },
});

export default LoanPage;
