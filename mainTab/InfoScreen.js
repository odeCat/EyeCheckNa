import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const InfoScreen = ({ navigation }) => {
  const [age, setAge] = useState('');
  const [eyeglasses, setEyeglasses] = useState('');
  const [hobby, setHobby] = useState('');
  const [preferredDistance, setPreferredDistance] = useState('');

  const handleNext = () => {
    const ageValue = parseInt(age, 10);
  
    if (!age || !eyeglasses || !hobby || !preferredDistance) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
  
    if (isNaN(ageValue) || ageValue < 9 || ageValue > 89) {
      Alert.alert('Validation Error', 'Age is not valid. Please enter a valid age.');
      return;
    }
  
    // Navigate to VisualAcuityTestScreen and pass the data
    navigation.navigate('VisualAcuityTestScreen', { 
      age: ageValue, 
      eyeglasses, 
      hobby, 
      preferredDistance 
    });
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text>Age:</Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        value={age}
        onChangeText={text => setAge(text)}
      />
      </View>

      <View style={styles.inputContainer}>
        <Text>Eyeglasses:</Text>
        <Picker
          selectedValue={eyeglasses}
          style={styles.picker}
          onValueChange={setEyeglasses}
        >
          <Picker.Item label="Select option" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text>Hobby:</Text>
        <Picker
          selectedValue={hobby}
          style={styles.picker}
          onValueChange={setHobby}
        >
          <Picker.Item label="Select hobby" value="" />
          <Picker.Item label="Painting" value="Painting" />
          <Picker.Item label="Photography" value="Photography" />
          <Picker.Item label="Reading" value="Reading" />
          <Picker.Item label="Playing video games" value="Playing video games" />
          <Picker.Item label="Driving" value="Driving" />
          <Picker.Item label="Using Mobile/Computer" value="Using Mobile/Computer" />
          <Picker.Item label="Sewing or knitting" value="Sewing or knitting" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text>Preferred Distance:</Text>
        <Picker
          selectedValue={preferredDistance}
          style={styles.picker}
          onValueChange={setPreferredDistance}
        >
          <Picker.Item label="Select distance" value="30" />
          <Picker.Item label="30cm" value="30" />
          <Picker.Item label="40cm" value="40" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#2D796D',
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#2D796D',
    fontSize: 16,
  },
});

export default InfoScreen;