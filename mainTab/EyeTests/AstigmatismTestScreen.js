import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from "../../lib/supabase";
import { session } from '@supabase/supabase-js';

const AstigmatismTestScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { leftEyeScore, rightEyeScore, leftEyeTestResult, rightEyeTestResult, overallResult } = route.params || {};

  const [isLeftEyeTest, setIsLeftEyeTest] = useState(true);
  const [leftEyeAnswer, setLeftEyeAnswer] = useState(null);
  const [rightEyeAnswer, setRightEyeAnswer] = useState(null);
  const [glaringAnswer, setGlaringAnswer] = useState(null);
  const [headacheAnswer, setHeadacheAnswer] = useState(null);
  const [finalAstigmatismResult, setFinalAstigmatismResult] = useState('');

   // Function to save results to Supabase
   const saveTestResult = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User is not logged in');
        return false;
      }

      // Save test result for the logged-in user
      const { data, error } = await supabase
        .from('results')
        .insert([
          {
            user_id: user.id,

            left_eyescore: leftEyeScore,
            right_eyescore: rightEyeScore,
            left_eyetestresult: leftEyeTestResult,
            right_eyetestresult: rightEyeTestResult,
            overall_result: overallResult,

            left_eyeanswer: leftEyeAnswer,
            right_eyeanswer: rightEyeAnswer,
            glaring_answer: glaringAnswer,
            headache_answer: headacheAnswer,
            final_astigmatismresult: finalAstigmatismResult,
          },
        ]);

      if (error) {
        console.error('Error saving test result:', error);
        return false;
      }

      console.log('Test result saved successfully:', data); // nadaan na dito
      return true;
    } catch (error) {
      console.error('Error saving test result:', error);
      return false;
    }
  };

  const handleGoBackHome = () => {
    saveTestResult();  // Save the test result after the test
    navigation.navigate('Home');
  };




  // Automatically set glaring and headache to "No" if both eye answers are "Yes"
  useEffect(() => {
    if (leftEyeAnswer === 'Yes' && rightEyeAnswer === 'Yes') {
      setGlaringAnswer('No');
      setHeadacheAnswer('No');
      setFinalAstigmatismResult("You don't have astigmatism");
    }
  }, [leftEyeAnswer, rightEyeAnswer]);

  // Determine the final result message based on answers
  useEffect(() => {
    if (leftEyeAnswer && rightEyeAnswer) {
      if (leftEyeAnswer === 'No' && rightEyeAnswer === 'No') {
        // Check follow-up questions for 'Yes' on either Glaring or Headache
        if (glaringAnswer === 'Yes' || headacheAnswer === 'Yes') {
          setFinalAstigmatismResult('You MAY have astigmatism');
        } else {
          setFinalAstigmatismResult("You don't have astigmatism");
        }
      } else if (leftEyeAnswer === 'Yes' || rightEyeAnswer === 'Yes') {
        // Avoid overwriting the result if both are "Yes"
        if (!(leftEyeAnswer === 'Yes' && rightEyeAnswer === 'Yes')) {
          setFinalAstigmatismResult('You MAY have astigmatism');
        }
      }
    }
  }, [leftEyeAnswer, rightEyeAnswer, glaringAnswer, headacheAnswer]);

  const handleButtonPress = (answer) => {
    if (isLeftEyeTest) {
      setLeftEyeAnswer(answer);
      setIsLeftEyeTest(false); // Switch to the right eye test
    } else {
      setRightEyeAnswer(answer);
    }
  };

  const handleGlaringAnswer = (answer) => {
    setGlaringAnswer(answer);
  };

  const handleHeadacheAnswer = (answer) => {
    setHeadacheAnswer(answer);
  };

  // Function to handle scheduling an appointment
  const handleScheduleAppointment = () => {
    // Logic to navigate to appointment screen or open a scheduling link
    navigation.navigate('Appointment'); // Replace 'Appointment' with the appropriate screen name or link
  };

  // Results will be displayed if both eye answers are given, and either follow-up answers are provided or they are automatically "No"
  const resultsDisplayed =
    leftEyeAnswer &&
    rightEyeAnswer &&
    (glaringAnswer || (leftEyeAnswer === 'Yes' && rightEyeAnswer === 'Yes')) &&
    headacheAnswer;

  // Follow-up questions (glaring and headache) will only be shown after both eye tests are answered
  const showFollowUpQuestions = (leftEyeAnswer === 'No' || rightEyeAnswer === 'No') && rightEyeAnswer !== null;

  return (
    <View style={styles.container}>
      {!resultsDisplayed && (
        <>
          <Text style={styles.title}>
            {showFollowUpQuestions ? 'ASTIGMATISM TEST FOLLOW UP QUESTIONS' : (isLeftEyeTest ? 'LEFT EYE ASTIGMATISM TEST' : 'RIGHT EYE ASTIGMATISM TEST')}
          </Text>

          {/* Conditionally render the image and the main question if follow-up questions are not being shown */}
          {!showFollowUpQuestions && (
            <>
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
        </>
      )}

      {/* Show follow-up questions only after the right eye test is answered */}
      {showFollowUpQuestions && !glaringAnswer && (
        <>
          <Text style={styles.question}>Are you experiencing glaring when it's bright?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handleGlaringAnswer('Yes')} style={styles.buttonAstigmatism}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleGlaringAnswer('No')} style={styles.buttonAstigmatism}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {glaringAnswer && !headacheAnswer && (
        <>
          <Text style={styles.question}>Are you experiencing headache?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handleHeadacheAnswer('Yes')} style={styles.buttonAstigmatism}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleHeadacheAnswer('No')} style={styles.buttonAstigmatism}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {resultsDisplayed && (
      <ScrollView>
          {/* start of astigmatism result */}
          <View style={styles.resultContainer}>
            <View style={styles.container}>
              {/* Header Section with Back Button and Title */}
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Astigmatism Result</Text>
              </View>

              {/* Astigmatism Eye Section with Local Image */}
              <View style={styles.resultSection}>
                <Image 
                  source={require('../../assets/Eye(1).png')}  // Replace this with your own image path
                  style={styles.eyeImage} 
                />
                <Text style={styles.mainText}>It seems like</Text>
                <Text style={styles.resultText}>{finalAstigmatismResult}</Text>
              </View> 

              {/* Eye Result Section - Right Eye and Left Eye in one box */}
              <View style={styles.mergedResultBox}>
                <Image 
                  source={require('../../assets/Eyes.png')}  // Replace this with your own image path
                  style={styles.iconImage} 
                />
                <View style={styles.resultTextContainer}>
                  <View style={styles.resultTextBox}>
                    <Text style={styles.eyeText}>RIGHT EYE</Text>
                    <Text style={styles.yesText}>{rightEyeAnswer}</Text>
                  </View>
                  <View style={styles.resultTextBox}>
                    <Text style={styles.eyeText}>LEFT EYE</Text>
                    <Text style={styles.noText}>{leftEyeAnswer}</Text>
                  </View>
                </View>
              </View>

              {/* Glaring and Headache Section in one box */}
              <View style={styles.mergedResultBox}>
                <Image 
                  source={require('../../assets/openEye.png')}  // Replace this with your own image path
                  style={styles.iconImage} 
                />
              <View style={styles.resultTextContainer}>
                <View style={styles.resultTextBox}>
                  <Text style={styles.eyeText}>GLARING</Text>
                  <Text style={styles.yesText}>{glaringAnswer}</Text>
                </View>
                <View style={styles.resultTextBox}>
                  <Text style={styles.eyeText}>HEADACHE</Text>
                  <Text style={styles.yesText}>{headacheAnswer}</Text>
                </View>

                  </View>
                </View>
              </View>
          </View>
          {/* end of astigmatism result */}

          {/* start of visual acuity result */}
          <View style={styles.resultContainer}>
            <View style={styles.container}>
              {/* Header Section with Back Button and Title */}
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Visual Acuity Test Result</Text>
              </View>

              {/* Astigmatism Eye Section with Local Image */}
              <View style={styles.resultSection}>
                <Image 
                  source={require('../../assets/vaChart.png')}  // Replace this with your own image path
                  style={styles.eyeImage} 
                />
                <Text style={styles.mainText}>It seems like your eyes is</Text>
                <Text style={styles.resultText}>{overallResult}</Text>
              </View>

              {/* Eye Result Section - Right Eye and Left Eye in one box */}
              <View style={styles.mergedResultBox}>
                <Image 
                  source={require('../../assets/Eye(1).png')}  // Replace this with your own image path
                  style={styles.iconImage} 
                />
                <View style={styles.resultTextContainer}>
                  <View style={styles.resultTextBox}>
                    <Text style={styles.eyeText}>RIGHT EYE</Text>
                    <Text style={styles.yesText}>{rightEyeScore}</Text>
                  </View>
                  <View style={styles.resultTextBox}>
                    <Text style={styles.eyeText}>LEFT EYE</Text>
                    <Text style={styles.noText}>{leftEyeScore}</Text>
                  </View>
                </View>
              </View>

              {/* Glaring and Headache Section in one box */}
              <View style={styles.mergedResultBox}>
                <Image 
                  source={require('../../assets/checkup.png')}  // Replace this with your own image path
                  style={styles.iconImage} 
                />
                  <View style={styles.resultTextContainer}>
                    <View style={styles.resultTextBox}>
                      <Text style={styles.eyeText}>RIGHT EYE</Text>
                      <Text style={styles.yesText}>{rightEyeTestResult}</Text>
                    </View>
                    <View style={styles.resultTextBox}>
                      <Text style={styles.eyeText}>LEFT EYE</Text>
                      <Text style={styles.yesText}>{leftEyeTestResult}</Text>
                    </View>

                    </View>
                  </View>
              </View>
          </View>



          {/* Display "Appoint a Schedule" button if the final result indicates potential astigmatism */}
          {finalAstigmatismResult === 'You MAY have astigmatism' && (
            <TouchableOpacity onPress={handleScheduleAppointment} style={styles.scheduleButton}>
              <Text style={styles.scheduleButtonText}>Appoint a Schedule</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleGoBackHome} style={styles.homeButton}>
            <Text style={styles.homeButtonText}>Go Back Home</Text>
          </TouchableOpacity>
        
        </ScrollView>
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
    textAlign: 'center',
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
  scheduleButton: {
    marginTop: 20,
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 10,
  },
  homeButton: {
    marginBottom: 80,
    backgroundColor: '#2D796D',
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },

  //
  headerContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    alignItems: 'flex-start',
  },
  backButton: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    left: 5,
    color: '#000',
  },
  resultSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainText: {
    fontSize: 20,
    color: '#000',
  },
  resultText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  eyeImage: {
    width: 90,
    height: 90,
    marginTop: 80,
  },

  // Merged Box for Right Eye and Left Eye, Glaring and Headache
  mergedResultBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: 300,
  },
  resultTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  resultTextBox: {
    alignItems: 'center',
    flex: 1,
  },
  eyeText: {
    fontSize: 15,
    color: '#000',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  yesText: {
    fontSize: 13,
    color: 'red',
    fontWeight: 'bold',
  },
  noText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },

  // Adjusted Icon Size
  iconImage: {
    width: 70,
    height: 70,
    marginRight: 20,
    resizeMode: 'contain',
  },

  // Overlay Image for background
  overlayImage: {
    position: 'absolute',
    bottom: -80, // Positioning to place under boxes
    width: 500,
    height: 500, // Adjust to fit the design
    resizeMode: 'contain',
    zIndex: -1, // Make sure it stays behind the boxes
    opacity: 60, // Add transparency if desired
  },
});

export default AstigmatismTestScreen;
