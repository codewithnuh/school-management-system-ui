import {
  generateUploadButton,
  UploadthingComponentProps,
} from "@uploadthing/react";

// Image Uploader Button
export const UploadButton = generateUploadButton({
  url: `${import.meta.env.VITE_API_BASE_URL}uploadthing`, // Point to your Express server
});
