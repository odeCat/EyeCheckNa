import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ScrollView } from 'react-native';
import { session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const ResultScreen = () => {
  const [testResults, setTestResults] = useState([]);

  const fetchTestResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User is not logged in');
        return;
      }

      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // Order by most recent

      if (error) {
        console.error('Error fetching test results:', error);
      } else {
        setTestResults(data);
        console.log('Fetched test results:', data);
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  useEffect(() => {
    // Fetch results when the component mounts
    fetchTestResults();
  }, []);

  return (
    <View>
      {testResults.length > 0 ? (
        <FlatList
          data={testResults}
          keyExtractor={(item) => item.id.toString()} // Convert id to string if necessary
          renderItem={({ item }) => (
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
                      source={require('../assets/Eye(1).png')}  // Replace this with your own image path
                      style={styles.eyeImage} 
                    />
                    <Text style={styles.mainText}>It seems like</Text>
                    <Text style={styles.resultText}>{item.final_astigmatismresult}</Text>
                  </View> 

                  {/* Eye Result Section - Right Eye and Left Eye in one box */}
                  <View style={styles.mergedResultBox}>
                    <Image 
                      source={require('../assets/Eyes.png')}  // Replace this with your own image path
                      style={styles.iconImage} 
                    />
                    <View style={styles.resultTextContainer}>
                      <View style={styles.resultTextBox}>
                        <Text style={styles.eyeText}>RIGHT EYE</Text>
                        <Text style={styles.yesText}>{item.right_eyeanswer}</Text>
                      </View>
                      <View style={styles.resultTextBox}>
                        <Text style={styles.eyeText}>LEFT EYE</Text>
                        <Text style={styles.noText}>{item.left_eyeanswer}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Glaring and Headache Section in one box */}
                  <View style={styles.mergedResultBox}>
                    <Image 
                      source={require('../assets/openEye.png')}  // Replace this with your own image path
                      style={styles.iconImage} 
                    />
                  <View style={styles.resultTextContainer}>
                    <View style={styles.resultTextBox}>
                      <Text style={styles.eyeText}>GLARING</Text>
                      <Text style={styles.yesText}>{item.glaring_answer}</Text>
                    </View>
                    <View style={styles.resultTextBox}>
                      <Text style={styles.eyeText}>HEADACHE</Text>
                      <Text style={styles.yesText}>{item.headache_answer}</Text>
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
                      source={require('../assets/vaChart.png')}  // Replace this with your own image path
                      style={styles.eyeImage} 
                    />
                    <Text style={styles.mainText}>It seems like your eyes is</Text>
                    <Text style={styles.resultText}>{item.overall_result}</Text>
                  </View>

                  {/* Eye Result Section - Right Eye and Left Eye in one box */}
                  <View style={styles.mergedResultBox}>
                    <Image 
                      source={require('../assets/Eye(1).png')}  // Replace this with your own image path
                      style={styles.iconImage} 
                    />
                    <View style={styles.resultTextContainer}>
                      <View style={styles.resultTextBox}>
                        <Text style={styles.eyeText}>RIGHT EYE</Text>
                        <Text style={styles.yesText}>{item.right_eyescore}</Text>
                      </View>
                      <View style={styles.resultTextBox}>
                        <Text style={styles.eyeText}>LEFT EYE</Text>
                        <Text style={styles.noText}>{item.left_eyescore}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Glaring and Headache Section in one box */}
                  <View style={styles.mergedResultBox}>
                    <Image 
                      source={require('../assets/checkup.png')}  // Replace this with your own image path
                      style={styles.iconImage} 
                    />
                      <View style={styles.resultTextContainer}>
                        <View style={styles.resultTextBox}>
                          <Text style={styles.eyeText}>RIGHT EYE</Text>
                          <Text style={styles.yesText}>{item.right_eyetestresult}</Text>
                        </View>
                        <View style={styles.resultTextBox}>
                          <Text style={styles.eyeText}>LEFT EYE</Text>
                          <Text style={styles.yesText}>{item.left_eyetestresult}</Text>
                        </View>

                        </View>
                      </View>
                  </View>
              </View>

              <View>
                <Text style={styles.dateText}>
                    Date: {new Date(item.created_at).toLocaleDateString()}
                </Text>
                <Text>
                  -------------------------------------------
                </Text>
              </View>
            </ScrollView>
          )}
        />
      ) : (
        <Text style={styles.noTestResult}>No test results available.</Text>
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  //
  headerContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    alignItems: 'flex-start',
  },
  resultContainer: {
    marginTop: 20,
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
    color: '#000',
    position: 'center',
    marginTop: 5,
  },
  noTestResult: {
    fontSize: 30,
    fontWeight: 'bold',
    position: 'center',
    alignItems: 'flex-start',
    Bottom: 30,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  dateText: {
    fontSize: 20,
    color: '#000',
    marginTop: 5,
    marginBottom: 100,
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
};

export default ResultScreen;