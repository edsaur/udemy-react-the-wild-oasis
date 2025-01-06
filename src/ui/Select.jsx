import { forwardRef } from "react";
import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

// Wrap the Select component with React.forwardRef
const Select = forwardRef(({ options, value, onChange, ...props }, ref) => (
  <StyledSelect ref={ref} value={value || ""} onChange={onChange} {...props}>
    <option value="" disabled>Select...</option>
    {options.map((option) => (
      <option value={option.value} key={option.value}>
        {option.label}
      </option>
    ))}
  </StyledSelect>
));

// Set displayName for debugging
Select.displayName = "Select";

export default Select;
