// src/components/withRole.tsx
import React from "react";
import { Navigate, useLocation } from "react-router";
import { useSession } from "../hooks/useSession";
import { Role } from "../utils/roles";

interface WithRoleProps {
  allowedRoles: Role[];
  children: JSX.Element;
}

export const withRole = (allowedRoles: Role[]) => {
  return (Component: React.ComponentType<any>) => {
    const WrappedComponent = (props: any) => {
      const location = useLocation();
      const { data, isLoading, isError } = useSession();
      console.log(data?.data.role);

      if (isLoading) {
        return <div>Loading...</div>; // Show a loading spinner
      }

      if (isError || !data?.data.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }

      if (!allowedRoles.includes(data.data.role)) {
        return <Navigate to="/unauthorized" replace />;
      }

      return <Component {...props} />;
    };

    return WrappedComponent;
  };
};
