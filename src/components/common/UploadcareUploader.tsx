import React from "react";
import { Widget } from "@uploadcare/react-widget";
import { Box, Typography, Button } from "@mui/material";

interface UploadcareUploaderProps {
  title: string;
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  isImage?: boolean;
  previewSize?: number;
}

const UploadcareUploader: React.FC<UploadcareUploaderProps> = ({
  title,
  value,
  onChange,
  accept = "",
  isImage = false,
  previewSize = 100,
}) => {
  // Uploadcare public key - use environment variable or default to demo key
  const UPLOADCARE_PUBLIC_KEY = "39d5faf5f775c673cb85";

  // Handle file upload from Uploadcare widget
  const handleFileUpload = (fileInfo: any) => {
    if (fileInfo) {
      onChange(fileInfo.cdnUrl);
    }
  };

  // Handle removal of uploaded file
  const handleRemove = () => {
    onChange(null);
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>

      {value ? (
        <Box
          sx={{
            mb: 2,
            textAlign: "center",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {isImage ? (
            <img
              src={value}
              alt={`${title} preview`}
              style={{
                maxWidth: "100%",
                maxHeight: `${previewSize}px`,
                borderRadius: "4px",
                margin: "0 auto",
              }}
            />
          ) : (
            <Box
              sx={{
                p: 2,
                bgcolor: "rgba(0,0,0,0.04)",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="body2"
                component="div"
                sx={{ fontWeight: "medium" }}
              >
                File Uploaded
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <a href={value} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              </Typography>
            </Box>
          )}
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={handleRemove}
            sx={{ mt: 1 }}
          >
            Remove
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            my: 2,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Widget
            publicKey={UPLOADCARE_PUBLIC_KEY}
            onChange={handleFileUpload}
            tabs="file camera url"
            imagesOnly={isImage}
            previewStep
            crop={isImage ? "1:1" : undefined}
            imageShrink={isImage ? "800x800" : undefined}
          />
        </Box>
      )}
    </Box>
  );
};

export default UploadcareUploader;
