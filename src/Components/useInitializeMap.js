// /useInitializeMap.js
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
export const useInitializeMap = (mapRef, mapContainerRef) => {
  useEffect(() => {
    // Ensure Mapbox access token is set
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXRpd2l0IiwiYSI6ImNraHEzd2dhcjFoM3IzOG14OWE2NDN4d2EifQ.gpmCZaDqR21iu8k2jbv4PQ';

    // Check that the container ref exists (to avoid errors during initialization)
    if (!mapContainerRef.current) return;

    // Initialize the Mapbox map instance
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, // Reference to the container HTML element
      style: 'mapbox://styles/mapbox/light-v11', // Valid Mapbox style
      center: [100.53345324464966, 13.76226308585546], // Initial center coordinates (longitude, latitude)
      zoom: 13, // Initial zoom level
    });

    // // Wait for the map to load before adding layers
    // mapRef.current.on('load', () => {
    //   const layers = mapRef.current.getStyle().layers;

    //   // Find the first symbol layer for proper placement of the 3D buildings layer
    //   const labelLayerId = layers.find(
    //     (layer) => layer.type === 'symbol' && layer.layout && layer.layout['text-field']
    //   )?.id; // Use optional chaining to avoid runtime errors

    //   if (labelLayerId) {
    //     mapRef.current.addLayer(
    //       {
    //         id: 'add-3d-buildings',
    //         source: 'composite',
    //         'source-layer': 'building',
    //         filter: ['==', 'extrude', 'true'],
    //         type: 'fill-extrusion',
    //         minzoom: 15,
    //         paint: {
    //           'fill-extrusion-color': '#aaa',
    //           'fill-extrusion-height': [
    //             'interpolate',
    //             ['linear'],
    //             ['zoom'],
    //             15,
    //             0,
    //             15.05,
    //             ['get', 'height'],
    //           ],
    //           'fill-extrusion-base': [
    //             'interpolate',
    //             ['linear'],
    //             ['zoom'],
    //             15,
    //             0,
    //             15.05,
    //             ['get', 'min_height'],
    //           ],
    //           'fill-extrusion-opacity': 0.6,
    //         },
    //       },
    //       labelLayerId // Add the new layer before the label layer
    //     );
    //   }
    // });

    // Cleanup function to remove the map instance when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null; // Clear the reference to avoid memory leaks
      }
    };
  }, [mapRef, mapContainerRef]); // Dependency array ensures effect runs when refs change
};