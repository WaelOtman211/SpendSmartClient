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
     
    const [incomesData, setIncomesData] = useState(...Props.data|| []);
    
    const [editingIndex, setEditingIndex] = useState(null);
    const [updatedAmount , setUpdatedAmount ] = useState("");
    

    useEffect(() => { setIncomesData(Props.data) }, [Props.data])
    
    try 
    {
        var totalTracked = incomesData.reduce((acc, item) => acc + parseFloat(item.tracked), 0);
        var totalAmount  = incomesData.reduce((acc, item) => acc + parseFloat(item.amount), 0);
        Props.setTotalIncome(totalAmount)
    }
    catch (error) 
    {
        var totalTracked = 0
        var totalAmount  = 0
    }
    

    const handleContainerPress = () => {
        if (editingIndex !== null) {
            setEditingIndex(null);
            
        }
    };

    const handleDeleteIncome= async (incomeId) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this income?",
            [ 
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const response = await axios.delete(`${HOST}/api/deleteIncome/${incomeId}`);
                            if (response.data.message === "Income deleted successfully") {
                                Alert.alert("Success", "income deleted successfully!");
                                const updatedIncomesData = incomesData.filter((income) => income._id !== incomeId);
                                setIncomesData(updatedIncomesData);
                            } else {
                                Alert.alert("Error", "Failed to delete income. Please try again.");
                            }
                        } catch (error) {
                            console.error("Error deleting income:", error);
                            Alert.alert("Error", "An error occurred. Please try again.");
                        }
                    },
                },
            ]
        );
    };

    const handleSaveAmount = async (index, item) => {
        
        try {
            const response = await axios.put(
                `${HOST}/api/updateAmount/${item._id}`,
                {
                    newAmount : updatedAmount ,
                    yearNumber: Props.yearNumber,
                    monthNumber: Props.monthNumber,
                }
            );

            console.log("Update response:", response.data);

            if (response.data.success) {
                Alert.alert("Success", "Amount  updated successfully!");
                const updatedIncomesData = [...incomesData];
                updatedIncomesData[index].amount  = parseFloat(updatedAmount );
                setIncomesData(updatedIncomesData);
                setEditingIndex(null);
            } else {
                Alert.alert("Error", "Failed to update Amount . Please try again.");
            }

        } catch (error) {
            console.error("Error updating Amount :", error);
            Alert.alert("Error", "An error occurred. Please try again.");
        }
    };

    const handleEditAmount  = (index) => {
        setEditingIndex(index);
        console.log(incomesData[index].amount )
        setUpdatedAmount (incomesData[index].amount);
    };


    const renderItem = ({ item, index }) => (
        <TouchableWithoutFeedback onPress={handleContainerPress}>
            <View style={styles.row}>
                {editingIndex === index ? (
                    <>
                        <TextInput
                            style={[styles.cell, styles.editInput]}
                            value={updatedAmount }
                            onChangeText={(text) => setUpdatedAmount (text)}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity onPress={() => handleSaveAmount (index, item)}>
                            <Ionicons name="checkmark" size={24} color="green" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={() => handleEditAmount (index)}>
                            <Ionicons name="pencil" size={24} color="blue" />
                        </TouchableOpacity>
                        <Text style={styles.cell}>
                            {item.amount}
                        </Text>
                    </>
                )}
                <Text style={styles.cell}>{item.tracked}</Text>
                <Text style={styles.cell}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteIncome(item._id)}>
                    <Feather name="trash-2" size={20} color="blue" />
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );

    return ( 
        
        <View>
         <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.headerCell}>Amount </Text>
                    <Text style={styles.headerCell}>Tracked</Text>
                    <Text style={styles.headerCell}>Incomes</Text>
                </View>
                <View>
                    <FlatList
                        style={{ height: 300 }}
                        data={incomesData}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                    />
                </View>
                <View>
                    <>
                        <View style={styles.line} />
                        <View style={styles.totalRow}>
                            <Text style={[styles.cell, styles.totalCell]}>
                                {totalAmount .toFixed(2)}
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