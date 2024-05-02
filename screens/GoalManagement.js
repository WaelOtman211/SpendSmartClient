
import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, SafeAreaView, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FooterList from "../components/footer/FooterList";
import axios from 'axios';
import { HOST } from '../network';

const GoalManagementPage = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
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

  useEffect(() => {
    getGoals();
  }, []);

  const getGoals = async () => {
    try {
      const resp = await axios.get(`${HOST}/api/getGoals`);
      const dbGoals = resp.data.goals;
 
      setGoals(dbGoals);
    } catch (error) {
      console.error("Error fetching goals data:", error);
      throw error;
    }
  };
  
  const updateGoalsDB = async (newGoals) => {
    console.log("updateGoalsDB ->")
    console.log(newGoals)
    try {
        const response = await axios.put(`${HOST}/api/updateGoals`, {
            newGoals: newGoals
        });
        // Handle response or perform any additional actions upon success
        console.log('Goals updated successfully:', response.data);
    } catch (error) {
        // Handle error
        console.error('Error updating goals:', error);
        // You can choose to throw the error again to propagate it or handle it as needed
        throw error;
    }
  }

  const transferProcess = async (fromGoalId, toGoalId) => {
    // Find fromGoal and toGoal
    const fromGoal = goals.find(goal => goal._id === fromGoalId);
    const toGoal = goals.find(goal => goal._id === toGoalId);

    fromGoal.collected = fromGoal.amount - fromGoal.remaining;
    toGoal.collected = toGoal.amount - toGoal.remaining;

    console.log("transferAmount -->", transferAmount);
     
    // Check if the amount to transfer exceeds the collected amount in the fromGoal
    if (parseFloat(fromGoal.collected) < parseFloat(transferAmount)){
        alert("Transfer failed: You don't have enough funds in the selected goal to make this transfer.");
        return;
    }

    // Update the goals' collected and remaining amounts after the transfer
    fromGoal.collected = parseFloat(fromGoal.collected) - parseFloat(transferAmount);
    fromGoal.remaining = parseFloat(fromGoal.remaining) + parseFloat(transferAmount);

    toGoal.collected = parseFloat(toGoal.collected) + parseFloat(transferAmount);
    toGoal.remaining = parseFloat(toGoal.remaining) - parseFloat(transferAmount);
    
    await updateGoalsDB(goals)
  }

  const transferFunds = (fromGoalId, toGoalId) => {
    // Validate transfer amount
    const fromGoal = goals.find(goal => goal._id === fromGoalId);
    const toGoal = goals.find(goal => goal._id === toGoalId);
    if (!transferAmount) {
      Alert.alert(
        'Empty Transfer Amount',
        'Please enter a transfer amount before proceeding.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      return;
    }
  
    // Convert transfer amount to number
    const transferAmountNumber = parseFloat(transferAmount);
  
    // Ask user for confirmation
    Alert.alert(
      'Confirm Transfer',
      `Are you sure you want to transfer $${transferAmountNumber} from goal ${fromGoal.name} to goal ${toGoal.name}?`,
      [
        {
          text: 'Cancel',
          onPress: () => {
            // User cancelled, reset transfer amount input field
            setTransferAmount('');
          },
          style: 'cancel'
        },
        {
          text: 'Transfer',
          onPress: () => {
            transferProcess(fromGoalId, toGoalId)
            setTransferAmount('');
          }
        }
      ]
    );
  };

  const renderGoalItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.goalItem, selectedGoal === item._id && styles.selectedGoalItem]}
      onPress={() => setSelectedGoal(item._id)}
    >
      <Text style={styles.goalTitle}>{item.name}</Text>
      <Text style={styles.goalAmount}>Goal Amount: ${item.amount}</Text>
    </TouchableOpacity>
  );

  const renderGoalDetails = () => {
    if (!selectedGoal) {
      return null;
    }

    const goal = goals.find(goal => goal._id === selectedGoal);

    return (
      <View style={styles.goalDetails}>
        <Text style={styles.detailsTitle}>{goal.name}</Text>
        <Text style={styles.detailsSubtitle}>Goal Details:</Text>
        <Text style={styles.detailsText}>Amount: ${goal.amount}</Text>
        <Text style={styles.detailsText}>Collected : ${goal.amount - goal.remaining}</Text>
        <Text style={styles.detailsText}>Remaining : ${goal.remaining}</Text>
        <Text style={styles.detailsText}>Start Date: {new Date(goal.startDate).toISOString().split("T")[0]}</Text>
        <Text style={styles.detailsText}>End Date: {new Date(goal.endDate).toISOString().split("T")[0]}</Text>

        <Text style={styles.transferText}>Transfer Funds:</Text>
        <TextInput
          style={styles.transferInput}
          placeholder="Enter Transfer Amount"
          placeholderTextColor="#999999"
          value={transferAmount}
          onChangeText={text => setTransferAmount(text)}
          keyboardType="numeric"
        />

        <View style={styles.transferContainer}>
          {goals
            .filter(goal => goal._id !== selectedGoal) // Filter out the selected goal
            .map(goal => (
              <TouchableOpacity
                key={goal._id}
                style={styles.transferButton}
                onPress={() => transferFunds(selectedGoal, goal._id)}
              >
                <Text style={styles.transferButtonText}>{goal.name}</Text>
              </TouchableOpacity>
            ))}
        </View>

      </View>
    );
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

        <Text style={styles.header}>Goal Management</Text>

        <FlatList
          data={goals}
          renderItem={renderGoalItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.goalList}
        />

        {renderGoalDetails()}
      </View>
      {!keyboardVisible && <FooterList />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
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
    color: '#FFFFFF',
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
  goalDetails: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  detailsSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  detailsText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
  },
  transferText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  transferInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  transferContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  transferButton: {
    backgroundColor: '#A0D9BB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    marginRight: 10,
  },
  transferButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoalManagementPage;
