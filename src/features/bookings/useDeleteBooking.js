import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
        toast.success("Booking successfully deleted");
        queryClient.invalidateQueries({
            queryKey: ["bookings"]
        });
    },
    onError: (err) => {
        toast.error(err.message);
    }
  })
}