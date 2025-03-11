import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPatientHomeLocation } from "../services/apiMobile";

interface HomeContextProps {
  homeSet: boolean;
  homeLocation: { latitude: number; longitude: number } | null;
  setHomeSet: (value: boolean) => void;
  setHomeLocation: (location: { latitude: number; longitude: number } | null) => void;
}

export const HomeContext = createContext<HomeContextProps>({
  homeSet: false,
  homeLocation: null,
  setHomeSet: () => {},
  setHomeLocation: () => {},
});

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [homeSet, setHomeSet] = useState(false);
  const [homeLocation, setHomeLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const fetchHomeLocation = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const patientId = await AsyncStorage.getItem("patientId");
        if (userId && patientId) {
          const data = await getPatientHomeLocation(userId, patientId);
          console.log("Fetched homeLocation from DB:", data);
          
          if (data && data.homeLocation) {
            setHomeLocation(data.homeLocation);
            setHomeSet(true);
          } else if (data && data.latitude && data.longitude) {
            setHomeLocation({ latitude: data.latitude, longitude: data.longitude });
            setHomeSet(true);
          } else {
            console.error("Kotisijaintitiedot puuttuvat API-vastauksesta.");
          }
        } else {
          console.error("userId tai patientId puuttuu AsyncStoragesta");
        }
      } catch (error) {
        console.error("Error fetching home location:", error);
      }
    };

    fetchHomeLocation();
  }, []);

  return (
    <HomeContext.Provider value={{ homeSet, homeLocation, setHomeSet, setHomeLocation }}>
      {children}
    </HomeContext.Provider>
  );
};
