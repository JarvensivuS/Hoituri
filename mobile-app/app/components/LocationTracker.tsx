// components/LocationTracker.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as Location from "expo-location";

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

const LocationTracker: React.FC<LocationTrackerProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Sijaintiluvan saaminen epäonnistui");
        return;
      }
      
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,  // Päivittää sijainnin 5 sekunnin välein
          distanceInterval: 0,
        },
        (locationData) => {
          setLocation({
            latitude: locationData.coords.latitude,
            longitude: locationData.coords.longitude,
          });
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationTracker;
