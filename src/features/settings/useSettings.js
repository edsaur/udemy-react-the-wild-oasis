import { useQuery } from "@tanstack/react-query"
import { getSettings } from "../../services/apiSettings"


export const useSettings = () => {
    const {isLoading, data: settingData, error} = useQuery({
        queryKey: ['settings'],
        queryFn: getSettings
    });

    return {isLoading, settingData, error};
}