// components/PieChart.js
"use client"
import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Title, Legend } from "chart.js";
import "./DashBoard.css";

Chart.register(ArcElement, Tooltip, Title, Legend);

const PieChart = ({MechDetails}) => {
  const [EngineC, setEngineC] = useState(0);
  const [ElectricC, setElectricC] = useState(0);
  const [TyreC, setTyreC] = useState(0);

const fetchData=async()=>{
  let engineCount = 0;
  let electricCount = 0;
  let tyreCount = 0;

  MechDetails.forEach((item) => {
    if (item.MechType === "Engine") {
      engineCount += 1;
    } else if (item.MechType === "Electric") {
      electricCount += 1;
    } else if (item.MechType === "Tyre") {
      tyreCount += 1;
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  setEngineC(engineCount);
  setElectricC(electricCount);
  setTyreC(tyreCount);
}
fetchData();

  
  const chartData = {
    datasets: [
      {
        data: [EngineC, ElectricC, TyreC],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderWidth: 2,
        Width: 15,
      },
    ],
    labels: ["Engine Mechanic", "Electric Mechanic", "Tyre Mechanic"],
  };

  const options = {
    plugins: {
      title: {
        text: "Mechanic Type Segregation",
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

export default PieChart;

