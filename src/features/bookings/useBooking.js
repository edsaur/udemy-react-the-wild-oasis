import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";

export const useBooking = (id) => {
  const {
    isLoading,
    data: booking,
    error,
  } = useQuery({
    queryKey: ["bookings", id],
    queryFn: () => {
      return getBooking(id);
    },
    enabled: !!id, // Only run query if `id` is defined
  });

  return { isLoading, booking, error };
};
