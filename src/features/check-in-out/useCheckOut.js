import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";


export const useCheckOut = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookingId) => updateBooking(bookingId, {status: 'checked-out'}),
        onSuccess: () => {
            toast.success("Booking successfully checked-out");
            queryClient.invalidateQueries({active:true})
        },
        onError: () => {
            toast.error("There is a problem in checked-out.");
        }
    })
}