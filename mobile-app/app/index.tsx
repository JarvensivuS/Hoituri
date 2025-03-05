import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, TouchableOpacity, Text } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import LocationScreen from "./screens/LocationScreen";
import LoginScreen from "./screens/LoginScreen";
import LocationTracker from "./components/LocationTracker";
import { HomeProvider } from "./components/HomeContext";
import styles from "./styles";

const App = () => {
  // Aseta aluksi "LoginScreen", jotta kirjautumisnäkymä tulee ensin.
  const [screen, setScreen] = useState("LoginScreen");

  return (
    <HomeProvider>
      <LocationTracker>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={styles.statusBar.backgroundColor}
          />

          {/* Näytetään yläpalkki vain, jos käyttäjä ei ole kirjautumassa */}
          {screen !== "LoginScreen" && (
            <View style={styles.topNav}>
              {/* Vasemman reunan navigointi: "Kirjaudu ulos" -nappi Home-näkymässä */}
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
              
              {/* Keskellä oleva otsikko */}
              <Text style={styles.titleText}>
                {screen === "Home" 
                  ? "Aloitus" 
                  : screen === "LocationScreen" 
                  ? "Sijainti" 
                  : "Kirjautuminen"}
              </Text>
  
              {/* Oikean reunan navigointi */}
              <TouchableOpacity
                onPress={() => setScreen("LocationScreen")}
                style={[styles.forwardButton, { display: screen === "Home" ? "flex" : "none" }]}
              >
                <Text style={styles.navText}>Sijainti →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Näytetään oikea sisältö nykyisen screen-tilan mukaan */}
          <View style={styles.screenContent}>
            {screen === "Home" && <HomeScreen setScreen={setScreen} />}
            {screen === "LocationScreen" && <LocationScreen setScreen={setScreen} />}
            {screen === "LoginScreen" && <LoginScreen setScreen={setScreen} />}
          </View>
        </SafeAreaView>
      </LocationTracker>
    </HomeProvider>
  );
};

export default App;
