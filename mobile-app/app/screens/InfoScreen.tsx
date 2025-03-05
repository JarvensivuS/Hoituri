import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles";

interface InfoScreenProps {
  setScreen: (screen: string) => void;
}

const InfoScreen: React.FC<InfoScreenProps> = ({ setScreen }) => {
  // Kovakoodatut muuttujat
  
  const patientCaretaker = "Maija Meikäläinen";
  const doctorName = "Dr.Pirkko Liisa"

  

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
        
        <Text style={styles.ScreenText}>Omainen: {patientCaretaker}</Text>
        <Text style={styles.ScreenText}>Lääkäri: {doctorName}</Text>

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
