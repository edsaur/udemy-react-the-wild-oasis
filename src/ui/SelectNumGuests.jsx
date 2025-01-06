import { forwardRef } from "react";
import Select from "./Select";

const SelectNumGuests = forwardRef(({ options, onChange, value, setNumGuests }, ref) => {
  const newArr = [];

  for (let i = 1; i <= options.capacity; i++) {
    newArr.push(i);
  }

  const option = newArr.map((option) => ({ value: option, label: option }));

  return (
    <Select
      ref={ref}
      options={option}
      value={value || ""}
      onChange={(e) => {
        const selectedValue = e.target.value;
        onChange(selectedValue);
        setNumGuests(selectedValue);
      }}
    />
  );
});

SelectNumGuests.displayName = "SelectNumGuests";

export default SelectNumGuests;
