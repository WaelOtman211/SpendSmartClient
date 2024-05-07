
import React, { useState ,useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList ,Modal} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
 import axios from 'axios';
 import { HOST } from '../network';
 import Ionicons  from 'react-native-vector-icons/Ionicons';
 import { FontAwesome5 } from '@expo/vector-icons';
 import Items_table  from '../components/Items_table_income';
 import { useIsFocused } from '@react-navigation/native';


 var selectedYearNumber_v=0
 var selectedMonthNumber_v=0

const IncomesDetails = ({ route, navigation }) => {
    const [incomesData, setIncomesData] = useState(route.params.incomesData.incomes || []);
   
    const [editingIndex, setEditingIndex] = useState(null);
    const [updatedBudget, setUpdatedBudget] = useState("");
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedOption, setSelectedOption] = useState(0);
    
    const [yearNumber, setYearNumber] = useState("");
    const [monthNumber, setMonthNumber] = useState("");


    const ComboBox = ({ options, onSelect }) => {
        const [showDropdown, setShowDropdown] = useState(false);
        show_seleceted_date=options[0]
        const toggleDropdown = () => {
            setShowDropdown(!showDropdown);
        };

        const handleSelect = (item) => {
            setSelectedOption(item);
            onSelect(item);
            toggleDropdown();
        };
        
        return (
            <View style={styles.comboBox}>
                
                <TouchableOpacity onPress={toggleDropdown} style={styles.comboBoxTouchable}>
                    <Text style={styles.selectedOption}>{selectedOption }</Text>
                    <FontAwesome5 name={showDropdown ? "caret-up" : "caret-down"} size={16} color="black" style={styles.dropdownIcon} />
                </TouchableOpacity>
                <Modal visible={showDropdown} animationType="fade" transparent={true}>
                    <TouchableOpacity style={styles.modalOverlay} onPress={toggleDropdown}>
                        <View style={styles.modalContent}>
                            <FlatList
                                data={options}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelect(item)} style={styles.option}>
                                        <Text>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    };
    const fetchAvailableDates = async () => {
        try {
            const userId = '645006320188d6681b4db8f4';
            const response = await axios.get(`${HOST}/api/getAvailableDates`);
            const dates = response.data.availableDates || [];
            setAvailableDates(dates);
            console.log("Available Dates:", availableDates);
            dates.sort((a, b) => {
                const [yearA, monthA] = a.split('-').map(Number);
                const [yearB, monthB] = b.split('-').map(Number);
            
                // Compare years first
                if (yearA !== yearB) {
                    return yearB - yearA; // Sort by year in descending order
                }
            
                // If years are equal, compare months
                return monthB - monthA; // Sort by month in descending order
            });
            setSelectedOption(dates[0]);

            // Set default date to the previous month
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() );
            const defaultDate = `${currentDate.getFullYear()}-${currentDate.getMonth() +1}`;
            setYearNumber(currentDate.getFullYear().toString());
            setMonthNumber((currentDate.getMonth() + 1).toString());

            if (!dates.includes(defaultDate)) {
                // If the default date is not in the list, add it
                setAvailableDates([...dates, defaultDate]);
            }
        } catch (error) {
            console.error("Error fetching available dates:", error);
        }
    };
    const handleDateSelect = async (selectedDate) => {
        const [year, month] = selectedDate.split("-");
        setYearNumber(year);
        setMonthNumber(month);
        selectedYearNumber_v=year
        selectedMonthNumber_v=month
        try {
            // Fetch incomes data for the selected date
            const response = await axios.post(`${HOST}/api/getIncomes`, {
                user_id: '645006320188d6681b4db8f4',
                yearNumber: year,
                monthNumber: month
            });
            console.log("getIncomes---getIncomes: ")
            console.log(response)
            console.log("getIncomes---getIncomes: ")


            // Update incomes data state with the fetched data
            setIncomesData(response.data.incomes || []);
        } catch (error) {
            console.error("Error fetching incomes data:", error);
            Alert.alert("Error", "An error occurred while fetching incomes data. Please try again.");
        }
        console.log("handleDateSelect year",selectedYearNumber_v," monthNumber ",selectedMonthNumber_v )
    };

    const fetchIncomesData =async () => {
        var currentDate = new Date();
        var currentMonthValue=currentDate.getMonth()+1+""
       
        var curentYearValue=currentDate.getFullYear()
        selectedYearNumber_v=currentMonthValue
        selectedMonthNumber_v=curentYearValue
        console.log("---fetchIncomesData", curentYearValue, " ", currentMonthValue, " ---");
    
        const response_get_incomes = await axios.post(`${HOST}/api/getIcomes`, {
          user_id: '645006320188d6681b4db8f4',
          yearNumber: currentDate.getFullYear(),
          monthNumber: currentDate.getMonth()+1+""
        });
        setIncomesData(response_get_incomes.data.incomes|| []);
        return response_get_incomes.data.incomes;
      }  

    const isFocused = useIsFocused();

    useEffect(() => {
      const currentDate = new Date();
      const pastMonthDate = new Date(currentDate);
      pastMonthDate.setMonth(currentDate.getMonth() - 1);
  
      setYearNumber(currentDate.getFullYear().toString());
      setMonthNumber((currentDate.getMonth() + 1).toString()); // Months are 0-based

      fetchAvailableDates();
      if(isFocused){
        fetchIncomesData()
        console.log("i am in IncomesDetailsPage......................... ^_^")
      }
    }, [isFocused]); // Empty dependency array to ensure it runs only once on component mount

    const handleViewIncomesReport = async () => {
        try {
            const user_id = '645006320188d6681b4db8f4';
            const resp = await axios.post(`${HOST}/api/getIncomes`,{ user_id, yearNumber, monthNumber });
            const incomesData = resp.data;
            navigation.navigate("IncomesCircularGraph", {
                incomesData: incomesData.incomes,
            });
        } catch (error) {
            console.error("Error fetching incomes data:", error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.amount}</Text>
            <Text style={styles.cell}>{item.tracked}</Text>
            <Text style={styles.cell}>{item.name}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#C9F0DB', '#A0E6C3']}
                style={styles.gradientBackground}
                start={[0, 0]}
                end={[1, 1]}
            />
            <View style={styles.container}>
                <Text style={styles.header}>Incomes Details</Text>

                <View style={styles.row}>
                    <Text style={styles.cell}>Select Date:</Text>
                    <ComboBox options={availableDates} onSelect={handleDateSelect} />
                </View>

                <Items_table 
                    data={incomesData}
                    yearNumber={yearNumber}
                    monthNumber={monthNumber}
                    />

                <View style={{ marginBottom: 20 }}></View>
                <View style={{ marginBottom: 20 }}></View>
                <TouchableOpacity
                    onPress={handleViewIncomesReport}
                    style={styles.buttonContainer}
                >
                    <Text style={styles.buttonText}>View Incomes Report</Text>
                </TouchableOpacity>
                <TouchableOpacity  
                onPress={() => {
                    navigation.navigate("IncomesInsert", {  
                            yearNumber: selectedYearNumber_v,
                            monthNumber:selectedMonthNumber_v
                          });
                }}
                style={styles.iconButton}
            >
                <Ionicons name="add" size={30} color="white"   />
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    selectedOption: {
        flex: 1,
    },
    dropdownIcon: {
        marginLeft: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        elevation: 5,
        maxHeight: 200,
    },
    option: {
        paddingVertical: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingVertical: 12,
    },
    comboBox: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    comboBoxTouchable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        width: '100%',
    },
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    container: {
        flex: 1,
        width: '90%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333333',
        textAlign: 'center',
    },
    headerRow: {
        backgroundColor: 'green',
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
        paddingVertical: 8,
    },
    headerCell: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        alignSelf: 'center',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingVertical: 12,
    },
    cell: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        alignSelf: 'center',
        textAlign: 'center',
    },
    line: {
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
    }, 
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    totalCell: {
        fontWeight: 'bold',
    },
    buttonContainer: {
    marginBottom: 180,
    backgroundColor: "#E4F2F0",
    height: 50,
    width: '80%', // Use a percentage-based width
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
    iconButton: {
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        backgroundColor: '#67C28D', 
        borderRadius: 30,
        width: 60,
        height: 60,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Android shadow
    },
});

export default IncomesDetails;
