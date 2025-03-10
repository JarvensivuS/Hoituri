// index.tsx
import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, View, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PatientHomeScreen from "./screens/PatientHomeScreen"; // Potilaan näkymä
import CaretakerHomeScreen from "./screens/CaretakerHomeScreen"; // Hoitajan näkymä
import PatientLocationScreen from "./screens/PatientLocationScreen"; // Potilaan sijaintinäkymä
import CaretakerLocationScreen from "./screens/CaretakerLocationScreen"; // Hoitajan sijaintinäkymä
import LoginScreen from "./screens/LoginScreen";
import LocationTracker from "./components/LocationTracker";
import LocationTrackerCareTaker from "./components/LocationTrackerCareTaker";
import { HomeProvider } from "./components/HomeContext";
import styles from "./styles";

const App = () => {
  const [screen, setScreen] = useState("LoginScreen");
  const [role, setRole] = useState<string | null>(null);

  // Haetaan käyttäjän rooli AsyncStoragesta (kirjautumisen jälkeen)
  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem("userRole");
      setRole(storedRole);
    };
    fetchRole();
  }, [screen]);

  // Näytetään ensin kirjautumisnäkymä
  if (screen === "LoginScreen") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={styles.statusBar.backgroundColor} />
        <View style={styles.screenContent}>
          <LoginScreen setScreen={setScreen} />
        </View>
      </SafeAreaView>
    );
  }

  // Jos roolia ei ole vielä ladattu, näytetään latausviesti
  if (!role) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Ladataan...</Text>
      </SafeAreaView>
    );
  }

  return (
    <HomeProvider>
      {role === "caretaker" ? (
        <LocationTrackerCareTaker>
          <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={styles.statusBar.backgroundColor} />

            {/* Yläpalkki navigointia varten */}
            <View style={styles.topNav}>
              {/* Kirjaudu ulos -painike */}
              <TouchableOpacity
                onPress={() => setScreen("LoginScreen")}
                style={[
                  styles.backButton,
                  { display: (screen === "Home" || screen === "CaretakerHome") ? "flex" : "none" }
                ]}
              >
                <Text style={styles.navText}>Kirjaudu ulos</Text>
              </TouchableOpacity>

              {/* Takaisin-painike sijaintinäkymästä */}
              <TouchableOpacity
                onPress={async () => {
                  const currentRole = await AsyncStorage.getItem("userRole");
                  if (currentRole === "caretaker") {
                    setScreen("CaretakerHome");
                  } else {
                    setScreen("Home");
                  }
                }}
                style={[
                  styles.backButton,
                  { display: (screen === "PatientLocationScreen" || screen === "CaretakerLocationScreen") ? "flex" : "none" }
                ]}
              >
                <Text style={styles.navText}>← Aloitus</Text>
              </TouchableOpacity>

              <Text style={styles.titleText}>
                {screen === "Home"
                  ? "Aloitus (patient)"
                  : screen === "CaretakerHome"
                  ? "Aloitus (caretaker)"
                  : screen === "PatientLocationScreen"
                  ? "Sijainti (patient)"
                  : screen === "CaretakerLocationScreen"
                  ? "Sijainti (caretaker)"
                  : "Kirjautuminen"}
              </Text>

              {/* Eteenpäin-painike sijaintinäkymään */}
              <TouchableOpacity
                onPress={async () => {
                  const currentRole = await AsyncStorage.getItem("userRole");
                  if (currentRole === "caretaker") {
                    setScreen("CaretakerLocationScreen");
                  } else {
                    setScreen("PatientLocationScreen");
                  }
                }}
                style={[
                  styles.forwardButton,
                  { display: (screen === "Home" || screen === "CaretakerHome") ? "flex" : "none" }
                ]}
              >
                <Text style={styles.navText}>Sijainti →</Text>
              </TouchableOpacity>
            </View>

            {/* Näytettävä pääsisältö */}
            <View style={styles.screenContent}>
              {screen === "Home" && <PatientHomeScreen setScreen={setScreen} />}
              {screen === "CaretakerHome" && <CaretakerHomeScreen setScreen={setScreen} />}
              {screen === "PatientLocationScreen" && <PatientLocationScreen setScreen={setScreen} />}
              {screen === "CaretakerLocationScreen" && <CaretakerLocationScreen setScreen={setScreen} />}
            </View>
          </SafeAreaView>
        </LocationTrackerCareTaker>
      ) : (
        <LocationTracker>
          <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={styles.statusBar.backgroundColor} />

            {/* Yläpalkki navigointia varten */}
            <View style={styles.topNav}>
              {/* Kirjaudu ulos -painike */}
              <TouchableOpacity
                onPress={() => setScreen("LoginScreen")}
                style={[
                  styles.backButton,
                  { display: (screen === "Home" || screen === "CaretakerHome") ? "flex" : "none" }
                ]}
              >
                <Text style={styles.navText}>Kirjaudu ulos</Text>
              </TouchableOpacity>

              {/* Takaisin-painike sijaintinäkymästä */}
              <TouchableOpacity
                onPress={async () => {
                  const currentRole = await AsyncStorage.getItem("userRole");
                  if (currentRole === "caretaker") {
                    setScreen("CaretakerHome");
                  } else {
                    setScreen("Home");
                  }
                }}
                style={[
                  styles.backButton,
                  { display: (screen === "PatientLocationScreen" || screen === "CaretakerLocationScreen") ? "flex" : "none" }
                ]}
              >
                <Text style={styles.navText}>← Aloitus</Text>
              </TouchableOpacity>

              <Text style={styles.titleText}>
                {screen === "Home"
                  ? "Aloitus (patient)"
                  : screen === "CaretakerHome"
                  ? "Aloitus (caretaker)"
                  : screen === "PatientLocationScreen"
                  ? "Sijainti (patient)"
                  : screen === "CaretakerLocationScreen"
                  ? "Sijainti (caretaker)"
                  : "Kirjautuminen"}
              </Text>

              {/* Eteenpäin-painike sijaintinäkymään */}
              <TouchableOpacity
                onPress={async () => {
                  const currentRole = await AsyncStorage.getItem("userRole");
                  if (currentRole === "caretaker") {
                    setScreen("CaretakerLocationScreen");
                  } else {
                    setScreen("PatientLocationScreen");
                  }
                }}
                style={[
                  styles.forwardButton,
                  { display: (screen === "Home" || screen === "CaretakerHome") ? "flex" : "none" }
                ]}
              >
                <Text style={styles.navText}>Sijainti →</Text>
              </TouchableOpacity>
            </View>

            {/* Näytettävä pääsisältö */}
            <View style={styles.screenContent}>
              {screen === "Home" && <PatientHomeScreen setScreen={setScreen} />}
              {screen === "CaretakerHome" && <CaretakerHomeScreen setScreen={setScreen} />}
              {screen === "PatientLocationScreen" && <PatientLocationScreen setScreen={setScreen} />}
              {screen === "CaretakerLocationScreen" && <CaretakerLocationScreen setScreen={setScreen} />}
            </View>
          </SafeAreaView>
        </LocationTracker>
      )}
    </HomeProvider>
  );
};

export default App;
