import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, AppState, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import COLORS from '../colors';
import Button from '../Button';
import { session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})


const Signup = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true)
    const { data: { session }, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if (error){ 
      Alert.alert(error.message)
      setLoading(false)
    } else {
      navigation.navigate('Main');
      setLoading(false)
    }

    // if (!session) Alert.alert("Please check your inbox for email verification!")
    // setLoading(false)
  }

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

        <View style={{ marginBottom: 12 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '400',
            marginVertical: 8
          }}>Email address</Text>
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
              style={{
                width: '100%'
              }}
            />
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '400',
            marginVertical: 8
          }}>Mobile Number</Text>
          <View style={{
            width: '100%',
            height: 48,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 22
          }}>
            <TextInput
              placeholder='+63'
              placeholderTextColor={COLORS.black}
              keyboardType='numeric'
              style={{
                width: '12%',
                borderRightWidth: 1,
                borderRightColor: COLORS.grey,
                height: '100%'
              }}
            />
            <TextInput
              placeholder='Enter your phone number'
              onChangeText={setPhone}
              value={phoneNumber}
              placeholderTextColor={COLORS.black}
              keyboardType='numeric'
              style={{
                width: '80%'
              }}
            />
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '400',
            marginVertical: 8
          }}>Password</Text>
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
              style={{
                width: '100%'
              }}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: 'absolute',
                right: 10
              }}
            >
              <Ionicons name={isPasswordShown ? 'eye' : 'eye-off'} size={22} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? COLORS.primary : COLORS.grey}
          />
          <Text style={{
            fontSize: 16,
            color: COLORS.grey,
            marginLeft: 8
          }}>I agree with
            <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
              <Text style={{color: COLORS.primary, fontSize: 16, marginLeft: 8}}> Terms</Text>
            </TouchableOpacity>
            and
            <Text style={{
              color: COLORS.primary
            }}> Privacy</Text>
          </Text>
        </View>

        <Button
          title='Sign Up'
          filled
          style={{
            marginTop: 18
          }}
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />

        <View style={{
          flexDirection: 'row',
          marginTop: 12,
          justifyContent: 'center'
        }}>
          <Text style={{
            fontSize: 16,
            color: COLORS.black
          }}>Already have an account?</Text>
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
    </SafeAreaView>
  );
};

export default Signup;
