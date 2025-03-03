import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "../styles"; // 🔹 Importing styles

interface HomeScreenProps {
  setScreen: (screen: string) => void;
}

// Esimerkkimuistutukset
const reminders = [
  { day: "Maanantai", medicine: "Keltainen juoma", time: "09:00" },
  { day: "Tiistai", medicine: "Punainen pilleri", time: "12:00" },
  { day: "Keskiviikko", medicine: "Oranssi pilleri", time: "18:00" },
  { day: "Maanantai", medicine: "jalka voide", time: "01:00" },
  { day: "Tiistai", medicine: "Punainen pilleri", time: "12:00" },
  { day: "Keskiviikko", medicine: "Oranssi pilleri", time: "18:00" },
  { day: "Maanantai", medicine: "burana", time: "08:00" },
  { day: "Tiistai", medicine: "Punainen pilleri", time: "12:00" },
  { day: "Keskiviikko", medicine: "Oranssi pilleri", time: "18:00" },
  { day: "Maanantai", medicine: "UniPro unilääke", time: "22:00" },
  { day: "Tiistai", medicine: "Punainen pilleri", time: "12:00" },
  { day: "Keskiviikko", medicine: "Oranssi pilleri", time: "18:00" },
  { day: "Maanantai", medicine: "Muisti Laastari", time: "09:05" },
  { day: "Tiistai", medicine: "Punainen pilleri", time: "12:00" },
  { day: "Keskiviikko", medicine: "Oranssi pilleri", time: "18:00" },
  
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

  // Järjestetään muistutukset ensin viikonpäivän, sitten kellonajan mukaan
  const sortedReminders = reminders.slice().sort((a, b) => {
    const dayA = daysOrder[a.day.toLowerCase()];
    const dayB = daysOrder[b.day.toLowerCase()];
    if (dayA !== dayB) {
      return dayA - dayB;
    }
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
          const isToday =
            item.day.toLowerCase() === weekday.toLowerCase();
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
              <Text>Aika: {item.time}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
