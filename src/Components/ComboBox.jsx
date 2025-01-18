import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
// import top100Films from './top100Films';

export default function ComboBox({ options }) {
  console.log("option,", options);
  return (
    <Autocomplete
      disabled={options.length === 0}
      disablePortal
      getOptionDisabled={()=>true}
      options={options}
      sx={{ width: "100%", padding: 0 }}
      renderInput={(params) => <TextField {...params} label={options.length === 0 ? "No Data" : "Click To Open" }  />}
    />
  );
}
