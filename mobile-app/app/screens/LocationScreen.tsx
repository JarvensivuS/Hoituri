import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
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

  if (loading) {
    return (
      <View style={[styles.locationScreenContainer, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={[styles.locationScreenContainer, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.errorText}>Sijaintia ei voitu hakea</Text>
      </View>
    );
  }

  // HTML-sisältö Leaflet-kartalle
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          html, body, #map {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 16);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          L.marker([${location.latitude}, ${location.longitude}]).addTo(map)
            .bindPopup("Olet tässä")
            .openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.locationScreenContainer}>
      {/* Header: Keskitetyt lat/long-tekstit */}
      <View style={styles.headerContainer}>
        <Text style={styles.ScreenText}>Latitude: {location.latitude.toFixed(6)}</Text>
        <Text style={styles.ScreenText}>Longitude: {location.longitude.toFixed(6)}</Text>
      </View>

      {/* Kartta vie tilan */}
      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={styles.webview}
        />
      </View>

      {/* Alue, jossa nappi "Aseta koti" */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => {
            // Lisää toiminnallisuus tähän, esim. aseta koti -toiminto
            Alert.alert("Koti asetettu", "Oletus kotisijainti on asetettu.");
          }}
          style={styles.homeButton}
        >
          <Text style={styles.homeButtonText}>Aseta koti</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationScreen;
