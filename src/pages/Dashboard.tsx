// src/pages/Dashboard.tsx
import React from "react";
import { withRole } from "../components/withRole";
import { Role } from "../utils/roles";

const Dashboard: React.FC = () => {
  return <div>Welcome to the Admin Dashboard!</div>;
};

export default withRole([Role.ADMIN])(Dashboard);
