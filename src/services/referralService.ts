import axios from "axios";
import {useMutation} from "@tanstack/react-query";
import {baseApiPath, downloadCv, referralComments, referralsBasePath} from "../endpoints";

type chipColor = "primary" | "success" | "error" | "default" | "secondary" | "info" | "warning" | undefined;
export const statusOptions: ({ value: number; color: chipColor; label: string })[] = [
    { value: 0, label: 'Select one', color: 'default', },
    { value: 1, label: 'Applied', color: 'primary', },
    { value: 2, label: 'Recruitment', color: 'primary', },
    { value: 3, label: 'Interviewing', color: 'primary', },
    { value: 4, label: 'Managers', color: 'primary', },
    { value: 5, label: 'Client', color: 'primary', },
    { value: 6, label: 'Offer', color: 'success', },
    { value: 7, label: 'Hiring', color: 'success', },
    { value: 8, label: 'Failed', color: 'error', }
];

const fetchAllReferrals: any = async (token: string) => {
    try {
        const { data } = await axios.get(`${baseApiPath}${referralsBasePath}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        data.map((response: any) => {
            response.status = statusOptions.find(x => x.value === response.status)?.label ?? statusOptions[0].label;
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

export const useDownloadCvReferral = () => {
    const {isSuccess, isLoading, mutateAsync} = useMutation(downloadCvReferral);

    return {
        isSuccessDownloadCvReferral: isSuccess,
        isLoadingDownloadCvReferral: isLoading,
        downloadCvReferral: mutateAsync,
    };
}

const downloadCvReferral = async ({referralId, token}: { referralId: any; token: string }) => {

    try {
        const { data } = await axios.get(`${baseApiPath}${downloadCv(referralId)}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            responseType: 'blob'
        });

        return data;
    } catch (e) {
        throw e;
    }
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

const fetchReferralComments = async ({id, token}: { id: any; token: string }) => {

    try {
        const { data } = await axios.get(`${baseApiPath}${referralComments(id)}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        return data;
    } catch (e) {
        throw e;
    }
}

export const useFetchReferralComments = () => {
    const {isSuccess, isLoading, mutateAsync} = useMutation(fetchReferralComments);

    return {
        isSuccessfetchReferralComments: isSuccess,
        isLoadingfetchReferralComments: isLoading,
        fetchReferralComments: mutateAsync
    };
}

const createReferralComment = async ({referral, token}: { referral: any; token: string }) => {
    let request = {
        referral_status_id: referral.referralStatusId > 0 ? referral.referralStatusId : 1,
        comment: referral.comment
    }

    const { data } = await axios.post(`${baseApiPath}${referralComments(referral.id)}`, request, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    return data;
}

export const useCreateReferralComment = () => {
    const {isSuccess, isLoading, mutateAsync} = useMutation(createReferralComment);

    return {
        isSuccessCreateReferralComment: isSuccess,
        isLoadingCreateReferralComment: isLoading,
        createReferralComment: mutateAsync
    };
}

const createReferral = async ({referral, token}: { referral: any; token: string }) => {
    let request = new FormData();
    request.append('full_name', referral.fullName);
    request.append('email', referral.email);
    request.append('linkedin_url', referral.linkedinUrl);
    request.append('comments', referral.comments);
    request.append('tech_stack', referral.techStacks);
    request.append('phone_number', referral.phoneNumber);
    request.append('file', referral.cvFile);

    const { data } = await axios.post(`${baseApiPath}${referralsBasePath}`, request, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data'
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
    let request = new FormData();
    let dataRequest: any = {
        full_name: referral.fullName,
        email: referral.email,
        linkedin_url: referral.linkedinUrl,
        comments: referral.comments,
        tech_stack: referral.techStacks,
        phone_number: referral.phoneNumber,
        referral_status_id: referral.status,
        ta_recruiter: referral.taRecruiter,
        file: referral.cvFile
    }

    Object.keys(dataRequest).forEach(key => {
        if (dataRequest[key] != null) {
            request.append(key, dataRequest[key]);
        }
    });

    const { data } = await axios.put(`${baseApiPath}${referralsBasePath}/${referral.id}`, request,{
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data'
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

const assignRecruiter = async ({request, token}: { request: any; token: string }) => {
    const { data } = await axios.patch(`${baseApiPath}/referral/${request.referralId}/ta/${request.taId}`, {}, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    return data;
}

export const useAssignRecruiter = () => {
    const {isSuccess, isLoading, mutateAsync} = useMutation(assignRecruiter);

    return {
        isSuccessAssignRecruiter: isSuccess,
        isLoadingAssignRecruiter: isLoading,
        assignRecruiter: mutateAsync
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
