import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen = () => {
  const [activeTab, setActiveTab] = useState('human');
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
    
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Privacy Policy</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'human' && styles.activeTab]}
          onPress={() => setActiveTab('human')}
        >
          <Text style={[styles.tabText, activeTab === 'human' && styles.activeTabText]}>Data Privacy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'legal' && styles.activeTab]}
          onPress={() => setActiveTab('legal')}
        >
          <Text style={[styles.tabText, activeTab === 'legal' && styles.activeTabText]}>Data Privacy Act of 2012</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'human' ? (
          <View style={styles.textBox}>
            {/* New Content for EyeCheck App */}
            <Text style={styles.sectionHeader}>EyeCheck App Data Privacy Policy</Text>

            <Text style={styles.subHeader}>Data Collection and Consent</Text>
            <Text style={styles.contentText}>
              The EyeCheck app, a machine learning-based application for vision acuity assessment, will strictly adhere to the provisions of the Data Privacy Act of 2012 (Republic Act No. 10173) to ensure the protection of users' personal data. Key compliance measures include:
              The app will collect only the necessary personal and health information required for vision acuity assessments.
            </Text>

            <Text style={styles.subHeader}>Data Processing and Storage</Text>
            <Text style={styles.contentText}>
              Personal data will be processed fairly, lawfully, and only for the specified, legitimate purposes of the EyeCheck app.
            </Text>

            <Text style={styles.subHeader}>User Rights</Text>
            <Text style={styles.contentText}>
              Users will have the right to access, correct, and delete their personal data.
            </Text>

            <Text style={styles.subHeader}>Data Security</Text>
            <Text style={styles.contentText}>
              Regular security audits and assessments will be conducted to maintain the integrity and confidentiality of the data.
            </Text>

            <Text style={styles.subHeader}>Data Sharing and Disclosure</Text>
            <Text style={styles.contentText}>
              Personal data will not be shared with third parties without explicit user consent, except as required by law.
            </Text>
          </View>
        ) : (
          <View style={styles.textBox}>
            {/* Updated Legal Content */}
            <Text style={styles.sectionHeader}>Data Privacy Act of 2012 - Organizational Structure of the Commission</Text>
            <Text style={styles.contentText}>
              Sec. 9. Organizational Structure of the Commission. – The Commission shall be attached to the Department of Information and Communications Technology (DICT) and shall be headed by a Privacy Commissioner, who shall also act as Chairman of the Commission. The Privacy Commissioner shall be assisted by two (2) Deputy Privacy Commissioners, one to be responsible for Data Processing Systems and one to be responsible for Policies and Planning. The Privacy Commissioner and the two (2) Deputy Privacy Commissioners shall be appointed by the President of the Philippines for a term of three (3) years, and may be reappointed for another term of three (3) years. Vacancies in the Commission shall be filled in the same manner in which the original appointment was made.
            </Text>
          </View>
        )}
        <Text style={styles.updateText}>Last updated: June 24, 2024</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#004d40',
  },
  tabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
  textBox: {
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  updateText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 10,
  },
});

export default PrivacyPolicyScreen;
