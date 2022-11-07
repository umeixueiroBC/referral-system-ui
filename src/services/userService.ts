import axios from "axios";
import { baseApiPath, usersBasePath, rolesBasePath, permissionsBasePath, permissionsByUser } from "../endpoints";
import { useMutation } from "@tanstack/react-query";

const fetchAllUsers = async (token: string) => {
    try {
        const { data } = await axios.get(`${baseApiPath}${usersBasePath}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        return data;
    } catch (e) {
        throw e;
    }
}

export const useFetchAllUsers = () => {
    const { isSuccess, isLoading, mutateAsync } = useMutation(fetchAllUsers);

    return {
        isSuccessFetchAllUsers: isSuccess,
        isLoadingFetchAllUsers: isLoading,
        fetchAllUsers: mutateAsync
    };
}

const fetchAllRoles = async (token: string) => {
    try {
        const { data } = await axios.get(`${baseApiPath}${rolesBasePath}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        return data;
    } catch (e) {
        throw e;
    }
}

export const useFetchAllRoles = () => {
    const { isSuccess, isLoading, mutateAsync } = useMutation(fetchAllRoles);

    return {
        isSuccessFetchAllRoles: isSuccess,
        isLoadingFetchAllRoles: isLoading,
        fetchAllRoles: mutateAsync
    };
}

const updateUser = async (values: any) => {
    try {
        const data = { role_id: values.roles.roleId };
        const { request } = await axios.put(`${baseApiPath}${usersBasePath}/${values.roles.id}`, data, {
            headers: {
                'Authorization': 'Bearer ' + values.token
            }
        });

        return request;
    } catch (e) {
        throw e;
    }
}

export const useUpdateUser = () => {
    const { isSuccess, isLoading, mutateAsync } = useMutation(updateUser);

    return {
        isSuccessUpdateUser: isSuccess,
        isLoadingUpdateUser: isLoading,
        updateUser: mutateAsync
    };
}

const deleteUser = async ({ id, token }: { id: any, token: string }) => {
    try {
        return await axios.delete(`${baseApiPath}${usersBasePath}/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    } catch (e) {
        throw e;
    }
}

export const useDeleteUser = () => {
    const { isSuccess, isLoading, mutateAsync } = useMutation(deleteUser);

    return {
        isSuccesDeleteeUser: isSuccess,
        isLoadingDeleteUser: isLoading,
        deleteUser: mutateAsync
    };
}

const fetchPermissions = async (token: string) => {
    try {
        const { data } = await axios.get(`${baseApiPath}${permissionsBasePath}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        return data;
    } catch (e) {
        throw e;
    }
}

export const useFetchPermissions = () => {
    const { isSuccess, isLoading, mutateAsync } = useMutation(fetchPermissions);

    return {
        isSuccesFetchPermissions: isSuccess,
        isLoadingFetchPermissions: isLoading,
        fetchPermissions: mutateAsync
    };
}

const getUserPermissions = async ({userId, token}: {userId:number; token: string;}) => {
    try {
        const { data } = await axios.get(`${baseApiPath}${permissionsByUser(userId)}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        return data;
    } catch (e) {
        throw e;
    }
}

export const useGetUserPermissions = () => {
    const { isSuccess, isLoading, mutateAsync } = useMutation(getUserPermissions);

    return {
        isSuccesGetUserPermissions: isSuccess,
        isLoadingGetUserPermissions: isLoading,
        getUserPermissions: mutateAsync
    };
}
