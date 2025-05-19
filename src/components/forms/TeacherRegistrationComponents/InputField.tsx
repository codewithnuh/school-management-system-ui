import React from "react";
import { Controller, Control } from "react-hook-form";
import TextField from "@mui/material/TextField";

interface InputFieldProps {
  name: string;
  control: Control;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  control,
  label,
  type = "text",
  multiline = false,
  rows,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        label={label}
        type={type}
        fullWidth
        multiline={multiline}
        rows={rows}
        error={!!error}
        helperText={error?.message}
      />
    )}
  />
);

export default InputField;
