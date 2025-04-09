import React, { useEffect, useState } from "react";
import { Widget } from "@uploadcare/react-widget";
const REACT_APP_UPLOADCARE_PUBLIC_KEY = import.meta.env
  .REACT_APP_UPLOADCARE_PUBLIC_KEY;
export type UploadcareFile = {
  uuid: string;
  name: string;
  size: number;
  isImage: boolean;
  cdnUrl: string;
  originalUrl: string;
};

interface FileUploaderProps {
  multiple?: boolean;
  value?: string | string[];
  onChange: (files: string | string[]) => void;
  imagesOnly?: boolean;
  maxSize?: number; // in MB
  accept?: string; // MIME type or file extension
  className?: string;
  buttonLabel?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  multiple = false,
  value,
  onChange,
  imagesOnly = false,
  maxSize = 10, // Default 10MB
  accept,
  className = "",
  buttonLabel = "Upload File",
}) => {
  const [uploaded, setUploaded] = useState<string | string[]>(
    multiple ? [] : ""
  );

  useEffect(() => {
    if (value) {
      setUploaded(value);
    }
  }, [value]);

  const handleUploadComplete = (info: any) => {
    if (!info) return;

    // For single file upload
    if (!multiple) {
      const fileUrl = info.cdnUrl;
      setUploaded(fileUrl);
      onChange(fileUrl);
      return;
    }

    // For multiple files
    if (Array.isArray(info)) {
      const fileUrls = info.map((file) => file.cdnUrl);
      setUploaded((prev) => {
        const newUploaded = Array.isArray(prev)
          ? [...prev, ...fileUrls]
          : fileUrls;
        onChange(newUploaded);
        return newUploaded;
      });
    } else {
      // If single file is uploaded in multiple mode
      const fileUrl = info.cdnUrl;
      setUploaded((prev) => {
        const newUploaded = Array.isArray(prev)
          ? [...prev, fileUrl]
          : [fileUrl];
        onChange(newUploaded);
        return newUploaded;
      });
    }
  };

  const removeFile = (fileUrl: string) => {
    if (!multiple) {
      setUploaded("");
      onChange("");
      return;
    }

    setUploaded((prev) => {
      if (Array.isArray(prev)) {
        const newUploaded = prev.filter((url) => url !== fileUrl);
        onChange(newUploaded);
        return newUploaded;
      }
      return prev;
    });
  };

  const renderUploadedFiles = () => {
    if (!uploaded || (Array.isArray(uploaded) && uploaded.length === 0)) {
      return null;
    }

    if (!multiple) {
      return (
        <div className="mt-2 flex items-center space-x-2">
          <div className="relative">
            {typeof uploaded === "string" && uploaded && (
              <div className="flex items-center p-2 border rounded">
                {isImageUrl(uploaded) ? (
                  <img
                    src={uploaded}
                    alt="Uploaded"
                    className="h-16 w-16 object-cover rounded"
                  />
                ) : (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-sm truncate max-w-xs">
                      {getFileNameFromUrl(uploaded)}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(uploaded)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
        {Array.isArray(uploaded) &&
          uploaded.map((fileUrl, index) => (
            <div key={index} className="relative">
              <div className="flex items-center p-2 border rounded">
                {isImageUrl(fileUrl) ? (
                  <img
                    src={fileUrl}
                    alt={`Uploaded ${index}`}
                    className="h-16 w-16 object-cover rounded"
                  />
                ) : (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-sm truncate max-w-xs">
                      {getFileNameFromUrl(fileUrl)}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(fileUrl)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
      </div>
    );
  };

  // Configure Uploadcare widget options
  const widgetOptions = {
    imagesOnly: imagesOnly,
    previewStep: true,
    crop: imagesOnly ? "1:1" : undefined,
    imageShrink: "1024x1024",
    clearable: true,
    multiple: multiple,
    maxSize: maxSize * 1024 * 1024, // Convert to bytes
    validators: [
      (fileInfo: any) => {
        if (fileInfo.size > maxSize * 1024 * 1024) {
          throw new Error(`File size should not exceed ${maxSize}MB`);
        }
      },
    ],
  };

  return (
    <div className={className}>
      <Widget
        publicKey={"39d5faf5f775c673cb85"} // Use your public key here
        onChange={handleUploadComplete}
        {...widgetOptions}
      />

      {renderUploadedFiles()}
    </div>
  );
};

// Helper functions
const isImageUrl = (url: string) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
};

const getFileNameFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.substring(pathname.lastIndexOf("/") + 1);
  } catch (e) {
    return url.substring(url.lastIndexOf("/") + 1);
  }
};

export default FileUploader;
