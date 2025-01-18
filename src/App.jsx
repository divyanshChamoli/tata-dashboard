import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, CssBaseline, Button, Box, Link } from "@mui/material";

const columns = [
  { field: "name", headerName: "Name", width: 100 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "phone", headerName: "Phone", width: 100 },
  { field: "tagNumber", headerName: "Tag Number", width: 150 },
  { field: "interestedIn", headerName: "Interested In", width: 150 },
  { field: "result", headerName: "Result", width: 100 },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 180,
  },
  { field: "pedalScore", headerName: "Pedal Score", width: 100 },
  // {
  //   field: "certificateImageUrl",
  //   headerName: "Certificate",
  //   width: 120,
  //   renderCell: (params) =>
  //     params.value ? (
  //       <Link href={params.value} target="_blank" rel="noopener noreferrer">
  //         Certificate
  //       </Link>
  //     ) : (
  //       "N/A"
  //     ),
  // },
  // {
  //   field: "childImageUrl",
  //   headerName: "Child's Image",
  //   width: 120,
  //   renderCell: (params) =>
  //     params.value ? (
  //       <Link href={params.value} target="_blank" rel="noopener noreferrer">
  //         Child's Image
  //       </Link>
  //     ) : (
  //       "N/A"
  //     ),
  // },
  // {
  //   field: "videoUrl",
  //   headerName: "Video",
  //   width: 120,
  //   renderCell: (params) =>
  //     params.value ? (
  //       <Link href={params.value} target="_blank" rel="noopener noreferrer">
  //         Video
  //       </Link>
  //     ) : (
  //       "N/A"
  //     ),
  // },
];

// const mapResult = (result) => {
//   switch (result) {
//     case "A":
//       return "Humble";
//     case "B":
//       return "Wise";
//     case "C":
//       return "Strong";
//     case "D":
//       return "Brave";
//     case "E":
//       return "Kind";
//     default:
//       return "Unknown";
//   }
// };

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
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users`);
  const data = await response.json();
  return data.users;
};

export default function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData()
      .then((data) => {
        const transformedData = data.map((item, index) => ({
          id: index + 1,
          name: item.name || "N/A",
          gender: item.gender || "N/A",
          parentsName: item.parentsName || "N/A",
          parentsNumber: item.parentsNumber || "N/A",
          childDescription: item.childDescription || "N/A",
          result: mapResult(item.result) || "N/A",
          createdAt: item.createdAt
            ? convertTimestampTo12HourClock(item.createdAt)
            : "N/A",
          jobId: item.jobId || "N/A",
          certificateImageUrl: item.certificateImageUrl || "N/A",
          childImageUrl: item.childImageUrl || "N/A",
          videoUrl: item.videoUrl || "N/A",
        }));
        setRows(transformedData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const downloadCSV = (rows) => {
    const csvContent = [
      [
        "Child Name",
        "Child's Gender",
        "Parent Name",
        "Parent Contact",
        "Child's Description",
        "Result",
        "Created At",
        "Job ID",
        "Certificate",
        "Child's Image",
        "Video",
      ],
      ...rows.map((row) => [
        row.name,
        row.gender,
        row.parentsName,
        row.parentsNumber,
        row.childDescription,
        row.result,
        row.createdAt,
        row.jobId,
        row.certificateImageUrl,
        row.childImageUrl,
        row.videoUrl,
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
        <h2>Supermilk Users</h2>
        <Button variant="contained" onClick={() => downloadCSV(rows)}>
          Download CSV
        </Button>
      </Box>

      <Box style={{ height: "calc(100vh - 64px)", width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </Box>
    </Container>
  );
}
