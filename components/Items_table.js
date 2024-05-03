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
 


const Items_table=Props=>{
     
    const [expensesData, setExpensesData] = useState(...Props.data|| []);
    
    const [editingIndex, setEditingIndex] = useState(null);
    const [updatedBudget, setUpdatedBudget] = useState("");
    

    useEffect(() => { setExpensesData(Props.data) }, [Props.data])
    
    try 
    {
        var totalTracked = expensesData.reduce((acc, item) => acc + parseFloat(item.tracked), 0);
        var totalBudget = expensesData.reduce((acc, item) => acc + parseFloat(item.budget), 0);
       
        Props.setTotalExpenses(totalBudget)
    }
    catch (error) 
    {
        
    }
    

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
         
        try {
            const response = await axios.put(
                `${HOST}/api/updateBudget/${item._id}`,
                {
                    newBudget: updatedBudget,
                    yearNumber: Props.yearNumber,
                    monthNumber: Props.monthNumber,
                }
            );

            console.log("Update response:", response.data);

            if (response.data.success) {
                Alert.alert("Success", "Budget updated successfully!");
                const updatedExpensesData = [...expensesData];
                updatedExpensesData[index].budget = parseFloat(updatedBudget);
                setExpensesData(updatedExpensesData);
                setEditingIndex(null);
            } else {
                Alert.alert("Error", "Failed to update budget. Please try again.");
            }

        } catch (error) {
            console.error("Error updating budget:", error);
            Alert.alert("Error", "An error occurred. Please try again.");
        }
    };

    const handleEditBudget = (index) => {
        setEditingIndex(index);
        console.log(expensesData[index].budget)
        setUpdatedBudget(expensesData[index].budget);
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

    return ( 
        
        <View>
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
    </View>
            
  );
};
 
 
const styles = StyleSheet.create({  
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
    editInput: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
    },

});
  export default Items_table; 