import React, { useState } from 'react';
import { X, Crown, Check, Loader2, Sparkles, Zap, Shield, Star } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionPlan } from '../services/revenueCatService';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightFeature?: string;
}

export function SubscriptionModal({ isOpen, onClose, highlightFeature }: SubscriptionModalProps) {
  const { plans, purchasing, purchasePlan, restorePurchases, subscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string>('annual');

  const handlePurchase = async (plan: SubscriptionPlan) => {
    const success = await purchasePlan(plan);
    if (success) {
      onClose();
    }
  };

  const handleRestore = async () => {
    await restorePurchases();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 px-8 py-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Upgrade to Tripza AI Pro</h2>
            <p className="text-xl text-purple-100">
              Unlock the full power of AI-driven travel planning
            </p>
            {highlightFeature && (
              <div className="mt-4 px-4 py-2 bg-white/20 rounded-full inline-block">
                <span className="text-sm font-medium">✨ {highlightFeature}</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Subscription Status */}
        {subscription.isActive && (
          <div className="px-8 py-4 bg-green-50 border-b border-green-200">
            <div className="flex items-center justify-center text-green-800">
              <Check className="w-5 h-5 mr-2" />
              <span className="font-medium">
                You have an active {subscription.plan} subscription
              </span>
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-6 transition-all duration-300 cursor-pointer hover:shadow-xl ${
                  plan.isPopular
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 scale-105'
                    : selectedPlan === plan.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-gray-900 mb-1">{plan.price}</div>
                  <div className="text-gray-500 text-sm">per {plan.period}</div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePurchase(plan)}
                  disabled={purchasing || subscription.isActive}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {purchasing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : subscription.isActive ? (
                    'Current Plan'
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Choose Plan
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Pro Features Highlight */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Advanced AI Planning</h4>
              <p className="text-gray-600 text-sm">
                Get personalized recommendations and intelligent route optimization powered by advanced AI
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Premium Support</h4>
              <p className="text-gray-600 text-sm">
                Get priority customer support and early access to new features and updates
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-600 rounded-2xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Unlimited Everything</h4>
              <p className="text-gray-600 text-sm">
                Create unlimited trips, save unlimited plans, and access all premium features
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={handleRestore}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Restore Previous Purchases
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Subscriptions auto-renew. Cancel anytime in your account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}