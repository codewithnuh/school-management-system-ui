import React from "react";
import { Box, Container } from "@mui/material";
import ClassesTable from "../components/Classes/ClassesTable";

const ClassesPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <ClassesTable />
      </Box>
    </Container>
  );
};

export default ClassesPage;
