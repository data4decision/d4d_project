import React from 'react';

const PrintableSummary = ({ data }) => {
  return (
    <div className="p-10 text-black bg-white print:block hidden">
      <h1 className="text-2xl font-bold mb-4">Fisheries Summary - {data.Country}, {data.Year}</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li>Total Catch: {data['Total fish catch (MT/year)']} MT</li>
        <li>CPUE: {data['Catch per unit effort (CPUE, kg/hour)']} kg/hr</li>
        <li>Average Income: ${data['Average income of fishers']}</li>
        <li>Post-Harvest Loss: {data['Post-harvest loss rate (%)']}%</li>
        {/* add more if needed */}
      </ul>
    </div>
  );
};

export default PrintableSummary;
