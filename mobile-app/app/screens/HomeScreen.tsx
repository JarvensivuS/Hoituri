import React from "react";
import { View, Text, Button } from "react-native";

interface HomeScreenProps {
  setScreen: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setScreen }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tänne muistutuksia yms ?</Text>
      {/*<Button title="Go to Second Screen" onPress={() => setScreen("SecondScreen")} />*/}
    </View>
  );
};

export default HomeScreen;
