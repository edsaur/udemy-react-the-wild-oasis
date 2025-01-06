import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

export default function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        name={"discount"}
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No Discount" },
          { value: "with-discount", label: "With Discount" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "regularPrice-asc", label: "Sort by Lowest Price first" },
          { value: "regularPrice-desc", label: "Sort by the Highest Price first" },
          { value: "capacity-asc", label: "Sort by the Lowest Capacity first" },
          { value: "capacity-desc", label: "Sort by the Highest Capacity first" },
        ]}
      />
    </TableOperations>
  );
}
