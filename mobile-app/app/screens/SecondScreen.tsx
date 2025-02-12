import React from "react";
import { View, Text, Button } from "react-native";

interface SecondScreenProps {
  setScreen: (screen: string) => void;
}

const SecondScreen: React.FC<SecondScreenProps> = ({ setScreen }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>GPS hommat tänne</Text>
      {/*<Button title="Go Back" onPress={() => setScreen("Home")} />*/}
    </View>
  );
};

export default SecondScreen;
