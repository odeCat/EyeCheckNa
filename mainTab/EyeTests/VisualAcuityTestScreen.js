import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

// Main component for the Visual Acuity Test Screen
export default function VisualAcuityTestScreen({ navigation, route }) {
  // Destructuring the parameters passed from the previous screen
  const { age, eyeglasses, hobby, preferredDistance } = route.params;

  // Various state variables for managing UI state and test logic
  const isFocused = useIsFocused(); // Check if the screen is currently focused
  const [showEyeTestSelection, setShowEyeTestSelection] = useState(false);
  const [selectedEye, setSelectedEye] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showTestImages, setShowTestImages] = useState(false);
  const [detections, setDetections] = useState([]);
  const [detectedImageUrl, setDetectedImageUrl] = useState(null);
  const [permission, requestPermission] = useCameraPermissions(); // Camera permission state
  const [cameraMode, setCameraMode] = useState(true);
  const [distance, setDistance] = useState(null); // Stores the calculated distance from the camera
  const [frameCount, setFrameCount] = useState(0); // Tracks the number of frames captured
  const [currentDirectionIndex, setCurrentDirectionIndex] = useState(0);
  const [randomDirections, setRandomDirections] = useState([]); // Holds random directions for the E symbol test
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isFirstEyeTestComplete, setIsFirstEyeTestComplete] = useState(false);
  const [leftEyeScore, setLeftEyeScore] = useState(null);
  const [rightEyeScore, setRightEyeScore] = useState(null);
  const [leftEyeTestResult, setLeftEyeTestResult] = useState(null);
  const [rightEyeTestResult, setRightEyeTestResult] = useState(null);
  const [overallResult, setOverallResult] = useState(null);
  const [eSymbolSize, setESymbolSize] = useState(40); // Initial size for the E symbol
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCameraView, setShowCameraView] = useState(false);
  const [bothTestsComplete, setBothTestsComplete] = useState(false);

  const cameraRef = useRef(null); // Reference to the camera component

  // Log the user's data when the component mounts or updates
  useEffect(() => {
    console.log("Age:", age);
    console.log("Eyeglasses:", eyeglasses);
    console.log("Hobby:", hobby);
    console.log("Preferred Distance:", preferredDistance);
  }, [age, eyeglasses, hobby, preferredDistance]);

  // Make these variables dynamic and not hard coded values
  const REFERENCE_BOX_WIDTH_LEFT_EYE = 50; // Known width of the reference object for the left eye
  const REFERENCE_BOX_WIDTH_RIGHT_EYE = 65; // Known width of the reference object for the right eye
  const KNOWN_DISTANCE = 15; // Known distance from the reference object to the camera

  // Function to get the correct REFERENCE_BOX_WIDTH based on the selected eye
  const getReferenceBoxWidth = () => {
    return selectedEye === "left"
      ? REFERENCE_BOX_WIDTH_LEFT_EYE
      : REFERENCE_BOX_WIDTH_RIGHT_EYE;
  };

  // Request camera permission if not granted
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // Set up an interval to capture frames when the screen is focused and capturing is enabled
  useEffect(() => {
    let interval;
    if (isFocused && isCapturing) {
      interval = setInterval(() => {
        captureFrame();
      }, 100);
    }
    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, [isFocused, isCapturing]);

  // Start capturing frames when the user begins the test
  const handleCaptureStart = () => {
    setIsCapturing(true);
  };

  // Function to capture a frame from the camera
  const captureFrame = async () => {
    try {
      setFrameCount((prevCount) => prevCount + 1);
      if (frameCount % 30 === 0 && cameraRef.current) {
        // Capture every 20th frame
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
        });
        uploadFrame(photo.base64); // Upload the captured frame for processing
      }
    } catch (error) {
      console.error("Error capturing frame:", error);
    }
  };

  // Upload the captured frame to the server for processing
  const uploadFrame = async (base64Image) => {
    try {
      const response = await fetch('http://192.168.5.136:5000/detect', {
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
        const estimatedDistance = (getReferenceBoxWidth() / boxWidth) * KNOWN_DISTANCE;
        setDistance(estimatedDistance.toFixed(2));
      } else {
        setDistance(null);
      }
    } catch (error) {
      console.error('Error uploading frame:', error);
    }
  };


  // Navigate to the eye test selection screen
  const handleContinue = () => {
    setShowEyeTestSelection(true);
  };

  // Handle the completion of the second eye test
  const handleSecondTestFinish = () => {
    setSelectedEye("left");
    setShowCameraView(true);
  };

  const completeSecondTest = () => {
    handleSecondTestFinish();
    setShowEyeTestSelection(false);
    setIsFirstEyeTestComplete(false);
  };

  // Go back to the previous screen or reset the current screen state
  const handleBack = () => {
    if (showTestImages) {
      setShowTestImages(false);
      setShowCamera(true);
    } else if (showCamera) {
      setShowCamera(false);
      setSelectedEye(null);
    } else if (showEyeTestSelection) {
      setShowEyeTestSelection(false);
      setSelectedEye(null);
      setShowCamera(false);
    } else {
      navigation.goBack();
    }
  };

  // Handle the selection of which eye to test
  const handleEyeSelection = (eye) => {
    setSelectedEye(eye);
    setShowCameraView(true);
    generateRandomDirections(); // Generate random directions for the E symbol test
  };

  // Start the visual acuity test after eye selection
  const handleStartTest = () => {
    setShowCamera(false);
    setShowTestImages(true);
  };

  // Render the status of the user's eyes based on detections
  const renderEyeStatus = () => {
    const detectedObjects = detections.map((detection) => detection.object);
    if (
      detectedObjects.includes("left_eye") &&
      detectedObjects.includes("right_eye")
    ) {
      return <Text style={styles.eyeStatusText}>Both eyes detected</Text>;
    } else if (detectedObjects.includes("left_eye")) {
      return <Text style={styles.eyeStatusText}>Left eye close</Text>;
    } else if (detectedObjects.includes("right_eye")) {
      return <Text style={styles.eyeStatusText}>Right eye close</Text>;
    } else {
      return <Text style={styles.eyeStatusText}>No eyes detected</Text>;
    }
  };

  // Determine if the "Start Test" button should be enabled based on eye detection and distance
  const isStartButtonEnabled = () => {
    const detectedObjects = detections.map((detection) => detection.object);
    // Check if the selected eye is detected and the other eye is closed
    const isEyeDetectionCorrect =
      (selectedEye === "right" &&
        detectedObjects.includes("right_eye") &&
        !detectedObjects.includes("left_eye")) ||
      (selectedEye === "left" &&
        detectedObjects.includes("left_eye") &&
        !detectedObjects.includes("right_eye"));

    // Check if the preferred distance is met
    const isDistanceCorrect =
      distance && preferredDistance && distance >= preferredDistance;

    return isEyeDetectionCorrect && isDistanceCorrect;
  };

  // Generate random directions (up, down, left, right) for the E symbol test
  const generateRandomDirections = () => {
    const directionsArray = ["up", "down", "left", "right"];
    const randomDirectionsArray = Array.from(
      { length: 10 },
      () => directionsArray[Math.floor(Math.random() * directionsArray.length)]
    );
    setRandomDirections(randomDirectionsArray);
  };

  // Get the image of the E symbol based on the current direction
  const getESymbolImage = () => {
    const direction = randomDirections[currentDirectionIndex];
    let source;
    switch (direction) {
      case "up":
        source = require("../../assets/ESymbol/E_up.jpg");
        break;
      case "down":
        source = require("../../assets/ESymbol/E_down.jpg");
        break;
      case "left":
        source = require("../../assets/ESymbol/E_left.jpg");
        break;
      case "right":
        source = require("../../assets/ESymbol/E_right.jpg");
        break;
      default:
        source = require("../../assets/ESymbol/E_up.jpg");
        break;
    }
    return { source, size: eSymbolSize };
  };

  // Event handler for when an arrow is pressed (to indicate the direction of the E symbol)
  const handleArrowPress = (direction) => {
    if (currentDirectionIndex < randomDirections.length) {
      // Record the user's answer and move to the next direction
      setUserAnswers([...userAnswers, direction]);
      setCurrentDirectionIndex(currentDirectionIndex + 1);

      // Decrease the E symbol size after each answer
      setESymbolSize((prevSize) => Math.max(prevSize - 5, 10)); // Prevent the size from getting too small
    }

    // When all directions have been tested
    if (
      currentDirectionIndex === randomDirections.length &&
      randomDirections.length > 0
    ) {
      // Calculate the user's score based on correct answers
      let newScore = userAnswers.reduce((acc, answer, index) => {
        return answer === randomDirections[index] ? acc + 1 : acc;
      }, 0);

      if (isFirstEyeTestComplete) {
        // If it's the second eye test, save the score and send results to the API
        setScore(newScore);
        if (selectedEye === "right") {
          setRightEyeScore(newScore);
        } else {
          setLeftEyeScore(newScore);
        }
        calculateScore(newScore); // Send the final scores to the server
      } else {
        // Save the score for the first eye and prepare for the second eye test
        if (selectedEye === "right") {
          setRightEyeScore(newScore);
        } else {
          setLeftEyeScore(newScore);
        }

        // Reset states for the second eye test
        setIsFirstEyeTestComplete(true);
        setSelectedEye(selectedEye === "right" ? "left" : "right");
        setShowTestImages(false);
        setShowCamera(true);
        setUserAnswers([]);
        setCurrentDirectionIndex(0);
        setScore(0);
        setESymbolSize(50); // Reset the E symbol size
        generateRandomDirections(); // Generate new random directions for the second eye test
      }
    }
  };

  // Function to send the final scores to the server for evaluation
  const calculateScore = async (finalScore) => {
    try {
      // Send the test data to the server
      const response = await fetch(
        "https://eyecheck-flask-svm.onrender.com/predict",
        {
          method: "POST",
          body: JSON.stringify({
            age,
            eyeglasses,
            hobby,
            preferred_distance: preferredDistance,
            left_eye_score: leftEyeScore !== null ? leftEyeScore : finalScore,
            right_eye_score:
              rightEyeScore !== null ? rightEyeScore : finalScore,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Process the server's response and determine the test results
        const result = await response.json();
        const leftEyePass = result.left_eye_prediction === 1;
        const rightEyePass = result.right_eye_prediction === 1;

        // Set the results based on the server's predictions
        setLeftEyeTestResult(leftEyePass ? "PASS" : "FAIL");
        setRightEyeTestResult(rightEyePass ? "PASS" : "FAIL");

        let overallResult;
        if (!leftEyePass && !rightEyePass) {
          overallResult = "At Risk";
        } else if (!leftEyePass || !rightEyePass) {
          overallResult = "Mild";
        } else {
          overallResult = "Healthy";
        }
        setOverallResult(overallResult);

        console.log("Navigating to AstigmatismTestScreen with data:", {
          leftEyeScore,
          rightEyeScore,
          leftEyeTestResult: leftEyePass ? "PASS" : "FAIL",
          rightEyeTestResult: rightEyePass ? "PASS" : "FAIL",
          overallResult,
        });

        // Navigate to the AstigmatismTestScreen with the results
        navigation.navigate("AstigmatismTestScreen", {
          leftEyeScore: leftEyeScore !== null ? leftEyeScore : finalScore,
          rightEyeScore: rightEyeScore !== null ? rightEyeScore : finalScore,
          leftEyeTestResult: leftEyePass ? "PASS" : "FAIL",
          rightEyeTestResult: rightEyePass ? "PASS" : "FAIL",
          overallResult,
        });
      } else {
        console.error("Error from Flask API");
      }
    } catch (error) {
      console.error("Error sending data to the server:", error);
    }
  };

  // Render a blank screen if the camera permission status is still loading
  if (!permission) {
    return <View />;
  }

  // If the camera permission is not granted, prompt the user to grant it
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  // Main return statement to render the UI
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back button to navigate back or reset state */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>
            ‹{" "}
            {showEyeTestSelection || showCameraView || showTestImages
              ? "Back"
              : "Visual Acuity Test"}
          </Text>
        </TouchableOpacity>

        {/* Conditional rendering based on the current step in the test */}
        {!showEyeTestSelection ? (
          <View style={styles.content}>
            <Text style={styles.description}>
              Good eye coordination requires healthy vision. You will conduct
              two tests:
              <Text style={{ fontWeight: "bold" }}> visual acuity test </Text>
              and
              <Text style={{ fontWeight: "bold" }}> astigmatism test</Text>.
            </Text>

            <Text style={styles.description}>
              Conduct these tests at
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                {preferredDistance} cm{" "}
              </Text>
              from a mobile screen. Keep your glasses or contacts on if you wear
              them.
              <Text style={{ fontStyle: "italic" }}>
                {" "}
                Remember, this isn't a replacement for a full eye exam by an
                optometrist. If needed, schedule one.{" "}
              </Text>
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        ) : !selectedEye ? (
          <View style={styles.eyeTestSelectionContent}>
            
            <Text style={styles.testTitle}>VISUAL ACUITY TEST</Text>
            <View style={styles.eyeIconContainer}>
              <Text style={styles.eyeIcon}>👁️</Text>
            </View>
            <Text style={styles.instruction}>
              Which eye do you want to test first?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleEyeSelection("right")}
              >
                <Text style={styles.buttonText}>RIGHT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleEyeSelection("left")}
              >
                <Text style={styles.buttonText}>LEFT</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : showTestImages && !bothTestsComplete ? (
          <View style={styles.eyeTestContent}>
            <Text style={styles.testTitle}>
              {selectedEye.toUpperCase()} EYE TEST
            </Text>
            <View style={styles.testImagesContainer}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <TouchableOpacity onPress={() => handleArrowPress("up")}>
                    <Image
                      source={require("../../assets/arrow_up.png")}
                      style={styles.arrowImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <TouchableOpacity onPress={() => handleArrowPress("left")}>
                    <Image
                      source={require("../../assets/arrow_left.png")}
                      style={styles.arrowImage}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.column}>
                  <Image
                    source={getESymbolImage().source}
                    style={[
                      styles.eImage,
                      { width: eSymbolSize, height: eSymbolSize },
                    ]}
                  />
                </View>
                <View style={styles.column}>
                  <TouchableOpacity onPress={() => handleArrowPress("right")}>
                    <Image
                      source={require("../../assets/arrow_right.png")}
                      style={styles.arrowImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <TouchableOpacity onPress={() => handleArrowPress("down")}>
                    <Image
                      source={require("../../assets/arrow_down.png")}
                      style={styles.arrowImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text style={styles.instruction}>
              KEEP YOUR
              <Text style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                {" "}
                {selectedEye} eye{" "}
              </Text>
              OPEN! Click the arrow keys to indicate which direction the E
              symbol is facing. Cover your eye with your palm, avoid pressing your eye. 
            </Text>
          </View>
        ) : showCameraView && !bothTestsComplete ? (
          <View style={styles.cameraContainer}>
            {/* Display the status of eye detection */}
            {renderEyeStatus()}
            <View style={styles.cameraWrapper}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="front"
                animateShutter={false}
                onCameraReady={() => console.log("Camera ready")}
              >
                <View style={styles.distanceContainer}>
                  <Text style={styles.distanceText}>
                    {distance
                      ? `Distance: ${distance} cm`
                      : "Calculating distance..."}
                  </Text>
                </View>
              </CameraView>
            </View>

            <Text style={styles.instruction}>
              Keep both eyes open until it detects both eyes. Then cover the
              <Text style={{ fontWeight: "bold" }}> {selectedEye} eye. </Text>
              Focus on the E symbol. Click the arrow keys to indicate which
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                direction the E symbol is facing.{" "}
              </Text>
            </Text>
            <TouchableOpacity
              style={[
                styles.continueButton,
                //!isStartButtonEnabled() && styles.disabledButton,
              ]}
              //style={styles.continueButton}
              onPress={handleStartTest}
              //disabled={!isStartButtonEnabled()}
            >
              <Text style={styles.buttonText}>START TEST</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCaptureStart}
            >
              <Text style={styles.captureButtonText}>Start Capturing</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    marginTop: 20,
    color: "#419382",
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#2D796D",
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 5,
    marginTop: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  eyeTestSelectionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  eyeIconContainer: {
    marginBottom: 20,
  },
  eyeIcon: {
    fontSize: 100,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  button: {
    backgroundColor: "#2D796D",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  eyeTestContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  cameraWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: 300,
    height: 300,
  },
  distanceContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  distanceText: {
    color: "white",
    fontSize: 18,
  },
  eyeStatusText: {
    fontSize: 18,
    color: "black",
    marginBottom: 16,
  },
  overlayTextContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  overlayText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  chartImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 20,
  },
  testImagesContainer: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  column: {
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  arrowImage: {
    width: 50,
    height: 50,
    marginLeft: 15,
    marginRight: 15,
    margin: 10,
  },
  eImage: {
    resizeMode: "contain",
  },
  testImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    margin: 10,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  captureButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2D796D",
    borderRadius: 5,
  },
  captureButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
