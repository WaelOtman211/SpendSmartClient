import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { LinearGradient } from 'expo-linear-gradient';

const IncomesCircularGraph = ({ route }) => {
  const { incomesData } = route.params;
 
  // Extracting names and tracked values from expensesData
  const data = incomesData.map((income) => ({
    key: income.name,
    value: parseFloat(income.tracked),
  }));

  // Check if tracked values contain valid numeric values
  if (data.some((item) => isNaN(item.value))) {
    console.error('Invalid tracked values:', data.map((item) => item.value));
    return <Text>Error: Invalid tracked values</Text>;
  }

  // Check if data is not empty
  if (data.length === 0) {
    console.error('Data is empty');
    return <Text>Error: Data is empty</Text>;
  }

  // Sort data based on tracked amount in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);

// Generate shades of green based on the sorted order
const greenShades = sortedData.map((_, index) => {
    const ratio = index / (sortedData.length - 1); // Calculate the ratio
    const hex = Math.floor(ratio * 255); // Calculate the hex value
    return `#${hex.toString(16).padStart(2, '0')}9900`; // Use the hex value for the shade
  });
  
  // Extracting names and tracked values from incomesData with assigned colors
  const dataWithColors = sortedData.map((income, index) => ({
    key: income.key,
    value: income.value,
    svg: { fill: greenShades[index] },
  }));
  const legendItemWidth = 180; // Adjust the width as needed

  const totalTrackedAmount = sortedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <LinearGradient
          colors={['#C9F0DB', '#A0E6C3']}
          style={styles.gradientBackground}
          start={[0, 0]}
          end={[1, 1]}
        />
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.goalTitle}>Incomes Categories Graph</Text>
          </View>
          <PieChart
            style={{ height: 200, marginTop: '10%' }}
            data={dataWithColors}
            innerRadius={'50%'}
            padAngle={0}
          />
          <View style={styles.legendContainer}>
            {sortedData.map((item, index) => (
              <View key={index} style={[styles.legendItem, { width: legendItemWidth }]}>
                <View style={[styles.legendColor, { backgroundColor: greenShades[index] }]} />
                <Text style={styles.legendText}>{item.key}</Text>
                <Text style={styles.legendText}>{item.value}</Text>
              </View>
            ))}
          </View>
          <View style={styles.separatorLine} />
          <View style={styles.totalTrackedContainer}>
            <Text style={styles.totalTrackedText}>Total Tracked: {totalTrackedAmount}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  titleContainer: {
    marginTop: '7%',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '10%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  legendText: {
    marginRight:20,
  },
  totalTrackedContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  totalTrackedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Adjust the color as needed
  },
  separatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'black', // Adjust the color as needed
    marginVertical: 10,
    marginHorizontal: '15%',
    marginTop:'10%'
  },
});

export default IncomesCircularGraph;