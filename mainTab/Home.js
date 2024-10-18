import React from 'react';
import { StyleSheet, View, Text, Image, TextInput, ScrollView, TouchableOpacity  } from 'react-native';
import { Avatar, Icon, Card } from 'react-native-elements';
import COLORS from '../colors';
import fonts from '../fonts';
import { supabase } from "../lib/supabase";

const Home = ({ navigation, firstname, lastname}) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={fonts.poppinsBold}>Welcome, {firstname} {lastname} 👋</Text>
          <Text style={styles.subtitle}>Patient</Text>
        </View>
        <Avatar
          rounded
          source={require('../assets/profile.png')} 
          size="medium"
          containerStyle={styles.avatar}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput style={styles.input} placeholder="Search" />
        <Icon name="filter" type="font-awesome" size={20} color="#000" />
      </View>

      {/* Category Buttons */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>General</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Treatments</Text>
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>FAQs</Text>
        </TouchableOpacity>
      </View>

      {/* Side Scrollable Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        <Card containerStyle={styles.card}>
          <TouchableOpacity  onPress={() => navigation.navigate('InfoScreen')}>
            <Image style={styles.cardImage} source={require('../assets/Eye.jpg')}  />
            <Text style={styles.cardText}>Visual Acuity Test</Text>
            <Text style={styles.cardSubText}>Check your Vision</Text>
          </TouchableOpacity>
        </Card>

        <Card containerStyle={styles.card}>
          <TouchableOpacity onPress={() => navigation.navigate('ResultScreen')}>
            <Image style={styles.cardImage} source={require('../assets/Result.jpg')}  />
            <Text style={styles.cardText}>Result</Text>
            <Text style={styles.cardSubText}>View Result</Text>
          </TouchableOpacity>
        </Card>
        
        {/* Add more cards if needed */}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: 'grey',
  },
  avatar: {
    marginLeft: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginLeft: 5,
    borderRadius: 20,
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
  },
  notificationDot: {
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  cardsContainer: {
    flexDirection: 'row',  // Set to row for horizontal scrolling
    paddingVertical: 10,
  },
  card: {
    width: 300,  // Increased width for larger card
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,  // Margin for spacing between cards
  },
  cardImage: {
    width: '100%',
    height: 300,  // Increased height for larger image
  },
  cardText: {
    // fontFamily: fonts.poppinsBold,
    fontWeight: 'bold',
    fontSize: 18,  // Increased font size for better readability
    marginTop: 10,
    marginBottom: 5,
  },
  cardSubText: {
    fontSize: 14,  // Increased font size for better readability
    color: 'grey',
    marginBottom: 10,
  },
});

export default Home;