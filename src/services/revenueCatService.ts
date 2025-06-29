import Purchases, { 
  PurchasesOffering, 
  PurchasesPackage, 
  CustomerInfo,
  PurchasesEntitlementInfo,
  LOG_LEVEL 
} from '@revenuecat/purchases-js';

export interface SubscriptionPlan {
  id: string;
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  rcPackage?: PurchasesPackage;
}

export interface UserSubscription {
  isActive: boolean;
  plan?: string;
  expirationDate?: Date;
  willRenew?: boolean;
  entitlements: string[];
}

class RevenueCatService {
  private initialized = false;
  private currentOffering: PurchasesOffering | null = null;

  async initialize(userId?: string): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize RevenueCat with your API key
      await Purchases.configure({
        apiKey: 'ofrng6751d7b998', // Your RevenueCat public API key
        appUserID: userId || undefined, // Optional user ID
      });

      // Set log level for debugging (remove in production)
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      this.initialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async identifyUser(userId: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize(userId);
      return;
    }

    try {
      await Purchases.logIn(userId);
      console.log('User identified with RevenueCat:', userId);
    } catch (error) {
      console.error('Failed to identify user:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<SubscriptionPlan[]> {
    try {
      const offerings = await Purchases.getOfferings();
      this.currentOffering = offerings.current;

      if (!this.currentOffering) {
        console.warn('No current offering found');
        return this.getFallbackPlans();
      }

      // Convert RevenueCat packages to our subscription plans
      const plans: SubscriptionPlan[] = [];

      // Monthly plan
      if (this.currentOffering.monthly) {
        plans.push({
          id: 'monthly',
          title: 'Monthly Pro',
          description: 'Perfect for occasional travelers',
          price: this.currentOffering.monthly.product.priceString,
          period: 'month',
          features: [
            'Unlimited AI trip planning',
            'Advanced route optimization',
            'Real-time Google Maps integration',
            'Trip sharing & collaboration',
            'Priority customer support'
          ],
          rcPackage: this.currentOffering.monthly
        });
      }

      // Annual plan
      if (this.currentOffering.annual) {
        plans.push({
          id: 'annual',
          title: 'Annual Pro',
          description: 'Best value for frequent travelers',
          price: this.currentOffering.annual.product.priceString,
          period: 'year',
          features: [
            'Everything in Monthly Pro',
            'Advanced AI insights & analytics',
            'Offline map downloads',
            'Premium trip templates',
            'Early access to new features',
            'Travel expense tracking'
          ],
          isPopular: true,
          rcPackage: this.currentOffering.annual
        });
      }

      // Lifetime plan (if available)
      if (this.currentOffering.lifetime) {
        plans.push({
          id: 'lifetime',
          title: 'Lifetime Pro',
          description: 'One-time purchase, lifetime access',
          price: this.currentOffering.lifetime.product.priceString,
          period: 'lifetime',
          features: [
            'Everything in Annual Pro',
            'Lifetime updates',
            'VIP customer support',
            'Exclusive travel insights',
            'Beta feature access'
          ],
          rcPackage: this.currentOffering.lifetime
        });
      }

      return plans.length > 0 ? plans : this.getFallbackPlans();
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return this.getFallbackPlans();
    }
  }

  async purchasePackage(rcPackage: PurchasesPackage): Promise<CustomerInfo> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(rcPackage);
      console.log('Purchase successful:', customerInfo);
      return customerInfo;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      console.log('Purchases restored:', customerInfo);
      return customerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<UserSubscription> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return this.parseCustomerInfo(customerInfo);
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return {
        isActive: false,
        entitlements: []
      };
    }
  }

  private parseCustomerInfo(customerInfo: CustomerInfo): UserSubscription {
    const entitlements = Object.keys(customerInfo.entitlements.active);
    const hasProAccess = entitlements.includes('pro') || entitlements.includes('premium');

    if (!hasProAccess) {
      return {
        isActive: false,
        entitlements: []
      };
    }

    // Get the active pro entitlement
    const proEntitlement = customerInfo.entitlements.active['pro'] || 
                          customerInfo.entitlements.active['premium'];

    return {
      isActive: true,
      plan: this.getPlanFromEntitlement(proEntitlement),
      expirationDate: proEntitlement.expirationDate ? new Date(proEntitlement.expirationDate) : undefined,
      willRenew: proEntitlement.willRenew,
      entitlements
    };
  }

  private getPlanFromEntitlement(entitlement: PurchasesEntitlementInfo): string {
    const productId = entitlement.productIdentifier.toLowerCase();
    
    if (productId.includes('annual') || productId.includes('yearly')) {
      return 'annual';
    } else if (productId.includes('monthly')) {
      return 'monthly';
    } else if (productId.includes('lifetime')) {
      return 'lifetime';
    }
    
    return 'unknown';
  }

  private getFallbackPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'monthly',
        title: 'Monthly Pro',
        description: 'Perfect for occasional travelers',
        price: '$9.99',
        period: 'month',
        features: [
          'Unlimited AI trip planning',
          'Advanced route optimization',
          'Real-time Google Maps integration',
          'Trip sharing & collaboration',
          'Priority customer support'
        ]
      },
      {
        id: 'annual',
        title: 'Annual Pro',
        description: 'Best value for frequent travelers',
        price: '$79.99',
        period: 'year',
        features: [
          'Everything in Monthly Pro',
          'Advanced AI insights & analytics',
          'Offline map downloads',
          'Premium trip templates',
          'Early access to new features',
          'Travel expense tracking'
        ],
        isPopular: true
      }
    ];
  }

  async logOut(): Promise<void> {
    try {
      await Purchases.logOut();
      console.log('User logged out from RevenueCat');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }
}

export const revenueCatService = new RevenueCatService();