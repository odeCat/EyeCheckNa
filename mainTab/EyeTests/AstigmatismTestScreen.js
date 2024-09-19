import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const AstigmatismTestScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { leftEyeScore, rightEyeScore, leftEyeTestResult, rightEyeTestResult, overallResult } = route.params || {};

  const [isLeftEyeTest, setIsLeftEyeTest] = useState(true);
  const [leftEyeAnswer, setLeftEyeAnswer] = useState(null);
  const [rightEyeAnswer, setRightEyeAnswer] = useState(null);

  const handleButtonPress = (answer) => {
    if (isLeftEyeTest) {
      setLeftEyeAnswer(answer);
      setIsLeftEyeTest(false); // Switch to the right eye test
    } else {
      setRightEyeAnswer(answer);
    }
  };

  const resultsDisplayed = leftEyeAnswer && rightEyeAnswer;

  const handleGoBackHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {!resultsDisplayed && (
        <>
          <Text style={styles.title}>
            {isLeftEyeTest ? 'LEFT EYE ASTIGMATISM TEST' : 'RIGHT EYE ASTIGMATISM TEST'}
          </Text>
          <Image
            source={require('../../assets/astigmatism_test.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.question}>Do all the lines appear in the same shade of black?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handleButtonPress('Yes')} style={styles.buttonAstigmatism}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleButtonPress('No')} style={styles.buttonAstigmatism}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {resultsDisplayed && (
        <>
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Left Eye: {leftEyeAnswer}</Text>
            <Text style={styles.resultText}>Right Eye: {rightEyeAnswer}</Text>
          </View>

          <Text style={styles.title}>Astigmatism Test Results</Text>
          <Text style={styles.resultText}>Left Eye Score: {leftEyeScore} / 10</Text>
          <Text style={styles.resultText}>Right Eye Score: {rightEyeScore} / 10</Text>
          <Text style={styles.resultText}>Left Eye Test: {leftEyeTestResult}</Text>
          <Text style={styles.resultText}>Right Eye Test: {rightEyeTestResult}</Text>
          <Text style={styles.resultText}>Overall Result: {overallResult}</Text>

          <TouchableOpacity onPress={handleGoBackHome} style={styles.homeButton}>
            <Text style={styles.homeButtonText}>Go Back Home</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  buttonAstigmatism: {
    backgroundColor: '#2D796D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeButton: {
    marginTop: 30,
    backgroundColor: '#2D796D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AstigmatismTestScreen;