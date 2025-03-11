import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPatientLocation } from "../services/apiMobile";

export interface LocationData {
  latitude: number;
  longitude: number;
}

interface LocationContextProps {
  location: LocationData | null;
}

export const LocationContext = createContext<LocationContextProps>({ location: null });

interface LocationTrackerProps {
  children: ReactNode;
}

const LocationTrackerCareTaker: React.FC<LocationTrackerProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);

  // Haetaan käyttäjän ja potilaan ID:t AsyncStoragesta
  useEffect(() => {
    const fetchIds = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedPatientId = await AsyncStorage.getItem("patientId");
        console.log("Fetched IDs from AsyncStorage:", storedUserId, storedPatientId);
        if (storedUserId && storedPatientId) {
          setUserId(storedUserId);
          setPatientId(storedPatientId);
        } else {
          console.error("User ID tai Patient ID puuttuu AsyncStoragesta");
        }
      } catch (error) {
        console.error("Virhe ID:iden haussa:", error);
      }
    };

    fetchIds();
  }, []);

  // Kun ID:t ovat saatavilla, haetaan potilaan sijainti tietokannasta
  useEffect(() => {
    if (!userId || !patientId) {
      console.log("UserId tai patientId ei ole vielä saatavilla, ei haeta sijaintia.");
      return;
    }

    const fetchLocationFromDB = async () => {
      try {
        const data = await getPatientLocation(userId, patientId);
        console.log("API-vastaus:", data);
        
        const patient = Array.isArray(data) ? data[0] : data;
        console.log("Potilasdata:", patient);
        if (patient && patient.location) {
          console.log("Potilaan sijainti:", patient.location);
          const newLocation = {
            latitude: patient.location.latitude,
            longitude: patient.location.longitude,
          };
          // Tulostetaan päivitetyt latitude ja longitude arvot konsoliin
          console.log("Updated location: Latitude:", newLocation.latitude, "Longitude:", newLocation.longitude);
          setLocation(newLocation);
        } else {
          console.error("Potilaan sijaintitiedot puuttuvat API-vastauksesta.");
        }
      } catch (error) {
        console.error("Virhe potilaan sijainnin haussa:", error);
      }
    };

    // Haetaan sijainti heti, kun ID:t ovat saatavilla
    fetchLocationFromDB();
    // Päivitetään sijainti 5 sekunnin välein
    const intervalId = setInterval(fetchLocationFromDB, 5000);

    return () => clearInterval(intervalId);
  }, [userId, patientId]);

  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationTrackerCareTaker;
