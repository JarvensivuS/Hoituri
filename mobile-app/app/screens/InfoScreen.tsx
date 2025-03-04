import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles";

interface InfoScreenProps {
  setScreen: (screen: string) => void;
}

const InfoScreen: React.FC<InfoScreenProps> = ({ setScreen }) => {
  // Kovakoodatut muuttujat
  const patientName = "Matti Meikäläinen";
  const patientCaretaker = "Maija Meikäläinen";
  const doctorName = "Dr.Pirkko Liisa"

  // Hätänapin tila
  const [emergencyPressed, setEmergencyPressed] = useState(false);

  return (
    <View
      style={[
        styles.ScreenContainer,
        { justifyContent: "space-between", paddingVertical: 20 },
      ]}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={styles.ScreenText}>Asiakkaan tiedot</Text>
        <Text></Text>
        <Text style={styles.ScreenText}>Käyttäjä: {patientName}</Text>
        <Text style={styles.ScreenText}>Omainen: {patientCaretaker}</Text>
        <Text style={styles.ScreenText}>Lääkäri: {doctorName}</Text>

        {/* Hätänappi ja tila kääritty omaan Viewen, jolla on marginTop */}
        <View style={{ marginTop: 100, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => setEmergencyPressed((prev) => !prev)}
            style={{
              width: 160,
              height: 160,
              borderRadius: 99,
              backgroundColor: "red",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 34, }}>HÄTÄ</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, marginTop: 10 }}>
            {emergencyPressed ? "true" : "false"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen("LoginScreen")}
      >
        <Text style={styles.buttonText}>Kirjaudu ulos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InfoScreen;
