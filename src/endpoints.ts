export const oauthServicePath = 'https://referral-system-api.onrender.com/auth/azure_oauth2';

export const baseApiPath = 'https://referral-system-api.onrender.com/api/v1';

export const referralsBasePath = '/referrals';

export const recruitersBasePath = '/user/recruiters';

export const usersBasePath = '/users';

export const permissionsBasePath = '/user/permissions'

export const permissionsByUser = (id: number) => `/user/${id}/permissions`;

export const rolesBasePath = '/roles';
