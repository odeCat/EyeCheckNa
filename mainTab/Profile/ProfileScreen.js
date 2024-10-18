import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import COLORS from '../../colors';
import Home from '../Home';

import { supabase } from '../../lib/supabase';
import { session } from '@supabase/supabase-js';
import Avatar from './Avatar';

export default function ProfileScreen() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('https://via.placeholder.com/150');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(true);

  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [birth_date, setBirth] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");


  useEffect(() => {
    const fetchSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error fetching session:", error);
            return;
        }
        if (session) {
            setSession(session);
            getProfile(session); // Fetch profile data when the session is set
        } else {
            console.log("No session available.");
        }
    };

    fetchSession();
}, []);

  const getProfile = async (session) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!!!");
      const { data, error } = await supabase
        .from("profiles")
        .select(`first_name, last_name, birth_date, age, avatar_url`)
        .eq("id", session.user.id)
        .single();

      if (error) {
        Alert.alert("Error fetching profile:", error.message);
        return;
      }

      if (data) {
        setFirstname(data.first_name);
        setLastname(data.last_name);
        setBirth(data.birth_date);
        setAge(data.age);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      Alert.alert("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  async function updateProfile({
    first_name,
    last_name,
    birth_date,
    age,
    avatar_url,
  }) {
    try {
      setLoading(true)
      if (!session || !session.user) throw new Error("No user on the session!");

      // Convert the date to YYYY-MM-DD format
      const formattedDate = new Date(birth_date).toISOString().split('T')[0];
      
      const updates = {
        id: session?.user.id,
        first_name,
        last_name,
        birth_date: formattedDate,  // Ensure the correct format
        age,
        avatar_url,
        updated_at: new Date()
      }

      console.log(updates); // Debugging here

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }      

      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message)
        }
      } finally {
        setLoading(false)
      }
  }

  // // Save session to AsyncStorage
  // const saveSession = async (session) => {
  //   try {
  //       await AsyncStorage.setItem('session', JSON.stringify(session));
  //   } catch (error) {
  //       console.error('Error saving session:', error);
  //   }
  // };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const saveImage = async (uri) => {
    const fileName = uri.split('/').pop(); // Extract the file name from the URI
    const response = await fetch(uri); // Fetch the image data
    const blob = await response.blob(); // Convert to Blob

    // Upload the blob to the 'avatars' bucket
    const { data, error } = await supabase.storage
        .from('avatars') // Use the bucket you created
        .upload(`profile_images/${fileName}`, blob, {
            contentType: 'image/jpeg', // Set the content type
        });

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    } else {
        // Get the public URL after upload
        const publicUrl = supabase.storage.from('avatars').getPublicUrl(`profile_images/${fileName}`).publicURL;
        return publicUrl; // Return the public URL
    }
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
      setImage(uri); // Set the local image URI

      // Save the new image URI to Supabase and get the public URL
      const publicUrl = await saveImage(uri);
      if (publicUrl) {
          setAvatarUrl(publicUrl); // Set the avatar URL
          await updateProfile({
              first_name,
              last_name,
              birth_date,
              avatar_url: publicUrl, // Update profile with the new avatar URL
          });
        }
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
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({
                first_name,
                last_name,
                birth_date,
                avatar_url: url,
              });
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
              value={first_name}
              onChangeText={text => setFirstname(text)}
              style={styles.input}
            />
            <Text>Last Name</Text>
            <TextInput
              placeholder="Last Name"
              value={last_name}
              onChangeText={text => setLastname(text)}
              style={styles.input}
            />
            <Text>Date of Birth</Text>
            <TouchableOpacity onPress={showDatepicker}>
              <TextInput
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
              onChangeText={text => setAge(text)}
              keyboardType="numeric"
            />
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              value={session?.user?.email} disabled
            />
            <TouchableOpacity onPress={() => updateProfile({ 
                first_name, 
                last_name, 
                birth_date: date.toISOString(), 
                age,
                avatar_url: avatarUrl })}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

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
  buttonText: {
    backgroundColor: '#007260',
    fontSize: 16,
    textAlign: 'center',
    height: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 150, 
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
    marginBottom: 10,
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
});

