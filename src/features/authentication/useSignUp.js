import { useMutation } from "@tanstack/react-query"
import { signUp } from "../../services/apiAuth"
import toast from "react-hot-toast"

export const useSignUp = () => {
    return useMutation({
        mutationFn: signUp,
        onSuccess: () => {
            toast.success("User registered. Please verify the user's email")
        }, 
        onError: (err) => {
            toast.error(err.message);
        }
       
    })
}