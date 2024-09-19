import React from 'react';
import { ScrollView, Text, StyleSheet, View, Button } from 'react-native';

const Terms = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Terms and Conditions</Text>
      <Text style={styles.paragraph}>
        Welcome to EyeCheck!
      </Text>
      <Text style={styles.paragraph}>
        These terms and conditions outline the rules and regulations for the use of the EyeCheck mobile application.
      </Text>
      <Text style={styles.paragraph}>
        By accessing this app, we assume you accept these terms and conditions. Do not continue to use EyeCheck if you do not agree to take all of the terms and conditions stated on this page.
      </Text>
      <Text style={styles.subheader}>License</Text>
      <Text style={styles.paragraph}>
        Unless otherwise stated, EyeCheck and/or its licensors own the intellectual property rights for all material on EyeCheck. All intellectual property rights are reserved. You may access this from EyeCheck for your own personal use subjected to restrictions set in these terms and conditions.
      </Text>
      <Text style={styles.paragraph}>
        You must not:
      </Text>
      <Text style={styles.listItem}>- Republish material from EyeCheck</Text>
      <Text style={styles.listItem}>- Sell, rent, or sub-license material from EyeCheck</Text>
      <Text style={styles.listItem}>- Reproduce, duplicate, or copy material from EyeCheck</Text>
      <Text style={styles.listItem}>- Redistribute content from EyeCheck</Text>
      <Text style={styles.subheader}>User Content</Text>
      <Text style={styles.paragraph}>
        In these terms and conditions, "User Content" shall mean any audio, video, text, images, or other material you choose to display on EyeCheck. By displaying User Content, you grant EyeCheck a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate, and distribute it in any and all media.
      </Text>
      <Text style={styles.subheader}>No Warranties</Text>
      <Text style={styles.paragraph}>
        This app is provided "as is," with all faults, and EyeCheck expresses no representations or warranties, of any kind related to this app or the materials contained on this app. Also, nothing contained on this app shall be interpreted as advising you.
      </Text>
      <Text style={styles.subheader}>Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        In no event shall EyeCheck, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this app whether such liability is under contract.  EyeCheck, including its officers, directors, and employees, shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this app.
      </Text>
      <Text style={styles.subheader}>Indemnification</Text>
      <Text style={styles.paragraph}>
        You hereby indemnify to the fullest extent EyeCheck from and against any and all liabilities, costs, demands, causes of action, damages, and expenses (including reasonable attorney’s fees) arising out of or in any way related to your breach of any of the provisions of these Terms.
      </Text>
      <Text style={styles.subheader}>Severability</Text>
      <Text style={styles.paragraph}>
        If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
      </Text>
      <Text style={styles.subheader}>Variation of Terms</Text>
      <Text style={styles.paragraph}>
        EyeCheck is permitted to revise these Terms at any time as it sees fit, and by using this app you are expected to review these Terms on a regular basis.
      </Text>
      <Text style={styles.subheader}>Assignment</Text>
      <Text style={styles.paragraph}>
        EyeCheck is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.
      </Text>
      <Text style={styles.subheader}>Entire Agreement</Text>
      <Text style={styles.paragraph}>
        These Terms constitute the entire agreement between EyeCheck and you in relation to your use of this app and supersede all prior agreements and understandings.
      </Text>
      <Text style={styles.subheader}>Governing Law & Jurisdiction</Text>
      <Text style={styles.paragraph}>
        These Terms will be governed by and interpreted in accordance with the laws of the State of [Your State], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [Your State] for the resolution of any disputes.
      </Text>
      <View style={styles.buttonContainer}>
      <View style={styles.button}>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 16,
    marginVertical: 5,
  },
  listItem: {
    fontSize: 16,
    marginVertical: 2,
    marginLeft: 10,
  },
  button:{
    width: '80%',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,  
    alignItems: 'center', 
  },
});

export default Terms;
