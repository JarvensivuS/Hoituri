import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "../styles";

interface LoginScreenProps {
  setScreen: (screenName: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setScreen }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Esimerkki: kovakoodattu tarkistus
    if (username === "hoituri" && password === "testi") {
      Alert.alert("Kirjautuminen onnistui!");
      setScreen("Home");
    } else {
      Alert.alert("Virheellinen käyttäjätunnus tai salasana!");
    }
  };

  return (
    // Muutetaan containerin justifyContent-arvoa, jotta sisältö ei keskity pystysuunnassa
    <View style={[styles.container, { justifyContent: "flex-start", paddingTop: 60 }]}>
      {/* Otsikko ylös keskelle */}
      <View style={{ width: "100%", alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#6200EE" }}>
          Hoituri
        </Text>
      </View>
      
      <Text style={styles.titleText}>Kirjaudu sisään</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Käyttäjätunnus"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Salasana"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Kirjaudu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
