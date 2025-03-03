import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles";

interface InfoScreenProps {
  setScreen: (screen: string) => void;
}

const InfoScreen: React.FC<InfoScreenProps> = ({ setScreen }) => {
  return (
    <View style={[styles.ScreenContainer, { justifyContent: "space-between", paddingVertical: 20 }]}>
      <Text style={styles.ScreenText}>Asiakkaan tiedot tänne</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => setScreen("LoginScreen")}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InfoScreen;
