import { useState, useEffect } from 'react';
import { revenueCatService, UserSubscription, SubscriptionPlan } from '../services/revenueCatService';
import { useAuth } from './useAuth';
import { useToast } from '../components/NotificationToast';

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription>({
    isActive: false,
    entitlements: []
  });
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    initializeRevenueCat();
  }, [user]);

  const initializeRevenueCat = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize RevenueCat
      await revenueCatService.initialize(user?.id);

      // Identify user if logged in
      if (user?.id) {
        await revenueCatService.identifyUser(user.id);
      }

      // Load subscription plans and user info
      const [userSubscription, availablePlans] = await Promise.all([
        revenueCatService.getCustomerInfo(),
        revenueCatService.getOfferings()
      ]);

      setSubscription(userSubscription);
      setPlans(availablePlans);
    } catch (err) {
      console.error('Failed to initialize RevenueCat:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const purchasePlan = async (plan: SubscriptionPlan) => {
    if (!plan.rcPackage) {
      showError('Purchase Error', 'This plan is not available for purchase');
      return false;
    }

    if (!user) {
      showError('Authentication Required', 'Please sign in to purchase a subscription');
      return false;
    }

    try {
      setPurchasing(true);
      setError(null);

      const customerInfo = await revenueCatService.purchasePackage(plan.rcPackage);
      const updatedSubscription = revenueCatService['parseCustomerInfo'](customerInfo);
      
      setSubscription(updatedSubscription);
      
      showSuccess(
        'Purchase Successful!', 
        `Welcome to Tripza AI ${plan.title}! Your premium features are now active.`
      );
      
      return true;
    } catch (err) {
      console.error('Purchase failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      setError(errorMessage);
      showError('Purchase Failed', errorMessage);
      return false;
    } finally {
      setPurchasing(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setLoading(true);
      setError(null);

      const customerInfo = await revenueCatService.restorePurchases();
      const updatedSubscription = revenueCatService['parseCustomerInfo'](customerInfo);
      
      setSubscription(updatedSubscription);
      
      if (updatedSubscription.isActive) {
        showSuccess('Purchases Restored', 'Your subscription has been restored successfully');
      } else {
        showError('No Purchases Found', 'No active subscriptions found to restore');
      }
    } catch (err) {
      console.error('Failed to restore purchases:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore purchases';
      setError(errorMessage);
      showError('Restore Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    try {
      const updatedSubscription = await revenueCatService.getCustomerInfo();
      setSubscription(updatedSubscription);
    } catch (err) {
      console.error('Failed to refresh subscription:', err);
    }
  };

  const hasFeature = (feature: string): boolean => {
    return subscription.isActive && subscription.entitlements.includes(feature);
  };

  const isPro = (): boolean => {
    return subscription.isActive;
  };

  return {
    subscription,
    plans,
    loading,
    purchasing,
    error,
    purchasePlan,
    restorePurchases,
    refreshSubscription,
    hasFeature,
    isPro,
    initializeRevenueCat
  };
}