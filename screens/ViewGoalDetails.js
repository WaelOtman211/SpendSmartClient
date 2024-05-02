
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { LinearGradient } from 'expo-linear-gradient';

const ViewGoalDetails = ({ route }) => {
  const { goalData } = route.params;
  console.log(goalData)
  goalData.collected=goalData.amount-goalData.remaining

  if (!goalData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const [statusMessage, setStatusMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');

  const calculateTimeRemaining = () => {
    const currentDate = new Date();
    const endDate = new Date(goalData.endDate);

    const timeDiff = endDate - currentDate;

    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));

    // Only show years if there are more than 0
    const yearsString = years > 0 ? `${years} years` : '';
    const monthsString = `${months} months`;

    return yearsString && monthsString ? `${yearsString} and ${monthsString}` : monthsString;
  };
  const getSmileyIcon = () => {
    // You can use any Unicode emoji or an emoji code here
    return '\u{1F609}'; // Winking face emoji
  };
  useEffect(() => {
    if (collectedPercentage < 50) {
      setStatusMessage("You still need time to complete your goal.");
    } else if (collectedPercentage >= 50 && collectedPercentage < 75) {
      setStatusMessage("You've already finished more than half the step.");
    } else if (collectedPercentage >= 75 && collectedPercentage < 90) {
      setStatusMessage("You have completed a lot of your goal!!.");
    } else if (collectedPercentage >= 90 && collectedPercentage < 100) {
      setStatusMessage("Congratulations! You're almost there!!.");
    } else if (collectedPercentage === 100) {
      setStatusMessage("Wow! Congratulations! You have completed your savings goal. Now you can achieve your goal!");
    }
    const remainingTime = calculateTimeRemaining();
    setTimeRemaining(remainingTime);

  }, [collectedPercentage]);

  const calculatePercentage = (value, total) => {
    if (total === 0) {
      return 0;
    }
    return Math.round((value / total) * 100);
  };

  const collectedPercentage = calculatePercentage(goalData.collected, goalData.amount);
  const remainingPercentage = calculatePercentage(goalData.remaining, goalData.amount);

  const pieChartData = [
    { key: 1, value: collectedPercentage, svg: { fill: '#4CAF50' }, arc: { outerRadius: '100%', padAngle: 0.02 } },
    { key: 2, value: remainingPercentage, svg: { fill: '#FFC107' }, arc: { outerRadius: '95%', padAngle: 0.02 } },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.background}>
          <LinearGradient
            colors={['#C9F0DB', '#A0E6C3']}
            style={styles.gradientBackground}
            start={[0, 0]}
            end={[1, 1]}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.goalTitle}>{goalData.name}</Text>
            <Text style={styles.statusMessage}>{statusMessage}</Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.chartContainer}>
              <PieChart style={{ height: 150 }} data={pieChartData} />
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.label}>Completed: ({collectedPercentage}%)</Text>
              <Text style={styles.label}>Rest: ({remainingPercentage}%)</Text>
              <Text style={styles.label}>Start Date: {goalData.startDate}</Text>
              <Text style={styles.label}>End Date: {goalData.endDate}</Text>
            </View>
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendLabel}>Collected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
              <Text style={styles.legendLabel}>Remaining</Text>
            </View>
          </View>
          <View style={styles.separatorLine} />

          <View style={styles.additionalLabelsContainer}>
            <Text style={styles.label}>Total Amount:             {goalData.amount}$</Text>
            <Text style={styles.label}>Collected:                    {goalData.collected}$</Text>
            <Text style={styles.label}>Remaining:                  {goalData.remaining}$</Text>
            <Text style={styles.label}>Monthly Amount:       4000$</Text>
            <Text style={styles.label}>Goal Rate:                   {goalData.rate}</Text>
          </View>
          <Text style={styles.timeRemaining}>{timeRemaining} Left To Achieve the Goal. Keep Going!!{getSmileyIcon()}</Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
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
  
  marginTop:'7%',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  contentContainer: {
    marginTop:'10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  chartContainer: {
    flex: 1,
    marginRight: 10,
  },
  dataContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'flex-start', // Align children to the start (left side)
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center items horizontally
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColor: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 7.5,
  },
  legendLabel: {
    fontSize: 16,
  },
  additionalLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  additionalLabelsContainer: {
    marginTop:'5%',
    marginLeft: '10%',
  },
  separatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'black', // Adjust the color as needed
    marginVertical: 10,
    marginHorizontal: '15%',
  },
  statusMessage: {
    fontSize: 20,
    marginTop: '5%',
    textAlign: 'center',
    fontWeight:'bold'

  },
  timeRemaining: {
    fontSize: 20,
    marginTop: '10%',
    textAlign: 'center',
    fontWeight:'bold'
  },
});

export default ViewGoalDetails;
