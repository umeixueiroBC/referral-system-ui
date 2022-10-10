import axios from "axios";
import {useMutation} from "@tanstack/react-query";
import {baseApiPath, referralsBasePath} from "../endpoints";

const fetchAllReferrals: any = async (token: string) => {
    try {
        const { data } = await axios.get(`${baseApiPath}${referralsBasePath}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        data.map((response: any) => {
            response.status = response.status ?? 0;
            response.ta_recruiter = response.ta_recruiter ?? 0;
            response.tech_stacks = response.tech_stack ? response.tech_stack.split(',') : [response.tech_stack];
            if (!response.tech_stacks || (response.tech_stacks[response.tech_stacks.length - 1] === '') || (response.tech_stacks[0] === null)) response.tech_stacks.pop();
            delete response.tech_stack;

            return response
        });

        return data;
    } catch (e) {
        throw e;
    }
}

export const useFetchAllReferrals = () => {
    const {isSuccess, isLoading, mutateAsync} = useMutation(fetchAllReferrals);

    return {
        isSuccessFetchAllReferrals: isSuccess,
        isLoadingFetchAllReferrals: isLoading,
        fetchAllReferrals: mutateAsync,
    };
}

const fetchReferral = async ({id, token}: { id: any; token: string }) => {

    try {
        const { data } = await axios.get(`${baseApiPath}${referralsBasePath}/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        data.tech_stacks = data.tech_stack ? data.tech_stack.split(',') : [data.tech_stack];
        if (!data.tech_stacks || (data.tech_stacks[data.tech_stacks.length - 1] === '')) data.tech_stacks.pop();

        return data;
    } catch (e) {
        throw e;
    }
}

export const useFetchReferral = () => {
    const {isSuccess, isLoading, mutateAsync} = useMutation(fetchReferral);

    return {
        isSuccessfetchReferral: isSuccess,
        isLoadingfetchReferral: isLoading,
        fetchReferral: mutateAsync
    };
}

const createReferral = async ({referral, token}: { referral: any; token: string }) => {
    let request = {
        full_name: referral.fullName,
        email: referral.email,
        linkedin_url: referral.linkedinUrl,
        cv_url: referral.cvUrl,
        comments: referral.comments,
        tech_stack: referral.techStacks,
        phone_number: referral.phoneNumber
    }
    const { data } = await axios.post(`${baseApiPath}${referralsBasePath}`, request, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    return data;
}

export const useCreateReferrals = () => {
    const {isSuccess, isLoading, mutateAsync} = useMutation(createReferral);

    return {
        isSuccessCreateReferrals: isSuccess,
        isLoadingCreateReferrals: isLoading,
        createReferral: mutateAsync
    };
}

const updateReferral = async ({referral, token}: { referral: any; token: string }) => {
    let request: any = {
        full_name: referral.fullName,
        email: referral.email,
        linkedin_url: referral.linkedinUrl,
        cv_url: referral.cvUrl,
        comments: referral.comments,
        tech_stack: referral.techStacks,
        phone_number: referral.phoneNumber,
        status: referral.status,
        ta_recruiter: referral.taRecruiter
    }

    Object.keys(request).forEach(key => {
        if (request[key] === null) {
            delete request[key];
        }
    });

    const { data } = await axios.put(`${baseApiPath}${referralsBasePath}/${referral.id}`, request,{
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    return data;
}

export const useUpdateReferral = () => {
    const {isSuccess, isLoading, mutateAsync} = useMutation(updateReferral);

    return {
        isSuccessUpdateReferrals: isSuccess,
        isLoadingUpdateReferrals: isLoading,
        updateReferral: mutateAsync
    };
}

const deleteReferral = async ({id, token}: { id: number; token: string;}) => {
    const { data } = await axios.delete(`${baseApiPath}${referralsBasePath}/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    return data;
}

export const useDeleteReferrals = () => {
    const {isSuccess, isLoading, mutateAsync} = useMutation(deleteReferral);

    return {
        isSuccessDeleteReferrals: isSuccess,
        isLoadingDeleteReferrals: isLoading,
        deleteReferral: mutateAsync
    };
}
