import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useCreateBookings = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            toast.success("Booking successfully created!");
            queryClient.invalidateQueries({
                queryKey: ["bookings"]
            })
            navigate("/bookings");
        },
        onError: (err) => {
            toast.error(err.message);
        }
    })
}