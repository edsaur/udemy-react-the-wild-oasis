import { forwardRef } from "react";
import Select from "./Select";

const SelectUser = forwardRef(
  ({ options, value, onChange, onHandleChange }, ref) => {
    const formattedOptions = options.map((option) => ({
      value: option.id,
      label: option.fullName,
    }));

    return (
      <Select
        ref={ref}
        options={formattedOptions}
        value={value || ''}
        onChange={(e) => {
          const selectedValue = e.target.value;
          console.log("Selected user ID:", selectedValue);
          onChange(selectedValue); // Notify React Hook Form
          if (onHandleChange) {
            onHandleChange(selectedValue); // Trigger additional side effects
          }
        }}
      />
    );
  }
);

// Set displayName for better debugging
SelectUser.displayName = "SelectUser";

export default SelectUser;


// export default function SelectUser({ options }) {
//     const option = options.map((option) => ({value: option.id, label: option.fullName}) );

//     const [user, setUser] = useState(option.length > 0 ? option[0].value : null);

//     function handleChange(e){
//         e.preventDefault();
//         setUser(e.target.value);
//     }

//   return <Select options={option} value={user} onChange={handleChange} />;
// }
