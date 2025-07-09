import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import fisheriesData from '../data/fisheriesData.json';

const positionMap = {
  Benin: [6.5, 2.6],
  Nigeria: [9.1, 8.7],
  // Add coordinates for all ECOWAS countries here
};

const FisheriesMap = () => {
  const latestByCountry = Object.values(
    fisheriesData.reduce((acc, entry) => {
      if (!acc[entry.Country] || acc[entry.Country].Year < entry.Year) {
        acc[entry.Country] = entry;
      }
      return acc;
    }, {})
  );

  return (
    <div className="mt-8 bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Fisheries Overview Map</h2>
      <MapContainer center={[8.5, 0]} zoom={5} style={{ height: 400, width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {latestByCountry.map(country => (
          <Marker key={country.Country} position={positionMap[country.Country]}>
            <Popup>
              <strong>{country.Country}</strong><br />
              Total Catch: {country['Total fish catch (MT/year)']} MT<br />
              CPUE: {country['Catch per unit effort (CPUE, kg/hour)']}<br />
              Income: ${country['Average income of fishers']}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default FisheriesMap;
