import { useState, useCallback } from "react";
import {
  openUploadcareDialog,
  getFileDetails,
  UploadcareOptions,
} from "../utils/uploadUtils";

interface UseUploadcareOptions extends UploadcareOptions {
  onUploadStart?: () => void;
  onUploadComplete?: (urls: string | string[]) => void;
  onUploadError?: (error: Error) => void;
}

interface UseUploadcareReturn {
  uploadFiles: () => Promise<string | string[]>;
  isUploading: boolean;
  error: Error | null;
  uploadedUrls: string | string[];
  clearUploads: () => void;
}

const useUploadcare = (
  options: UseUploadcareOptions = {}
): UseUploadcareReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string | string[]>(
    options.multiple ? [] : ""
  );

  const uploadFiles = useCallback(async (): Promise<string | string[]> => {
    try {
      setIsUploading(true);
      setError(null);

      if (options.onUploadStart) {
        options.onUploadStart();
      }

      const result = await openUploadcareDialog(options);

      setUploadedUrls(result);

      if (options.onUploadComplete) {
        options.onUploadComplete(result);
      }

      return result;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Unknown upload error");
      setError(error);

      if (options.onUploadError) {
        options.onUploadError(error);
      }

      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [options]);

  const clearUploads = useCallback(() => {
    setUploadedUrls(options.multiple ? [] : "");
  }, [options.multiple]);

  return {
    uploadFiles,
    isUploading,
    error,
    uploadedUrls,
    clearUploads,
  };
};

export default useUploadcare;
