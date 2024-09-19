import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import Avatar from './Avatar';

export default function ProfileScreen() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [image, setImage] = useState('https://via.placeholder.com/150');
  const [age, setAge] = useState('');
  const [eyeGrade, setEyeGrade] = useState('20/20');
  const [eyeglasses, setEyeglasses] = useState('no');

  const [loading, setLoading] = useState(true);
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [birth_date, setBirth] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  


  //profile
  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error("No user on the session!")

      const { data, error, status } = await supabase
        .from("profiles")
        .select(
          `username, first_name, last_name, birth_date, avatar_url`
        )
        .eq("id", session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setFirstname(data.first_name)
        setLastname(data.last_name)
        setBirth(data.birth_date)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    first_name,
    last_name,
    birth_date,
    avatar_url
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error("No user on the session!")

      const updates = {
        id: session?.user.id,
        username,
        first_name,
        last_name,
        birth_date,
        avatar_url,
        updated_at: new Date()
      }

      const { error } = await supabase.from("profiles").upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }



  // Load image from AsyncStorage when component mounts
  useEffect(() => {
    const loadImage = async () => {
      try {
        const savedImageUri = await AsyncStorage.getItem('profileImage');
        if (savedImageUri) {
          setImage(savedImageUri);
        }
      } catch (error) {
        console.error("Failed to load image from storage", error);
      }
    };

    loadImage();
  }, []);

  // Save image URI to AsyncStorage
  const saveImage = async (uri) => {
    try {
      await AsyncStorage.setItem('profileImage', uri);
    } catch (error) {
      console.error("Failed to save image to storage", error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      saveImage(uri); // Save the new image URI
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.profileImageContainer}
        colors={['#A8C7BD', '#26594C']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <TouchableOpacity style={styles.imageWrapper} onPress={pickImage}>
          <Image source={{ uri: image }} style={styles.profileImage} />
        </TouchableOpacity>
      </LinearGradient>

      <View>
            <Avatar
              size={50}
              url={avatarUrl}
              onUpload={url => {
                setAvatarUrl(url)
                updateProfile({
                  username,
                  first_name,
                  last_name,
                  birth_date,
                  avatar_url: url
                })
              }}
            />
        </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Edit Profile</Text>

          <View style={styles.form}>
            <Text>First Name</Text>
            <TextInput
              placeholder="First Name"
              value={first_name || ""}
              onChangeText={text => setFirstname(text)}
              style={styles.input}
            />
            <Text>Last Name</Text>
            <TextInput
              placeholder="Last Name"
              value={last_name || ""}
              onChangeText={text => setLastname(text)}
              style={styles.input}
            />
            <Text>Date of Birth</Text>
            <TouchableOpacity onPress={showDatepicker}>
              <TextInput
                placeholder="Date of Birth"
                style={styles.input}
                value={date.toLocaleDateString() || birth_date}
                onChangeText={text => setBirth(text)}
              />
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
            <Text>Age</Text>
            <TextInput
              placeholder="Age"
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <Text>Eye Grade</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={eyeGrade}
                onValueChange={(itemValue) => setEyeGrade(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="20/20" value="20/20" />
                <Picker.Item label="20/25" value="20/25" />
                <Picker.Item label="20/30" value="20/30" />
                <Picker.Item label="20/40" value="20/40" />
                <Picker.Item label="20/50" value="20/50" />
                <Picker.Item label="20/70" value="20/70" />
                <Picker.Item label="20/100" value="20/100" />
                <Picker.Item label="20/200" value="20/200" />
              </Picker>
            </View>
            <Text>Eyeglasses</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={eyeglasses}
                onValueChange={(itemValue) => setEyeglasses(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
              </Picker>
            </View>
            <Text>PIN</Text>
            <TextInput
              placeholder="PIN"
              style={styles.input}
              defaultValue="1234"
              secureTextEntry={true}
            />
            <Text>Email</Text>
            <TextInput
              placeholder="Email"
              style={styles.input}
              defaultValue="grangerH85@gmail.com"
            />
            <Button mode="contained" style={styles.button}>
              Save
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  profileImageContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#fff', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 220, 
    paddingBottom: 100, 
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 40,
  },
  pickerItem: {
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
  },
});

