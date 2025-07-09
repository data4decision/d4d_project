
import React from "react";
import { db } from "../firebase/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import fisheriesData from "../data/fisheriesData.json";

export default function UploadFisheriesData() {
  const uploadData = async () => {
    try {
      const fisheriesRef = collection(db, "fisheries");

      for (const record of fisheriesData) {
        const newDocRef = doc(fisheriesRef);
        await setDoc(newDocRef, record);
      }

      alert("✅ Data uploaded successfully to Firestore!");
    } catch (error) {
      console.error("❌ Error uploading data:", error);
      alert("Failed to upload data.");
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={uploadData}
        className="bg-[#0B0B5C] hover:bg-[#F45B20] text-white px-6 py-3 rounded"
      >
        Upload Fisheries Data
      </button>
    </div>
  );
}
