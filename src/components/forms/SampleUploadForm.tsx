import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import FileUploader from "../common/FileUploader";

interface FormData {
  title: string;
  description: string;
  documentUrl: string;
  imageUrls: string[];
}

const SampleUploadForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      documentUrl: "",
      imageUrls: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      console.log("Form data with file URLs:", data);

      // Your API submission here
      // const response = await api.post('/your-endpoint', data);

      alert("Form submitted successfully with file URLs included in payload");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">Upload Form Example</h2>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <input
              id="title"
              type="text"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              {...field}
            />
          )}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              id="description"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              {...field}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document Upload (PDF, DOC, etc.)
        </label>
        <Controller
          name="documentUrl"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FileUploader
              value={value}
              onChange={onChange}
              multiple={false}
              maxSize={20}
              buttonLabel="Upload Document"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image Upload (multiple)
        </label>
        <Controller
          name="imageUrls"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FileUploader
              value={value}
              onChange={onChange}
              multiple={true}
              imagesOnly={true}
              maxSize={10}
              buttonLabel="Upload Images"
            />
          )}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Form"}
      </button>
    </form>
  );
};

export default SampleUploadForm;
