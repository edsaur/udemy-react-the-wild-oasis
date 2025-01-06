import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

export default function Filter({ name, options }) {
  const [searchParams, setSearchParams] = useSearchParams(); // To set and add the text in the URL
  const [currentIndex, setCurrentIndex] = useState(0);

  const filters = options;

  // Sync currentIndex with searchParams when the component mounts or when searchParams change
  useEffect(() => {
    const currentFilterValue = searchParams.get(name);
    const matchedIndex = filters.findIndex(
      (filter) => filter.value === currentFilterValue
    );

    // If a matching filter is found in the URL, update the currentIndex
    if (matchedIndex !== -1) {
      setCurrentIndex(matchedIndex);
    } else {
      // If no match is found, set to default (index 0)
      setCurrentIndex(0);
    }
  }, [searchParams, filters, name]);

  function handleClick() {
    const nextIndex = (currentIndex + 1) % filters.length; // Cycle through the indices
    setCurrentIndex(nextIndex);

    const nextFilter = filters[nextIndex]; // Get the next filter object
    searchParams.set(name, nextFilter.value); // Update the URL parameter

    // Reset the 'page' parameter to 1 when a filter is updated
    if (searchParams.get('page')) {
      searchParams.set('page', 1);
    }
    setSearchParams(searchParams); // Apply the change
  }

  const currentFilter = filters[currentIndex];

  return (
    <StyledFilter>
      <FilterButton onClick={handleClick}>{currentFilter.label}</FilterButton>
    </StyledFilter>
  );
}
