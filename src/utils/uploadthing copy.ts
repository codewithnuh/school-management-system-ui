import { createUploadthing, type FileRouter } from 'uploadthing/client'

// Import the type from your backend
import type { OurFileRouter } from '../../../src/config/uploadthing'

// Create the uploadthing client with the correct backend types
export const uploadThing = createUploadthing<OurFileRouter>()

// Export the uploader utilities for the specific route
export const { useUploadThing, uploadFiles } = uploadThing
