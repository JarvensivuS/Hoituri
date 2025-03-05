import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "../styles"; // 🔹 Importing styles

interface HomeScreenProps {
  setScreen: (screen: string) => void;
}

// Esimerkkimuistutukseet
const reminders = [
  { day: "Maanantai", medicine: "Keltainen juoma", dosage:1, time: "09:00" },
  { day: "Tiistai", medicine: "Punainen pilleri", dosage:2, time: "12:00" },
  { day: "Keskiviikko", medicine: "Oranssi pilleri", dosage:2, time: "18:00" },
  { day: "Maanantai", medicine: "jalka voide", dosage:1, time: "01:00" },
  { day: "Tiistai", medicine: "Punainen pilleri", dosage:2, time: "12:00" },
  { day: "Keskiviikko", medicine: "Oranssi pilleri", dosage:2, time: "18:00" },
  { day: "Maanantai", medicine: "burana", dosage:2, time: "08:00" },
  { day: "Tiistai", medicine: "Punainen pilleri", dosage:2, time: "12:00" },
  { day: "Keskiviikko", medicine: "Oranssi pilleri", dosage:2, time: "12:00" },
  { day: "Maanantai", medicine: "UniPro unilääke", dosage:7, time: "22:00" },
  { day: "Tiistai", medicine: "Punainen pilleri", dosage:2, time: "12:00" },
  { day: "Keskiviikko", medicine: "Oranssi pilleri", dosage:2, time: "18:00" },
  { day: "Maanantai", medicine: "Muisti Laastari", dosage:1, time: "09:05" },
  { day: "Tiistai", medicine: "Punainen pilleri", dosage:2, time: "12:00" },
  { day: "Keskiviikko", medicine: "Oranssi pilleri", dosage:2, time: "18:00" },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ setScreen }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Päivitetään aika sekunnin välein

    return () => clearInterval(intervalId);
  }, []);

  // Haetaan nykyisen päivämäärän ja ajan komponentit
  const weekday = currentDateTime.toLocaleDateString("fi-FI", { weekday: "long" });
  const date = currentDateTime.toLocaleDateString("fi-FI", { day: "numeric", month: "long", year: "numeric" });
  const time = currentDateTime.toLocaleTimeString("fi-FI");

  // Määritellään viikonpäivien järjestys
  const daysOrder: { [key: string]: number } = {
    "maanantai": 1,
    "tiistai": 2,
    "keskiviikko": 3,
    "torstai": 4,
    "perjantai": 5,
    "lauantai": 6,
    "sunnuntai": 7,
  };

  // Lasketaan nykyisen päivän indeksi
  const currentDayIndex = daysOrder[weekday.toLowerCase()];

  // Järjestetään muistutukset siten, että nykyisen päivän muistutukset tulevat ensin.
  const sortedReminders = reminders.slice().sort((a, b) => {
    const aIndex = daysOrder[a.day.toLowerCase()];
    const bIndex = daysOrder[b.day.toLowerCase()];
    // Lasketaan relatiiviset arvot nykyisestä päivästä (0 = tänään)
    const relativeA = (aIndex - currentDayIndex + 7) % 7;
    const relativeB = (bIndex - currentDayIndex + 7) % 7;
    if (relativeA !== relativeB) {
      return relativeA - relativeB;
    }
    // Jos muistutukset ovat samalta päivältä, verrataan kellonaikoja
    return a.time.localeCompare(b.time);
  });

  return (
    <View style={styles.ScreenContainer}>
      {/* Yläosan reaaliaikaiset tiedot */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Tänään on {weekday}</Text>
        <Text style={{ fontSize: 20 }}>{date}</Text>
        <Text style={{ fontSize: 20 }}>{time}</Text>
      </View>

      {/* Otsikko Lääkemuistutuksille */}
      <Text style={styles.ScreenText}>Lääkemuistutukset</Text>

      {/* ScrollView: muistutukset eivät työntäisi otsikkoa ylös */}
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 20 }}>
        {sortedReminders.map((item, index) => {
          const isToday = item.day.toLowerCase() === weekday.toLowerCase();
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
                backgroundColor: isToday ? "#e0f7fa" : "transparent",
              }}
            >
              <Text>Päivä: {item.day}</Text>
              <Text>Lääke: {item.medicine}</Text>
              <Text>Annos: {item.dosage}</Text>
              <Text>Aika: {item.time}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
