import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAndEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditCabin() {
   const queryClient = useQueryClient();
   return useMutation({
        mutationFn: ({newCabinData, id}) => createAndEditCabin(newCabinData, id),
        onSuccess: () => {
            toast.success("Cabin successfully edited!");
            queryClient.invalidateQueries({
                queryKey: ["cabins"]
              })
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });
}
