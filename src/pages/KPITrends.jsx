// KPITrends.jsx – with Animated Trend Playback

import React, { useState, useEffect, useRef } from "react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowUpRight, ArrowDownRight, HelpCircle, Play, Pause } from "lucide-react";

const allIndicators = Object.keys(fisheriesData[0]).filter(
  (key) => key !== "Country" && key !== "Year" && key !== "Region"
);
const years = Array.from(new Set(fisheriesData.map((d) => d.Year))).sort((a, b) => a - b);
const countries = Array.from(new Set(fisheriesData.map((d) => d.Country))).sort();

export default function KPITrends() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedIndicator, setSelectedIndicator] = useState(allIndicators[0]);
  const [yearIndex, setYearIndex] = useState(years.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const playTrend = () => {
    setIsPlaying(true);
    setYearIndex(0);
    intervalRef.current = setInterval(() => {
      setYearIndex((prev) => {
        if (prev < years.length - 1) return prev + 1;
        clearInterval(intervalRef.current);
        setIsPlaying(false);
        return prev;
      });
    }, 700);
  };

  const pauseTrend = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  const currentYear = years[yearIndex];
  const chartData = fisheriesData
    .filter((d) => d.Country === selectedCountry && d.Year <= currentYear)
    .map((d) => ({ year: d.Year, value: d[selectedIndicator] }));

  const getTrendArrow = () => {
    const filtered = fisheriesData.filter((d) => d.Country === selectedCountry && d[selectedIndicator] != null);
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
            <label className="text-sm font-medium text-gray-700">Select Country</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-end">
            <button
              onClick={isPlaying ? pauseTrend : playTrend}
              className="px-3 py-2 bg-[#0b0b5c] text-white text-sm rounded hover:bg-[#080849]"
            >
              {isPlaying ? "Pause" : "Play Trend"}
            </button>
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
          <div className="mb-2 flex justify-between items-center">
            <h4 className="font-medium text-gray-700">{selectedCountry} (up to {currentYear})</h4>
            {getTrendArrow()}
          </div>

          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={selectedIndicator}
                  stroke="#0b0b5c"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
