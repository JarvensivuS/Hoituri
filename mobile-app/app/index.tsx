import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import SecondScreen from "./screens/SecondScreen";

const App = () => {
  const [screen, setScreen] = useState("Home");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#6200EE" }}>
      <StatusBar barStyle="light-content" backgroundColor="#6200EE" />
      {/* Top Navigation Bar */}
      <View style={{ height: 60, backgroundColor: "#6200EE", justifyContent: "center", alignItems: "center", flexDirection: "row", paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => setScreen("Home")} style={{ position: "absolute", left: 15, display: screen === "Home" ? "none" : "flex" }}>
          <Text style={{ color: "white", fontSize: 18 }}>← Aloitus</Text>
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>{screen === "Home" ? "Aloitus" : "Sijainti"}</Text>
        <TouchableOpacity onPress={() => setScreen("SecondScreen")} style={{ position: "absolute", right: 15, display: screen === "Home" ? "flex" : "none" }}>
          <Text style={{ color: "white", fontSize: 18 }}>Sijainti →</Text>
        </TouchableOpacity>
      </View>
      
      {/* Screen Content */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "white" }}>
        {screen === "Home" ? <HomeScreen setScreen={setScreen} /> : <SecondScreen setScreen={setScreen} />}
      </View>
    </SafeAreaView>
  );
};

export default App;
