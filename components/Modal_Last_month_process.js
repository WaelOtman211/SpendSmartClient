import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';
import Items_table from '../components/Items_table';
import Items_table_income from '../components/Items_table_income';
import Investment from '../components/Investment';
import axios from 'axios';
import { HOST } from '../network';
import { MaterialIcons } from '@expo/vector-icons';
import Goal_data_table from './Goal_data_table';
const Modal_Last_month_process = Props => {

  const [modalVisible, setModalVisible] = useState(Props.Visible);

  const [maxStagesNumber, setMaxStagesNumber] = useState(3);

  const [title, settitle] = useState("");
  const [GoalDetails, setGoalDetails] = useState([])
  const [nextBlocker, setNextBlocker] = useState(false);
  const [backBlocker, setBackBlocker] = useState(false);

  const [PrevYear, setPrevYear] = useState(0);
  const [PrevMonth, setPrevMonth] = useState(0);

  const [stageNumber, setStageNumber] = useState(0);

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [freeMoney, setFreeMoney] = useState(0);

  const [investmentAmount, setInvestmentAmount] = useState('');

  const [savingsAmount, setSavingsAmount] = useState("");


  const showAlert = () => {
    Alert.alert(
      'Missing fields',
      'Insert the amount of the investment ',
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed')
        }
      ],
      { cancelable: false }
    );
  };

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


  useEffect(() => {
    // Update modalVisible state based on Props.Visible
    setModalVisible(Props.Visible);
    // Rest of your logic remains the same
    const currentDate = new Date();
    var lastMonth = new Date(currentDate);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    if (lastMonth.getMonth() === 11) {
      lastMonth.setFullYear(lastMonth.getFullYear() - 1);
    }
    const lastMonthValue = lastMonth.getMonth() + 1;
    const yearValue = lastMonth.getFullYear();
    setPrevYear(yearValue);
    setPrevMonth(lastMonthValue);
    switch (stageNumber) {
      case 0:
        settitle("Your expenses from the previous month");
        break;
      case 1:
        settitle("Your Incomes from the previous month");
        break;
      case 2:
        settitle("Investment Amount");
        break;
      case 3:
        settitle("");
        break;
      default:
        settitle("");
    }
  }, [Props.Visible, stageNumber]); // Add Props.Visible to the dependency array

  console.log("---Modal_Last_month_process ", PrevYear, " ", PrevMonth, " ---");

  const backStage = async () => {
    setInvestmentAmount('')
    if (stageNumber > 0) {
      var stageNumber_temp = stageNumber - 1
      setStageNumber(stageNumber_temp)
    }
  }

  const nextStage = async () => {

    if (stageNumber == 2) {
      fun()

      if (investmentAmount == '') {
        showAlert()
        return
      }
    }
    
    var stageNumber_temp = stageNumber + 1
    setStageNumber(stageNumber_temp)
    console.log("press backStage")
    console.log(nextBlocker)

  }

  const closeStage = () => {
    setModalVisible(!modalVisible)
  }

  const getUserGoals = async () => {
    try {
      const resp = await axios.get(`${HOST}/api/getGoals`);
      const dbGoals = resp.data.goals;
      return dbGoals;
    } catch (error) {
      console.error("Error while fetching user goals:", error);
      throw error;
    }
  }

  ////////////////////////////////////////////////////////

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

  // Function to sum the rates

  const sumRates = (data) => {
    let totalRate = 0;
    for (let entry of data) {
      console.log(entry.rate)
      totalRate += parseInt(entry.rate);
    }
    return totalRate;
  }
  // Function to update the remaining amount
  function updateRemaining(goals, oneRateAmount) {
    var extraMoney = 0;

    goals.forEach(goal => {
      const rateAmount = oneRateAmount * parseInt(goal.rate);
      if (rateAmount <= goal.remaining) {
        goal.remaining -= rateAmount;
        if (goal.remaining == 0) {
          goal.achieved = true;
        }
        goal.collected = goal.amount - goal.remaining;
      }
      else {
        goal.achieved = true;
        goal.remaining = 0;
        goal.collected = goal.amount;
        extraMoney += rateAmount - goal.remaining;
      }

    });
    console.log(goals)
    console.log("extraMoney- " + extraMoney)

  }

  const budgetAlgorithm = async (freeMoney) => {
    console.log("budgetAlgorithm->")
    userGoals = await getUserGoals()
    console.log("done fetch")
    sumOfRates = sumRates(userGoals)

    console.log("sumOfRates" + sumOfRates)

    oneRateAmount = parseInt(freeMoney / sumOfRates)

    console.log("oneRateAmount-" + oneRateAmount)
    updateRemaining(userGoals, oneRateAmount);
    console.log("final saving Amount-" + savingsAmount)


    // await updateGoalsDB(userGoals)


  }
  ////////////////////////////////////////////////////////  

  const updateSavingAmount = async (savingsAmount) => {
    try {
      console.log("start update Saving on DB - Amount: " + savingsAmount)
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

  const finishStage = async () => {
    //setModalVisible(!modalVisible)
    console.log("finishStage")
    getSavings()
    console.log("Saving Amount- " + savingsAmount)
    console.log("parseInt(totalIncome) ",parseInt(totalIncome))
    setFreeMoney(parseInt(totalIncome) - parseInt(totalExpenses) - parseInt(investmentAmount))
    console.log("freeMoney-" + freeMoney)
    if (freeMoney > 0) {
      budgetAlgorithm(freeMoney)
    }

    //updateSavingAmount

    res = await updateSavingAmount(savingsAmount)
    console.log(res)
    if (res === false) {
      Alert.alert('Error', 'Failed to update Savings money. Please try again.');
      return
    }

    res = await updateInvestmentAmountDB()
    console.log(res)
    if (res === false) {
      Alert.alert('Error', 'Failed to update investment amount. Please try again.');
      return
    }

    Props.SetVisible(false)

  }
  const fun= async () => {
       
      console.log("i am here in fun ")
        
      userGoals = await getUserGoals()

      console.log(userGoals)
      sumOfRates = sumRates(userGoals)

      const freeMoneyv=parseInt(totalIncome) - parseInt(totalExpenses) - parseInt(investmentAmount)

      oneRateAmount = parseInt(freeMoneyv / sumOfRates)

      console.log("sumOfRates ",sumOfRates)
      console.log("oneRateAmount ", oneRateAmount)
      console.log("freeMoneyv ",freeMoneyv)

      const updatedGoalsArray = [];


      userGoals.forEach(goal => {
        const rateAmount = oneRateAmount * parseInt(goal.rate);
        updatedGoalsArray.push({ goal: goal.name, rateAmount });
      });

      setGoalDetails(updatedGoalsArray)
   
    }


  const updateInvestmentAmountDB = async () => {
    try {
      console.log("***updateInvestmentAmountDB1***");

      const response_getInvestAmount = await axios.get(`${HOST}/api/getInvestAmount`);
      const DBInvestAmount = response_getInvestAmount.data.investAmount;
      const newInvestAmount = (parseInt(investmentAmount) + parseInt(DBInvestAmount)).toString();

      console.log("newInvestAmount: " + newInvestAmount);
      setInvestmentAmount(newInvestAmount);

      try {
        const response = await axios.put(`${HOST}/api/updateInvestAmount`, {
          newInvestAmount: newInvestAmount
        });

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



  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.closeIcon}>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="black" />
              </Pressable>
            </View>
            <Text style={styles.modalText}>{title}</Text>
            {
              stageNumber === 0 && (
                <Items_table
                  data={Props.expensesData}
                  yearNumber={PrevYear}
                  monthNumber={PrevMonth}
                  setTotalExpenses={setTotalExpenses}
                />
              )
            }
            {
              stageNumber === 1 && (
                <Items_table_income
                  data={Props.incomesData}
                  yearNumber={PrevYear}
                  monthNumber={PrevMonth}
                  setTotalIncome={setTotalIncome}
                />
              )
            }
            {
              stageNumber === 2 && (
                <View style={{ height: "56%" }}>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={styles.stageDescription}>
                      Please enter the amount of your income you'd like to invest:
                    </Text>
                  </View>
                  <View style={styles.investmentInputContainer}>
                    <Text style={styles.investmentInputLabel}>Investment Amount:</Text>
                    <TextInput
                      style={styles.investmentInput}
                      keyboardType="numeric"
                      placeholder="Instert amount"
                      value={investmentAmount}
                      onChangeText={setInvestmentAmount}
                    />
                  </View>
                  
                </View>
              )
            }
            {
              stageNumber === 3 && (

                < View style={{ height: "56%" }}>
                  
                  

                  <Goal_data_table GoalDetails={GoalDetails} />

                </View>
              )
            }
            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 20 }}>
              {
                stageNumber !== 0 && (
                  <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.buttonBack,
                    ((backBlocker === false && stageNumber === 3)||backBlocker === false && stageNumber === 2) ? { bottom: -100 } : {},
                    backBlocker === false ? styles.activeButton : {},
                  ]}
                  onPress={() => backStage()}
                  disabled={backBlocker}
                >
                  <MaterialIcons name="arrow-back" size={24} color="black" />
                </Pressable>
                )
              }
              {
                maxStagesNumber > stageNumber && (
                  <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.buttonNext,
                    (nextBlocker === false && stageNumber ===2) ? { bottom: -100 } : {},
                    nextBlocker === false ? styles.activeButton : {},
                  ]}
                  onPress={() => nextStage()}
                  disabled={nextBlocker}
                >
                  <MaterialIcons name="arrow-forward" size={24} color="black" />
                </Pressable>
                )
              }
              {
                stageNumber === maxStagesNumber && (
                  <View style={styles.finishButtonContainer}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.finishButton,
                      nextBlocker === false ? styles.activeButton : {},
                   
                    ]}
                    onPress={() => finishStage()}
                    disabled={nextBlocker}
                  >
                    <Text style={styles.textStyle}>Finish</Text>
                  </Pressable>
                  </View>
                )
              }
            </View>
          </View>
        </View>
      </Modal >
    </View >
  );
};

