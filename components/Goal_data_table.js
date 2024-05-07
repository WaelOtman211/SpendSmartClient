import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const Goal_data_table = (props) => {
     
    const [GoalDetails, setGoalDetails] = useState(props.GoalDetails || []);

    useEffect(() => {
        setGoalDetails(props.GoalDetails);
    }, [props.GoalDetails]);

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.goal}</Text>
            <Text style={styles.cell}>{item.rateAmount}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sentence}>Here's the amount that must be allocated to each goal until it's achieved:</Text>
            <View style={[styles.row, styles.headerRow]}>
                <Text style={styles.headerCell}>Goal</Text>
                <Text style={styles.headerCell}>Amount</Text>
            </View>
            <View style={{height: '80%'}} >
            <FlatList
                data={GoalDetails}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
            </View >
            <Text style={styles.sentence}>Remember, this is just an estimate. Adjust as needed based on your financial situation.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
         
        width: '90%',
        height: '100%'
    },
    sentence: {
        fontSize: 14,
        marginBottom: 10,
        color: '#666666',
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
});

export default Goal_data_table;
