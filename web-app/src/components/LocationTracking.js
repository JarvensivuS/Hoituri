import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const  LocationTracking = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([60.1699, 24.9384], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Kartta</h2>
      <div id="map" style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
};

export default LocationTracking;