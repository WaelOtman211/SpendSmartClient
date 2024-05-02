
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, FlatList, Alert, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import FooterList from "../components/footer/FooterList";
import axios from 'axios';
import { HOST } from '../network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';


const GoalsInsert = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [collected, setCollected] = useState('0');
  const [remaining, setRemaining] = useState('0');
  const [achieved, setAchieved] = useState(false);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [isAddGoalPressed, setIsAddGoalPressed] = useState(true);
  const [isAchievedGoalPressed, setIsAchievedGoalPressed] = useState(false);
  const [isViewGoalPressed, setIsViewGoalPressed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState(false); // State variable to track keyboard status

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);

    const filtered = goals.filter((goal) =>
      goal.name.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredGoals(filtered);
  };

  const renderSearchBar = () => {
    return (
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search goals"
          onChangeText={(text) => handleSearch(text)}
          value={searchQuery}
        />
        <Ionicons name="search" size={24} color="#BEBDBD" style={styles.searchIcon} />
      </View>
    );
  };

  const getGoals = async () => {
    try {
      const resp = await axios.get(`${HOST}/api/getGoals`);
      const dbGoals = resp.data.goals;

      const convertedGoals = dbGoals.map((dbGoal, index) => {
        return {
          id: dbGoal._id,
          name: dbGoal.name,
          amount: parseInt(dbGoal.amount),
          collected: parseInt(dbGoal.amount-dbGoal.remaining),
          remaining: parseInt(dbGoal.remaining),
          startDate: new Date(dbGoal.startDate).toISOString().split("T")[0],
          endDate: new Date(dbGoal.endDate).toISOString().split("T")[0],
          achieved: dbGoal.achieved,
          rate:dbGoal.rate
        };
      });

      setGoals(convertedGoals);
      setFilteredGoals(convertedGoals);
    } catch (error) {
      console.error("Error fetching goals data:", error);
      throw error;
    }
  };

  useEffect(() => {
    getGoals();
  }, []);

  const handleViewGoalDetails = async (item) => {
    navigation.navigate('ViewGoalDetails', { goalData: item });
  };

  const handleViewGoals = () => {
    setIsViewGoalPressed(true);
    setIsAddGoalPressed(false);
    setIsAchievedGoalPressed(false);
  };
 
  const handelAchievedGoals = () => {
    setIsAchievedGoalPressed(true);
    setIsAddGoalPressed(false);
    setIsViewGoalPressed(false);
  };

  const handleAddGoals = () => {
    setIsAddGoalPressed(true);
    setIsAchievedGoalPressed(false);
    setIsViewGoalPressed(false);
  };


  const handleManage = async () => {
    if (name === '' || amount === '' || rate === '') {
      alert("All fields are required");
      return;
    }
  
    const goalAmount = parseInt(amount);
    const collectedAmount = parseInt(collected);
  
    if (isNaN(goalAmount) || isNaN(collectedAmount)) {
      alert("Invalid input. Amount and collected must be numbers.");
      return;
    }
  
    const remainingAmount = goalAmount - collectedAmount;
  
    user_id = 0;
    try {
      const resp = await axios.post(`${HOST}/api/insertGoals`, {
        user_id,
        name,
        amount: goalAmount, // Use the parsed goal amount
        rate,
        description,
        collected: collectedAmount, // Use the parsed collected amount
        remaining: remainingAmount, // Calculate remaining amount
        achieved,
        startDate,
        endDate
      });
  
      await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
      alert("Insert Goals Successfully");
      // Refresh the goals after insertion
      getGoals();
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };
  

  const handleDelete = async (item) => {
    // Display a confirmation dialog
    Alert.alert(
      `Delete ${item.name}`,
      `Are you sure you want to delete the goal "${item.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await axios.delete(`${HOST}/api/deleteGoal/${item.id}`);
              console.log("Delete response:", response.data);
              // Refresh the goals after deletion
              getGoals();
            } catch (error) {
              console.error("Error deleting goal:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  const renderGoalItem = ({ item }) => {
    if (isAchievedGoalPressed && !item.achieved) {
      return null; // Skip rendering non-achieved goals in the achieved goals section
    }

    return (
      <TouchableOpacity
        style={[styles.goalItem, selectedGoal === item.id && styles.selectedGoalItem]}
        onPress={() => handleViewGoalDetails(item)}
      >
        <View style={styles.goalInfoContainer}>
          {item.achieved && (
            <View style={styles.starIconContainer}>
              <FontAwesome name="star" size={20} color="#67C28D" />
            </View>
          )}
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{`${item.name} : $${item.amount}`}</Text>
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalCollected}>Collected: ${item.collected}</Text>
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalRemaining}>Remaining: ${item.remaining}</Text>
          </View>
          <TouchableOpacity style={styles.viewButton} onPress={() => handleDelete(item)}>
            <Feather name="trash-2" size={20} color="blue" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
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
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handelAchievedGoals}
            style={[styles.topBarButton, isAchievedGoalPressed && styles.activeButton]}
          >
            <Text style={[styles.topBarButtonText, isAchievedGoalPressed && styles.activeButtonText]}>
              Achieved
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleViewGoals}
            style={[styles.topBarButton, isViewGoalPressed && styles.activeButton]}
          >
            <Text style={[styles.topBarButtonText, isViewGoalPressed && styles.activeButtonText]}>
              View Goals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddGoals}
            style={[styles.topBarButton, isAddGoalPressed && styles.activeButton]}
          >
            <Text style={[styles.topBarButtonText, isAddGoalPressed && styles.activeButtonText]}>
              Add Goal
            </Text>
          </TouchableOpacity>
        </View>

        {isAchievedGoalPressed && (
          <View style={styles.content}>
            {renderSearchBar()}
            <FlatList
              data={filteredGoals}
              renderItem={renderGoalItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.goalList}
            />
          </View>
        )}

        {isViewGoalPressed && (
          <View style={styles.content}>
            {renderSearchBar()}
            <FlatList
              data={filteredGoals}
              renderItem={renderGoalItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.goalList}
            />
          </View>
        )}

        {!isAchievedGoalPressed && !isViewGoalPressed && (
          <View style={styles.content}>
            <Text style={styles.label}>Goal Name</Text>
            <TextInput
              style={styles.inputGoalName}
              keyboardType="default"
              placeholder="Enter Goal Name"
              onChangeText={(text) => setName(text)}
            />
            <View style={styles.labelInputContainer}>
              <View style={styles.inputRowContainer}>
                <Text style={styles.label}>Goal Amount:</Text>
                <TextInput
                  style={[styles.input, styles.smallInput, styles.goalAmountInput]}
                  placeholder="7000$"
                  keyboardType="numeric"
                  onChangeText={(text) => setAmount(text)}
                />
              </View>
              <View style={styles.inputRowContainer}>
                <Text style={styles.label}>Rate Your Goal:</Text>
                <TextInput
                  style={[styles.input, styles.smallInput, styles.goalAmountInput]}
                  placeholder="1 - 10"
                  keyboardType="numeric"
                  onChangeText={(text) => setRate(text)}
                />
              </View>
            </View>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.DescriptionInput}
              placeholder="Plain Text"
              keyboardType="default"
              onChangeText={(text) => setDescription(text)}
            />
            <TouchableOpacity onPress={handleManage} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Conditionally render the FooterList based on keyboard status */}
      {!keyboardStatus && <FooterList />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {

    flex: 1,
  },
  topBar: {
    marginTop: 30,

    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7F6F6',
    padding: 10,
    borderRadius: 39,
    width: 340,
    height: 50,
    marginBottom: 20,
  },
  topBarButton: {
    borderRadius: 39,
    alignSelf: 'center',
    padding: 7,
    width: 100,
    height: 35,
  },
  topBarButtonText: {
    color: '#BEBDBD',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13,
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'black',
  },
  activeButtonText: {
    color: '#67C28D',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    flex: 1
  },
  smallInput: {
    width: '60%',
    marginTop: 5,
  },
  goalAmountInput: {
    marginLeft: '10%',
  },
  labelInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputRowContainer: {
    marginBottom: 20,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
    marginHorizontal: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 20,
    width: '35%',
    paddingHorizontal: 15,
  },
  inputGoalName: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginHorizontal: 20,
    width: '90%',
    paddingHorizontal: 15,
  },
  DescriptionInput: {
    width: '90%',
    height: 163,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 20,
    textAlignVertical: 'top',
    marginHorizontal: 20,
    paddingHorizontal: 15,
  },
  buttonStyle: {
    marginBottom: 15,
    backgroundColor: "#E4F2F0",
    height: 50,
    width: '40%',
    justifyContent: "center",

    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginHorizontal: 20,
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
    right: 20,
    backgroundColor: 'green',
    borderRadius: 50,
    padding: 10,
  },
  addIcon: {
    color: 'white',
    fontSize: 20,
  },
  selectedGoalItem: {
    backgroundColor: '#A0D9BB',

  },
  goalList: {
    paddingBottom: 20,
    paddingHorizontal: '5%', // Set the horizontal padding for the goalList

  },
  goalItem: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  goalInfoContainer: {

    justifyContent: 'space-between',
  },
  goalInfo: {
    flex: 1,
    marginRight: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5, // Add margin between title and other text

  },

  goalCollected: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5, // Add margin between title and other text

  },
  goalRemaining: {
    fontSize: 16,
    color: '#333333',
  },

  starIconContainer: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  viewButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  viewButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center both horizontally and vertically
    width: '100%', // Use full width of the parent container
    marginBottom: 10,
    paddingHorizontal: 70, // Adjust the padding to your desired width

  },
  searchBar: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 20, // Adjust the padding to your desired width
  },

  searchIcon: {
    position: 'absolute',
    right: 80, // Adjust the left position based on your design
  }


});

export default GoalsInsert;
