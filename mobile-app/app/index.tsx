import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, TouchableOpacity, Text } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import LocationScreen from "./screens/LocationScreen";
import LoginScreen from "./screens/LoginScreen";
import LocationTracker from "./components/LocationTracker";
import { HomeProvider } from "./components/HomeContext";
import styles from "./styles";

const App = () => {
  const [screen, setScreen] = useState("LoginScreen");

  // Jos käyttäjä on kirjautumassa, näytetään ainoastaan LoginScreen
  if (screen === "LoginScreen") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={styles.statusBar.backgroundColor}
        />
        <View style={styles.screenContent}>
          <LoginScreen setScreen={setScreen} />
        </View>
      </SafeAreaView>
    );
  }

  // Kun käyttäjä on kirjautunut sisään, näytetään HomeProvider ja LocationTracker ympäröimässä sisältöä
  return (
    <HomeProvider>
      <LocationTracker>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={styles.statusBar.backgroundColor}
          />

          {/* Yläpalkki, näkyy vain kirjautuneille */}
          <View style={styles.topNav}>
            <TouchableOpacity
              onPress={() => setScreen("LoginScreen")}
              style={[styles.backButton, { display: screen === "Home" ? "flex" : "none" }]}
            >
              <Text style={styles.navText}>Kirjaudu ulos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScreen("Home")}
              style={[styles.backButton, { display: screen === "LocationScreen" ? "flex" : "none" }]}
            >
              <Text style={styles.navText}>← Aloitus</Text>
            </TouchableOpacity>
            
            <Text style={styles.titleText}>
              {screen === "Home" ? "Aloitus" : screen === "LocationScreen" ? "Sijainti" : "Kirjautuminen"}
            </Text>
    
            <TouchableOpacity
              onPress={() => setScreen("LocationScreen")}
              style={[styles.forwardButton, { display: screen === "Home" ? "flex" : "none" }]}
            >
              <Text style={styles.navText}>Sijainti →</Text>
            </TouchableOpacity>
          </View>

          {/* Näytetään sisältö kirjautuneille */}
          <View style={styles.screenContent}>
            {screen === "Home" && <HomeScreen setScreen={setScreen} />}
            {screen === "LocationScreen" && <LocationScreen setScreen={setScreen} />}
          </View>
        </SafeAreaView>
      </LocationTracker>
    </HomeProvider>
  );
};

export default App;
