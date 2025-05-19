import React from "react";
import { Controller, Control } from "react-hook-form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";

interface RadioGroupFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  options: { value: any; label: string }[];
}

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  name,
  control,
  label,
  options,
}) => (
  <FormControl error={!!control._formState.errors[name]}>
    <FormLabel id={`${name}-label`}>{label}</FormLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <RadioGroup {...field} aria-labelledby={`${name}-label`} row>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      )}
    />
    {control._formState.errors[name] && (
      <FormHelperText>
        {control._formState.errors[name]?.message}
      </FormHelperText>
    )}
  </FormControl>
);

export default RadioGroupField;
