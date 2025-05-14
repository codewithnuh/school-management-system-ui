import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
// Styled wrapper for UploadThing button
const StyledUploadButton = styled(Box)(({ theme }) => ({
  "& .uploadthing-button": {
    background: "#1E1E1E",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    height: 56,
    width: "100%",
    textTransform: "none",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
    "&:hover": {
      backgroundColor: "#2C2C2C",
      borderColor: "#555",
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  "& .uploadthing-button svg": {
    marginRight: theme.spacing(1),
    width: 20,
    height: 20,
  },
}));
