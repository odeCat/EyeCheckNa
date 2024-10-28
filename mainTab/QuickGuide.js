import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const QuickGuideScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backButtonText}>{"<"}</Text>
      </TouchableOpacity>

      {/* Guide Title */}
      <Text style={styles.title}>Quick Guide for better results.</Text>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Step 1 */}
        <View style={styles.stepContainer}>
          <Image style={styles.image} source={require('../assets/Handplacement.jpg')} />
          <View style={styles.textContainer}>
            <Text style={styles.stepTitle}>1. Hand placement</Text>
            <Text style={styles.stepDescription}>
              Make sure that your hands are slightly curved, just like in the picture.
            </Text>
          </View>
        </View>

        {/* Step 2 */}
        <View style={styles.stepContainer}>
          <Image style={styles.image} source={require('../assets/CoverEye.jpg')} />
          <View style={styles.textContainer}>
            <Text style={styles.stepTitle}>2. Cover your one eye</Text>
            <Text style={styles.stepDescription}>
              Cover one eye at a time. This is to ensure that your vision is not affected while covering each eye.
            </Text>
          </View>
        </View>
      </View>

      {/* Set Date & Time Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InfoScreen')} >
        <Text style={styles.buttonText}>Proceed to Eye Test</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between', // Spread content vertically to push button to the bottom
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 90,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start', // Makes sure content is aligned to the top
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6e6e6e',
  },
 button: {
    position: 'absolute',    // Position the button absolutely
    bottom: 150,              // Adjust the distance from the bottom
    left: 20,                // Adjust the distance from the left
    right: 20,               // Adjust the distance from the right
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default QuickGuideScreen;
