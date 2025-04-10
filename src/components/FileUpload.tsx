import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Typography,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { uploadDirect } from "@uploadcare/upload-client";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface FileUploadProps {
  label: string;
  fieldName: "photo" | "cv" | "verificationDoc";
  error?: string;
  required?: boolean;
  onFileChange: (params: {
    event: React.ChangeEvent<HTMLInputElement>;
    fieldName: "photo" | "cv" | "verificationDoc";
  }) => void;
  acceptedFileTypes?: string;
}
const UPLOADCARE_PUBLIC_KEY = "39d5faf5f775c673cb85";
const FileUpload: React.FC<FileUploadProps> = ({
  label,
  fieldName,
  error,
  required = false,
  onFileChange,
  acceptedFileTypes = "image/*, application/pdf",
}) => {
  const [fileUrls, setFileUrls] = useState({
    cvPath: "",
    photo: "",
    verificationDocument: "",
  });
  async function handleFileChange({
    event,
    fieldName,
  }: {
    event: React.ChangeEvent<HTMLInputElement>;
    fieldName: "cv" | "photo" | "verficationDoc";
  }) {
    const file = event.target?.files?.[0];
    const uploadedFile = await uploadDirect(file!, {
      publicKey: UPLOADCARE_PUBLIC_KEY,
      store: "auto",
    });
    setFileUrls((prev) => ({
      ...prev,
      [fieldName]: uploadedFile.cdnUrl,
    }));
    console.log(fileUrls);
  }

  return (
    <FormControl fullWidth error={!!error} required={required}>
      <Box
        sx={{
          border: (theme) =>
            `1px solid ${
              error ? theme.palette.error.main : theme.palette.divider
            }`,
          borderRadius: 1,
          p: 2,
          textAlign: "center",
          bgcolor: "background.paper",
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {fileName ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <InsertDriveFileIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="body2" noWrap sx={{ maxWidth: "200px" }}>
              {fileName}
            </Typography>
          </Box>
        ) : (
          <CloudUploadIcon
            sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
          />
        )}

        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          fullWidth
        >
          {fileName ? "Change File" : `Upload ${label}`}
          <VisuallyHiddenInput
            type="file"
            onChange={handleChange}
            accept={acceptedFileTypes}
          />
        </Button>

        {!fileName && (
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, color: "text.secondary" }}
          >
            {required ? "Required" : "Optional"} • Click to browse files
          </Typography>
        )}
      </Box>

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default FileUpload;
