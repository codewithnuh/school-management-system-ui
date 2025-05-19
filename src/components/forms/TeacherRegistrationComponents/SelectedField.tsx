import React from "react";
import { Controller, Control } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface SelectFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  options: { value: any; label: string }[];
  isLoading: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  control,
  label,
  options,
  isLoading,
}) => (
  <FormControl fullWidth error={!!control._formState.errors[name]}>
    <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ...rest } }) => (
        <Select
          labelId={`${name}-select-label`}
          id={`${name}-select`}
          value={value?.toString() || ""}
          label={label}
          {...rest}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "" ? undefined : Number(val));
          }}
          disabled={isLoading}
        >
          <MenuItem value="">
            <em>Select an option</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value.toString()}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    {control._formState.errors[name] && (
      <FormHelperText>
        {control._formState.errors[name]?.message}
      </FormHelperText>
    )}
    {isLoading && (
      <Box display="flex" alignItems="center" mt={1}>
        <CircularProgress size={16} />
        <Typography variant="caption" sx={{ ml: 1 }}>
          Loading...
        </Typography>
      </Box>
    )}
  </FormControl>
);

export default SelectField;
