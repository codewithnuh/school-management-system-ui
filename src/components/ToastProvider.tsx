import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
              color: "white",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#EF4444",
              color: "white",
            },
          },
        }}
      />
      {children}
    </>
  );
};

export default ToastProvider;
