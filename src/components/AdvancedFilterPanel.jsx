import React, { useState } from "react";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import fisheriesData from "../data/fisheriesData.json";

const getUniqueValues = (arr, key) => [...new Set(arr.map(item => item[key]))];

const AdvancedFilterPanel = ({ onFilter }) => {
  const allCountries = getUniqueValues(fisheriesData, "Country");
  const allYears = getUniqueValues(fisheriesData, "Year").sort();
  const allIndicators = Object.keys(fisheriesData[0]).filter(
    key => typeof fisheriesData[0][key] === "number" && key !== "Year"
  );

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [yearRange, setYearRange] = useState([Math.min(...allYears), Math.max(...allYears)]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);

  const handleApplyFilters = () => {
    onFilter({
      countries: selectedCountries.map(c => c.value),
      yearRange,
      indicators: selectedIndicators.map(i => i.value),
    });
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-4">Advanced Filters</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Select Countries</label>
          <Select
            options={allCountries.map(c => ({ value: c, label: c }))}
            isMulti
            onChange={setSelectedCountries}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium ">Select Year Range</label>
          <Slider
            range
            min={Math.min(...allYears)}
            max={Math.max(...allYears)}
            defaultValue={yearRange}
            onChange={setYearRange}
            marks={{ [allYears[0]]: allYears[0], [allYears[allYears.length - 1]]: allYears[allYears.length - 1] }}
          />
          <p className="text-sm text-[#0B0B5C] mt-1 ml-17">Years: {yearRange[0]} – {yearRange[1]}</p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Select Indicators</label>
          <Select
            options={allIndicators.map(i => ({ value: i, label: i }))}
            isMulti
            onChange={setSelectedIndicators}
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;
