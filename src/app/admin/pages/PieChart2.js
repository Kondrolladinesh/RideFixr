// components/PieChart.js
"use client"
import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Title, Legend } from "chart.js";
import "./DashBoard.css";

Chart.register(ArcElement, Tooltip, Title, Legend);

const PieChart2 = ({MechDetails}) => {
  const [PendingMechCount, setPendingMechCount] = useState(0);
  const [ActiveMechCount, setActiveMechCount] = useState(0);
  const [BlockedMechCount, setBlockedMechCount] = useState(0);

const fetchData=async()=>{
  let PendingCount = 0;
  let ActiveCount = 0;
  let BlockedCount = 0;

  MechDetails.forEach((item) => {
    if (item.Status === "Pending") {
        PendingCount += 1;
    } else if (item.Status === "Verified") {
        ActiveCount += 1;
    } else if (item.Status === "Block") {
        BlockedCount += 1;
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  setPendingMechCount(PendingCount);
  setActiveMechCount(ActiveCount);
  setBlockedMechCount(BlockedCount);
}
fetchData();

  
  const chartData = {
    datasets: [
      {
        data: [PendingMechCount, ActiveMechCount, BlockedMechCount],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(56, 165, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderWidth: 2,
        Width: 15,
      },
    ],
    labels: ["Pending Mechanic", "Verified Mechanic", "Block Mechanic"],
  };

  const options = {
    plugins: {
      title: {
        text: "Mechanic Status Segregation",
        display: true,
        fontSize: 20,
      },
    },
  };

  return (
    <div className="pieChart">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart2;

