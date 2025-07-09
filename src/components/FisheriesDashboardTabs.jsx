import React, { useState } from 'react';
import FisheriesOverview from './FisheriesOverview';
import FisheriesCharts from './FisheriesCharts';
import FisheriesMap from './FisheriesMap';

const FisheriesDashboardTabs = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedCountry, setSelectedCountry] = useState('Benin');

  const tabStyle = (active) =>
    `px-4 py-2 rounded-t-lg font-semibold ${
      active ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-blue-500'
    }`;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-4 flex space-x-4 border-b">
        <button onClick={() => setSelectedTab('overview')} className={tabStyle(selectedTab === 'overview')}>Overview</button>
        <button onClick={() => setSelectedTab('charts')} className={tabStyle(selectedTab === 'charts')}>Charts</button>
        <button onClick={() => setSelectedTab('map')} className={tabStyle(selectedTab === 'map')}>Map</button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow">
        {selectedTab === 'overview' && (
          <FisheriesOverview
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
          />
        )}

        {selectedTab === 'charts' && <FisheriesCharts country={selectedCountry} />}

        {selectedTab === 'map' && <FisheriesMap />}
      </div>
    </div>
  );
};

export default FisheriesDashboardTabs;
