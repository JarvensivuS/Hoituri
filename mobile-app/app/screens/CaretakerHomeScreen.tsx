import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles";
import { getPrescriptions } from "../services/apiMobile.js";

interface HomeScreenProps {
  setScreen: (screen: string) => void;
}

const CaretakerHomeScreen: React.FC<HomeScreenProps> = ({ setScreen }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [caretakerName, setCaretakerName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientsPrescriptions, setPatientsPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    const loadUserData = async () => {
      try {
        // Get caretaker's name
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          setCaretakerName(storedName);
        }
        // Get patients data saved during login
        const storedPatients = await AsyncStorage.getItem("patients");
        console.log("Stored patients:", storedPatients);
        if (storedPatients) {
          const patients = JSON.parse(storedPatients);
          console.log("Parsed patients:", patients);
          if (patients.length > 0) {
            // Join patient names to display at the top
            const names = patients
              .map((patient: any) => patient.userName || patient.name)
              .join(", ");
            setPatientName(names);

            // For each patient, fetch their prescriptions
            const patientsPresc = await Promise.all(
              patients.map(async (patient: any) => {
                try {
                  const prescriptions = await getPrescriptions(patient.id);
                  return { ...patient, prescriptions };
                } catch (error) {
                  console.error("Error fetching prescriptions for patient", patient.id, error);
                  return { ...patient, prescriptions: [] };
                }
              })
            );
            setPatientsPrescriptions(patientsPresc);
          }
        }
      } catch (error) {
        console.error("Error loading user data", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    return () => clearInterval(intervalId);
  }, []);

  // Get current date/time strings
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

  // Calculate current day's index (default to 1 if not found)
  const currentDayIndex = daysOrder[weekday.toLowerCase()] || 1;

  // Helper function to get the day order from the prescription frequency.
  // If the frequency isn't one of the defined days, it defaults to 1.
  const getDayOrder = (dayStr: string | undefined) => {
    if (dayStr && daysOrder[dayStr.toLowerCase()]) {
      return daysOrder[dayStr.toLowerCase()];
    }
    return 1;
  };

  return (
    <View style={styles.ScreenContainer}>
      {/* Top section with caretaker and patient names and real-time info */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={styles.ScreenText}>Käyttäjä: {caretakerName}</Text>
        <Text style={styles.ScreenText}>Hoidettava: {patientName}</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tänään on {weekday}</Text>
        <Text style={{ fontSize: 16 }}>{date}</Text>
        <Text style={{ fontSize: 16 }}>{time}</Text>
      </View>

      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 20 }}>
        {loading ? (
          <Text>Ladataan...</Text>
        ) : patientsPrescriptions.length > 0 ? (
          patientsPrescriptions.map((patient) => (
            <View key={patient.id} style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Hoidettava: {patient.userName || patient.name}
              </Text>
              {patient.prescriptions && patient.prescriptions.length > 0 ? (
                // Sort each patient's prescriptions by day (frequency) and then by time.
                patient.prescriptions
                  .slice()
                  .sort((a: any, b: any) => {
                    const aDayOrder = getDayOrder(a.frequency);
                    const bDayOrder = getDayOrder(b.frequency);
                    const relativeA = (aDayOrder - currentDayIndex + 7) % 7;
                    const relativeB = (bDayOrder - currentDayIndex + 7) % 7;
                    if (relativeA !== relativeB) {
                      return relativeA - relativeB;
                    }
                    // If on the same day, sort by time (using the first time if an array)
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
                  })
                  .map((prescription: any, index: number) => {
                    // Prepare times display from reminderSettings.times
                    let timesDisplay = "Ei määritelty";
                    if (prescription.reminderSettings && prescription.reminderSettings.times) {
                      timesDisplay = Array.isArray(prescription.reminderSettings.times)
                        ? prescription.reminderSettings.times.join(", ")
                        : prescription.reminderSettings.times;
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
                        }}
                      >
                        <Text>Lääke: {prescription.medication || "Ei määritelty"}</Text>
                        <Text>Päivä: {prescription.frequency || "Ei määritelty"}</Text>
                        <Text>Annos: {prescription.dosage || "Ei määritelty"}</Text>
                        <Text>Aika: {timesDisplay}</Text>
                      </View>
                    );
                  })
              ) : (
                <Text>Ei reseptejä tälle hoidettavalle.</Text>
              )}
            </View>
          ))
        ) : (
          <Text>Ei hoidettavan tietoja saatavilla.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default CaretakerHomeScreen;
