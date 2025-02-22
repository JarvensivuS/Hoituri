import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import styles from "../styles"; // Importoidaan tyylit

interface LocationScreenProps {
  setScreen: (screen: string) => void;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ setScreen }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Sijaintilupa hylätty", "Salli sijainti asetuksista käyttääksesi karttaa.", [{ text: "OK" }]);
          setLoading(false);
          return;
        }

        let locationData = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

        setLocation({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        });
      } catch (error) {
        console.error("Virhe haettaessa sijaintia:", error);
        Alert.alert("Virhe", "Sijaintia ei voitu hakea.", [{ text: "OK" }]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : location ? (
        <>
          <Text style={styles.ScreenText}>latitude {location.latitude.toFixed(6)}</Text>
          <Text style={styles.ScreenText}>longitude {location.longitude.toFixed(6)}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={location} title="Olet tässä" />
          </MapView>
        </>
      ) : (
        <Text style={styles.errorText}>Sijaintia ei voitu hakea</Text>
      )}
    </View>
  );
};

export default LocationScreen;
