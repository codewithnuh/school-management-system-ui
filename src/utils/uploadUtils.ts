import { UploadcareFile } from "../components/common/FileUploader";

export interface UploadcareOptions {
  publicKey?: string;
  multiple?: boolean;
  imagesOnly?: boolean;
  maxSize?: number; // in MB
  imageShrink?: string;
  crop?: string;
}

/**
 * Opens the Uploadcare dialog programmatically
 * @param options Upload options
 * @returns Promise that resolves with the upload result
 */
export const openUploadcareDialog = (
  options: UploadcareOptions = {}
): Promise<string | string[]> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.uploadcare) {
      reject(new Error("Uploadcare widget is not loaded"));
      return;
    }

    const widgetOptions = {
      publicKey:
        options.publicKey ||
        process.env.REACT_APP_UPLOADCARE_PUBLIC_KEY ||
        "demopublickey",
      multiple: options.multiple || false,
      imagesOnly: options.imagesOnly || false,
      previewStep: true,
      crop: options.imagesOnly ? options.crop || "1:1" : undefined,
      imageShrink: options.imageShrink || "2048x2048",
      maxSize: (options.maxSize || 10) * 1024 * 1024, // Convert to bytes
    };

    const widget = window.uploadcare.openDialog(null, widgetOptions);

    widget.done((result: any) => {
      if (!result) {
        resolve("");
        return;
      }

      if (options.multiple) {
        if (result.files && result.files()) {
          // Handle multiple files
          const filesArray = result.files();
          Promise.all(
            filesArray.map((file: any) => {
              return new Promise((fileResolve) => {
                file.done((fileInfo: any) => {
                  fileResolve(fileInfo.cdnUrl);
                });
              });
            })
          ).then((urls: string[]) => {
            resolve(urls);
          });
        } else {
          // Single file in multiple mode
          result.done((info: any) => {
            resolve([info.cdnUrl]);
          });
        }
      } else {
        // Single file mode
        result.done((info: any) => {
          resolve(info.cdnUrl);
        });
      }
    });

    widget.fail((error: Error) => {
      reject(error);
    });
  });
};

/**
 * Get file details from Uploadcare CDN URL
 * @param cdnUrl Uploadcare CDN URL
 * @returns Promise that resolves with file details
 */
export const getFileDetails = async (
  cdnUrl: string
): Promise<UploadcareFile | null> => {
  try {
    if (!cdnUrl || typeof cdnUrl !== "string") {
      return null;
    }

    // Extract UUID from CDN URL
    const match = cdnUrl.match(/\/([a-f0-9-]+)\//i);
    if (!match || !match[1]) {
      return null;
    }

    const uuid = match[1];
    const apiUrl = `https://api.uploadcare.com/files/${uuid}/`;

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Uploadcare.Simple ${
          process.env.REACT_APP_UPLOADCARE_PUBLIC_KEY || "demopublickey"
        }:`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch file details from Uploadcare");
    }

    const data = await response.json();

    return {
      uuid: data.uuid,
      name: data.filename || "unknown",
      size: data.size || 0,
      isImage: data.is_image || false,
      cdnUrl: data.original_file_url || cdnUrl,
      originalUrl: data.original_file_url || cdnUrl,
    };
  } catch (error) {
    console.error("Error getting file details:", error);
    return null;
  }
};

// Type declaration for the Uploadcare global object
declare global {
  interface Window {
    uploadcare: any;
  }
}
