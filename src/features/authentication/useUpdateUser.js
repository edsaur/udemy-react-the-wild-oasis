import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAndEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser() {
   const queryClient = useQueryClient();
   return useMutation({
        mutationFn: updateCurrentUser,
        onSuccess: ({user}) => {
            toast.success("User account successfully updated!");
            queryClient.setQueryData(['user'], user);
            // queryClient.invalidateQueries({
            //     queryKey: ["user"]
            //   })
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });
}
