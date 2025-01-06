import { useQuery } from "@tanstack/react-query"
import { getCabinCapacity } from "../../services/apiCabins"

export const useCabinCapacity = (id) => {
    const {data: cabinCapacity, isLoading, error} = useQuery({
        queryFn: () =>{ return getCabinCapacity(id)},
        queryKey: ['cabin-capacity', id],
        enabled: !!id, // Only run query if `id` is defined
    });
    

    return {cabinCapacity, isLoading, error};
}