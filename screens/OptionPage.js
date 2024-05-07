import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, SafeAreaView, FlatList } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import FooterList from "../components/footer/FooterList";
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { HOST } from '../network';

import Modal_Last_month_process  from '../components/Modal_Last_month_process';

const OptionPage = ({ navigation }) => {
  const user_id = '645006320188d6681b4db8f4';

  const is_client_update_Last_Month_Process=false 
 

  const DayProcess=23
  const HourProcess=23;
  const MinuteProcess=10;
  // Create a Date object for "24/02/2024 9:42"
  var processDate = new Date(2024, 2, 25, 17, 22); // Note: Months are zero-based in JavaScript, so February is represented by 1


  //Previuos Month
  const [PrevYear, setPrevYear] = useState(0);
  const [PrevMonth, setPrevMonth] = useState(0);


  const [dayCurrent, setDayCurrent] = useState(0);
  const [hourCurrent, setHourCurrent] = useState(0);
  const [minuteCurrent, setMinuteCurrent] = useState(0);
  const [expensesData, setExpensesData] = useState([]);
  const [incomesData, setIncomesData] = useState(  []);

  const [isLastMonthProcessActive, setIsLastMonthProcessActive] = useState(false);

  const handleGoals = async () => {
    navigation.navigate("GoalManagement");
  };
  const handelSavings = async () => {
    navigation.navigate("SavingsPage");
  };
  const handleInvestment = async () => {
    navigation.navigate("InvestmentPage");
  };
  state = {
    textInputs: [],
  };

   
  const fetch_value_of_last_Month_process=()=>{
    return is_client_update_Last_Month_Process
  }
  

  const getExpenses =async () => {

    var currentDate = new Date();

    // Get the last month
    var lastMonth = new Date(currentDate);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    if (lastMonth.getMonth() === 11) { // If the last month is December, adjust the year
        lastMonth.setFullYear(lastMonth.getFullYear() - 1);
    }

    // Extract year and month values
    const lastMonthValue = lastMonth.getMonth() + 1; // Months are zero-indexed, so add 1
    const yearValue = lastMonth.getFullYear();

    console.log("---getExpenses last month process ", yearValue, " ", lastMonthValue, " ---");

    const response_get_expenses = await axios.post(`${HOST}/api/getExpenses`, {
      user_id: '645006320188d6681b4db8f4',
      yearNumber: yearValue,
      monthNumber: (lastMonthValue)+""
    });
    
    setExpensesData(response_get_expenses.data.expenses|| [])
 
    return response_get_expenses.data.expenses;

  }  
  const geticomesData =async () => {
    var currentDate = new Date();
    var currentMonthValue=currentDate.getMonth()+""
    
    var curentYearValue=currentDate.getFullYear()

    month=currentMonthValue
    year=curentYearValue
    console.log("---fetchIncomesData", curentYearValue, " ", currentMonthValue, " ---");
    const response = await axios.post(`${HOST}/api/getIncomes`, {
      user_id: '645006320188d6681b4db8f4',
      yearNumber: year,
      monthNumber: month
  });

   
    setIncomesData(response.data.incomes || []);
    
    return resp.data.incomes;
  }  


  const LastMonthProcess = () => {
    console.log("check Last Month Process ")
    resp=fetch_value_of_last_Month_process()
    if (true==resp)
    {
      return 
    }  
    var currentDate = new Date();
    // Compare the processDate with the currentDate
    if (processDate > currentDate) 
    {
      return;
    } 
    else (processDate <= currentDate) 
    {
      try 
      {
        console.log("active Last Month Process ")
        setIsLastMonthProcessActive(true)
        console.log("isLastMonthProcessActive "+isLastMonthProcessActive)
        getExpenses()
        geticomesData()
 
      } 
      catch (error) 
      {
        console.error("Error fetching expenses data:", error);
      }
    }  
};


  useEffect(() => {
    const currentDate = new Date();
    console.log(currentDate.toString());
    const pastMonthDate = new Date(currentDate);

    pastMonthDate.setMonth(currentDate.getMonth() );

    setPrevYear(pastMonthDate.getFullYear().toString());
    setPrevMonth((pastMonthDate.getMonth()).toString()); 

    LastMonthProcess();
  
  }, []); 
 
   

  return (

    <SafeAreaView style={styles.container}>
     
      <View style={styles.containerr}>
        <LinearGradient
          colors={['#C9F0DB', '#A0E6C3']}
          style={styles.background}
          start={[0, 0]}
          end={[1, 1]}
        />

        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.circle2} />
            <View style={styles.circle1} />
            <Text style={styles.title}>Spend</Text>
            <Text style={styles.subtitle}>Smart</Text>

          </View>
          {true===isLastMonthProcessActive &&(
          <Modal_Last_month_process
            Visible={isLastMonthProcessActive}
            SetVisible={setIsLastMonthProcessActive}
            expensesData={expensesData}
            incomesData={incomesData}
            func_getExpenses={getExpenses}

          /> 
          ) } 
          
          <View style={styles.buttonContainerStyle}>
            <Text style={styles.selectOptionText}>Select An Option</Text>
            
            <TouchableOpacity onPress={handelSavings} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>View Saving's</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleGoals} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Manage Goals</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleInvestment} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Manage Investment</Text>
            </TouchableOpacity>

          </View>
        </View>

      </View>

      <FooterList />
        
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: { flex: 1, justifyContent: 'space-between' },
  containerr: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 40,
    color: 'black',
    top: 98,
    right: '10%',
  },
  subtitle: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 64,
    color: 'black',
    top: 78,
    left: '-2%',
  },
  selectOptionText: {
    fontSize: 24,
    fontWeight: 'bold',

    color: 'black',
    marginBottom: 40,
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
  buttonContainerStyle: {
    alignItems: 'center',
    top: -112,
    marginBottom: -30,

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
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },

});

export default OptionPage;