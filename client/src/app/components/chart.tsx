'use client'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import { DataJSON } from "../page";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const Chart: React.FC<{ data: DataJSON[] }> = ({ data }) => {
  console.log(data, 'data')
  const labels = data?.map((item) => new Date(item.time).toLocaleString())
  const dots = data?.map(item => item.data)
  return (
    <div>
      {data &&
        <Line
          className="w-full h-[600px]"
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true          
              }
            }
          }}
          data={{
          labels: labels,
          datasets: [
              {
                data: dots,
                backgroundColor: "purple",
              },
            ],
          }}
        />
      }
    </div>
  );
};
export default Chart;