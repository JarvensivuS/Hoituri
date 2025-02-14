import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles"; // 🔹 Importoidaan tyylit

interface LocationScreenProps {
  setScreen: (screen: string) => void;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ setScreen }) => {
  return (
    <View style={styles.ScreenContainer}>
      <Text style={styles.ScreenText}>GPS hommat tänne</Text>

    </View>
  );
};

export default LocationScreen;
