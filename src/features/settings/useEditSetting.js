import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateSetting as updateSettingApi} from "../../services/apiSettings";
import toast from "react-hot-toast";

export const useEditSetting = () => {
    const queryClient = useQueryClient();
    return useMutation({
         mutationFn: updateSettingApi,
         onSuccess: () => {
             toast.success("Settings successfully edited!");
             queryClient.invalidateQueries({
                 queryKey: ["settings"]
               })
         },
         onError: (err) => {
             toast.error(err.message);
         }
     });
}