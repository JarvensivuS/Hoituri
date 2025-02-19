import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import LocationScreen from "./screens/LocationScreen";
import InfoScreen from "./screens/InfoScreen";
import styles from "./styles";

const App = () => {
  const [screen, setScreen] = useState("Home");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={styles.statusBar.backgroundColor} />
      
      <View style={styles.topNav}>
        {/* Navigoi InfoScreeniin */}
        <TouchableOpacity
          onPress={() => setScreen("InfoScreen")}
          style={[styles.backButton, { display: screen === "Home" ? "flex" : "none" }]}
        >
          <Text style={styles.navText}>← Info</Text>
        </TouchableOpacity>
        
        {/* Navigoi HomeScreeniin */}
        <TouchableOpacity
          onPress={() => setScreen("Home")}
          style={[styles.backButton, { display: screen === "LocationScreen" ? "flex" : "none" }]}
        >
          <Text style={styles.navText}>← Aloitus</Text>
        </TouchableOpacity>
        
        <Text style={styles.titleText}>
          {screen === "Home" ? "Aloitus" : screen === "LocationScreen" ? "Sijainti" : "Info"}
        </Text>
        
        {/* Navigoi LocationScreeniin */}
        <TouchableOpacity
          onPress={() => setScreen("LocationScreen")}
          style={[styles.forwardButton, { display: screen === "Home" ? "flex" : "none" }]}
        >
          <Text style={styles.navText}>Sijainti →</Text>
        </TouchableOpacity>
        
        {/* Navigoi HomeScreeniin InfoScreenistä */}
        <TouchableOpacity
          onPress={() => setScreen("Home")}
          style={[styles.forwardButton, { display: screen === "InfoScreen" ? "flex" : "none" }]}
        >
          <Text style={styles.navText}>Aloitus →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.screenContent}>
        {screen === "Home" && <HomeScreen setScreen={setScreen} />}
        {screen === "LocationScreen" && <LocationScreen setScreen={setScreen} />}
        {screen === "InfoScreen" && <InfoScreen setScreen={setScreen} />}
      </View>
    </SafeAreaView>
  );
};

export default App;
