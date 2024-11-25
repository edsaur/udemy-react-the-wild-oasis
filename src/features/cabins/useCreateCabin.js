import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAndEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useCreateCabin(reset, onClose) {
   const queryClient = useQueryClient();
   return useMutation({
        mutationFn: createAndEditCabin,
        onSuccess: () => {
            toast.success("Cabin successfully created!");
            queryClient.invalidateQueries({
                queryKey: ["cabins"]
              })
        if(reset) {reset();}
        onClose?.();

        },
        onError: (err) => {
            toast.error(err.message);
        }
    });
}
