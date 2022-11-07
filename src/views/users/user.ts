export interface User {
    id: number,
    fullName: string,
    email: string,
    roleId: number,
    roleName: string,
    permissions: string[],
}
