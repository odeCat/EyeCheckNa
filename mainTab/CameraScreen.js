import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { useIsFocused } from '@react-navigation/native';

const CameraScreen = () => {
  const isFocused = useIsFocused();
  const [detections, setDetections] = useState([]);
  const [detectedImageUrl, setDetectedImageUrl] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [distance, setDistance] = useState(null);
  const cameraRef = useRef(null);

  // Calibrate these values
  const REFERENCE_BOX_WIDTH = 50;  // in pixels, adjust this value based on actual measurements
  const KNOWN_DISTANCE = 14;  // in cm, adjust this value based on actual measurements

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    let interval;
    if (isFocused) {
      interval = setInterval(() => {
        captureFrame();
      }, 100); // Capture frame every 2 seconds
    }
    return () => clearInterval(interval);
  }, [isFocused]);

  const captureFrame = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ 
        base64: true,
        
       });
      uploadFrame(photo.base64);
    }
  };

  const uploadFrame = async (base64Image) => {
    try {
      const response = await fetch('https://eyecheck-flask.onrender.com/detect', {
        method: 'POST',
        body: JSON.stringify({ image: base64Image }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error response:', response);
        return;
      }

      const jsonResponse = await response.json();
      setDetections(jsonResponse.detections);
      setDetectedImageUrl(jsonResponse.image_url);

      if (jsonResponse.detections.length > 0) {
        const detection = jsonResponse.detections[0];
        const boxWidth = detection.box[2] - detection.box[0];
        const estimatedDistance = (REFERENCE_BOX_WIDTH / boxWidth) * KNOWN_DISTANCE;
        setDistance(estimatedDistance.toFixed(2));
      } else {
        setDistance(null);
      }
    } catch (error) {
      console.error('Error uploading frame:', error);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const renderEyeStatus = () => {
    const detectedObjects = detections.map(detection => detection.object);
    if (detectedObjects.includes('left_eye') && detectedObjects.includes('right_eye')) {
      return <Text style={styles.eyeStatusText}>Both eyes are open</Text>;
    } else if (detectedObjects.includes('left_eye')) {
      return <Text style={styles.eyeStatusText}>Left eye is close</Text>;
    } else if (detectedObjects.includes('right_eye')) {
      return <Text style={styles.eyeStatusText}>Right eye is close</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
        {renderEyeStatus()}
        <View style={styles.cameraWrapper}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            animateShutter={false}
            
            onCameraReady={() => console.log('Camera ready')}
          >
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceText}>
                {distance ? `Distance: ${distance} cm` : 'Calculating distance...'}
              </Text>
            </View>
          </CameraView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: 300,
    height: 300,
  },
  distanceContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  distanceText: {
    color: 'white',
    fontSize: 18,
  },
  eyeStatusText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 16,
  },
});

export default CameraScreen;
