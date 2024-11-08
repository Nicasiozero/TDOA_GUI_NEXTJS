"use client";
import { useState, useEffect, useRef } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { IoMicCircle } from "react-icons/io5";
// import {useWebSocket} from "../../components/websocket"
// import useWebSocket from "../../components/websocket";
// import { Server } from 'socket.oO'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);


const ScatterChart = ({ onCalculationStatusChange }) => {
  // const { messages, sendMessage } = useWebSocket('ws://localhost:4000');
  // console.log("msg:",messages)
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);


  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000/');
    setWs(socket);

    socket.onmessage = (event) => {
      let data;

      // Check if event.data is an ArrayBuffer
      if (event.data instanceof ArrayBuffer) {
        const decoder = new TextDecoder('utf-8');
        data = decoder.decode(event.data); // Convert ArrayBuffer to string
      } else {
        data = event.data; // Assume it's a string if it's not an ArrayBuffer
      }


      if (data) {
        let dataSplit = String(data).split(",");
        let position_x = parseFloat(dataSplit[0]);
        let position_y = parseFloat(dataSplit[1]);
        let position_calculate = dataSplit[2];

        onCalculationStatusChange(position_calculate == "True")
        handleAddNode(position_x, position_y);

      }

    };


    return () => {
      socket.close();
    };
  }, []);


  const [microphoneData, setMicrophoneData] = useState([
    { x: 20.5, y: 25 },
    { x: 4.5, y: 2 },
    { x: 38, y: 2 },
  ]);

  const [nodeData, setNodeData] = useState([
  ]);

  const handleAddNode = (x, y) => {
    setNodeData((prevNodeData) => {
      const updatedNodeData = [...prevNodeData, { x, y }];
      if (updatedNodeData.length > 3) {    //num of point
        updatedNodeData.shift();
      }
      return updatedNodeData;
    });
  };


  const chartRef = useRef(null);
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });


  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setChartDimensions({
          width: chartRef.current.offsetWidth,
          height: chartRef.current.offsetHeight,
        });
      }
    };


    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const calculatePosition = (x, y) => {
    const { width, height } = chartDimensions;
    return {
      left: `${(x / 42) * width}px`,
      top: `${height - (y / 30) * height}px`,
    };
  };


  const data = {
    datasets: [
      {
        label: "Microphones",
        data: microphoneData,
        backgroundColor: "#1e293b",
        pointRadius: 15,
      },
      {
        label: "Node Coordinates",
        data: nodeData,
        backgroundColor: nodeData.map(
          (_, index) => (index === nodeData.length - 1 ? "red" : "gray")
        ),
        pointRadius: 15,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: 0,
        max: 42,
        grid: {
          color: "#374151",
        },
        ticks: {
          color: "#ffffff",
          stepSize: 1,
        },
      },
      y: {
        type: "linear",
        min: 0,
        max: 30,
        grid: {
          color: "#374151",
        },
        ticks: {
          color: "#ffffff",
          stepSize: 2,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        ref={chartRef}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <Scatter data={data} options={options} />
        <div
          style={{
            position: "absolute",
            ...calculatePosition(4.5, 2),
            transform: "translate(-5%, -70%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <IoMicCircle size={50} />
          Mic1 (4.5, 2)
        </div>

        <div
          style={{
            position: "absolute",
            ...calculatePosition(20.5, 25),
            transform: "translate(-15%, -50%)",
            color: "white",
            textAlign: "center",
          }}
        >
          Mic2 (20.5, 25)
          <IoMicCircle size={50} />
        </div>

        <div
          style={{
            position: "absolute",
            ...calculatePosition(38, 2),
            transform: "translate(-50%, -70%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <IoMicCircle size={50} />
          Mic3 (38, 2)
        </div>
      </div>

      {/* แสดงพิกัดของจุดที่มาจาก Node */}
      {nodeData.map((point, index) => {
        const position = calculatePosition(point.x, point.y);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: position.left,
              top: position.top,
              color: "white",
              textAlign: "center",
            }}
          >
            <div>{`(${point.x.toFixed(1)}, ${point.y.toFixed(1)})`}</div>
          </div>
        );
      })}
    </div>
  );
};


export default function Home() {

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };


  const [isCalculated, setIsCalculated] = useState(false);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <main className="flex flex-col items-center w-full h-full">
        <div className="flex flex-row w-full justify-between">
          <div className="mb-2 text-3xl w-2/4  font-semibold text-white p-2 flex flex-row">
            <div className="mb-2 text-3xl font-semibold text-white p-2 justify-end">
              2-D Localization
            </div>
          </div>
          <div className="mb-2 text-1xl ont-semibold text-white p-2 justify-items-end">
            {isCalculated ? "Calculated" : "Calculate Failed"}
          </div>
        </div>

        <div className="w-full h-full flex flex-row items-end p-1">
          <div className="flex-grow w-full h-full">
            <ScatterChart onCalculationStatusChange={setIsCalculated} />
          </div>
        </div>
      </main>
    </div>
  );
}