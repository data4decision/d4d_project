import React, { useState } from "react";
import Layout from "../components/Layout";
import fisheriesData from "../data/fisheriesData.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const allIndicators = Object.keys(fisheriesData[0]).filter(
  (key) => key !== "Country" && key !== "Year" && key !== "Region"
);
const years = Array.from(new Set(fisheriesData.map((d) => d.Year))).sort(
  (a, b) => a - b
);
const countries = Array.from(new Set(fisheriesData.map((d) => d.Country))).sort();

export default function KPITrends() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedIndicator, setSelectedIndicator] = useState(allIndicators[0]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([countries[0]]);

  const toggleCountry = (country) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  const getChartData = () => {
    if (compareMode) {
      return years.map((year) => {
        const entry = { year };
        selectedCountries.forEach((country) => {
          const record = fisheriesData.find(
            (d) => d.Year === year && d.Country === country
          );
          entry[country] = record ? record[selectedIndicator] : null;
        });
        return entry;
      });
    } else {
      return fisheriesData
        .filter((d) => d.Country === selectedCountry)
        .map((d) => ({ year: d.Year, value: d[selectedIndicator] }));
    }
  };

  const chartData = getChartData();

  const getTrendArrow = () => {
    const filtered = fisheriesData.filter(
      (d) => d.Country === selectedCountry && d[selectedIndicator] !== null
    );
    if (filtered.length < 2) return null;
    const start = filtered[0][selectedIndicator];
    const end = filtered[filtered.length - 1][selectedIndicator];
    const percentChange = ((end - start) / start) * 100;
    const isPositive = percentChange >= 0;
    return (
      <span className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {percentChange.toFixed(1)}%
      </span>
    );
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("kpi-chart-section");
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, width, height);
    pdf.save(`KPI_Trend_${selectedIndicator}.pdf`);
  };

  return (
    <Layout>
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold text-[#0b0b5c] mb-4">KPI Trends Over Time</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Select Indicator</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
            >
              {allIndicators.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {compareMode ? "Select Countries" : "Select Country"}
            </label>
            {!compareMode ? (
              <select
                className="w-full p-2 border rounded"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <div className="h-32 overflow-y-auto border p-2 rounded">
                {countries.map((c) => (
                  <label key={c} className="block text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(c)}
                      onChange={() => toggleCountry(c)}
                      className="mr-2"
                    />
                    {c}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={compareMode}
                onChange={(e) => setCompareMode(e.target.checked)}
                className="mr-2"
              />
              Compare Multiple Countries
            </label>
            <button
              onClick={handleExportPDF}
              className="px-3 py-2 bg-[#f47b20] text-white text-sm rounded hover:bg-[#d7660f]"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* KPI Summary & Chart */}
        <div id="kpi-chart-section" className="bg-gray-50 p-4 rounded">
          {!compareMode && (
            <div className="mb-2 flex justify-between items-center">
              <h4 className="font-medium text-gray-700">{selectedCountry}</h4>
              {getTrendArrow()}
            </div>
          )}

          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                {!compareMode ? (
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={selectedIndicator}
                    stroke="#0b0b5c"
                    strokeWidth={2}
                    dot={false}
                  />
                ) : (
                  selectedCountries.map((country, i) => (
                    <Line
                      key={country}
                      type="monotone"
                      dataKey={country}
                      name={country}
                      stroke={["#0b0b5c", "#f47b20", "#82ca9d", "#8884d8"][i % 4]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
