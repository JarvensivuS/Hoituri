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

  // Päivitetään nykyinen aika sekunnin välein
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    const loadUserData = async () => {
      try {
        // Haetaan hoitajan nimi
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          setCaretakerName(storedName);
        }
        // Haetaan sisäänkirjautumisen yhteydessä tallennetut hoidettavien tiedot
        const storedPatients = await AsyncStorage.getItem("patients");
        console.log("Stored patients:", storedPatients);
        if (storedPatients) {
          const patients = JSON.parse(storedPatients);
          console.log("Parsed patients:", patients);
          if (patients.length > 0) {
            // Yhdistetään hoidettavien nimet näytettäväksi
            const names = patients
              .map((patient: any) => patient.userName || patient.name)
              .join(", ");
            setPatientName(names);

            // Haetaan kunkin hoidettavan reseptit
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

  // Haetaan nykyiset päivämäärä- ja kellonaikatiedot
  const weekday = currentDateTime.toLocaleDateString("fi-FI", { weekday: "long" });
  const date = currentDateTime.toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = currentDateTime.toLocaleTimeString("fi-FI");

  // Normalisointifunktio: muuttaa viikonpäivän pieniksi kirjaimiksi ja poistaa mahdollisen loppuosan "na"
  const normalizeDay = (day: string) => {
    return day.trim().toLowerCase().replace(/na$/, "");
  };

  // Viikonpäivien järjestys (normalisoidut muodot)
  const daysOrder: { [key: string]: number } = {
    "maanantai": 1,
    "tiistai": 2,
    "keskiviikko": 3,
    "torstai": 4,
    "perjantai": 5,
    "lauantai": 6,
    "sunnuntai": 7,
  };

  // Lasketaan nykyisen päivän indeksi käyttäen normalisoitua muotoa
  const currentDayIndex = daysOrder[normalizeDay(weekday)] || 1;

  // Apufunktio, joka palauttaa reseptin frequency-arvon järjestysnumeron normalisoidun arvon perusteella
  const getDayOrder = (dayStr: string | undefined) => {
    if (dayStr) {
      return daysOrder[normalizeDay(dayStr)] || 1;
    }
    return 1;
  };

  return (
    <View style={styles.ScreenContainer}>
      {/* Ylätunniste: hoitajan ja hoidettavan nimet sekä reaaliaikaiset tiedot */}
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
                // Lajitellaan kunkin hoidettavan reseptit nykyiseen päivään nähden:
                // Lasketaan etäisyys nykyisestä päivästä (0 = tänään, 1 = huomenna jne.) ja järjestetään kellonaikojen mukaan saman päivän sisällä
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
                    // Jos samalle päivälle, järjestetään kellonaikojen mukaan.
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
                    // Normalisoidaan reseptin frequency ja vertaillaan nykyiseen päivän normalisoituun muotoon
                    const normalizedFrequency = prescription.frequency ? normalizeDay(prescription.frequency) : "";
                    const isToday = normalizedFrequency === normalizeDay(weekday);
                    // Muodostetaan kellonaikaesitys
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
                          backgroundColor: isToday ? "lightblue" : "white",
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
