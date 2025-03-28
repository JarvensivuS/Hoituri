import React, { useContext, useMemo } from "react";
import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { LocationContext } from "../components/LocationTrackerCareTaker";
import { HomeContext } from "../components/HomeContext";
import styles from "../styles";

interface LocationScreenProps {
  setScreen: (screen: string) => void;
}

const CareTakerLocationScreen: React.FC<LocationScreenProps> = ({ setScreen }) => {
  const { location } = useContext(LocationContext);
  const { homeSet, homeLocation, setHomeSet, setHomeLocation } = useContext(HomeContext);

  // Näytetään latausviesti, jos sijaintia ei ole vielä haettu
  if (!location) {
    return (
      <View style={[styles.locationScreenContainer, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Haetaan sijaintitietoja...</Text>
      </View>
    );
  }

  // Lasketaan, onko potilas kotialueen ulkopuolella
  const outsideHome = useMemo(() => {
    if (homeSet && homeLocation) {
      const latOffset = 50 / 111320;
      const lngOffset = 50 / (111320 * Math.cos(homeLocation.latitude * Math.PI / 180));
      const minLat = homeLocation.latitude - latOffset / 2;
      const maxLat = homeLocation.latitude + latOffset / 2;
      const minLng = homeLocation.longitude - lngOffset / 2;
      const maxLng = homeLocation.longitude + lngOffset / 2;
      return (
        location.latitude < minLat ||
        location.latitude > maxLat ||
        location.longitude < minLng ||
        location.longitude > maxLng
      );
    }
    return false;
  }, [homeSet, homeLocation, location]);

  // Muodostetaan HTML-sisältö karttaa varten
  const getHtmlContent = (): string => {
    let rectangleCode = "";
    if (homeSet && homeLocation) {
      rectangleCode = `
        var latOffset = 50 / 111320; 
        var lngOffset = 50 / (111320 * Math.cos(${homeLocation.latitude} * Math.PI / 180));
        var southWest = [${homeLocation.latitude} - latOffset/2, ${homeLocation.longitude} - lngOffset/2];
        var northEast = [${homeLocation.latitude} + latOffset/2, ${homeLocation.longitude} + lngOffset/2];
        var bounds = [southWest, northEast];
        var homeArea = L.rectangle(bounds, { color: "red", weight: 2 });
        homeArea.addTo(map);
      `;
    }
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
          <style>
            html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
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
              .bindPopup("Hoidettava")
              .openPopup();
            ${rectangleCode}
          </script>
        </body>
      </html>
    `;
  };

  

  return (
    <View style={styles.locationScreenContainer}>
      <View style={styles.headerContainer}>
        {homeSet && outsideHome && (
          <Text style={styles.warningText}>HOIDETTAVA ON KODIN ULKOPUOLELLA!</Text>
        )}
        <Text>Hoidettavan GPS-koordinaatit:</Text>
        <Text style={styles.ScreenText}>Latitude: {location.latitude.toFixed(6)}</Text>
        <Text style={styles.ScreenText}>Longitude: {location.longitude.toFixed(6)}</Text>
      </View>
      <View style={styles.mapContainer}>
        <WebView originWhitelist={["*"]} source={{ html: getHtmlContent() }} style={styles.webview} />
      </View>
      
    </View>
  );
};

export default CareTakerLocationScreen;
