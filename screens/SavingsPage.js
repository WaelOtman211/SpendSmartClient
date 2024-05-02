
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, SafeAreaView, KeyboardAvoidingView,Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FooterList from "../components/footer/FooterList";
import axios from 'axios';
import { HOST } from '../network';

const SavingsPage = () => {
  const [savingsAmount, setSavingsAmount] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getGoals();
    getSavings();
  }, []);

  const updateGoalsDB = async (newGoals) => {
    console.log("updateGoalsDB ->")
    console.log(newGoals)
    try {
        const response = await axios.put(`${HOST}/api/updateGoals`, {
            newGoals: newGoals
        });
        // Handle response or perform any additional actions upon success
        console.log('Goals updated successfully:'  );
    } catch (error) {
        // Handle error
        console.error('Error updating goals:', error);
        // You can choose to throw the error again to propagate it or handle it as needed
        throw error;
    }
}
 
  const getSavings = async () => {
    try {
      const resp = await axios.get(`${HOST}/api/getSavings`);
      const savings = resp.data.savings;
      setSavingsAmount(savings);
    } catch (error) {
      console.error("Error fetching savings data:", error);
      throw error;
    }
  };

  const updateSavingAmount = async (savingsAmount ) => {
    try {
      console.log("start update Saving on DB - Amount: "+savingsAmount )
      try {
        const response = await axios.put(`${HOST}/api/updateSavings`, {
          savings: savingsAmount
        });
        console.log(response)
        return true;
      } catch (error) {
        // Handle error
        Alert.alert('Error', 'Failed to update investment amount. Please try again.');
        console.error('Update failed:', error);
        return false;
      }
    } catch (error) {
      console.error("Error updating investment amount:", error);
      return false;
    }
  };


  const getGoals = async () => {
    try {
      const resp = await axios.get(`${HOST}/api/getGoals`);
      const dbGoals = resp.data.goals;

      const convertedGoals = dbGoals.map((dbGoal, index) => {
        return {
          id: (index + 1).toString(),
          title: dbGoal.name,
          amount: parseInt(dbGoal.amount),
          transferAmount: '',
        };
      });

      setGoals(convertedGoals);
    } catch (error) {
      console.error("Error fetching goals data:", error);
      throw error;
    }
  };

  const transferFunds = () => {
    // Find the selected goal
    const selectedGoalItem = goals.find(goal => goal.id === selectedGoal);
    
    // Validate transfer amount
    if (!selectedGoalItem.transferAmount || isNaN(selectedGoalItem.transferAmount)) {
      setErrorMessage('Please enter a valid transfer amount.');
      return;
    }
    
    // Convert transfer amount to number
    const transferAmountNumber = parseFloat(selectedGoalItem.transferAmount);
    
    // Validate if transfer amount is greater than available savings
    if (transferAmountNumber > savingsAmount) {
      setErrorMessage('Insufficient savings amount for transfer.');
      return;
    }
  
    // Calculate new savings amount
    const newSavingsAmount = savingsAmount - transferAmountNumber;
  
    // Update the savings amount and goal amount
    setSavingsAmount(newSavingsAmount);
  
    // Update goals in the database and saving amount
    setGoals(prevGoals => {
      const updatedGoals = prevGoals.map(goal => {
        if (goal.id === selectedGoal) {
          return { ...goal, amount: goal.amount + transferAmountNumber, transferAmount: '' };
        }
        return goal;
      });
  
      // Update goals in the database
      updateGoalsDB(updatedGoals);
  
      // Update saving amount
      updateSavingAmount(newSavingsAmount);
  
      // Reset error message
      setErrorMessage('');
  
      return updatedGoals;
    });
  };
  
  

  const renderGoalItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.goalItem, selectedGoal === item.id && styles.selectedGoalItem]}
      onPress={() => setSelectedGoal(item.id)}
    >
      <Text style={styles.goalTitle}>{item.title}</Text>
      <Text style={styles.goalAmount}>Goal Amount: ${item.amount}</Text>
      <TextInput
        style={styles.transferInput}
        placeholder="Enter Transfer Amount"
        placeholderTextColor="#999999"
        value={item.transferAmount}
        onChangeText={text => {
          setGoals(prevGoals => {
            const updatedGoals = prevGoals.map(goal => {
              if (goal.id === item.id) {
                return { ...goal, transferAmount: text };
              }
              return goal;
            });
            return updatedGoals;
          });
        }}
        keyboardType="numeric"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#C9F0DB', '#A0E6C3']}
          style={styles.background}
          start={[0, 0]}
          end={[1, 1]}
        />
        <View style={styles.containerr}>
          <Text style={styles.header}>Savings Management</Text>

          <Text style={styles.savingsAmount}>Savings Amount: ${savingsAmount}</Text>

          <Text style={styles.goalsTitle}>Goals List:</Text>

          <View style={styles.goalList}>
            <FlatList
              data={goals}
              renderItem={renderGoalItem}
              keyExtractor={item => item.id}
            />
          </View>

          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}

           
          <View style={styles.buttonContainerStyle}>
            <TouchableOpacity onPress={transferFunds} style={styles.buttonStyle}>
              <Text style={styles.TransferTextButton}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <FooterList />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
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
  savingsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  goalsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  goalList: {
    paddingBottom: 20,
  },
  goalItem: {
    backgroundColor: '#D3F1E1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedGoalItem: {
    backgroundColor: '#A0D9BB',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  goalAmount: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  transferInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  transferButton: {
    backgroundColor: '#A0D9BB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  transferButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainerStyle: {
    alignItems: 'center',
  },
  buttonStyle: {
    marginBottom: 15,
    backgroundColor: "#E4F2F0",
    height: 50,
    width: 300,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,

  },
  TransferTextButton: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
});

export default SavingsPage;
