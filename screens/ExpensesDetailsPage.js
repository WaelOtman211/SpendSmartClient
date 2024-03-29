import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList,
    TextInput, Alert, TouchableWithoutFeedback, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { HOST } from '../network';
import { Ionicons, Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const ExpensesDetails = ({ route, navigation }) => {
    const [yearNumber, setYearNumber] = useState("");
    const [monthNumber, setMonthNumber] = useState("");
    const [expensesData, setExpensesData] = useState(route.params.expensesData || []);
    const [editingIndex, setEditingIndex] = useState(null);
    const [updatedBudget, setUpdatedBudget] = useState("");
    const totalTracked = expensesData.reduce((acc, item) => acc + parseFloat(item.tracked), 0);
    const totalBudget = expensesData.reduce((acc, item) => acc + parseFloat(item.budget), 0);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    let show_seleceted_date=0
    const [selectedOption, setSelectedOption] = useState(0);

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

    const showDatePicker = () => {
        Alert.alert(
            "Select Date",
            "Choose a date to view expenses",
            availableDates.map(date => ({
                text: date,
                onPress: () => handleDateSelect(date)
            })),
            {
                cancelable: true,
                onDismiss: () => console.log('Dismissed')
            }
        );
    };

    const handleDateSelect = async (selectedDate) => {
        const [year, month] = selectedDate.split("-");
        setYearNumber(year);
        setMonthNumber(month);
        try {
            // Fetch expenses data for the selected date
            const response = await axios.post(`${HOST}/api/getExpenses`, {
                user_id: '64d373c5bf764a582023e5f7',
                yearNumber: year,
                monthNumber: month
            });

            // Update expenses data state with the fetched data
            setExpensesData(response.data.expenses || []);
        } catch (error) {
            console.error("Error fetching expenses data:", error);
            Alert.alert("Error", "An error occurred while fetching expenses data. Please try again.");
        }
    };


    const handleEditBudget = (index) => {
        setEditingIndex(index);
        setUpdatedBudget(expensesData[index].budget.toString());
    };

    const handleContainerPress = () => {
        if (editingIndex !== null) {
            setEditingIndex(null);
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this expense?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const response = await axios.delete(`${HOST}/api/deleteExpense/${expenseId}`);
                            if (response.data.message === "Expense deleted successfully") {
                                Alert.alert("Success", "Expense deleted successfully!");
                                const updatedExpensesData = expensesData.filter((expense) => expense._id !== expenseId);
                                setExpensesData(updatedExpensesData);
                            } else {
                                Alert.alert("Error", "Failed to delete expense. Please try again.");
                            }
                        } catch (error) {
                            console.error("Error deleting expense:", error);
                            Alert.alert("Error", "An error occurred. Please try again.");
                        }
                    },
                },
            ]
        );
    };

    const handleSaveBudget = async (index, item) => {
        console.log("itemId=", item._id);
        try {
            const response = await axios.put(
                `${HOST}/api/updateBudget/${item._id}`,
                {
                    newBudget: updatedBudget,
                    yearNumber: yearNumber,
                    monthNumber: monthNumber,
                }
            );

            console.log("Update response:", response.data);

            if (response.data.success) {
                Alert.alert("Success", "Budget updated successfully!");
                const updatedExpensesData = [...expensesData];
                updatedExpensesData[index].budget = parseFloat(updatedBudget);
                setExpensesData(updatedExpensesData);
            } else {
                Alert.alert("Error", "Failed to update budget. Please try again.");
            }

        } catch (error) {
            console.error("Error updating budget:", error);
            Alert.alert("Error", "An error occurred. Please try again.");
        }
    };

    const renderItem = ({ item, index }) => (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
            <View style={styles.row}>
                {editingIndex === index ? (
                    <>
                        <TextInput
                            style={[styles.cell, styles.editInput]}
                            value={updatedBudget}
                            onChangeText={(text) => setUpdatedBudget(text)}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity onPress={() => handleSaveBudget(index, item)}>
                            <Ionicons name="checkmark" size={24} color="green" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={() => handleEditBudget(index)}>
                            <Ionicons name="pencil" size={24} color="blue" />
                        </TouchableOpacity>
                        <Text style={styles.cell}>
                            {item.budget}
                        </Text>
                    </>
                )}
                <Text style={styles.cell}>{item.tracked}</Text>
                <Text style={styles.cell}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteExpense(item._id)}>
                    <Feather name="trash-2" size={20} color="blue" />
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );

    useEffect(() => {
        const currentDate = new Date();
        console.log("hgh",currentDate.getMonth())
        // Fetch available dates from the server
        const fetchAvailableDates = async () => {
            try {
                const userId = '64d373c5bf764a582023e5f7';
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

        fetchAvailableDates();
    }, []); // Empty dependency array to ensure it runs only once on component mount




    const handleViewExpensesReport = async () => {
        try {
            const user_id = '64d373c5bf764a582023e5f7';
            const resp = await axios.post(`${HOST}/api/getExpenses`, { user_id, yearNumber, monthNumber });

            navigation.navigate("ExpensesCircularGraph", {
                expensesData: resp.data.expenses,
            });
        } catch (error) {
            console.error("Error fetching expenses data:", error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#C9F0DB', '#A0E6C3']}
                style={styles.gradientBackground}
                start={[0, 0]}
                end={[1, 1]}
            />

            <View style={styles.container}>
                <Text style={styles.header}>Expenses Details</Text>
                <View style={styles.row}>
                    <Text style={styles.cell}>Select Date:</Text>
                    <ComboBox options={availableDates} onSelect={handleDateSelect} />
                </View>
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.headerCell}>Budget</Text>
                    <Text style={styles.headerCell}>Tracked</Text>
                    <Text style={styles.headerCell}>Expenses</Text>
                </View>
                <View>
                    <FlatList
                        style={{ height: 300 }}
                        data={expensesData}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                    />
                </View>
                <View>
                    <>
                        <View style={styles.line} />
                        <View style={styles.totalRow}>
                            <Text style={[styles.cell, styles.totalCell]}>
                                {totalBudget.toFixed(2)}
                            </Text>
                            <Text style={[styles.cell, styles.totalCell]}>
                                {totalTracked.toFixed(2)}
                            </Text>
                            <Text style={[styles.cell, styles.totalCell]}>Total</Text>
                        </View>
                    </>
                </View>
                <View style={{ marginBottom: 20 }}></View>
                <TouchableOpacity
                    onPress={handleViewExpensesReport}
                    style={styles.buttonContainer}
                >
                    <Text style={styles.buttonText}>View Expenses Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("ExpensesInsert");
                    }}
                    style={styles.iconButton}
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        width: '100%',
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
        backgroundColor: 'pink',
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
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    dropdownIcon: {
        marginLeft: 'auto', // Align icon to the right
    },
    buttonContainer: {
        marginBottom: 180,
        backgroundColor: "#E4F2F0",
        height: 50,
        width: '80%',
        justifyContent: "center",
        alignSelf: 'center',
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
        elevation: 5,
    },
    editInput: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
    },

});

export default ExpensesDetails;
