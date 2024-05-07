
import { TouchableOpacity, SafeAreaView, StyleSheet, View, handleSearch, Text } from "react-native";
import React, { useContext, useState ,useEffect} from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Make sure to install the @expo/vector-icons package
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { HOST } from "../../network";
const Stack = createNativeStackNavigator();


const HeaderTabs = () => {
  const [yearNumber, setYearNumber] = useState("");
  const [monthNumber, setMonthNumber] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
      const currentDate = new Date();
      const pastMonthDate = new Date(currentDate);
      pastMonthDate.setMonth(currentDate.getMonth() );
  
      setYearNumber(pastMonthDate.getFullYear().toString());
      setMonthNumber((pastMonthDate.getMonth() + 1).toString()); // Months are 0-based
    }, []); // Empty dependency array to ensure it runs only once on component mount  

    
    const handlePageSelection = async (page) => {
        // Implement navigation or logic for the selected page here
        if(page==="Expenses"){ 
          
          try {
            const user_id = '645006320188d6681b4db8f4';
            const resp = await axios.post(`${HOST}/api/getExpenses`, { user_id, yearNumber, monthNumber });
            console.log("resp   "+resp.data.expenses)
            navigation.navigate("ExpensesDetailsPage", {  
              expensesData: resp.data.expenses,
            });
          } catch (error) {
            console.error("Error fetching expenses data:", error);
          } 
        
        }
      

        else if(page==="Loan Details"){ 
          
          navigation.navigate("LoanDetails");
        
        
        }
       
    
      else if(page==="Incomes")
      { try {
        const user_id = '645006320188d6681b4db8f4';
        
        const resp = await axios.post(`${HOST}/api/getIncomes`, { user_id, yearNumber, monthNumber });
      
        navigation.navigate("IncomesDetailsPage", {  
          incomesData: resp.data,
        });
      } catch (error) {
        console.error("Error fetching expenses data:", error);
      } 
    }
   
      else if(page==="Goals Insert")
      navigation.navigate("GoalsInsertPage");
    
        toggleModal(); // Close the modal
    };
    const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility

///navigation.navigate("LoanDetails");
    // Function to toggle the modal visibility
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Function to handle selecting a suggested page

    const Search = async () => {
        setState({ token: "", user: null });
        await AsyncStorage.removeItem("auth-rm");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleModal}>
                <FontAwesome5 name="list" style={styles.iconText} />
            </TouchableOpacity>
             

            {/* Suggested Pages Modal */}
            <Modal isVisible={isModalVisible} animationIn="slideInLeft" animationOut="slideOutLeft" style={styles.modal}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <View style={styles.modalTitleContainer}>
        <Text style={styles.modalTitle}>Suggested Pages</Text>
      </View>
     
      
      <TouchableOpacity onPress={() => handlePageSelection("Expenses")} style={styles.pageItem}>
        <FontAwesome5 name="dollar-sign" style={styles.pageIcon} />
        <View style={styles.pageTextContainer}>
          <Text style={styles.pageText}>Expenses</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePageSelection("Incomes")} style={styles.pageItem}>
        <FontAwesome5 name="money-bill" style={styles.pageIcon} />
        <View style={styles.pageTextContainer}>
          <Text style={styles.pageText}>Incomes</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePageSelection("Goals Insert")} style={styles.pageItem}>
        <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="bullseye" style={styles.pageIcon} />
        </View>
        <View style={styles.pageTextContainer}>
          <Text style={styles.pageText}>Goals Insert</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePageSelection("Loan Details")} style={styles.pageItem}>
        <FontAwesome5 name="file-invoice" style={styles.pageIcon} />
        <View style={styles.pageTextContainer}>
          <Text style={styles.pageText}>Loan Details</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleModal} style={styles.cancelItem}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconText: {
    color: "#A0E6C3",
    fontSize: 25,
    textAlign: "center",
    marginHorizontal: 5,
    textTransform: "uppercase",
  },
  modalContainer: {
    flex: 1,
    marginTop: '10%',
  },
  modalContent: {
    backgroundColor: '#A0E6C3',
    height: '70%', // Adjust the height as needed
    width: '80%',
    alignSelf: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', // Title color
  },
  pageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#67C28D', // Page item background color
    width:'80%'
  },
  pageIcon: {
    color: '#fff', // Icon color
    fontSize: 30,
    marginRight: 15,
  },
  pageText: {
    fontSize: 18,
    color: 'black',
    fontWeight:"bold" // Text color
  },
  cancelItem: {
    marginTop: 'auto',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'red', // Cancel button background color
  },
  cancelText: {
    fontSize: 18,
    color: '#fff', 
    fontWeight:"bold" // Text color
    // Cancel button text color
  },
});
  export default HeaderTabs;
