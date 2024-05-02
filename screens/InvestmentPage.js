
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView,SafeAreaView, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; // Import Feather icons from react-native-vector-icons
import FooterList from '../components/footer/FooterList';

const InvestmentPage = () => {
  const [income, setIncome] = useState('');
  const [investmentPercentage, setInvestmentPercentage] = useState('');
  const [suggestedStocks, setSuggestedStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockDetails, setStockDetails] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState(0); // New state variable
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    fetchSuggestedStocks();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const fetchSuggestedStocks = () => {
    // Simulated API call to fetch suggested stocks
    const simulatedApiCall = new Promise(resolve => {
      setTimeout(() => {
        const stocks = [
          { symbol: 'AAPL', name: 'Apple Inc.', price: 150.24 },
          { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3200.56 },
          { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2750.99 },
          { symbol: 'MSFT', name: 'Microsoft Corporation', price: 250.88 },
          { symbol: 'TSLA', name: 'Tesla Inc.', price: 620.50 },
        ];
        resolve(stocks);
      }, 1000);
    });

    simulatedApiCall.then(data => {
      setSuggestedStocks(data);
    });
  };

  const handleInvestment = () => {
    // Validate income and investment percentage
    if (!income || !investmentPercentage) {
      // Show error message or perform necessary action
      return;
    }

    // Convert income and investment percentage to numbers
    const monthlyIncome = parseFloat(income);
    const percentage = parseInt(investmentPercentage);

    // Calculate the amount to invest based on the income and percentage
    const amount = (monthlyIncome * percentage) / 100;

    // Show suggestions for stocks
    // You can customize the logic to generate stock suggestions based on your requirements
    // For simplicity, this code selects the first 5 stocks from the suggested stocks list
    const selectedStocks = suggestedStocks.slice(0, 5);

    // Update the selected stock state
    setSelectedStock(selectedStocks[0]);

    // Update the investment amount state
    setInvestmentAmount(amount);
  };

  const handleStockSelection = async stock => {
    // Fetch the stock details using an API
    const stockDetails = await fetchStockDetails(stock.symbol);
    setStockDetails(stockDetails);
  };

  const fetchStockDetails = async symbol => {
    // Simulated API call to fetch stock details
    const simulatedApiCall = new Promise(resolve => {
      setTimeout(() => {
        const stockDetails = {
          symbol,
          name: 'Sample Stock',
          price: 100.00,
          graphData: [/* Placeholder data for the stock graph */],
        };
        resolve(stockDetails);
      }, 1000);
    });

    const stockDetails = await simulatedApiCall;
    return stockDetails;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerr}>
        <LinearGradient
          colors={['#C9F0DB', '#A0E6C3']}
          style={styles.background}
          start={[0, 0]}
          end={[1, 1]}
        />

        <Text style={styles.header}>Investment</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Monthly Income:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Monthly Income"
            value={income}
            onChangeText={text => setIncome(text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Investment Percentage:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Investment Percentage"
            value={investmentPercentage}
            onChangeText={text => setInvestmentPercentage(text)}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.calculateButton} onPress={handleInvestment}>
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Investment Amount:</Text>
          <Text style={styles.investmentAmount}>${investmentAmount}</Text>
        </View>

        {selectedStock && (
          <View style={styles.stockContainer}>
            <Text style={styles.stockTitle}>Suggested Stocks:</Text>
            <ScrollView>
              {suggestedStocks.map(stock => (
                <TouchableOpacity
                  key={stock.symbol}
                  style={styles.stockItem}
                  onPress={() => handleStockSelection(stock)}
                >
                  <Text style={styles.stockName}>{stock.name}</Text>
                  <Text style={styles.stockPrice}>Price: ${stock.price}</Text>
                  <Feather name="chevron-right" size={20} color="#666666" style={styles.stockIcon} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {stockDetails && (
          <View style={styles.stockDetailsContainer}>
            <Text style={styles.stockDetailsTitle}>{stockDetails.name} ({stockDetails.symbol})</Text>
            <Text style={styles.stockDetailsPrice}>Price: ${stockDetails.price}</Text>

            {/* Render the stock graph using a chart library */}
            {/* <StockGraph data={stockDetails.graphData} /> */}

            {/* You can display more details about the stock here */}
          </View>
        )}
      </View>
      {!keyboardVisible && <FooterList />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{flex: 1, justifyContent: "space-between"},
    stockIcon: {
        position: 'absolute',
        right: 10,
              },
        containerr: {
          flex: 1,
          paddingHorizontal: 20,
          
        },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#FFFFFF',
    },
    formContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333333',
    },
    input: {
      backgroundColor: '#F5F5F5',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginBottom: 20,
      fontSize: 16,
      color: '#333333',
      borderWidth: 1,
      borderColor: '#CCCCCC',
    },
    calculateButton: {
      backgroundColor: '#A0D9BB',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginBottom: 20,
    },
    calculateButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    stockContainer: {
      marginTop: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 20,
      height: 230, // Increase the height as desired
    },
    stockTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333333',
    },
    stockItem: {
      backgroundColor: '#D3F1E1',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    stockName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333333',
    },
    stockPrice: {
      fontSize: 14,
      color: '#666666',
    },
    stockDetailsContainer: {
      marginTop: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 20,
    },
    stockDetailsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333333',
    },
    stockDetailsPrice: {
      fontSize: 16,
      marginBottom: 20,
      color: '#666666',
    },
    investmentAmount: {
        fontSize: 16,
        marginBottom: 20,
        color: '#333333',
        fontWeight: 'bold',
      },
  });
  

export default InvestmentPage;
