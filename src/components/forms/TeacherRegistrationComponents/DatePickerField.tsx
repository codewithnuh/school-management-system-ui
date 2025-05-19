import React from "react";
import { Controller, Control } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface DatePickerFieldProps {
  name: string;
  control: Control;
  label: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  name,
  control,
  label,
}) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={field.value}
          onChange={(date) => field.onChange(date)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
            },
          }}
        />
      )}
    />
  </LocalizationProvider>
);

export default DatePickerField;
