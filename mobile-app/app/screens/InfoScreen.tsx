import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles";

interface InfoScreenProps {
  setScreen: (screen: string) => void;
}

const InfoScreen: React.FC<InfoScreenProps> = ({ setScreen }) => {
  // Kovakoodatut muuttujat
  const userName = "Erkki Esimerkki";
  const relative = "Ulla Esimerkki";

  return (
    <View style={[styles.ScreenContainer, { justifyContent: "space-between", paddingVertical: 20 }]}>
      <View>
        <Text style={styles.ScreenText}>Asiakkaan tiedot</Text>
        <Text></Text>
        <Text style={styles.ScreenText}>Käyttäjä: {userName}</Text>
        <Text style={styles.ScreenText}>Omainen: {relative}</Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={() => setScreen("LoginScreen")}>
        <Text style={styles.buttonText}>Kirjaudu ulos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InfoScreen;
