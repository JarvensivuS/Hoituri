import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import LocationScreen from "./screens/LocationScreen";
import styles from "./styles"; 

const App = () => {
  const [screen, setScreen] = useState("Home");

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <StatusBar barStyle="light-content" backgroundColor={styles.statusBar.backgroundColor} />

    
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => setScreen("Home")}
          style={[styles.backButton, { display: screen === "Home" ? "none" : "flex" }]}>
          <Text style={styles.navText}>← Aloitus</Text>
        </TouchableOpacity>

        <Text style={styles.titleText}>{screen === "Home" ? "Aloitus" : "Sijainti"}</Text>

        <TouchableOpacity
          onPress={() => setScreen("LocationScreen")}
          style={[styles.forwardButton, { display: screen === "Home" ? "flex" : "none" }]}
        >
          <Text style={styles.navText}>Sijainti →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.screenContent}>
        {screen === "Home" ? <HomeScreen setScreen={setScreen} /> : <LocationScreen setScreen={setScreen} />}
      </View>
    </SafeAreaView>
  );
};

export default App;
