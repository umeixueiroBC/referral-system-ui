export interface Referral {
    id: number,
    referred_by: number,
    full_name: string,
    phone_number: string,
    email: string,
    linkedin_url: string,
    cv_url: string,
    tech_stacks: string[],
    ta_recruiter: number,
    status: number,
    comments: string,
}