const styles = StyleSheet.create({
  containerr: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',

    marginTop: 22,
  },

  modalView: {
    margin: 20,
    backgroundColor: '#C9F0DB',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 50, // Make buttons circular
    padding: 10, // Add padding for spacing
    justifyContent: 'center', // Align icon to the center of the button
    alignItems: 'center', // Align icon to the center of the button
    
  },
  buttonOpen: {
    backgroundColor: '#6C63FF', // Change background color to a shade of blue
  },
  buttonNext: {
    width: 50, // Set fixed width for circular button
    position:'absolute',
    bottom: -25,
    right:0
  },
  buttonBack: {
    width: 50, // Set fixed width for circular button
    position:'absolute',
    bottom: -25,
    left:0
   
  },
  activeButton: {
    opacity: 1, // Make active buttons fully visible
  },

  modalText: {
    marginBottom: 20, // Increase bottom margin for spacing
    textAlign: 'center',
    fontSize: 18, // Increase font size
    fontWeight: 'bold', // Make text bold
    color: '#333', // Change text color to a darker shade
  },
  stageDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  investmentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  investmentInputLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  investmentInput: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    flex: 1,
  },
  investmentExample: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },


  finishButtonContainer: {
    width: '100%',
    position:'relative',
   
  },
  finishButton: {
paddingBottom:10,
    paddingHorizontal: 30,
    position:'absolute',
    bottom: -100,
    right:0
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
   
  },
  infoText: {
    fontSize: 15,
    textAlign: 'auto',
    marginBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: '#A0E6C3',
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#6C63FF',
    marginBottom: 20,
  },
});
export default Modal_Last_month_process; 