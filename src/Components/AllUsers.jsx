import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, CssBaseline, Button, Box } from "@mui/material";
import ComboBox from "./Combobox";
import { pdfArray } from "../utils";

function visitsNumtoName(visits){
  return visits.map(visit=> {
    if(typeof +visit === 'number'){
      return pdfArray[visit-1]?.name
    }
    else{
      return null
    }
  }).filter(item => item !== undefined)
}

const columns = [
  { field: "name", headerName: "Name", width: 100 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "phone", headerName: "Phone", width: 100 },
  { field: "tagNumber", headerName: "Tag Number", width: 150 },
  { field: "interestedIn", headerName: "Interested In", width: 150 },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 180,
  },
  { field: "pedalScore", headerName: "Pedal Score", width: 100 },
  { 
    field: 'activity', 
    headerName: 'Activity', 
    width: 170, 
    renderCell: (params) => (
      <ComboBox options={params?.row?.activity}/>
    ),
  },
  { 
    field: 'visits', 
    headerName: 'Visits', 
    width: 350, 
    renderCell: (params) => (
      <ComboBox options = {visitsNumtoName(params?.row?.visits)}/> // Map to an array of strings/>
    ),
  },
];

function convertTimestampTo12HourClock(timestampMs) {
  const date = new Date(timestampMs);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours < 12 ? "AM" : "PM";
  hours = hours % 12 || 12;

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${month}/${day}/${year} ${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${amPm}`;
}

const fetchData = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/user-data`);
  const data = await response.json();
  return data;
};

export default function AllUsers() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData()
      .then((data) => {
        console.log("data", data)
        const transformedData = data.map((item, index) => ({
          id: item._id,
          name: item.name || "N/A",
          email: item.email || "N/A",
          phone: item.phone || "N/A",
          tagNumber: item.tagNumber || "N/A",
          interestedIn: item.interestedIn || "N/A",
          createdAt: item.createdAt
            ? convertTimestampTo12HourClock(item.createdAt)
            : "N/A",
          pedalScore: item.pedalScore || "N/A",
          activity: item.activity || [],
          visits: item.visits || [],
        }));
        setRows(transformedData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const downloadCSV = (rows) => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Phone",
        "Tag Number",
        "Interested In",
        "Created At",
        "Pedal Score",
      ],
      ...rows.map((row) => [
        row.name,
        row.email,
        row.number,
        row.tagNumber,
        row.interestedIn,
        row.createdAt,
        row.pedalScore,
      ]),
    ]
      .map((e) => e.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;  
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth={false} disableGutters>
      <CssBaseline />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={2}
        style={{ backgroundColor: "#f5f5f5" }}
      >
        <h2>All Users</h2>
        <Button variant="contained" onClick={() => downloadCSV(rows)}>
          Download CSV
        </Button>
      </Box>

      <Box style={{ height: "calc(100vh - 64px)", width: "100%" }}>
        <DataGrid  rows={rows} columns={columns} pageSize={5} />
      </Box>
    </Container>
  );
}
