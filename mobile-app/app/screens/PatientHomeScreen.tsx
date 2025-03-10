import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles";
import { getPrescriptions } from "../services/apiMobile.js";

interface HomeScreenProps {
  setScreen: (screenName: string) => void;
}

const PatientHomeScreen: React.FC<HomeScreenProps> = ({ setScreen }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [emergencyPressed, setEmergencyPressed] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Update the current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Load patient details and fetch prescriptions
  useEffect(() => {
    const loadUserDetailsAndPrescriptions = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        const storedId = await AsyncStorage.getItem("userId");
        if (storedName) {
          setPatientName(storedName);
        }
        if (storedId) {
          setPatientId(storedId);
          const data = await getPrescriptions(storedId);
          setPrescriptions(data);
        }
      } catch (error) {
        console.error("Error loading user details or prescriptions", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetailsAndPrescriptions();
  }, []);

  // Get current date and time strings
  const weekday = currentDateTime.toLocaleDateString("fi-FI", { weekday: "long" });
  const date = currentDateTime.toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = currentDateTime.toLocaleTimeString("fi-FI");

  // Define weekday order mapping
  const daysOrder: { [key: string]: number } = {
    "maanantai": 1,
    "tiistai": 2,
    "keskiviikko": 3,
    "torstai": 4,
    "perjantai": 5,
    "lauantai": 6,
    "sunnuntai": 7,
  };

  // Calculate the current day's index (default to 1 if not found)
  const currentDayIndex = daysOrder[weekday.toLowerCase()] || 1;

  // Helper function: if the prescription's frequency (day) is not recognized, return 1
  const getDayOrder = (dayStr: string | undefined) => {
    if (dayStr && daysOrder[dayStr.toLowerCase()]) {
      return daysOrder[dayStr.toLowerCase()];
    }
    return 1;
  };

  // Sort prescriptions based on their "frequency" (i.e. day) relative to today.
  // If the frequency isn't one of the defined days, it's given order 1.
  // If two prescriptions are on the same day, sort them by time (using the first time in reminderSettings.times).
  const sortedPrescriptions = prescriptions.slice().sort((a, b) => {
    const aDayOrder = getDayOrder(a.frequency);
    const bDayOrder = getDayOrder(b.frequency);
    const relativeA = (aDayOrder - currentDayIndex + 7) % 7;
    const relativeB = (bDayOrder - currentDayIndex + 7) % 7;
    if (relativeA !== relativeB) {
      return relativeA - relativeB;
    }
    // If on the same day, sort by time.
    let aTime = "";
    let bTime = "";
    if (a.reminderSettings && a.reminderSettings.times) {
      aTime = Array.isArray(a.reminderSettings.times)
        ? a.reminderSettings.times[0]
        : a.reminderSettings.times;
    }
    if (b.reminderSettings && b.reminderSettings.times) {
      bTime = Array.isArray(b.reminderSettings.times)
        ? b.reminderSettings.times[0]
        : b.reminderSettings.times;
    }
    return aTime.localeCompare(bTime);
  });

  return (
    <View style={styles.ScreenContainer}>
      {/* Header with real-time info */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={styles.ScreenText}>Käyttäjä: {patientName}</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tänään on {weekday}</Text>
        <Text style={{ fontSize: 16 }}>{date}</Text>
        <Text style={{ fontSize: 16 }}>{time}</Text>
      </View>

      {/* Prescription details (sorted) */}
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 20 }}>
        {loading ? (
          <Text>Ladataan reseptejä...</Text>
        ) : sortedPrescriptions.length > 0 ? (
          sortedPrescriptions.map((item, index) => {
            let timesDisplay = "Ei määritelty";
            if (item.reminderSettings && item.reminderSettings.times) {
              timesDisplay = Array.isArray(item.reminderSettings.times)
                ? item.reminderSettings.times.join(", ")
                : item.reminderSettings.times;
            }
            return (
              <View
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 10,
                  marginVertical: 5,
                  borderRadius: 5,
                  width: "100%",
                }}
              >
                <Text>Lääke: {item.medication || "Ei määritelty"}</Text>
                <Text>Päivä: {item.frequency || "Ei määritelty"}</Text>
                <Text>Annos: {item.dosage || "Ei määritelty"}</Text>
                <Text>Aika: {timesDisplay}</Text>
              </View>
            );
          })
        ) : (
          <Text>Ei reseptejä näytettäväksi.</Text>
        )}
      </ScrollView>

      {/* Emergency button */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <TouchableOpacity
          onPress={() => setEmergencyPressed((prev) => !prev)}
          style={{
            width: 100,
            height: 100,
            borderRadius: 99,
            backgroundColor: "red",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 34 }}>HÄTÄ</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          {emergencyPressed ? "true" : "false"}
        </Text>
      </View>
    </View>
  );
};

export default PatientHomeScreen;
