'use client'
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

// Define your Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEMAPS_KEY;

const PropertiesLocations = () => {
  const [map, setMap] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => setApiLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Static array of markers with example locations
  const staticMarkers = [
    { position: { lat: 40.7128, lng: -74.006 } }, // New York
    { position: { lat: 34.0522, lng: -118.2437 } }, // Los Angeles
    { position: { lat: 51.5074, lng: -0.1278 } }, // London
    { position: { lat: 48.8566, lng: 2.3522 } }, // Paris
    { position: { lat: 33.5731, lng: -7.5898 } }, // Casablanca
    { position: { lat: 34.020882, lng: -6.84165 } }, // Rabat
    { position: { lat: 31.6295, lng: -7.9811 } }, // Marrakech
    { position: { lat: 34.0181, lng: -5.0077 } }, // Fez
    { position: { lat: 35.7595, lng: -5.833 } }, // Tangier
    { position: { lat: 30.422, lng: -9.5595 } }, // Agadir
    { position: { lat: 31.5085, lng: -9.7595 } }, // Essaouira
    { position: { lat: 35.1695, lng: -5.2699 } }, // Chefchaouen
    { position: { lat: 33.8869, lng: -5.6541 } }, // Meknes
    { position: { lat: 30.9184, lng: -6.8937 } }, // Ouarzazate
  ];
  

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
  };

  return (
    <div style={{ width: "100%", height: "600px" }}>
      {apiLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: 40.7128, lng: -74.006 }} // Default center to New York
          zoom={4} // Default zoom level
          options={mapOptions}
          onLoad={map => setMap(map)}
        >
          {/* Render static markers */}
          {staticMarkers.map((marker, index) => (
            <Marker key={index} position={marker.position} />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default PropertiesLocations;
