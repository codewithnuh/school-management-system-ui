import React from "react";
import ApplicationsTable from "./ApplicationTable";
import Box from "@mui/material/Box";

const Application = () => {
  return (
    <div>
      <h1>Teacher Applications</h1>
      <p>Manage teacher applications and review their details.</p>
      <Box sx={{ mt: 4 }}>
        <ApplicationsTable />
      </Box>
    </div>
  );
};

export default Application;
