export const postsPerPage = 8;
export const sliderPerPage = 6;
export const authUrl = process.env.NEXT_PUBLIC_AUTH_URL!;
export const authUrlRedirect = process.env.NEXT_PUBLIC_AUTH_URL + "?redirectTo=" + process.env.NEXT_PUBLIC_BASE_URL!;
export const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL!;
export const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
export const dashUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL!;
export const billingUrl = process.env.NEXT_PUBLIC_BILLING_URL!;



export const isProduction = process.env.NODE_ENV === 'production';
export const baseUrl =
    !isProduction || !process.env.NEXT_PUBLIC_BASE_URL
        ? new URL('http://localhost:3004')
        : new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`);

export const getSupabaseFileUrl = (path: string, bucket: string = 'avatars') => {
    if (path.startsWith('http')) return path;
    if (!path) return '';
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};
