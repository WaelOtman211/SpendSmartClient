import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback,SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import FooterList from "../components/footer/FooterList";

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleDayPress = (day) => {
    // Handle the selected date
    setSelectedDate(day.dateString);
    // Show the modal when a day is pressed
    setModalVisible(true);
  };

  const handleSaveNote = () => {
    // Save the note and description to the database
    // You can make an API call here to save the data
    // For simplicity, let's just log the data for now
    console.log(`Date: ${selectedDate}, Note: ${note}, Description: ${description}`);
    // Close the modal
    setModalVisible(false);
  };

  const closeModal = () => {
    // Close the modal when clicking outside of it
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.background}>
      <LinearGradient
          colors={['#C9F0DB', '#A0E6C3']}
          style={styles.gradientBackground}
          start={[0, 0]}
          end={[1, 1]}
        />
      <View style={styles.header}>
        <Text style={styles.headerText}>My Calendar</Text>
      </View>

      
      
       
        <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: '#A0E6C3' } }}
        />
      </View>

      {/* Modal for adding note and description */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Note and Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Add Note"
                  onChangeText={(text) => setNote(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Add Description"
                  onChangeText={(text) => setDescription(text)}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveNote}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      </View>
      <FooterList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarContainer: {
    flex: 1,
    width: '90%', // Adjust the width as needed
    alignSelf: 'center', // Center the calendar
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '20%', // Add margin to lift the note window

  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '90%', 
    alignSelf: 'center', // Center the calendar
  

  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#A0D9BB',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },

  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CalendarComponent;