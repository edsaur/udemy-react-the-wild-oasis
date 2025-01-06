import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useCheckIn = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({bookingId, obj}) => updateBooking(bookingId, {status: "checked-in", isPaid: true, ...obj}),
        onSuccess: (data) => {
            toast.success(`Booking #${data.id} has been checked-in`);
            queryClient.invalidateQueries({active:true});
            navigate("/");
        },
        onError: () => {
            toast.error("There was an error in checking-in");
        }
    })
}