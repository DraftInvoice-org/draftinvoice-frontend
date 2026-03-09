import { useAuthStore } from '../store/authStore';
import { PLAN_FEATURES } from '../types/plans';
import type { Feature, Plan } from '../types/plans';

const PLAN_LEVELS: Record<Plan, number> = {
    free: 0,
    pro: 1,
};

/**
 * Returns `true` if the current user's plan meets the minimum required plan
 * for the given feature.
 *
 * Usage:
 *   const canEmail = useCanAccess('invoice_email');
 *   if (!canEmail) return <ProUpgradePrompt />;
 */
export function useCanAccess(feature: Feature): boolean {
    const user = useAuthStore((state) => state.user);
    const userPlan: Plan = (user?.plan as Plan) ?? 'free';
    const requiredPlan = PLAN_FEATURES[feature];
    return PLAN_LEVELS[userPlan] >= PLAN_LEVELS[requiredPlan];
}
