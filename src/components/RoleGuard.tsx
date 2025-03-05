// components/RoleGuard.tsx
import React from "react";
import { Navigate } from "react-router";
import { useUser } from "../hooks/useUser";

interface RoleGuardProps {
  allowedRoles: Array<"ADMIN" | "TEACHER" | "PARENT" | "STUDENT">;
  children: React.ReactElement;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
}) => {
  const { data: user, isLoading, isError } = useUser();
  console.log(user);
  if (isLoading) {
    // Show a loading indicator while fetching
    return <div>Loading...</div>;
  }

  // If there's an error or no user is found, assume the user is not authenticated.
  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user role is in the list of allowed roles.
  if (!allowedRoles.includes(user.data.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
