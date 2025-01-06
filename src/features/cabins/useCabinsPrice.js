import { useQuery } from "@tanstack/react-query"
import { getCabinPrice } from "../../services/apiCabins";

export const useCabinsPrice = (id) => {
    const {data: cabinPrice, isLoading, error} = useQuery({
        queryFn: () => getCabinPrice(id),
        queryKey: ['cabinPrice', id],
        enabled: !!id, // Only run query if `id` is defined
    });

    return {cabinPrice, isLoading, error}
}