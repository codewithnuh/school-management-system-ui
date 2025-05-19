import React from "react";
import { Control } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { UploadButton } from "../../common/Uploadthing";

interface FileUploadFieldProps {
  name: keyof FileUploads;
  control: Control<any>;
  label: string;
  uploadErrors: FileUploadErrors;
  isUploading: FileUploadingStates;
  setUploadErrors: React.Dispatch<React.SetStateAction<FileUploadErrors>>;
  setIsUploading: React.Dispatch<React.SetStateAction<FileUploadingStates>>;
  setValue: (name: string, value: any) => void;
  files: FileUploads;
  setFiles: React.Dispatch<React.SetStateAction<FileUploads>>;
  showToast: (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => void;
}

interface FileUploads {
  cvPath: string;
  photo: string;
  verificationDocument: string;
}

interface FileUploadingStates {
  cvPath: boolean;
  photo: boolean;
  verificationDocument: boolean;
}

interface FileUploadErrors {
  cvPath: string | null;
  photo: string | null;
  verificationDocument: string | null;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  name,
  control,
  label,
  uploadErrors,
  isUploading,
  setUploadErrors,
  setIsUploading,
  setValue,
  files,
  setFiles,
  showToast,
}) => {
  const getFieldDisplayName = (fieldName: keyof FileUploads): string => {
    switch (fieldName) {
      case "cvPath":
        return "CV/Resume";
      case "photo":
        return "Profile Photo";
      case "verificationDocument":
        return "Verification Document";
      default:
        return "File";
    }
  };

  const validateFile = (
    file: File,
    fieldName: keyof FileUploads
  ): { valid: boolean; message: string } => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `File is too large. Maximum size is 10MB.`,
      };
    }
    if (fieldName === "photo") {
      if (!file.type.startsWith("image/")) {
        return {
          valid: false,
          message: "Please upload an image file (JPEG, PNG, etc.)",
        };
      }
    } else if (fieldName === "cvPath" || fieldName === "verificationDocument") {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        return {
          valid: false,
          message: "Please upload a PDF or Word document",
        };
      }
    }
    return { valid: true, message: "" };
  };

  return (
    <Box>
      <InputLabel htmlFor={`${name}-upload`}>{label}</InputLabel>
      {uploadErrors[name] && (
        <FormHelperText error>{uploadErrors[name]}</FormHelperText>
      )}
      <UploadButton
        className="upload-btn"
        endpoint={"pdfUploader"}
        onUploadBegin={() => {
          setIsUploading({ ...isUploading, [name]: true });
          showToast("File is being uploaded", "info");
        }}
        onUploadError={(error) => {
          setUploadErrors((prev) => ({
            ...prev,
            [name]: error.message,
          }));
          showToast(error.message, "error");
        }}
        onClientUploadComplete={(file) => {
          const fileUrl = file[0].url;
          setFiles({ ...files, [name]: fileUrl });
          setValue(name, fileUrl);
          setIsUploading({ ...isUploading, [name]: false });
          showToast(
            `${getFieldDisplayName(name)} uploaded successfully!`,
            "success"
          );
        }}
      />
      {(files[name] || control._formValues[name]) && (
        <Box mt={2}>
          <Typography
            variant="caption"
            display="block"
            gutterBottom
            color="success.main"
          >
            ✅ {getFieldDisplayName(name)} uploaded successfully
          </Typography>
          {name === "photo" ? (
            <img
              src={files[name] || control._formValues[name]}
              alt={`${getFieldDisplayName(name)} preview`}
              style={{
                maxWidth: "100%",
                maxHeight: "100px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          ) : (
            <Button
              size="small"
              onClick={() =>
                window.open(files[name] || control._formValues[name], "_blank")
              }
              variant="outlined"
            >
              View Document
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FileUploadField;
