import axios from "axios";
import {baseApiPath, recruitersBasePath} from "../endpoints";
import {useMutation} from "@tanstack/react-query";

const fetchAllRecruiters = async (token: string) => {
    try {
        const { data } = await axios.get(`${baseApiPath}${recruitersBasePath}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        return data;
    } catch (e) {
        throw e;
    }
}

export const useFetchAllRecruiters = () => {
    const {mutateAsync} = useMutation(fetchAllRecruiters);

    return {
        fetchAllRecruiters: mutateAsync,
    };
}
