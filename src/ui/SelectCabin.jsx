import { forwardRef, useEffect } from "react";
import Select from "./Select";

const SelectCabin = forwardRef(
  ({ options, value, onChange, onHandleChange }, ref) => {
    const option = options.map((option) => ({
      value: option.id,
      label: `${option.name} (Capacity of: ${option.capacity} guests)`,
    }));

    return (
      <Select
        ref={ref}
        options={option}
        value={value}
        onChange={(e) => {
          const selectedValue = e.target.value;
          onChange(selectedValue);
          if (onHandleChange) {
            onHandleChange(selectedValue); // Trigger additional side effects
          }
        }}
      />
    );
  }
);

SelectCabin.displayName = "SelectCabin";

export default SelectCabin;
