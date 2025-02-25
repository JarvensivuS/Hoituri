import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles"; // 🔹 Importing styles

interface InfoScreenProps {
  setScreen: (screen: string) => void;
}

const InfoScreen: React.FC<InfoScreenProps> = ({ setScreen }) => {
  return (
    <View style={styles.ScreenContainer}>
      <Text style={styles.ScreenText}>Asiakkaan tiedot tänne</Text>

    </View>
  );
};

export default InfoScreen;