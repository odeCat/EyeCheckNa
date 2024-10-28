import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import BackIcon from '../assets/backIcon.png';
import EyeIcon from '../assets/eyeIcon.png';
import StepsIcon from '../assets/stepIcon.png';
import WeightIcon from '../assets/weightIcon.png';
import RestIcon from '../assets/restIcon.png';
import EyewearIcon from '../assets/eyewearIcon.png';
import calendarIcon from '../assets/calendarIcon.png';
import growthIcon from '../assets/growthIcon.png';
import examIcon from '../assets/examIcon.png';

const EyeCareFAQScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Access the route to get params

  const [activeTab, setActiveTab] = useState(route.params?.initialTab || 'EyeCare'); // Set initialTab from params, default to 'EyeCare'
  const underlinePosition = useRef(new Animated.Value(activeTab === 'EyeCare' ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(underlinePosition, {
      toValue: activeTab === 'EyeCare' ? 0 : 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const renderEyeCareContent = () => (
    <>
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scrollView}>
      <View style={styles.item}>
        <Image source={EyeIcon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Have a comprehensive eye exam</Text>
          <Text style={styles.description}>
            Your eye care professional is the only one who can determine if your eyes are healthy and if you’re seeing your best.
          </Text>
        </View>
      </View>
      <View style={styles.item}>
        <Image source={StepsIcon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Steps</Text>
          <Text style={styles.description}>
            90% of blindness caused by diabetes is preventable. Ask your health care team to help you set and reach goals to manage your blood sugar.
          </Text>
        </View>
      </View>
      <View style={styles.item}>
        <Image source={WeightIcon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Maintain a healthy weight</Text>
          <Text style={styles.description}>
            Being overweight or obese increases your risk of developing diabetes and other systemic conditions, which can lead to vision loss.
          </Text>
        </View>
      </View>
      <View style={styles.item}>
        <Image source={RestIcon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Give your eyes a rest</Text>
          <Text style={styles.description}>
            If you spend a lot of time at the computer or focusing on any one thing, you sometimes forget to blink and your eyes can get fatigued.
          </Text>
        </View>
      </View>
      <View style={styles.item}>
        <Image source={EyewearIcon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Wear protective eyewear</Text>
          <Text style={styles.description}>
            Wear protective eyewear when playing sports or doing activities around the home. Protective eyewear includes safety glasses and goggles.
          </Text>
        </View>
      </View>
      <View style={styles.item}>
        
      </View>
      </ScrollView>
    </SafeAreaView>
    </>
  );

  const renderFAQContent = () => (
    <>
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scrollView}>
      <View style={styles.faqItem}>
        <Image source={calendarIcon} style={styles.faqIcon} />
        <View style={styles.faqTextContainer}>
          <Text style={styles.faqTitle}>How Often Do I Need My Eyes Examined?</Text>
          <Text style={styles.faqContent}>
            Adults with normal vision and no eye problems should have their eyes checked every three years until the age of 40. After 40, we like to see all of our patients for an annual vision exam.
          </Text>
        </View>
      </View>
      <View style={styles.faqItem}>
        <Image source={growthIcon} style={styles.faqIcon} />
        <View style={styles.faqTextContainer}>
          <Text style={styles.faqTitle}>Why are More Exams Needed After the Age of 40?</Text>
          <Text style={styles.faqContent}>
            Once a person reaches 40 years of age, they're more likely to develop certain eye diseases, such as:
            {'\n'}• Glaucoma
            {'\n'}• Macular degeneration
            {'\n'}• Cataracts
            {'\n'}• Diabetic retinopathy
          </Text>
        </View>
      </View>
      <View style={styles.faqItem}>
        <Image source={examIcon} style={styles.faqIcon} />
        <View style={styles.faqTextContainer}>
          <Text style={styles.faqTitle}>What Does an Eye Exam Involve?</Text>
          <Text style={styles.faqContent}>
            Your eye examination will last between 30 minutes and an hour, in most cases. We'll start with a consultation, where the optometrist will get to know you and your medical history, as well as details about your vision.
          </Text>
        </View>
      </View>
      <View style={styles.faqItem}>
        
      </View>
      </ScrollView>
      </SafeAreaView>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView >
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonContainer} onPress={() => navigation.navigate("Home")}>
          <Image source={BackIcon} style={styles.backIcon} />
          <Text style={styles.headerButton}>Check Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('EyeCare')}>
          <Text style={activeTab === 'EyeCare' ? styles.headerButtonActive : styles.headerButton}>Eye Care</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('FAQs')}>
          <Text style={activeTab === 'FAQs' ? styles.headerButtonActive : styles.headerButton}>FAQs</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.underlineContainer}>
        <Animated.View style={[styles.underline, {
          transform: [{
            translateX: underlinePosition.interpolate({
              inputRange: [0, 1],
              outputRange: [155, 250] // Adjust these values based on your button positions
            })
          }]
        }]} />
      </View>
      <View>
        {activeTab === 'EyeCare' ? renderEyeCareContent() : renderFAQContent()}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
  headerButton: {
    fontSize: 16,
    color: '#888',
  },
  headerButtonActive: {
    fontSize: 16,
    color: '#0f9d58',
  },
  underlineContainer: {
    position: 'relative',
    width: '100%',
    height: 4,
    marginTop: -15, 
    marginBottom:10,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '20%', 
    backgroundColor: '#0f9d58',
    borderRadius: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#FDFFFE',
    padding: 16,
    borderRadius: 10,
    borderColor: '#DDDEDF', 
    borderWidth: 1,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#45A188',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#FDFFFE',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDDEDF', 
  },
  faqIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  faqTextContainer: {
    flex: 1,
  },
  faqTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#45A188',
  },
  faqContent: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
});

export default EyeCareFAQScreen;
