  import React, { useState, useEffect } from 'react';
  import { View, Text, TextInput, TouchableOpacity, AppState, Alert, Modal, ActivityIndicator, StyleSheet } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { Ionicons } from '@expo/vector-icons';
  import Checkbox from 'expo-checkbox';
  import COLORS from '../colors';
  import Button from '../Button';
  import { session } from '@supabase/supabase-js';
  import { supabase } from '../lib/supabase';
  import { useNavigation } from '@react-navigation/native';
  // import sgMail from '@sendgrid/mail'; // Import SendGrid
  // sgMail.setApiKey(process.env.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); // Set your API Key
  import apiClient from './aplClient';

  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })

  const CustomAlert = ({ visible, message, onClose }) => {
    return (
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertContainer}>
            <Ionicons name="warning-outline" size={50} color="#F9D648" />
            <Text style={styles.alertTitle}>Error</Text>
            <Text style={styles.alertMessage}>{message}</Text>
  
            <TouchableOpacity onPress={onClose} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [password, setPassword] = useState('');
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
  
    // Function to handle sign up
    const signUpWithEmail = async () => {
      if (!isChecked) {
        setAlertMessage('Please agree to the Terms and Privacy Policy.');
        setAlertVisible(true);
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.post('/auth/v1/signup', {
          email: email,
          password: password,
        });

        if (response.status === 200 || response.status === 201) {
          setAlertMessage('Success', 'Sign up completed!');
          setAlertVisible(true);
          setLoading(false);
        } else {
          setAlertMessage('Error', 'Unexpected response status: ' + response.status);
          setAlertVisible(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error during signup:', error); // Log for debugging
        // Display a meaningful error message
        setAlertMessage('Signup Error',
          error.response?.data?.message || 'Something went wrong. Please try again.');
        setAlertVisible(true);
        setLoading(false);
      }
    };


    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={{ flex: 1, marginHorizontal: 22 }}>
          <View style={{ marginVertical: 22 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginVertical: 12,
              color: COLORS.black
            }}>
              Create Account
            </Text>
            <Text style={{
              fontSize: 16,
              color: COLORS.black
            }}>Check your Visual Acuity Today!</Text>
          </View>

          {/* Input fields for first name, last name, email, password */}
          {/* First Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '400', marginVertical: 8 }}>First Name</Text>
            <View style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22
            }}>
              <TextInput
                placeholder='First Name'
                onChangeText={setFirstname}
                value={first_name}
                placeholderTextColor={COLORS.black}
                style={{ width: '100%' }}
              />
            </View>
          </View>

          {/* Last Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '400', marginVertical: 8 }}>Last Name</Text>
            <View style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22
            }}>
              <TextInput
                placeholder='Last Name'
                onChangeText={setLastname}
                value={last_name}
                placeholderTextColor={COLORS.black}
                style={{ width: '100%' }}
              />
            </View>
          </View>

          {/* Email */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '400', marginVertical: 8 }}>Email address</Text>
            <View style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22
            }}>
              <TextInput
                placeholder='Enter your email address'
                onChangeText={setEmail}
                value={email}
                placeholderTextColor={COLORS.black}
                keyboardType='email-address'
                style={{ width: '100%' }}
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '400', marginVertical: 8 }}>Password</Text>
            <View style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22
            }}>
              <TextInput
                placeholder='Enter your password'
                onChangeText={setPassword}
                value={password}
                placeholderTextColor={COLORS.black}
                secureTextEntry={!isPasswordShown}
                style={{ width: '100%' }}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
                style={{ position: 'absolute', right: 10 }}
              >
                <Ionicons name={isPasswordShown ? 'eye' : 'eye-off'} size={22} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? COLORS.primary : COLORS.grey}
            />
            <Text style={{ fontSize: 16, color: COLORS.grey, marginLeft: 8 }}>
              I agree with
              <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                <Text style={{ color: COLORS.primary, fontSize: 16, marginLeft: 8 }}> Terms</Text>
              </TouchableOpacity> and
              <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
                <Text style={{ color: COLORS.primary, fontSize: 16, marginLeft: 8 }}> Privacy</Text>
              </TouchableOpacity>
            </Text>
          </View>

          {/* Button with loading spinner */}
          <View style={{ marginTop: 18 }}>
            {
              loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <Button
                  title='Sign Up'
                  filled
                  onPress={signUpWithEmail}
                />
              )
            }
          </View>

          {/* Already have an account */}
          <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{
                fontSize: 16,
                color: COLORS.primary,
                fontWeight: 'bold',
                marginLeft: 4
              }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

      {/* Custom Alert Modal */}
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      alertTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#000',
      },
      alertMessage: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        marginVertical: 10,
      },
      okButton: {
        marginTop: 20,
        backgroundColor: '#A6EBB7',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      okButtonText: {
        color: '#000',
        fontSize: 16,
      },
    });

  export default Signup;
