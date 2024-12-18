export const fetchAmphoeGeoJSON = async () => {
    try {
        const response = await fetch('/data/Amphoe-4326.geojson');
        if (!response.ok) throw new Error('Failed to fetch Amphoe GeoJSON');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading Amphoe GeoJSON:', error);
        throw error;
    }
};