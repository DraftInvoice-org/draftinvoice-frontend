export type Plan = 'free' | 'pro';

export type Feature =
    | 'client_list'
    | 'custom_smtp'
    | 'invoice_email'
    | 'email_dispatch';

/** Maps each feature to the minimum plan required to access it. */
export const PLAN_FEATURES: Record<Feature, Plan> = {
    client_list: 'pro',
    custom_smtp: 'pro',
    invoice_email: 'pro',
    email_dispatch: 'pro',
};
