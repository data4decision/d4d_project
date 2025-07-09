// File: admin/AdminDashboard.jsx

import { useState } from "react";
import Layout from "../components/Layout";
import FisheriesOverview from "../components/FisheriesOverview";
import AdvancedFilterPanel from "../components/AdvancedFilterPanel";
import fisheriesData from "../data/fisheriesData.json";

export default function AdminDashboard() {
  const [filteredData, setFilteredData] = useState([]);

  const handleFilter = ({ countries, yearRange, indicators }) => {
    const results = fisheriesData.filter(item =>
      countries.includes(item.Country) &&
      item.Year >= yearRange[0] &&
      item.Year <= yearRange[1]
    );

    const mapped = results.map(entry => ({
      country: entry.Country,
      year: entry.Year,
      ...indicators.reduce((acc, indicator) => {
        acc[indicator] = entry[indicator];
        return acc;
      }, {})
    }));

    setFilteredData(mapped);
  };

  return (
    <Layout>
      <div className="px-4 py-6">
        <AdvancedFilterPanel onFilter={handleFilter} />
        <FisheriesOverview data={filteredData} />
      </div>
    </Layout>
  );
}
